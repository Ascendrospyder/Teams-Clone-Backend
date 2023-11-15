import { getData, setData } from './dataStore';
import { generateToken, getHashOf, utilization } from './helper';
import validator from 'validator';
import HTTPError from 'http-errors';
import config from './config.json';

const nodemailer = require('nodemailer');

/* A user will enter their login details in to the function and it returns their authUserId if it is correct otherwise return an error.
email - string - the email that the user signed up with (user.email)
password - string - the password the user signed up with (user.password)
returns:
error if the email doesn't exist or the password does not match
authUserId if there is no error
*/
function authLoginV1(email: string, password: string) {
  const data = getData();
  // Searches through the data to check if the email exists otherwise return an error
  if (!data.users.find((user: any) => user.email === email)) {
    throw HTTPError(400, '400: Email Does Not Belong To User!');
  }

  // Hash password and compare to stored value
  const hashedPassword = getHashOf(password);
  // Finds the user and checks if the users password is correct
  const user = data.users.find((user: any) => user.email === email);
  if (user.hashedPassword === hashedPassword) {
    const token = generateToken(user.uId);
    // Generates hashedToken
    const hashedToken = getHashOf(token);
    user.tokens.push(token);
    user.hashedTokens.push(hashedToken);
    setData(data);
    return { token: token, authUserId: user.uId, hashedToken };
  }
  // The password is incorrect and returns an error
  throw HTTPError(400, '400: Password Is Incorrect!');
}

/* registers the user, generates a handle for them and adds their details to the datastore
arguments
email: string - the email that the user wants to register with
password: string - the password that the user wants to register with
nameFirst - string - the firstName of the user
nameLast - string - the lastName of the user
Return values
AuthID: when there is no error it returns the userID
error: when the email already exists, the password is less than 6 characters, the first and last name is less than 1 or greater than 50 characters or the email is invalid.
*/
function authRegisterV1(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
) {
  const data = getData();

  // Checking for errors in the user input and then returns an error
  if (data.users.find((user: any) => user.email === email)) {
    throw HTTPError(400, '400: Email Address Already Registered!');
  } else if (validator.isEmail(email) !== true) {
    throw HTTPError(400, '400: Not A Valid Email Address!');
  } else if (password.length < 6) {
    throw HTTPError(400, '400: Minimum Length Of Password is 6 Characters!');
  } else if (nameFirst.length < 1 || nameFirst.length > 50) {
    throw HTTPError(
      400,
      '400: First Name Must Be Between 1 and 50 Characters!'
    );
  } else if (nameLast.length < 1 || nameLast.length > 50) {
    throw HTTPError(400, '400: Last Name Must Be Between 1 and 50 Characters!');
  }
  // Hashing password
  const hashedPassword = getHashOf(password);

  // The userID will be 1 more than the previous userID
  const uId = data.users.length + 1;

  // By default the permission will be 2 but if it is the first user created it will be 1
  let permission = 2;
  if (uId === 1) {
    permission = 1;
    // workspace analytics
    data.workspaceStats.channelsExist.push({
      numChannelsExist: data.channels.length,
      timeStamp: ~~(Date.now() / 1000)
    });
    data.workspaceStats.dmsExist.push({
      numDmsExist: data.dms.length,
      timeStamp: ~~(Date.now() / 1000)
    });
    data.workspaceStats.messagesExist.push({
      numMessagesExist: data.messages.length,
      timeStamp: ~~(Date.now() / 1000)
    });
  }

  // Concatenate the first and last name and removes alphanumeric and converts all uppercase letters to lowercase. Takes the first 20 characters
  let handle: string = nameFirst.concat(nameLast);
  handle = handle.toLowerCase();
  handle = handle.replace(/[^a-z0-9]/g, '');
  handle = handle.slice(0, 20);
  let handleCount = 0;

  // Iterates through the handles and counts if the handle is already in use. Appends the amount of times the handle
  // has occurred to the end of the handle if the count is greater than 0 (there is more than 1 handle already in use)
  for (const user of data.users) {
    if (handle === user.handleStr.substring(0, handle.length)) {
      handleCount++;
    }
  }

  if (handleCount > 0) {
    handle = handle.concat((handleCount - 1).toString());
  }
  // generate a token and initially set the user's token as the token because they are
  // automatically logged in when creating their account
  const token = generateToken(uId);
  const tokens = [token];

  // Generate hashedToken and store in array
  const hashedToken = getHashOf(token);
  const hashedTokens = [hashedToken];
  // Adding the data to the datastore
  data.users.push({
    uId: uId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    hashedPassword: hashedPassword, // <--- check if any other functions use password key
    handleStr: handle,
    profileImgUrl: `http://${config.url}:${parseInt(config.port)}/images/profileImages/default.jpg`,
    permission: permission,
    notifications: [],
    tokens: tokens,
    hashedTokens: hashedTokens,
    stats: {
      channelsJoined: [{ numChannelsJoined: 0, timeStamp: ~~(Date.now() / 1000) }],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: ~~(Date.now() / 1000) }],
      messagesSent: [{ numMessagesSent: 0, timeStamp: ~~(Date.now() / 1000) }],
      involvementRate: 0
    },
    resetCode: null,
  });
  // workspaceStats
  data.workspaceStats.utilizationRate = utilization();
  setData(data);
  return { token: token, authUserId: uId, hashedToken: hashedToken };
}
/**
 * a user will submit if they have forgotten their password, then an email
 * with a code to reset thei password will be sent to the email they entered
 * @param email - the email the user signed up with
 * @returns nothing
 */
function authPasswordRequest(email: string) {
  const data = getData();
  // check if the user exists
  const user = data.users.find((user: any) => user.email === email);
  // set up email in node
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thecomp1531email@gmail.com',
      pass: 'ermwesloygwhxcsp',
    },
  });
  if (user) {
    // generate code
    const code = Math.random().toString(36).substring(2);
    // invalidate all codes and set resetcode as new code
    user.tokens.length = 0;
    user.resetCode = code;
    // contents of email will only be the code
    const details = {
      from: 'thecomp1531email@gmail.com',
      to: user.email,
      subject: 'password reset',
      text: code,
    };
    // send the email
    transporter.sendMail(details);
  }
  setData(data);
  return {};
}

/**
 * a user will enter the resetcode from the email send and be able
 * to reset their password
 * @param resetCode - the reset code from the email
 * @param newPassword  - the new password the user wants to enter
 * @returns nothing
 */
function authPasswordReset(resetCode: string, newPassword: string) {
  const data = getData();

  const user = data.users.find((user) => user.resetCode === resetCode);
  // checks if the password is correct length
  if (newPassword.length < 6) {
    throw HTTPError(400, '400: invalid password');
  }
  // checks if the reset code is valid
  if (!user) {
    throw HTTPError(400, '400: invalid reset code');
  }
  // store the new password an invalidate new resetcode
  user.hashedPassword = getHashOf(newPassword);
  user.resetCode = null;
  setData(data);
  return {};
}

export { authRegisterV1, authLoginV1, authPasswordRequest, authPasswordReset };
