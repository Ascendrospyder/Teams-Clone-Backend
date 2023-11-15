import { getData, setData } from './dataStore';
import { getUIdfromtoken } from './helper';
import HTTPError from 'http-errors';

/*
a global user can remove a user from Treats using their uId.
They will be removed:
- from all channels/ dms
- array returned by users/all
Treat owners can remove other treat owners (including the original first owner)
Removed users will have their messages be replaces with 'Removed user'
The profile will still be retrivable by using the function user/profile, but
the first name and last name will be replaced with 'Removed' 'user' respectively.
The handleStr and email is reusable after being removed.

Arguments:
token - string - the global user who will remove a user
uId - number - the selected uId of someone who is going to be removed

Returns:
nothing if no errors

400 Error occurs:
- uId does not refer to a valid user
- uId refers to only global user

403 Error occurs:
- the token is not a global owner
*/

export function userPermissionRemoveV1(token: string, uId: number) {
  const database = getData();

  // checks if user exist
  const authUserId = getUIdfromtoken(token);
  if (!authUserId) {
    throw HTTPError(403, 'Error! Invalid Token');
  }
  const owner = database.users.find((user:any) => user.uId === authUserId);
  database.users.find((user: any) => user.uId === uId);
  // checks if uId exists
  if (!database.users.find((user: any) => user.uId === uId)) {
    throw HTTPError(400, 'Error! No User');
  }

  if (owner.permission !== 1) {
    throw HTTPError(403, 'User Is not a Global Owner!');
  }

  const owners = database.users.filter((user:any) => user.permission === 1);
  if (owners.length === 1 && owners[0].uId === uId) {
    throw HTTPError(400, 'there is only 1 owner');
  }

  // removes from all channels
  for (const channels of database.channels) {
    if (channels.allMembers.find((member: any) => member === uId)) {
      for (const index in channels.allMembers) {
        if (channels.allMembers[index] === uId) {
          channels.allMembers.splice(index, 1);
        }
      }
      for (const index in channels.ownerMembers) {
        if (channels.ownerMembers[index] === uId) {
          channels.ownerMembers.splice(index, 1);
        }
      }
    }
  }

  // removes from all dms
  for (const dms of database.dms) {
    if (dms.allMembers.find((member: any) => member === uId)) {
      for (const index in dms.allMembers) {
        if (dms.allMembers[index] === uId) {
          dms.allMembers.splice(index, 1);
        }
      }
      for (const index in dms.ownerMembers) {
        if (dms.ownerMembers[index] === uId) {
          dms.ownerMembers.splice(index, 1);
        }
      }
    }
  }

  // edit name to 'removed user' on profile
  const removedUser = database.users.find(
    (user: any) => user.uId === uId
  );
  if (removedUser) {
    removedUser.nameFirst = 'Removed';
    removedUser.nameLast = 'user';
    removedUser.email = '';
    removedUser.handleStr = '';
  }

  for (const messages of database.messages) {
    if (messages.uId === uId) {
      messages.message = 'Removed user';
    }
  }

  setData(database);
  return {};
}

/*
Through this function a global owner can change the permissions of another user (both global owner and any member)

Arguments:
token - string - the global owner who will change the permissionId
uId - number - the selected uId of someone who is having their permissionId changed
permissionId - number - a permissionId of (1) determines a global owner // a permissionId of (2) determines a normal member

Returns:
nothing if no errors

400 Error occurs:
- uId does not refer to a valid user
- uId refers to only global user and they are being demoted by a normal user
- permissionId is invalid
- the user already has existing permissionId

403 Error occurs:
- the token is not a global owner
*/

export function userPermissionChangeV1(token: string, uId: number, permissionId: number) {
  const database = getData();
  // checks if user exist
  const authUserId = getUIdfromtoken(token);
  if (!authUserId) {
    throw HTTPError(400, 'Error! Invalid Token');
  }

  const user = database.users.find((user: any) => user.uId === uId);
  // checks if uId exists
  if (!database.users.find((user: any) => user.uId === uId)) {
    throw HTTPError(400, 'Error! No User');
  }

  // checks if valid permissionId was inputted
  if (permissionId === user.permission || permissionId < 0 || permissionId > 2) {
    throw HTTPError(400, 'Error! Invalid PermissionId');
  }

  // checks if global user is authUserId
  const globalowner = database.users.find(
    (user:any) => user.uId === authUserId
  );

  if (globalowner.permission !== 1) {
    throw HTTPError(403, 'Invalid User Changing Permissions!');
  } else {
    user.permission = permissionId;
  }
  setData(database);
  return {};
}
