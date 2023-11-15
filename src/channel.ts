import { getData, setData } from './dataStore';
import { getUIdfromtoken, userProfile, utilization } from './helper';
import HTTPError from 'http-errors';
/*
Given a channelId of a channel that the authorized user can join, adds them to that channel.
token - string - issued to a validated user.
channelId: integer - the channel the user wants to join

Return values
returns empty braces if the function doesn't encounter any errors.

error: when channelId doesn't refer to a valid channel, authorized user member is already a member of that channel and channelId is private and
authorized user is not a channel member or a global owner.
*/

function channelJoinV1(token: string, channelId: number) {
  const data = getData();

  // Validating token and returning the userId
  const authUserId = getUIdfromtoken(token);
  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  // Checking for errors
  // ChannelId does not refer to a valid channel or the authorized user is already a member of the channel
  if (!data.channels.find((channel: any) => channel.channelId === channelId)) {
    throw HTTPError(400, '400: Invalid Channel!');
  }

  // Authorized user is already a member of the channel
  if (data.channels.find((channel: any) => channel.channelId === channelId)) {
    const user = data.users.find((user: any) => user.uId === authUserId);
    const channel = data.channels.find(
      (channel: any) => channel.channelId === channelId
    );
    if (channel.allMembers.find((member: any) => member === authUserId)) {
      throw HTTPError(400, '400: User Is Already A Member Of Channel!');
    }
    // ChannelId refers to a channel that is private and the authorized user is not already a channel member and is not a global owner
    if (channel.isPublic === false && user.permission === 2) {
      throw HTTPError(403, '403: User Is Not A Channel Member Or Global Owner!');
    }

    channel.allMembers.push(authUserId);
    channel.allMembers.sort();
  }
  data.workspaceStats.utilizationRate = utilization();
  const findUser = data.users.find((user : any) => user.uId === authUserId);
  const channelNum = findUser.stats.channelsJoined[findUser.stats.channelsJoined.length - 1].numChannelsJoined + 1;
  findUser.stats.channelsJoined.push({
    numChannelsJoined: channelNum,
    timeStamp: ~~(Date.now() / 1000)
  });
  setData(data);
  return {};
}

/*
Description: The user inputs a channel they want details about. The function will return the name, public status, owners and allMembers of the channel.
Arguments:
token - string - issued to a validated user.
channelId - integer - the channel the user wants details about
Return:
object that contains the name, isPublic, ownerMembers and allMembers and only returns this when there is no error
error object - returns when authUserId is not valid, channelId is not valid, userId is not in the allMembers of the channel they want details about.
*/
function channelDetailsV1(token: string, channelId: number) {
  const data = getData();

  // Validating token and returning the userId
  const authUserId = getUIdfromtoken(token);
  // Check if the user_id exists
  if (authUserId === null) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  // Checks if the channel exists
  if (!data.channels.find((channel: any) => channel.channelId === channelId)) {
    throw HTTPError(400, '400: Invalid Channel!');
  }
  // Gets the channel and then looks membersArray of that channel to check if the authUserId is present and then returns the channel object
  const channel = data.channels.find(
    (channel: any) => channel.channelId === channelId
  );
  const ownerMembers = [];
  const allMembers = [];
  for (let i = 0; i < channel.ownerMembers.length; i++) {
    ownerMembers.push(userProfile(authUserId, channel.ownerMembers[i]));
  }
  for (let i = 0; i < channel.allMembers.length; i++) {
    allMembers.push(userProfile(authUserId, channel.allMembers[i]));
  }
  for (let i = 0; i < channel.allMembers.length; i++) {
    if (channel.allMembers[i] === authUserId) {
      return {
        name: channel.name,
        isPublic: channel.isPublic,
        ownerMembers: ownerMembers,
        allMembers: allMembers,
      };
    }
  }
  // Happens when the user is not in the channel
  throw HTTPError(403, '403: User Is Not A Member Of Channel!');
}

