import { getData, setData } from './dataStore';
import { getUIdfromtoken, utilization } from './helper';
import HTTPError from 'http-errors';

/*
A user will send a message in to a channel where it will then be stored in the messages array
arguments:
token - string - the session that the user is currently on. Signifies the user
channelId - integer - the channel the user wants to send the message in to
message - string - the message the user wants to send in to the channel
returns:
error: if the token doesn't exist, channel doesnt exist, the message length is invalid or the user is not in the channel
messageId - integer - the message's id is returned if there are no errors
*/
function messageSend(token: string, channelId: number, message: string) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);
  const channel = data.channels.find(
    (channel: any) => channel.channelId === channelId
  );
  // checks if the token or channel exists and if the message is of valid length
  if (authUserId === null) {
    throw HTTPError(403, '403: invalid token');
  } else if (!channel) {
    throw HTTPError(400, '400: invalid channelId');
  } else if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, '400: invalid message length');
  }
  // checks if the user is in the channel
  let userflag = 0;
  for (let i = 0; i < channel.allMembers.length; i++) {
    if (channel.allMembers[i] === authUserId) {
      userflag = 1;
    }
  }
  if (userflag === 0) {
    throw HTTPError(403, '403: user is not part of channel');
  }
  // the first messageId will be 1, but afterwards it will find the maximum message id and add 1.
  // this is because duplciate message ids could be generated if it were based upon the length of messages
  let messageId = 1;
  if (data.messages.length !== 0) {
    const maxMId = Math.max(...data.messages.map((o) => o.messageId));
    messageId = maxMId + 1;
  }
  // pushes messages in to the messages array and then setting the data.
  data.messages.push({
    messageId: messageId,
    channelId: channelId,
    dmId: null,
    uId: authUserId,
    message: message,
    timeSent: ~~(Date.now() / 1000),
    reacts: [{
      reactId: 1,
      uIds: [],
    }],
    isPinned: false,
    sharedMessageId: -1
  });
  // workspace analytics
  data.workspaceStats.messagesExist.push({
    numMessagesExist: data.messages.length,
    timeStamp: ~~(Date.now() / 1000)
  });
  data.workspaceStats.utilizationRate = utilization();

  const findUser = data.users.find((user : any) => user.uId === authUserId);

  const newNum = findUser.stats.messagesSent[findUser.stats.messagesSent.length - 1].numMessagesSent + 1;
  findUser.stats.messagesSent.push({
    numMessagesSent: newNum,
    timeStamp: ~~(Date.now() / 1000)
  });

  setData(data);
  return { messageId: messageId };
}

/*
A user will find a message that they will want to delete which will then be removed from the messages array.
arguments:
token - string - the user's session token - signifies the user
messageId - number - the message the user wants to delete
returns:
{error: 'error'} when the token doesn't exist, message does not exist, user is not part of the channel
where the message is located, if the user is not an owner and wants to delete another person's message.
{} when there are no errors and the message has been successfully deleted.
*/
function messageRemove(token: string, messageId: number) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);
  const message = data.messages.find(
    (message: any) => message.messageId === messageId
  );
  // checks if the token exists or the message exists
  if (authUserId === null) {
    throw HTTPError(403, '403: invalid token');
  }
  if (!message) {
    throw HTTPError(400, '400: invalid messageId');
  }
  const channel = data.channels.find(
    (channel: any) => channel.channelId === message.channelId
  );
  const dm = data.dms.find((dm: any) => dm.dmId === message.dmId);

  // users can remove their own messages, but owners can remove other peoples messages
  // so we check if the user is not an owner and if theyre trying to remove another persons message
  let ownerFlag = 0;
  if (channel) {
    for (let i = 0; i < channel.ownerMembers.length; i++) {
      if (channel.ownerMembers[i] === authUserId) {
        ownerFlag = 1;
      }
    }
  } else if (dm) {
    for (let i = 0; i < dm.ownerMembers.length; i++) {
      if (dm.ownerMembers[i] === authUserId) {
        ownerFlag = 1;
      }
    }
  }

  if (!ownerFlag && message.uId !== authUserId) {
    throw HTTPError(403, '403: user does not have owner permissions');
  }
  // iterates through all messages and then deletes it when its found
  for (const i in data.messages) {
    if (data.messages[i].messageId === messageId) {
      data.messages.splice(parseInt(i), 1);
    }
  }
  // workspace analytics
  data.workspaceStats.messagesExist.push({
    numMessagesExist: data.messages.length,
    timeStamp: ~~(Date.now() / 1000)
  });
  data.workspaceStats.utilizationRate = utilization();
  setData(data);
  return {};
}

