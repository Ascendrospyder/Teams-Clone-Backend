import { getData, setData } from './dataStore';
import { getUIdfromtoken, userProfile } from './helper';
import validator from 'validator';
import HTTPError from 'http-errors';
// import config from './config.json';

/*
This function allows a verified user access to the information of another user of the software.
This information includes the users email, first and last name as well as their unique handle.

arguments:
token - string - identifying the user who is searching the database for another user
uId - integer - the user being searched for

returns:
error - object string - if the user doesn't exist or the user being searched for doesn't exist.
user - object - user's Id, first and last name and unique handle.
*/

function userProfileV1(token: string, uId: number) {
  // Gives access to the dataStore database via a local variable.
  const dataBase = getData();
  // Find the uId connected to the token
  const authUserId = getUIdfromtoken(token);
  // Check if authUserId is a valid user
  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  } else {
    // Check if user exists within the user array
    if (!dataBase.users.find((user: any) => user.uId === uId)) {
      throw HTTPError(400, '400: Invalid User!');
    } else {
      // Search for user of interest and store the details.
      const userOfInterest = dataBase.users.find(
        (user: any) => user.uId === uId
      );
      // return user information.
      return {
        user: {
          uId: userOfInterest.uId,
          email: userOfInterest.email,
          nameFirst: userOfInterest.nameFirst,
          nameLast: userOfInterest.nameLast,
          handleStr: userOfInterest.handleStr,
        },
      };
    }
  }
}
/*
This function allows a verified user access to the information of all users of the software.
This information includes the users email, first and last name as well as their unique handle.
arguments:
token - string - identifying the user who is searching the database for another user
returns:
error - object string - if the unique token doesn't exist.
user - object array - user's Id, first and last name and unique handle for all users.
*/
function usersAllV1(token: string) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);

  if (authUserId === null) {
    throw HTTPError(403, '403: Unauthorized User!');
  }

  const allUser = [];

  for (const user of data.users) {
    if (user.nameFirst !== 'Removed' && user.nameLast !== 'user') {
      const currentUser = userProfile(authUserId, user.uId);
      allUser.push(currentUser);
    }
  }

  return {
    users: allUser,
  };
}

/*
This function allows a verified user access to the information of all users of the software.
This information includes the users email, first and last name as well as their unique handle.
arguments:
token - string - identifying the user who is searching the database for another user
handleStr - string - another method to identify a user which is the username
returns:
error - object string - if the unique token doesn't exist, if handle is less than 3 or more than
20 characters, if contains non-alphanumeric characters and if the handle is already used by another user.
*/
function userProfileSethandleV1(token: string, handleStr: string) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);

  // testing if token is invalid
  if (authUserId === null) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  // testing if handleStr is less than 3 or more than 20
  if (handleStr.length < 3 || handleStr.length > 20) {
    throw HTTPError(400, '400: Handle Length Needs To Be Between 3 And 20 Characters Inclusive!');
  }
  // if handleStr doesn't contain alpha-numeric characters
  if (!handleStr.match(/^[0-9a-zA-Z]+$/)) {
    throw HTTPError(400, '400: Handle Must Only Contain Alphanumeric Characters!');
  }

  // if handleStr is already used by another user
  if (data.users.find((user: any) => user.handleStr === handleStr)) {
    throw HTTPError(400, '400: Handle Is Unavailable!');
  }

  // setting handleStr
  const userOfInterest = data.users.find(
    (user: any) => user.uId === authUserId
  );
  if (userOfInterest) {
    userOfInterest.handleStr = handleStr;
  }
  setData(data);
  return {};
}
/*
This function allows a verified user to update their first name and last name.
arguments:
token - string - identifying the user who is searching the database for another user
nameFirst - string - users registered first name
nameLast - string - users registered last name
returns:
error - object string - if the unique token doesn't exist, if first name is not between 1 - 50 characters inclusive,
if last name is not between 1 - 50 characters inclusive.
*/

function userProfileSetNameV1(token: string, nameFirst: string, nameLast: string) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);

  // testing if token is valid
  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }

  // testing if nameFirst is more than 50 characters or less than 1 character
  if (nameFirst.length < 1 || nameFirst.length > 50) {
    throw HTTPError(400, '400: First Name Needs To Be Between 1 And 50 Characters Inclusive!');
  }

  // testing if nameLast is more than 50 characters or less than 1 character
  if (nameLast.length < 1 || nameLast.length > 50) {
    throw HTTPError(400, '400: Last Name Needs To Be Between 1 And 50 Characters Inclusive!');
  }

  // if nameFirst does not consist of only alphabet characters
  if (!nameFirst.match(/^[a-zA-Z]+$/)) {
    throw HTTPError(400, '400: First Name Needs To Consist Of Alphabetic Characters!');
  }

  // if nameLast does not consist of only alphabet characters
  if (!nameLast.match(/^[a-zA-Z]+$/)) {
    throw HTTPError(400, '400: Last Name Must Only Contain Alphanumeric Characters!');
  }

  // setting name
  const registereduser = data.users.find(
    (user: any) => user.uId === authUserId
  );
  if (registereduser) {
    registereduser.nameFirst = nameFirst;
    registereduser.nameLast = nameLast;
  }
  setData(data);
  return {};
}

/*
This function allows a verified user to update their first name and last name.
arguments:
token - string - identifying the user who is searching the database for another user
email - string - registered user's email
returns:
error - object string - if the unique token doesn't exist, email entered is not a valid email, email is already being used by another user
*/