/*
description - a user will invite another user to a channel that they are already present in.
arguments:
token - string - issued to a validated user.
channelId - integer - the channel's id that the user wants to invite another user in to
uId - integer - the user that the current user wants to invite
returns:
error - object - returns when authUser doesn't exist, the channel doesn't exist, the user is already present in the channel or the authUser is not in the channel
{} - returns when no error occurs
*/
function channelInviteV1(token: string, channelId: number, uId: number) {
  const data = getData();

  // Validating token and returning the userId
  const authUserId = getUIdfromtoken(token);

  // Error checking if the user exists or the channel exists
  if (!data.users.find((user: any) => user.uId === authUserId)) {
    throw HTTPError(403, '403: Unauthorized User!');
    // Checks if uId exists
  } else if (!data.users.find((user: any) => user.uId === uId)) {
    throw HTTPError(400, '400: Invalid User!');
    // Checks if channel exists
  } else if (
    !data.channels.find((channel: any) => channel.channelId === channelId)
  ) {
    throw HTTPError(400, '400: Invalid Channel!');
  } else if (
    authUserId === uId
  ) {
    throw HTTPError(400, '400: User Inviting Themselves To Channel!');
  }
  // Checking if the authUser is in the channel and if uId is already present
  const channel = data.channels.find(
    (channel) => channel.channelId === channelId
  );
  let authUserFlag = 0;
  let uIdFlag = 0;
  for (let i = 0; i < channel.allMembers.length; i++) {
    if (channel.allMembers[i] === authUserId) {
      authUserFlag = 1;
    } else if (channel.allMembers[i] === uId) {
      uIdFlag = 1;
    }
  }

  // If the authUser is not present or the uId is already in the members array
  if (authUserFlag === 0 || uIdFlag) {
    throw HTTPError(400, '400: Already Member Of Channel!');
  }

  // Add the uId to the members array and then sort so that the order is consistent
  channel.allMembers.push(uId);
  channel.allMembers.sort();
  // workspace statistics
  data.workspaceStats.utilizationRate = utilization();
  // *********************** Create Notification *************************************
  //
  const notification = {
    channelId: 0,
    dmId: 0,
    notificationMessage: '',
  };
  // find user that added new user to channel
  const inviter = data.users.find((user: any) => user.uId === authUserId);

  // find channel being invited to
  const channelAdded2 = data.channels.find((channel: any) => channel.channelId === channelId);

  // find person being invited to channel
  const invitee = data.users.find((user: any) => user.uId === uId);

  notification.channelId = channelAdded2.channelId;
  notification.dmId = -1;
  notification.notificationMessage = `${inviter.handleStr} added you to ${channelAdded2.name} `;

  invitee.notifications.unshift(notification);
  // ******************* End Of Notification *****************************************
  setData(data);
  return {};
}

