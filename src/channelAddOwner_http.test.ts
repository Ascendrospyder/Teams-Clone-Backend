import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;
const OK = 200;

describe('HTTP Testing: Testing functionality of the channel/addowner/v2', () => {
  test('Promoting 1 member to owner', () => {
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
        email: 'JohnSmith@gmail.com',
        password: 'inventingNewPasswordsMakesMeCry',
        nameFirst: 'John',
        nameLast: 'Smith',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user3 = JSON.parse(id3.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user2.token,
      }
    });
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user3.token,
      }
    });
    const res = request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: channel1.channelId,
        uId: user2.authUserId,
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(res.getBody() as any);
    expect(result).toEqual({});
  });
  test('Promoting a 2nd member to owner', () => {
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
        email: 'JohnSmith@gmail.com',
        password: 'inventingNewPasswordsMakesMeCry',
        nameFirst: 'John',
        nameLast: 'Smith',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user3 = JSON.parse(id3.getBody() as any);
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'fBrmTP45Pq9',
        nameFirst: 'James',
        nameLast: 'Peters',
      },
    });
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user2.token,
      }
    });
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user3.token,
      }
    });
    request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: channel1.channelId,
        uId: user2.authUserId,
      },
      headers: {
        token: user1.token,
      }
    });
    const res = request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: channel1.channelId,
        uId: user3.authUserId,
      },
      headers: {
        token: user2.token,
      }
    });
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(res.getBody() as any);
    expect(result).toEqual({});
  });
});
describe('HTTP Testing: Validating inputs to the channel/addowner/v2 route', () => {
  test('Testing with invalid authUserId', () => {
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
        email: 'JohnSmith@gmail.com',
        password: 'inventingNewPasswordsMakesMeCry',
        nameFirst: 'John',
        nameLast: 'Smith',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'fBrmTP45Pq9',
        nameFirst: 'James',
        nameLast: 'Peters',
      },
    });
    const user3 = JSON.parse(id3.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user2.token,
      }
    });
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user3.token,
      }
    });
    const res = request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: channel1.channelId,
        uId: user2.authUserId,
      },
      headers: {
        token: '$notAValidToken',
      }
    });
    expect(res.statusCode).toStrictEqual(403);
  });
  test('Invalid UId', () => {
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
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'fBrmTP45Pq9',
        nameFirst: 'James',
        nameLast: 'Peters',
      },
    });
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JohnSmith@gmail.com',
        password: 'inventingNewPasswordsMakesMeCry',
        nameFirst: 'John',
        nameLast: 'Smith',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'lucky@gmail.com',
        password: 'fBrT99Qq9',
        nameFirst: 'Lucky',
        nameLast: 'Nelly',
      },
    });
    const user3 = JSON.parse(id3.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        token: user2.token,
        channelId: channel1.channelId
      },
      headers: {
        token: user2.token,
      }
    });
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user3.token,
      }
    });
    const res = request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: channel1.channelId,
        uId: -500,
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Invalid channel', () => {
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
        email: 'JohnSmith@gmail.com',
        password: 'inventingNewPasswordsMakesMeCry',
        nameFirst: 'John',
        nameLast: 'Smith',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const res = request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: -854,
        uId: user2.authUserId,
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('AuthUser not owner of channel', () => {
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
        email: 'JohnSmith@gmail.com',
        password: 'inventingNewPasswordsMakesMeCry',
        nameFirst: 'John',
        nameLast: 'Smith',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user3 = JSON.parse(id3.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user2.token,
      }
    });
    const res = request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: channel1.channelId,
        uId: user2.authUserId,
      },
      headers: {
        token: user3.token,
      }
    });
    expect(res.statusCode).toStrictEqual(403);
  });
  test('The uId is not a member of the channel', () => {
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
        email: 'JohnSmith@gmail.com',
        password: 'inventingNewPasswordsMakesMeCry',
        nameFirst: 'John',
        nameLast: 'Smith',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user3 = JSON.parse(id3.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user2.token,
      }
    });
    const res = request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: channel1.channelId,
        uId: user3.authUserId,
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toStrictEqual(400);
  });
  test('An existing owner is added as an owner', () => {
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
        email: 'JohnSmith@gmail.com',
        password: 'inventingNewPasswordsMakesMeCry',
        nameFirst: 'John',
        nameLast: 'Smith',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user3 = JSON.parse(id3.getBody() as any);
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'fBrmTP45Pq9',
        nameFirst: 'James',
        nameLast: 'Peters',
      },
    });
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      }
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user2.token,
      }
    });
    request('POST', `${url}:${port}/channel/join/v3`, {
      json: {
        channelId: channel1.channelId
      },
      headers: {
        token: user3.token,
      }
    });
    request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: channel1.channelId,
        uId: user2.authUserId,
      },
      headers: {
        token: user1.token,
      }
    });
    const res = request('POST', `${url}:${port}/channel/addowner/v2`, {
      json: {
        channelId: channel1.channelId,
        uId: user1.authUserId,
      },
      headers: {
        token: user2.token,
      }
    });
    expect(res.statusCode).toStrictEqual(400);
  });
});