function messageEdit(token: string, messageId: number, message: string) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);

  const messageToEdit = data.messages.find(
    (message: any) => message.messageId === messageId
  );
  // checks if the user exists, if the message is larger than 100 characters
  // and if the message exists
  if (authUserId === null) {
    throw HTTPError(403, '403: invalid token');
  }
  if (message.length > 1000) {
    throw HTTPError(400, '400: invalid message length');
  }
  if (!messageToEdit) {
    throw HTTPError(400, '400: invalid messageId');
  }
  const channel = data.channels.find(
    (channel: any) => channel.channelId === messageToEdit.channelId
  );
  const dm = data.dms.find((dm: any) => dm.dmId === messageToEdit.dmId);
  // users can edit their own messages, but owners can edit other peoples messages
  // so we check if the user is not an owner and if they're trying to edit another persons message
  let ownerFlag = 0;
  if (channel) {
    for (let i = 0; i < channel.ownerMembers.length; i++) {
      if (channel.ownerMembers[i] === authUserId) {
        ownerFlag = 1;
      }
    }
  } else if (dm) {
    for (let i = 0; i < dm.ownerMembers.length; i++) {
      if (dm.ownerMembers[i] === authUserId) {
        ownerFlag = 1;
      }
    }
  }

  if (!ownerFlag && messageToEdit.uId !== authUserId) {
    throw HTTPError(403, '403: user does not have owner permissions');
  }
  if (message === '') {
    messageRemove(token, messageId);
  } else {
    messageToEdit.message = message;
  }
  setData(data);
  return {};
}
/**
 * Given a message within a channel or DM the authorized user is part of,
 * add a "react" to that particular message.
 * @param token - string
 * @param messageId - integer
 * @param reactId - integer
 * @returns - error 403 when given an invalid token or 400 when given an invalid
 * messageId, reactId or same person tries to react twice
 * OR
 * empty object
 */
function messageReactV1 (token : string, messageId : number, reactId : number) {
  const data = getData();
  const userId = getUIdfromtoken(token);
  // check if we have a valid token
  if (!userId) {
    throw HTTPError(403, 'Error! Invalid token');
  }
  // check if valid reactId
  if (reactId !== 1) {
    throw HTTPError(400, 'Error! Invalid reactId');
  }
  // checks if messageId is valid
  const message = data.messages.find(
    (message: any) => message.messageId === messageId
  );
  if (!message) {
    throw HTTPError(400, 'Error! Invalid messageId');
  }
  // checks if message already has same reactId
  const reacted = message.reacts.find((user : any) => user.reactId === reactId);
  if (reacted) {
    const alreadyReacted = reacted.uIds.find((react : any) => react === userId);
    if (alreadyReacted) {
      throw HTTPError(400, 'Error! Same person cannot react to the same message twice!');
    }
  }

  const react = message.reacts.find((react: any) => react.reactId === reactId);
  if (react) {
    react.uIds.push(userId);
  }
  // *********************** Create Notification *************************************
  //
  const notification = {
    channelId: 0,
    dmId: 0,
    notificationMessage: '',
  };
  // find user that authored message
  const authorOfMessage = data.users.find((user: any) => user.uId === message.uId);

  // find the person reacting
  const personReacting = data.users.find((user: any) => user.uId === userId);

  // find channel name containing the message/react
  const channel = data.channels.find((channel: any) => channel.channelId === message.channelId);

  // find dm name containing the message/react
  const dm = data.dms.find((dm: any) => dm.dmId === message.dmId);

  if (message.dmId === null || message.dmId === -1) {
    notification.channelId = message.channelId;
    notification.dmId = -1;
    notification.notificationMessage = `${personReacting.handleStr} reacted to your message in ${channel.name} `;
  }
  if (message.channelId === null || message.channelId === -1) {
    notification.channelId = -1;
    notification.dmId = message.dmId;
    notification.notificationMessage = `${personReacting.handleStr} reacted to your message in ${dm.name}`;
  }
  authorOfMessage.notifications.unshift(notification);
  // ******************* End Of Notification *****************************************
  setData(data);
  return {};
}
/**
 * Given a message within a channel or DM the authorised user is part of,
 * remove a "react" to that particular message.
 * @param token - string
 * @param messageId - integer
 * @param reactId - integer
 * @returns - error 403 when given an invalid token or error 400 when given an invalid
 * messageId, reactId or same person tries to react twice
 * OR
 * empty object
 */