/*
channelMessagesV1 - This function will return the last 50 messages from when the user specifies. if 50 messages can't be returned then the end value will be -1
arguments:
token - string - issued to a validated user.
channelId - integer - The channel where the messages are located in
start - integer - The starting index for the messages array
returns:
error - object - Returns when the userId, channelId is invalid, start is greater than the length of the messages array or the user is not in the channel
{messages: messageList, start: start, end: end} - object - returns when there is no error. messages is an object that contains {messageId, uId, message, timeSent}.
start is the starting index and end is start + 50 when there is 50 or more messages or -1 if there is less than 50 messages.
*/
function channelMessagesV1(token: string, channelId: number, start: number) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);
  // Error checking if the user exists or the channel exists
  if (authUserId === null) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  let flag1 = 0;
  for (const key of data.channels) {
    if (key.channelId === channelId) {
      flag1 = 1;
    }
  }
  if (flag1 === 0) {
    throw HTTPError(400, '400: Invalid Channel!');
  }

  // Checks if the message array is shorter than start
  const messages = data.messages.filter(
    (channel: any) => channel.channelId === channelId
  );
  const channel = data.channels.find(
    (channel) => channel.channelId === channelId
  );
  if (messages.length < start) {
    throw HTTPError(400, '400: Start Is Greater Than Total Messages In Channel!');
  }

  // Checks if the user is part of the channel
  let flag = 0;
  for (let i = 0; i < channel.allMembers.length; i++) {
    if (channel.allMembers[i] === authUserId) {
      flag = 1;
    }
  }
  if (flag === 0) {
    throw HTTPError(403, '403: User Is Not A Member Of Channel!');
  }

  // Start appending the last 50 messages to our return array
  const messageList = messages.slice(start, start + 50);
  // take specific attributes from message list
  const returnList = [];
  for (let i = 0; i < messageList.length; i++) {
    const alreadyReacted = messageList[i].reacts[0].uIds.find((uId: any) => uId === authUserId);
    if (alreadyReacted) {
      messageList[i].reacts[0].isThisUserReacted = true;
    } else {
      messageList[i].reacts[0].isThisUserReacted = false;
    }
    returnList[i] = {
      messageId: messageList[i].messageId,
      uId: messageList[i].uId,
      message: messageList[i].message,
      timeSent: messageList[i].timeSent,
      reacts: messageList[i].reacts,
      isPinned: messageList[i].isPinned
    };
  }
  // Calculate end based upon the messages return array
  let end = start + 50;
  if (messageList.length < 50) {
    end = -1;
  }
  // Sort so that the most recent messages are shown first
  returnList.sort((a, b) => b.messageId - a.messageId);
  // Return the messages, start and end based
  return { messages: returnList, start: start, end: end };
}

/*
Promotes an existing member to owner of the channel.

Arguments:
token - string - Issued to a validated user.
channelId - integer - the Id of the channel the user is joining.
uId - integer - A unique identifier given to each registered user.

Returns:
{} - empty object - The return value when no errors occur.
{error: 'error'} - error msg - when channel doesn't exist, user doesn't exist, user is not a channel owner,
user is the only owner or if the authorized user is not an owner of the channel.
*/

function channelAddOwnerV1(token: string, channelId: number, uId: number) {
  // finding uId from token
  const authUserId = getUIdfromtoken(token);
  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  // local reference to database
  const database = getData();
  if (!database.users.find((user: any) => user.uId === uId)) {
    throw HTTPError(400, '400: Invalid User!');
  }
  const channelOfInterest = database.channels.find((channel: any) => channel.channelId === channelId);
  if (!channelOfInterest) {
    throw HTTPError(400, '400: Invalid Channel!');
  }
  // Checks whether user is already a channel owner
  if (channelOfInterest.ownerMembers.find((member: any) => member === uId)) {
    throw HTTPError(400, '400: User Is Already A Channel Owner!');
  }
  // Checks if channel valid and authorized user is not an owner
  if (channelOfInterest && !channelOfInterest.ownerMembers.find((member: any) => member === authUserId)) {
    throw HTTPError(403, '403: Authorized User Does Not Have Owner Permissions!');
  }
  // Checks token is valid, channelId is valid, uId is valid and is a member of channel, authUserId is valid and
  // is an owner of channel and uId is NOT an owner of channel
  if (
    channelOfInterest &&
    channelOfInterest.allMembers.find((member: any) => member === uId) &&
    channelOfInterest.ownerMembers.find((member: any) => member === authUserId) &&
    !channelOfInterest.ownerMembers.find((member: any) => member === uId)
  ) {
    // Updates the owners array to include uId
    channelOfInterest.ownerMembers.push(uId);
    setData(database);
    return {};
  } else {
    throw HTTPError(400, '400: Does Not Satisfy Requirements for Promotion!');
  }
}

