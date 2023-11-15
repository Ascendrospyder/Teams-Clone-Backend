import { getData, setData } from './dataStore';
import { getUIdfromtoken, userProfile, utilization } from './helper';
import HTTPError from 'http-errors';

/*
a user can invite multiple users to a group chat (dm) where they can all chat together.
arguments:
token - string - the user who wants to create the dm
uIds: the uIds of the users the creator wants to invite
returns:
error - if the token doesnt exist, there are duplicate users, if any of the uIds are invalid,
if the owner tries to invite themself
dmId- when there are no errors that occur
*/
function dmCreate(token: string, uIds: number[]) {
  const authUserId = getUIdfromtoken(token);
  const data = getData();
  // checks if the token exists
  if (authUserId === null) {
    throw HTTPError(403, '403: invalid token');
  }
  // checks if there are duplicate users
  const set = new Set(uIds);
  // Checks for duplicates
  if (set.size !== uIds.length) {
    throw HTTPError(400, '400: duplicate uIds');
  }

  // checks if any uIds are invalid
  for (const eachId of uIds) {
    if (!data.users.find((user) => user.uId === eachId)) {
      throw HTTPError(400, '400: invalid uIds');
    }
  }

  // checks if owner is part of uIds
  let ownerflag = 1;
  for (const uId of uIds) {
    if (authUserId === uId) {
      ownerflag = 0;
    }
  }
  if (ownerflag === 0) {
    throw HTTPError(400, '400: invalid uIds');
  }

  // assigns all the users and owner to members array
  const allMembers = uIds;
  // assign creator to owner array
  const ownerMembers = [authUserId];
  allMembers.push(authUserId);

  // calculate dm id
  const dmId = data.dms.length + 1;

  // adds all the handles to an array
  const handleArray = [];
  for (let i = 0; i < allMembers.length; i++) {
    for (const key of data.users) {
      if (key.uId === allMembers[i]) {
        handleArray.push(key.handleStr);
      }
    }
  }
  // sorts and then create name using join method
  handleArray.sort();
  const name = handleArray.join(', ');
  // push to dms array
  data.dms.push({
    name: name,
    dmId: dmId,
    ownerMembers: ownerMembers,
    allMembers: allMembers,
  });

  // workspace analytics
  data.workspaceStats.dmsExist.push({
    numDmsExist: data.dms.length,
    timeStamp: ~~(Date.now() / 1000)
  });
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

  for (const uId of uIds) {
    const user = data.users.find((user: any) => user.uId === uId);
    notification.channelId = -1;
    notification.dmId = dmId;
    notification.notificationMessage = `${inviter.handleStr} added you to ${name} `;

    user.notifications.unshift(notification);
  }
  // ******************* End Of Notification *****************************************

  const findUser = data.users.find((user : any) => user.uId === authUserId);
  const dmNum = findUser.stats.dmsJoined[findUser.stats.dmsJoined.length - 1].numDmsJoined + 1;
  findUser.stats.dmsJoined.push({
    numDmsJoined: dmNum,
    timeStamp: ~~(Date.now() / 1000)
  });

  for (const uId of uIds) {
    if (uId !== authUserId) {
      const user = data.users.find((user : any) => user.uId === uId);
      const num = user.stats.dmsJoined[user.stats.dmsJoined.length - 1].numDmsJoined + 1;
      user.stats.dmsJoined.push({
        numDmsJoined: num,
        timeStamp: ~~(Date.now() / 1000)
      });
    }
  }
  setData(data);
  return { dmId: dmId };
}

