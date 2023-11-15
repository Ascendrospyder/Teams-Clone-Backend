import { getData } from './dataStore';
import HTTPError from 'http-errors';
import { getUIdfromtoken } from './helper';

/**
 * Return the user's most recent 20 notifications, ordered from most recent to least recent.
 * @param token - string: Validates person as an authorized user
 * @returns -object: 20 most recent notifications
 */
export function getNotificationsV1(token: string) {
  // Validating token and returning the userId
  const authUserId = getUIdfromtoken(token);

  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  const data = getData();
  const userOfInterest = data.users.find((user: any) => user.uId === authUserId);

  const notifications: any[] = [];

  if (userOfInterest.notifications.length === undefined || userOfInterest.notifications.length === 0) {
    return { notifications };
  } else {
    for (const index in userOfInterest.notifications) {
      if (parseInt(index) < 20) {
        notifications.push(userOfInterest.notifications[parseInt(index)]);
      }
    }
    return { notifications };
  }
}