/*
Removes an existing owner from a channel except if they are the last owner.

Arguments:
token - string - Issued to a validated user.
channelId - integer - the Id of the channel the user is joining.
uId - integer - A unique identifier given to each registered user.

Returns:
{} - empty object - The return value when no errors occur.
{error: 'error'} - error msg - when channel doesn't exist, user doesn't exist, user is not a channel owner,
user is the only owner or if the authorized user is not an owner of the channel.
*/
function channelRemoveOwnerV1(token: string, channelId: number, uId: number) {
  // find uId from token
  const authUserId = getUIdfromtoken(token);
  // Validates token/authUser
  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  // local copy of dataStore
  const database = getData();
  // Validate user
  if (!database.users.find((user: any) => user.uId === uId)) {
    throw HTTPError(400, '400: Invalid User!');
  }
  const channelOfInterest = database.channels.find((channel: any) => channel.channelId === channelId);
  // Validates channel
  if (!channelOfInterest) {
    throw HTTPError(400, '400: Invalid Channel!');
  }
  // Checks if channel valid and authorized user is not an owner
  if (channelOfInterest && !channelOfInterest.ownerMembers.find((member: any) => member === authUserId)) {
    throw HTTPError(403, '403: Authorized User Does Not Have Owner Permissions!');
  }

  if ((authUserId === uId) && (channelOfInterest.ownerMembers.length === 1)) {
    throw HTTPError(400, '400: Authorized User Only Owner Of Channel!');
  }
  // Checks that channelId is valid, uId is valid and that uId is also a member of the channel. Also
  // checks whether authUser is an owner of the channel.
  if (channelOfInterest &&
    channelOfInterest.ownerMembers.find((member: any) => member === authUserId) &&
    channelOfInterest.ownerMembers.find((member: any) => member === uId)
  ) {
    // Updates the owners array by removing uId from owners array.
    for (const index in channelOfInterest.ownerMembers) {
      if (channelOfInterest.ownerMembers[index] === uId) {
        channelOfInterest.ownerMembers.splice(index, 1);
      }
    }
    setData(database);
    return {};
  } else {
    throw HTTPError(400, '400: Unable To Remove User From Channel!');
  }
}
/*
channelLeaveV1 - Given a channel with ID channelId that the authorized user is a member of,
remove them as a member of the channel. Their messages should remain in the channel. If the only channel owner leaves, the channel will remain.
arguments:
token - string - issued to a validated user.
channelId - integer - The channel where the user leaves are located in
returns:
error - object - Returns when the userId, channelId is invalid,
- returns - empty object - when there is no error
*/
function channelLeaveV1(token: string, channelId: number) {
  const data = getData();
  // Validating token and returning the userId
  const userId = getUIdfromtoken(token);
  // Check if the userId exists
  if (!userId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }

  const findChannel = data.channels.find(
    (channel: any) => channel.channelId === channelId
  );

  // Checks if the channel exists
  if (!findChannel) {
    throw HTTPError(400, '400: Invalid Channel!');
  }

  if (!findChannel.allMembers.find((member: any) => member === userId)) {
    throw HTTPError(403, '403: User Is Not A Member Of Channel!');
  }

  if (findChannel) {
    // searching through the allMembers array and finding that particular user
    // with the same userId and will remove them from the channel
    // if (findChannel.)
    for (const index in findChannel.allMembers) {
      if (findChannel.allMembers[index] === userId) {
        findChannel.allMembers.splice(index, 1);
      }
    }

    for (const index in findChannel.ownerMembers) {
      if (findChannel.ownerMembers[index] === userId) {
        findChannel.ownerMembers.splice(index, 1);
      }
    }
  }
  data.workspaceStats.utilizationRate = utilization();

  const findUser = data.users.find((user : any) => user.uId === userId);
  const channelNum = findUser.stats.channelsJoined[findUser.stats.channelsJoined.length - 1].numChannelsJoined - 1;
  findUser.stats.channelsJoined.push({
    numChannelsJoined: channelNum,
    timeStamp: ~~(Date.now() / 1000)
  });
  setData(data);
  return {};
}

export {
  channelMessagesV1,
  channelInviteV1,
  channelDetailsV1,
  channelJoinV1,
  channelRemoveOwnerV1,
  channelAddOwnerV1,
  channelLeaveV1,
};
