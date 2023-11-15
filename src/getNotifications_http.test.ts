import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;

describe('getNotifications', () => {
  // the user will first register and then will log in with different conditions.
  test('Testing Unauthorised User', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('GET', `${url}:${port}/notifications/get/v1`, {
      qs: {},
      headers: {
        token: '$invalidToken$',
      }
    });
    expect(res.statusCode).toBe(403);
  });
  test('Testing Zero Notifications', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const res = request('GET', `${url}:${port}/notifications/get/v1`, {
      qs: {},
      headers: {
        token: user1.token,
      }
    });
    const data = JSON.parse(res.getBody() as any);
    expect(data).toEqual({ notifications: [] });
  });
  test('Testing When A Notification Exists', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'James',
        nameLast: 'Brown',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    request('POST', `${url}:${port}/channel/invite/v3`, {
      json: {
        channelId: channel1.channelId,
        uId: user2.authUserId,
      },
      headers: {
        token: user1.token,
      },
    });
    const res = request('GET', `${url}:${port}/notifications/get/v1`, {
      qs: {},
      headers: {
        token: user2.token,
      }
    });
    const data = JSON.parse(res.getBody() as any);
    expect(data).toEqual({
      notifications: [
        {
          channelId: 1,
          dmId: -1,
          notificationMessage: 'kellybrown added you to Pop Corn ',
        }
      ]
    });
  });
});