function userProfileSetEmailV1(token: string, email: string) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);

  // testing if token is valid
  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }

  // checks if the email is valid
  if (validator.isEmail(email) !== true) {
    throw HTTPError(400, '400: Not A Valid Email Address!');
  }

  // testing if email is already used by another user
  if (data.users.find((user:any) => user.email === email)) {
    throw HTTPError(400, '400: Email Address Already Registered!');
  }

  // setting user email
  const registereduser = data.users.find(
    (user: any) => user.uId === authUserId
  );
  if (registereduser) {
    registereduser.email = email;
  }
  setData(data);
  return {};
}
/**
 * Fetch the required statistics about this user's use of UNSW Treats.
 * @param token - string
 * @returns : error 403 if token is invalid or array of objects called userStats
 */
function userStatsV1 (token : string) {
  const data = getData();
  const authUserId = getUIdfromtoken(token);

  if (!authUserId) {
    throw HTTPError(403, 'Error! Invalid token');
  }

  const findUser = data.users.find((user : any) => user.uId === authUserId);
  const numChannelsJoined = findUser.stats.channelsJoined[findUser.stats.channelsJoined.length - 1].numChannelsJoined;
  const numDms = findUser.stats.dmsJoined[findUser.stats.dmsJoined.length - 1].numDmsJoined;
  const numMessages = findUser.stats.messagesSent[findUser.stats.messagesSent.length - 1].numMessagesSent;
  const totalChannel = data.channels.length;
  const totalDm = data.dms.length;
  const totalMessage = data.messages.length;
  const numerator = numChannelsJoined + numDms + numMessages;
  const denominator = totalChannel + totalDm + totalMessage;
  const userStats = findUser.stats;
  userStats.involvementRate = 1;
  if (denominator === 0) {
    userStats.involvementRate = 0;
  } else {
    userStats.involvementRate = numerator / denominator;
  }

  setData(data);
  return { userStats };
}

/**
 * Given a URL of an image on the internet will crop the image based on the input parameters
 * URL's must be in non-https format
 * @param imgUrl The url from where the image will be taken
 * @param xStart The distance from the left edge of the image where the crop begins
 * @param yStart The distance from the top of the image where the crop begins
 * @param xEnd   The distance from the left edge where the crop ends
 * @param yEnd   The distance from the top of the image where the crop ends.
 * @returns if no errors returns an empty object
 */
// function uploadUserPhotoV1(token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) {
//   const data = getData();
//   // Validating token and returning the userId
//   const authUserId = getUIdfromtoken(token);
//   if (!authUserId) {
//     throw HTTPError(403, '403: Unauthorized User!');
//   }

//   // check that imgUrl returns a http status other than 200 or any other errors occur when attempting
//   //  to retrieve the image (400 Error)
//   // if (statuscode !== 200) {throw HTTPError(400, '400: Status code Indicates Problem With Download!')}

//   // check xEnd is less than or equal to xStart or yEnd is less than or equal to yStart (400 Error)
//   if (xEnd <= xStart || yEnd <= yStart) {
//     throw HTTPError(400, '400: Cropping Dimensions Are Incorrect!');
//   }
//   // check image uploaded is not a JPG (400 Error)
//   const extensionCheck = imgUrl.slice((imgUrl.lastIndexOf('.') - 1 >>> 0) + 2);
//   if (extensionCheck !== 'jpg') {
//     throw HTTPError(400, '400: Image Is Not A JPG File');
//   }
//   // -------------- Implementation -------------------------------
//   // image editing library
//   const sharp = require('sharp');
//   // image downloader library
//   const download = require('image-downloader');

//   // download image off web based on options
//   async function downloadImg() {
//     await download.image(options)
//       .catch((err: any) => { throw HTTPError(400, '400: Unable To Download Image!'); });
//   }

//   // process (crop) image based on parameters
//   async function cropImg(delay: any) {
//     sharp(`./images/${authUserId}_original.jpg`)
//       .extract({ width: xLength, height: yLength, left: xStart, top: yStart })
//       .toFile(profileImgPath)
//       .catch((err: any) => { throw HTTPError(400, '400: The Cropping Parameters Are Not Within The Dimensions Of The Image!'); });
//   }

//   const xLength = xEnd - xStart;
//   const yLength = yEnd - yStart;

//   const originalImgPath = `../../images/${authUserId}_original.jpg`;
//   const options = {
//     url: imgUrl,
//     dest: originalImgPath
//   };

//   // Path of cropped profile image
//   const profileImgPath = `./images/profileImages/${authUserId}.jpg`;
//   async function processImg() {
//     try {
//       const downloading = await downloadImg();
//       await cropImg(downloading);
//       // await profileImageSearch(crop);
//     } catch (err) {
//       return null;
//     }
//   }
//   processImg() as any;
//   setData(data);
//   return {};
// }

/**
 * Fetches the required statistics about usage of UNSW Treats
 * @param token - string: Given to a verified user
 * @returns workspaceStats - object: The statistics related to user usage of UNSW Treats
 */
function usersStatsV1() {
  const data = getData();
  const workspaceStats = {
    channelsExist: [] as any,
    dmsExist: [] as any,
    messagesExist: [] as any,
    utilizationRate: 0,
  };
  for (const channel of data.workspaceStats.channelsExist) {
    workspaceStats.channelsExist.push(channel);
  }

  for (const dm of data.workspaceStats.dmsExist) {
    workspaceStats.dmsExist.push(dm);
  }
  for (const message of data.workspaceStats.messagesExist) {
    workspaceStats.messagesExist.push(message);
  }
  workspaceStats.utilizationRate = data.workspaceStats.utilizationRate;
  return { workspaceStats };
}

export { userProfileV1, usersAllV1, userProfileSethandleV1, userProfileSetNameV1, userProfileSetEmailV1, userStatsV1, usersStatsV1 /* uploadUserPhotoV1 */ };
