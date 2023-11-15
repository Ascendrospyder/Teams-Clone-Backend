import { getData, setData } from './dataStore';
import { getUIdfromtoken, utilization } from './helper';
import HTTPError from 'http-errors';

/*
A user will create a new channel and automatically be put in that channel.
arguments:
authUserId - integer - the user who is creating the channel
name - string - the name of the channel
isPublic - boolean - determines if the channel is private or public
returns:
error - object string - if the user doesn't exist or the name is in an invalid format an error is returned
channelId - object integer - if no errors occur, the function will return the channelId
*/
function channelsCreateV1(token: string, name: string, isPublic: boolean) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);
  // check if theauthUserId exists
  if (authUserId === null) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  // checks if the channel name is valid
  if (name.length < 1 || name.length > 20) {
    throw HTTPError(
      400,
      '400: Channel Name Must Be Between 1 and 20 Characters!'
    );
  }

  // creating each variable to push into data.channel
  const channelId = data.channels.length + 1;
  const messages = [] as any[];

  // when the channel is being created the only members would
  // be the person creating it
  const ownerMembers = [authUserId];
  const allMembers = [authUserId];
  data.channels.push({
    channelId: channelId,
    name: name,
    isPublic: isPublic,
    messages: messages,
    ownerMembers: ownerMembers,
    allMembers: allMembers,
    isActive: false,
    timeFinish: 0,
    messageQueue: [],
    userStarted: -1,
  });
  // workspace analytics
  data.workspaceStats.channelsExist.push({
    numChannelsExist: data.channels.length,
    timeStamp: ~~(Date.now() / 1000)
  });
  data.workspaceStats.utilizationRate = utilization();
  setData(data);
  return { channelId: channelId };
}

/*
A function will provide the user with an array of channels, both private and public, that the user is part of.
The function will take in the user's Id and match them with the authorized Id in the channels,
and then will provide the following arguments in the array:
channelId - object integer - if there are no errors, it will return the channelId
name - string - the name of the channel
returns:
channels - object array - the object contains the channels that the user is apart of. occurs when there is no error
error - object string - when the user is invalid an error occurs
*/
function channelsListV1(token: string) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);
  // check if its a valid userId
  if (!data.users.find((user: any) => user.uId === authUserId)) {
    throw HTTPError(403, '403: Unauthorized User!');
  } else {
    // check what permissions the userId has to channels and pushes the arguments channelId and name to an array
    const channelArray = [];
    for (const channels of data.channels) {
      if (channels.allMembers.find((Id: any) => Id === authUserId)) {
        channelArray.push({
          channelId: channels.channelId,
          name: channels.name,
        });
      }
    }
    return { channels: channelArray };
  }
}

/*
This function allows a verified user the ability to list all the channels that are currently stored
in the software database regardless of whether the channel has a public or private attribute. The information
provided is limited to the channel id number and the channel name.

arguments:
authUserId - integer - the user who is searching the database

returns:
empty array - object - if no channels exist.
channels - object - containing the channels Id and name.
*/

function channelsListallV1(token: string) {
  // Gives access to the data in datastore
  const dataBase = getData();
  const authUserId = getUIdfromtoken(token);
  // Checks if authUserId is a valid user by searching the dataStore
  if (!dataBase.users.find((user: any) => user.uId === authUserId)) {
    throw HTTPError(403, '403: Unauthorized User!');
  } else {
    // Array to store all the channels Id's and names objects
    const channels = [];
    for (const eachChannel of dataBase.channels) {
      channels.push({
        channelId: eachChannel.channelId,
        name: eachChannel.name,
      });
    }

    return { channels };
  }
}

export { channelsCreateV1, channelsListallV1, channelsListV1 };
