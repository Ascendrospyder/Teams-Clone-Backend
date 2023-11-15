import config from './config.json';
import request from 'sync-request';
const OK = 200;
const port = config.port;
const url = config.url;

describe('HTTP Tests for channel/invite/v3', () => {
  test('A validated public user invites another user to join an existing public channel', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Ice Cream',
        isPublic: 1
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const res = request('POST', `${url}:${port}/channel/invite/v3`, {
      json: {
        channelId: channel1.channelId,
        uId: user2.authUserId,
      },
      headers: {
        token: user1.token,
      }
    });
    const result = JSON.parse(res.getBody() as any);
    expect(res.statusCode).toBe(OK);
    expect(result).toEqual({});
  });
  test('A validated private user invites another user to join an existing private channel', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Ice Cream',
        isPublic: 0
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const res = request('POST', `${url}:${port}/channel/invite/v3`, {
      json: {
        channelId: channel1.channelId,
        uId: user2.authUserId,
      },
      headers: {
        token: user1.token,
      }
    });
    const result = JSON.parse(res.getBody() as any);
    expect(res.statusCode).toBe(OK);
    expect(result).toEqual({});
  });
  test('An invalid user invites another user to join a private channel (tests also for public and invalid channel)', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Fast Cars',
        isPublic: 0
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const res = request('POST', `${url}:${port}/channel/invite/v3`, {
      json: {
        token: '$notAValidToken$',
        channelId: channel1.channelId,
        uId: user1.authUserId,
      },
      headers: {
        token: '$notAValidToken$',
      }
    });
    expect(res.statusCode).toBe(403);
  });
  test('A validated user invites another user to join an invalid channel', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const channel1 = 'invalid channel';
    const res = request('POST', `${url}:${port}/channel/invite/v3`, {
      json: {
        channelId: channel1,
        uId: user2.authUserId,
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toBe(400);
  });
});
