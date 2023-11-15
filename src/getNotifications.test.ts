import { getNotificationsV1 } from './getNotifications';
import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV1 } from './channels';
import { channelInviteV1 } from './channel';
import HTTPError from 'http-errors';

describe('Testing getNotifications function', () => {
  test('Testing Unauthorised User', () => {
    clearV1();
    try {
      getNotificationsV1('$notAValidToken$');
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
  });
  test('Testing Zero Notifications', () => {
    clearV1();
    const id = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    expect(getNotificationsV1(id.token)).toEqual({ notifications: [] });
  });
  test('Testing When A Notification Exists', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id2 = authRegisterV1(
      'kelly@gmail.com',
      'KBrT45Pq9',
      'Kelly',
      'Brown'
    );
    const idc = channelsCreateV1(id2.token, 'ice cream', true);
    channelInviteV1(id2.token, idc.channelId, id1.authUserId);
    expect(getNotificationsV1(id1.token)).toEqual({
      notifications: [
        {
          channelId: 1,
          dmId: -1,
          notificationMessage: 'kellybrown added you to ice cream ',
        }
      ]
    });
  });
});