/*
this function allows users in a dm channel to send messages to each other
arguments:
token - string - the user who wants to send a message
dmId - number - the specific dm the user wants to send a message to
message - stinrg - the message the user wants sent
returns:
error: the token doesn't exist, dm doesn't exist, message is of incorrect size and
user is not part of the dm
messageId - when there are no errors return the messageId back.
*/
function sendDm(token: string, dmId: number, message: string) {
  const authUserId = getUIdfromtoken(token);
  const data = getData();
  // checks if the token is valid
  if (!authUserId) {
    throw HTTPError(403, '403: invalid token');
  }
  // checks if the dm exists
  const dm = data.dms.find((dms: any) => dms.dmId === dmId);
  if (!dm) {
    throw HTTPError(400, '400: invalid dmId');
  }
  // checks if the message length is of correct size
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, '400: invalid message length');
  }
  // checks if the user is a part of the dm
  const user = dm.allMembers.find((member: any) => member === authUserId);
  if (!user) {
    throw HTTPError(403, '403: user is not part of the dm');
  }
  // create messageId
  let messageId = 1;
  if (data.messages.length !== 0) {
    const maxMId = Math.max(...data.messages.map((o) => o.messageId));
    messageId = maxMId + 1;
  }
  // push new message to messages array and return messageId
  data.messages.push({
    messageId: messageId,
    dmId: dmId,
    channelId: null,
    uId: authUserId,
    message: message,
    timeSent: ~~(Date.now() / 1000),
    reacts: [{
      reactId: 1,
      uIds: [],
    }],
    isPinned: false,
  });
  // workspace analytics
  data.workspaceStats.dmsExist.push({
    numDmsExist: data.dms.length,
    timeStamp: ~~(Date.now() / 1000)
  });
  data.workspaceStats.utilizationRate = utilization();
  setData(data);
  return { messageId: messageId };
}

/*
a user can invite multiple users to a group chat (dm) where they can all chat together.
arguments: Given a DM ID, the user is removed as a member of this DM. The creator is allowed to leave and
the DM will still exist if this happens. This does not update the name of the DM.
token - string - the user who wants to create the dm
dmId: the dmId of the user who wants to leave
returns:
error - if the token doesnt exist, the dmId is invalid and the dmId is valid and the authorised user is not
a member of the DM

empty object
*/
function dmLeaveV1 (token : string, dmId : number) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);
  // invalid token
  if (!authUserId) {
    throw HTTPError(403, '403: invalid token');
  }

  const findDm = data.dms.find(
    (dm: any) => dm.dmId === dmId
  );

  // dmId does not refer to a valid DM
  if (!findDm) {
    throw HTTPError(400, '400: invalid dmId');
  }

  // dmId is valid and the authorised user is not a member of the DM
  if (!findDm.allMembers.find((member: any) => member === authUserId)) {
    throw HTTPError(403, '403: user is not part of the dm');
  }

  if (findDm) {
    // looping through dms array and allMembers and removing the user from the dm
    for (const index of findDm.allMembers) {
      if (findDm.allMembers[index] === authUserId) {
        // after find the user removes them from the array
        findDm.allMembers.splice(index, 1);
      }
    }

    // looping through the dms array and ownerMembers and removing the user from the dm
    for (const index of findDm.ownerMembers) {
      if (findDm.ownerMembers[index] === authUserId) {
        // after finding that user in the ownerMembers array remove them n
        findDm.ownerMembers.splice(index, 1);
      }
    }
  }
  const findUser = data.users.find((user : any) => user.uId === authUserId);
  const dmNum = findUser.stats.dmsJoined[findUser.stats.dmsJoined.length - 1].numDmsJoined - 1;
  findUser.stats.dmsJoined.push({
    numDmsJoined: dmNum,
    timeStamp: ~~(Date.now() / 1000)
  });
  setData(data);
  return {};
}
/*
This function will display the last 50 messages that was sent in a dm channel.
arguments:
token - string - the user who wants to see the last 50 messages
dmId - the specific channel the user wants to see messages from
start - the start is the index of the message they want to read the last 50 messages
returns:
error - when the token doesnt exist, the dm doesnt exist, the start is greater than the
number of messages in teh channel and if the user is not part of the channel
returns - the last 50 messages, the start and the end. the end will be 50 + start
if 50 messages exist and -1 if there are less than 50 messages. returns this when
there is no error
*/

function dmMessages(token: string, dmId: number, start: number) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);
  // checks if the user exists
  if (authUserId === null) {
    throw HTTPError(403, '403: invalid token');
  }
  // checks if the dm exists
  const dm = data.dms.find((dm: any) => dm.dmId === dmId);
  if (!dm) {
    throw HTTPError(400, '400: invalid dmId');
  }
  // gets all the messages that occured in the speific dm channel and if the number
  // of messages is less the start then return an error
  const messages = data.messages.filter((messages: any) => messages.dmId === dmId);
  if (messages.length < start) {
    throw HTTPError(400, '400: start greater than total messages');
  }
  // check if the user exists in the channel
  if (!dm.allMembers.find((members: number) => members === authUserId)) {
    throw HTTPError(403, '403: user is not part of the channel');
  }
  // get the last 50 messages and then remove the dm and channel id from the object
  const messageList = messages.slice(start, start + 50);
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
  // calculate the end
  let end = start + 50;
  if (messageList.length < 50) {
    end = -1;
  }
  // sort by the most recent messages ie last message will be in the 0 index
  returnList.sort((a, b) => b.messageId - a.messageId);
  // Return the messages, start and end based
  return { messages: returnList, start: start, end: end };
}

