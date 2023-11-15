import { getData, setData } from './dataStore';
import { getUIdfromtoken } from './helper';
import HTTPError from 'http-errors';
import { usersStatsV1 } from './users';

/**
 * a user will start a standup which a session in which users can type messages and then
 * a report of messages will be sent at the very end
 * @param token - the users token
 * @param channelId - the channel the user wants to start the standup in
 * @param length - the amount of time the user wants the standup to last
 * @returns timefinished - the time when the standup ends
 */
export function standupStart(token: string, channelId: number, length: number) {
  const authUserId = getUIdfromtoken(token);
  const data = getData();
  // checks if the token is invalid
  if (!authUserId) {
    throw HTTPError(403, '403: invalid uId');
  }
  // checks if the length is negative
  if (length < 0) {
    throw HTTPError(400, '400: invalid length');
  }
  // checks if the channel exists
  const channel = data.channels.find(
    (channel: any) => channel.channelId === channelId
  );
  if (!channel) {
    throw HTTPError(400, '400: invalid channelId');
  }
  // checks if the standup is active
  if (channel.isActive === true) {
    throw HTTPError(400, '400: standup already in progress');
  }
  // checks if the user is part of the channel
  let userflag = false;
  for (let i = 0; i < channel.allMembers.length; i++) {
    if (channel.allMembers[i] === authUserId) {
      userflag = true;
    }
  }
  if (userflag === false) {
    throw HTTPError(403, '403: user is not part of the channel');
  }
  // gets the current time and then calcualtes the finish time through the users input
  const finish = ~~(Date.now() / 1000) + length;
  // changes the channel data to now contain an active standup
  channel.isActive = true;
  channel.timeFinish = finish;
  channel.userStarted = authUserId;
  channel.messageQueue = [];
  setData(data);
  return { timeFinish: finish };
}

/**
 * checks if there is an active standup in a channel
 * @param token - the user's token
 * @param channelId - the channel the user is checking if it is active
 * @returns - returns if the channel has an active standup and the time that it finishes
 */
export function standupActive(token: string, channelId: number) {
  const authUserId = getUIdfromtoken(token);
  const data = getData();
  // checks if the token is invalid
  if (!authUserId) {
    throw HTTPError(403, '403: invalid token');
  }
  const channel = data.channels.find(
    (channel: any) => channel.channelId === channelId
  );
  // checks if the channel exists
  if (!channel) {
    throw HTTPError(400, '400: invalid channelId');
  }
  // checks if the user is part of the channel
  let userflag = false;
  for (let i = 0; i < channel.allMembers.length; i++) {
    if (channel.allMembers[i] === authUserId) {
      userflag = true;
    }
  }
  if (userflag === false) {
    throw HTTPError(403, '403: user is not part of the channel');
  }
  // checks if the stand up is finish
  if (~~(Date.now() / 1000) > channel.timeFinish) {
    // if the standup is active and then the time is finish append a new
    // message based upon the message queue
    if (channel.isActive === true) {
      channel.isActive = false;
      let messageId = 1;
      if (data.messages.length !== 0) {
        const maxMId = Math.max(...data.messages.map((o) => o.messageId));
        messageId = maxMId + 1;
      }
      const message = channel.messageQueue.join('\n');
      data.messages.push({
        messageId: messageId,
        channelId: channelId,
        dmId: null,
        uId: channel.userStarted,
        message: message,
        timeSent: channel.timeFinish,
        reacts: [{
          reactId: 1,
          uIds: [],
        }],
        isPinned: false,
      });
      // workspace analytics
      usersStatsV1();

      const user = data.users.find((user : any) => user.uId === channel.userStarted);
      const newNum = user.stats.messagesSent[user.stats.messagesSent.length - 1].numMessagesSent + 1;
      user.stats.messagesSent.push({
        numMessagesSent: newNum,
        timeStamp: ~~(Date.now() / 1000)
      });
      setData(data);
      return { isActive: false, timeFinish: null };
    }
  }
  // checks if the standup is on the first runthrough (no active standup),
  // otherwise return the current standup
  if (channel.timeFinish === 0) {
    return { isActive: false, timeFinish: null };
  }
  return { isActive: channel.isActive, timeFinish: channel.timeFinish };
}

/**
 * while a standup is in action, a user can send a message which will be reported at the end of a standup
 * @param token - the user who wants to enter a messages
 * @param channelId - the message the standup is taking place in
 * @param message - the message the user wants to send
 * @returns nothing when there is no error
 */
export function standupSend(token: string, channelId: number, message: string) {
  const authUserId = getUIdfromtoken(token);
  const data = getData();
  // checks if the token is invalid
  if (!authUserId) {
    throw HTTPError(403, '403: invalid token');
  }
  const channel = data.channels.find(
    (channel: any) => channel.channelId === channelId
  );
  // checks if the channel exists
  if (!channel) {
    throw HTTPError(400, '400: invalid channelId');
  }
  if (message.length > 1000) {
    throw HTTPError(400, '400: invalid message');
  }
  // checks if the user is part of the channel
  let userflag = false;
  for (let i = 0; i < channel.allMembers.length; i++) {
    if (channel.allMembers[i] === authUserId) {
      userflag = true;
    }
  }
  if (userflag === false) {
    throw HTTPError(403, '403: user is not part of the channel');
  }
  // checks if the standup is active
  if (channel.isActive === false) {
    throw HTTPError(400, '400: standup not active');
  }
  // get the user handle and then concat their message and then add the message to the queue
  const user = data.users.find((user) => user.uId === authUserId);
  const messageSent = user.handleStr.concat(': ', message);
  channel.messageQueue.push(messageSent);
  setData(data);
  return {};
}