function messageUnreactV1 (token : string, messageId : number, reactId : number) {
  const data = getData();
  const userId = getUIdfromtoken(token);
  // if token is invalid
  if (!userId) {
    throw HTTPError(403, 'Error! Invalid token');
  }
  // check if valid reactId
  if (reactId !== 1) {
    throw HTTPError(400, 'Error! Invalid reactId');
  }
  // checks if messageId is valid
  const message = data.messages.find(
    (message: any) => message.messageId === messageId
  );
  if (!message) {
    throw HTTPError(400, 'Error! Invalid messageId');
  }
  // checks if message already has same reactId
  const reacted = message.reacts.find((user : any) => user.reactId === reactId);
  const alreadyReacted = reacted.uIds.find((react : any) => react === userId);

  if (!alreadyReacted) {
    throw HTTPError(400, 'Error! User cannot unreact a message that has not been reacted');
  }
  const react = message.reacts.find((react: any) => react.reactId === reactId);

  for (const index in react.uIds) {
    if (react.uIds[index] === userId) {
      react.uIds.splice(index, 1);
    }
  }
  return {};
}

/**
 * Given a message within a channel or DM, mark it as "pinned".
 * @param token - string
 * @param messageId - integer
 * @returns - returns status code 400 if given an invalid messageId or if the message
 * is already pinned. It also returns error code 403 if token is invalid or a user who
 * is not an owner decides to pin.
 * OR
 * returns empty object
 */
function messagePinV1 (token : string, messageId : number) {
  const data = getData();
  const userId = getUIdfromtoken(token);

  if (!userId) {
    throw HTTPError(403, 'Error! Invalid token');
  }

  // checks if messageId is valid
  const message = data.messages.find(
    (message: any) => message.messageId === messageId
  );
  if (!message) {
    throw HTTPError(400, 'Error! Invalid messageId');
  }
  // checks if message is already pinned
  if (message.isPinned === true) {
    throw HTTPError(400, 'Error! Message is already pinned');
  }
  // messageId refers to a valid message in a joined channel/DM and the authorised user
  // does not have owner permissions in the channel/DM
  const user = data.users.find((user: any) => user.uId === userId);
  if (message) {
    if (user.permission === 2) {
      throw HTTPError(403, 'Error! You are not authorised to pin in this channel/dm');
    }
  }
  // marking as pinned
  message.isPinned = true;

  return {};
}
/**
 * Given a message within a channel or DM, remove its mark as "pinned".
 * @param token - string
 * @param messageId - integer
 * @returns - returns status code 400 if given an invalid messageId or if the message
 * is never pinned but you try to unpin. It also returns error code 403 if token is invalid or a user who
 * is not an owner decides to unpin.
 * OR
 * returns empty object
 */
function messageUnpinV1 (token : string, messageId : number) {
  const data = getData();
  const userId = getUIdfromtoken(token);

  if (!userId) {
    throw HTTPError(403, 'Error! Invalid token');
  }

  // checks if messageId is valid
  const message = data.messages.find(
    (message: any) => message.messageId === messageId
  );
  if (!message) {
    throw HTTPError(400, 'Error! Invalid messageId');
  }
  // checks if message is not pinned
  if (message.isPinned === false) {
    throw HTTPError(400, 'Error! You are trying to unpin a message that was never pinned');
  }

  // messageId refers to a valid message in a joined channel/DM and the authorised user
  // does not have owner permissions in the channel/DM
  const user = data.users.find((user: any) => user.uId === userId);
  if (message) {
    if (user.permission === 2) {
      throw HTTPError(403, 'Error! You are not authorised to unpin in this channel/dm');
    }
  }

  // removing marked as pinned
  message.isPinned = false;
  // console.log(data.messages);
  return {};
}

/**
 * a user will enter a time when they want their message to be sent
 * @param token - the user's current session
 * @param channelId - the channel the message is going to be sent to
 * @param message - the message the user wants to send
 * @param timeSent - the time that the message should be sent at
 * @returns - the message id for the message that is going to be sent
 */