/*
Remove an existing DM, so all members are no longer in the DM. This can only be done by the original creator of the DM.
token - string - the user who wants to create the dm
dmId: the dmId of the user who wants to leave
returns:
error - if the token doesnt exist, the dmId is invalid,
dmId is valid and the authorised user is not the original DM creator and
dmId is valid and the authorised user is no longer in the DM
a member of the DM

empty object
*/
function dmRemoveV1 (token : string, dmId : number) {
  const data = getData();
  const userId = getUIdfromtoken(token);

  // testing if token is valid
  if (!userId) {
    throw HTTPError(403, '403: invalid token');
  }
  // dmId is valid and the authorised user is not the original DM creator
  const findDm = data.dms.find(
    (dm: any) => dm.dmId === dmId
  );
  // if dmId is invalid
  if (!findDm) {
    throw HTTPError(400, '400: invalid dmId');
  }

  // check if the user is apart of the dm
  if (!findDm.allMembers.find((member: any) => member === userId)) {
    throw HTTPError(403, '403: user not part of dm');
  }

  if (findDm.ownerMembers.find((member: any) => member === userId)) {
    // go through the whole array starting at the index and remove everyone there
    findDm.allMembers.splice(0, (findDm.allMembers.length));
  } else { // if they're not the owner return an error
    throw HTTPError(403, '403: user is not part of the dm');
  }

  // workspace analytics
  data.workspaceStats.dmsExist.push({
    numDmsExist: data.dms.length,
    timeStamp: ~~(Date.now() / 1000)
  });
  data.workspaceStats.utilizationRate = utilization();

  const findUser = data.users.find((user : any) => user.uId === userId);
  const dmNum = findUser.stats.dmsJoined[findUser.stats.dmsJoined.length - 1].numDmsJoined - 1;
  findUser.stats.dmsJoined.push({
    numDmsJoined: dmNum,
    timeStamp: ~~(Date.now() / 1000)
  });

  setData(data);
  return {};
}

/*
the function returns an array of all the dms the user is a part of.
arguments:
token - string - the user who wants to create the dm
returns:
dms - array of dms (when there are no errors that occur)
error - if the token doesnt exist
*/

function dmList(token: string) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);
  // check if its a valid userId
  if (!data.users.find((user: any) => user.uId === authUserId)) {
    throw HTTPError(403, '403: invalid token');
  } else {
    // checks if the userId is in the dm and pushes the arguments
    const dmsArray = [];
    for (const dms of data.dms) {
      if (dms.allMembers.find((Id: any) => Id === authUserId)) {
        dmsArray.push({
          dmId: dms.dmId,
          name: dms.name,
        });
      }
    }
    return {
      dms: dmsArray,
    };
  }
}

/*
the function gives basic details on a specified dm that the user is a part of.
arguments:
token - string - the user who wants to create the dm
dmId - number - a unique identifier for a dm
returns:
error - if the token doesnt exist, when dm does not refer to any valid dm, dmId is valid, however, user is not an authorised member of the dm
*/

function dmDetails(token: string, dmId: number) {
  const data = getData();
  // Validating token and returning the userId
  const authUserId = getUIdfromtoken(token);
  // checks if token is valid
  if (!authUserId) {
    throw HTTPError(403, '403: invalid token');
  }
  // Checks if the dm exists
  const dm = data.dms.find((dms: any) => dms.dmId === dmId);
  if (!dm) {
    throw HTTPError(400, '400: invalid dmId');
  }
  // Happens when the user is not in the dms
  if (!dm.allMembers.find((uId: number) => uId === authUserId)) {
    throw HTTPError(403, '403: user not part of the dm');
  }
  // checks if the userId is in the dm and pushes the arguments
  const allMembers = [];
  for (let i = 0; i < dm.allMembers.length; i++) {
    allMembers.push(userProfile(authUserId, dm.allMembers[i]));
  }
  return {
    name: dm.name,
    members: allMembers,
  };
}

export { dmCreate, dmLeaveV1, dmRemoveV1, dmMessages, sendDm, dmList, dmDetails };
