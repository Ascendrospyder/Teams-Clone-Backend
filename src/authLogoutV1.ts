import { getUIdfromtoken } from './helper';
import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

// Removes token from token array upon closing an active session.
// argument:
// token - string - Issued to a validated user.
// returns:
// {} - empty object - output is an empty object.
// error - not specified by the spec.
export function authLogoutV1(token: string) {
  const database = getData();
  // Search for token
  const authUserId = getUIdfromtoken(token);

  // validating token/authUser
  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  const authUser = database.users.find((user: any) => user.uId === authUserId);

  // Remove token from token array.
  for (const index in authUser.tokens) {
    if (authUser.tokens[index] === token) {
      authUser.tokens.splice(index, 1);
    }
  }
  setData(database);
  return {};
}