function messageSendLater(token: string, channelId: number, message: string, timeSent: number) {
  const authUserId = getUIdfromtoken(token);
  const data = getData();
  if (~~(Date.now() / 1000) > timeSent) {
    throw HTTPError(400, '400: invalid time');
  }
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
  if (message.length > 1000 || message.length < 1) {
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
  // wait for the timesent to pass until the message is sent
  const starttime = ~~(Date.now() / 1000);
  const delta = timeSent - starttime;
  let now = starttime;
  while ((now - starttime) < delta) {
    now = ~~(Date.now() / 1000);
  }
  // create messageid
  let messageId = 1;
  if (data.messages.length !== 0) {
    const maxMId = Math.max(...data.messages.map((o) => o.messageId));
    messageId = maxMId + 1;
  }
  // pushes messages in to the messages array and then setting the data.
  data.messages.push({
    messageId: messageId,
    channelId: channelId,
    dmId: null,
    uId: authUserId,
    message: message,
    timeSent: timeSent,
    reacts: [{
      reactId: 1,
      uIds: [],
    }],
    isPinned: false,
    sharedMessageId: -1
  });
  // workspace analytics
  data.workspaceStats.messagesExist.push({
    numMessagesExist: data.messages.length,
    timeStamp: ~~(Date.now() / 1000)
  });
  data.workspaceStats.utilizationRate = utilization();

  const findUser = data.users.find((user : any) => user.uId === authUserId);

  const newNum = findUser.stats.messagesSent[findUser.stats.messagesSent.length - 1].numMessagesSent + 1;
  findUser.stats.messagesSent.push({
    numMessagesSent: newNum,
    timeStamp: ~~(Date.now() / 1000)
  });
  setData(data);
  return { messageId: messageId };
}

/**
 * a user will specify a time when they want a message to be sent to a specified dm. the message will be sent to that dm
 * @param token the user's session where they will send the message later to
 * @param dmId the dm where the message will be sent later to
 * @param message the message that is to be sent later
 * @param timeSent the time when the message will be sent at
 * @returns the message's id
 */
function messageSendLaterDm(token: string, dmId: number, message: string, timeSent: number) {
  const authUserId = getUIdfromtoken(token);
  const data = getData();
  if (~~(Date.now() / 1000) > timeSent) {
    throw HTTPError(400, '400: invalid time');
  }
  // checks if the token is invalid
  if (!authUserId) {
    throw HTTPError(403, '403: invalid token');
  }
  const dm = data.dms.find((dm: any) => dm.dmId === dmId);
  // checks if the dm exists
  if (!dm) {
    throw HTTPError(400, '400: invalid dmId');
  }
  if (message.length > 1000 || message.length < 1) {
    throw HTTPError(400, '400: invalid message');
  }
  // checks if the user is part of the dm
  let userflag = false;
  for (let i = 0; i < dm.allMembers.length; i++) {
    if (dm.allMembers[i] === authUserId) {
      userflag = true;
    }
  }
  if (userflag === false) {
    throw HTTPError(403, '403: user is not part of the dm');
  }
  // wait for the timesent to pass until the message is sent
  const starttime = ~~(Date.now() / 1000);
  const delta = timeSent - starttime;
  let now = starttime;
  while ((now - starttime) < delta) {
    now = ~~(Date.now() / 1000);
  }
  // create messageid
  let messageId = 1;
  if (data.messages.length !== 0) {
    const maxMId = Math.max(...data.messages.map((o) => o.messageId));
    messageId = maxMId + 1;
  }
  // pushes messages in to the messages array and then setting the data.
  data.messages.push({
    messageId: messageId,
    channelId: null,
    dmId: dmId,
    uId: authUserId,
    message: message,
    timeSent: timeSent,
    reacts: [{
      reactId: 1,
      uIds: [],
    }],
    isPinned: false,
    sharedMessageId: -1
  });
  // workspace analytics
  data.workspaceStats.messagesExist.push({
    numMessagesExist: data.messages.length,
    timeStamp: ~~(Date.now() / 1000)
  });
  data.workspaceStats.utilizationRate = utilization();

  const findUser = data.users.find((user : any) => user.uId === authUserId);

  const newNum = findUser.stats.messagesSent[findUser.stats.messagesSent.length - 1].numMessagesSent + 1;
  findUser.stats.messagesSent.push({
    numMessagesSent: newNum,
    timeStamp: ~~(Date.now() / 1000)
  });
  setData(data);
  return { messageId: messageId };
}

/**
 * Shares a message with other channels/DM's that the user is a member of
 * @param token - string: Given to a validated user
 * @param ogMessageId - string: ID of original message
 * @param channelId - number: ID of channel message being sent to
 * @param dmId - number: ID of DM message being sent to
 * @param message - string: (optional): Appended to the original shared message
 * @returns sharedMessageId - number: An identifier to the shared message.
 */
// What if message had been shared to a channel that the user is a member of but isn't
// a member of the original channel? I've only checked the channel and DM of original message
function shareMessageV1(token: string, ogMessageId: number, channelId: number, dmId: number, message?: string) {
  // Validating token and returning the userId
  const authUserId = getUIdfromtoken(token);
  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  const data = getData();

  // Check if channelId and dmId is valid
  const validChannelId = data.channels.find((channel: any) => channel.channelId === channelId);
  const validDmId = data.dms.find((dm: any) => dm.dmId === dmId);

  if (!validChannelId && !validDmId) {
    throw HTTPError(400, '400: Invalid channelId and dmId!');
  }
  // Check either channelId or dmId (and not both) equal to -1
  if ((channelId !== -1 && dmId !== -1) || (channelId === dmId)) {
    throw HTTPError(400, '400: channelId or dmId is invalid!');
  }
  // locate message to be shared and allocate to a variable
  const originalMsg = data.messages.find((message: any) => message.messageId === ogMessageId);
  // verify that user is a member of the channel the message originated from if DM isn't original source of message
  if (originalMsg.dmId === -1 || originalMsg.dmId === null) {
    // Allocate channel where msg originated from to a variable
    const channelContainingOriginalMsg = data.channels.find((channel: any) => channel.channelId === originalMsg.channelId);

    if (!channelContainingOriginalMsg.allMembers.find((member: any) => member === authUserId)) {
      throw HTTPError(400, '400: Not a valid message within a channel that user has joined!');
    }
  }
  // Verify that user is a member of the DM the message originated from if channel isn't original source of message
  if (originalMsg.channelId === -1 || originalMsg.channelId === null) {
    // Allocate DM where msg originated from to a variable
    const DmContainingOriginalMsg = data.dms.find((dm: any) => dm.dmId === originalMsg.dmId);
    if (!DmContainingOriginalMsg.allMembers.find((member: any) => member === authUserId)) {
      throw HTTPError(400, '400: Not a valid message within a DM that user has joined!');
    }
  }
  // Check if authUser is a member of the channel/DM that the msg will be shared to
  // find channel message will be sent to
  const destinationChannel = data.channels.find((channel: any) => channel.channelId === channelId);
  const destinationDm = data.dms.find((dm: any) => dm.dmId === dmId);
  // Checking whether authUser is a member of the channel that the message will be sent to
  if (dmId === -1 && validChannelId) {
    let flag = true;
    for (const member of destinationChannel.allMembers) {
      if (member === authUserId) {
        flag = false;
      }
    }
    if (flag === true) {
      throw HTTPError(403, '403: User not a member of Channel that the message will be shared with!');
    }
  }
  // Checking whether authUser is a member of the DM that the message will be sent to
  if (channelId === -1 && validDmId) {
    let flag = true;
    for (const member of destinationDm.allMembers) {
      if (member === authUserId) {
        flag = false;
      }
    }
    if (flag === true) {
      throw HTTPError(403, '403: User not a member of Dm that the message will be shared with!');
    }
  }
  // Checking whether an optional message was included as part of input parameters
  if (typeof message === 'undefined') {
    message = '';
  } else {
    if (message.length > 1000) {
      throw HTTPError(400, '400: Length of message is greater than 1000 characters!');
    }
  }
  const newMessage = originalMsg.message + ' ' + message;
  let sharedMessageId = 0;
  let messageId = 0;
  // Determining messageId
  for (const message of data.messages) {
    if (message.messageId > messageId) {
      messageId = message.messageId;
    }
  }
  // Determining sharedMessageId
  for (const message of data.messages) {
    if (message.sharedMessageId !== -1) { // instead of -1 we can use null, -1 is preferable though
      if (message.sharedMessageId > sharedMessageId) {
        sharedMessageId = message.sharedMessageId;
      }
    }
  }

  data.messages.push({
    messageId: messageId + 1,
    channelId: channelId,
    uId: authUserId,
    dmId: dmId,
    message: newMessage,
    timeSent: ~~(Date.now() / 1000),
    reacts: [{
      reactId: 1,
      uIds: [],
    }],
    isPinned: false,
    sharedMessageId: sharedMessageId + 1
  });
  // workspace analytics
  data.workspaceStats.messagesExist.push({
    numMessagesExist: data.messages.length,
    timeStamp: ~~(Date.now() / 1000)
  });
  data.workspaceStats.utilizationRate = utilization();
  setData(data);
  return { sharedMessageId };
}

export { messageSend, messageRemove, messageEdit, messageReactV1, messageUnreactV1, messagePinV1, messageUnpinV1, messageSendLater, messageSendLaterDm, shareMessageV1 };
