import config from './config.json';
import request from 'sync-request';

const OK = 200;
const port = config.port;
const url = config.url;

describe('HTTP Tests for user/profile/v3', () => {
  test('User exists', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const data = JSON.parse(id1.getBody() as any);
    const res = request('GET', `${url}:${port}/user/profile/v3`, {
      qs: {
        uId: data.authUserId,
      },
      headers: {
        token: data.token,
      },
    });
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(res.getBody() as any);
    expect(result).toEqual({
      user: {
        uId: 1,
        email: 'kelly@gmail.com',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
        handleStr: 'kellybrown',
      },
    });
  });
  test('User does not exist', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const res = request('GET', `${url}:${port}/user/profile/v3`, {
      qs: {
        // token: '$notRealToken$',
        uId: 12,
      },
      headers: {
        Authorization: `${'$notRealToken$'}`
      }
    });
    expect(res.statusCode).toStrictEqual(403);
  });
  test('Multiple users exist', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'lucky@gmail.com',
        password: 'fBrT99Qq9',
        nameFirst: 'Lucky',
        nameLast: 'Nelly',
      },
    });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const id4 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'fBrmTP45Pq9',
        nameFirst: 'James',
        nameLast: 'Peters',
      },
    });
    const data = JSON.parse(id4.getBody() as any);
    const res = request('GET', `${url}:${port}/user/profile/v3`, {
      qs: {
        uId: data.authUserId,
      },
      headers: {
        token: data.token,
      },
    });
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(res.getBody() as any);
    expect(result).toEqual({
      user: {
        uId: 4,
        email: 'james@gmail.com',
        nameFirst: 'James',
        nameLast: 'Peters',
        handleStr: 'jamespeters',
      },
    });
  });
});
describe('HTTP Tests for users/all/v2', () => {
  test('User exists', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const data = JSON.parse(id2.getBody() as any);
    const res = request('GET', `${url}:${port}/users/all/v2`, {
      headers: {
        token: data.token,
      },
    });
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(res.getBody() as any);
    expect(result).toEqual({
      users: [
        {
          email: 'JennyPatrick@gmail.com',
          handleStr: 'jennypatrick',
          nameFirst: 'Jenny',
          nameLast: 'Patrick',
          uId: 1,
        },
        {
          email: 'kelly@gmail.com',
          handleStr: 'kellybrown',
          nameFirst: 'Kelly',
          nameLast: 'Brown',
          uId: 2,
        },
      ],
    });
  });
  test('User does not exist', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const res = request('GET', `${url}:${port}/users/all/v2`, {
      headers: {
        token: '$notRealToken$',
      },
    });
    expect(res.statusCode).toStrictEqual(403);
  });
});
describe('HTTP Tests for user/profile/sethandle/v2', () => {
  test('Testing a valid handleStr', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/sethandle/v2`,
      {
        json: {
          handleStr: 'thisismyhandle',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    const userProfile = request('GET', `${url}:${port}/user/profile/v3`,
      {
        qs: {
          uId: 1,
        },
        headers: {
          token: uid1.token,
        }
      }
    );
    const result = JSON.parse(userProfile.getBody() as any);
    const handleFromUser = result.user.handleStr;
    expect(res.statusCode).toBe(OK);
    expect(handleFromUser).toEqual('thisismyhandle');
  });
  test('Testing handleStr isnt already being used', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const uid2 = JSON.parse(id2.getBody() as any);
    request('PUT', `${url}:${port}/user/profile/sethandle/v2`,
      {
        json: {
          handleStr: 'thisismyhandle',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    const res = request('PUT', `${url}:${port}/user/profile/sethandle/v2`,
      {
        json: {
          handleStr: 'thisismyhandle',
        },
        headers: {
          token: uid2.token,
        },
      }
    );
    expect(res.statusCode).toBe(400);
  });
  test('Testing a invalid handleStr', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/sethandle/v2`,
      {
        json: {
          handleStr: '@##$',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    expect(res.statusCode).toStrictEqual(400);
    const result = JSON.parse(res.body as string);
    expect(result).toEqual({ error: { message: '400: Handle Must Only Contain Alphanumeric Characters!' } });
  });
});
describe('HTTP Tests for user/profile/setname/v2', () => {
  test('Testing For Unauthorised User', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const res = request('PUT', `${url}:${port}/user/profile/setname/v2`,
      {
        json: {
          nameFirst: 'Arindam',
          nameLast: 'Mukherjee'
        },
        headers: {
          token: '$notAValidToken$',
        },
      }
    );
    expect(res.statusCode).toBe(403);
  });
  test('Testing if name is invalid', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/setname/v2`,
      {
        json: {
          nameFirst: '',
          nameLast: 'Mukherjee',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Testing if first name is between 1 and 50 characters', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/setname/v2`,
      {
        json: {
          nameFirst: '',
          nameLast: 'Mukherjee',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Testing if last name is between 1 and 50 characters', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/setname/v2`,
      {
        json: {
          nameFirst: 'Arindam',
          nameLast: '',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Testing if last name has only alphanumeric characters', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/setname/v2`,
      {
        json: {
          nameFirst: 'Arindam',
          nameLast: '*?p',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    expect(res.statusCode).toStrictEqual(400);
  });
  test('Testing if first name has only alphanumeric characters', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/setname/v2`,
      {
        json: {
          nameFirst: '*Arindam!',
          nameLast: 'Mukherjee',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    expect(res.statusCode).toStrictEqual(400);
  });
});
describe('HTTP Tests for user/profile/setemail/v2', () => {
  test('Testing for unauthorised user', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/setemail/v2`,
      {
        json: {
          token: uid1.token,
          email: 'NotArindam@unsw.edu.au',
        },
        headers: {
          token: '$notAValidToken$',
        },
      }
    );
    expect(res.statusCode).toBe(403);
  });
  test('Testing a valid email', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/setemail/v2`,
      {
        json: {
          token: uid1.token,
          email: 'NotArindam@unsw.edu.au',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    expect(res.statusCode).toBe(OK);
    const userProfile = request('GET', `${url}:${port}/user/profile/v3`,
      {
        qs: {
          token: uid1.token,
          uId: 1,
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    const result = JSON.parse(userProfile.getBody() as any);
    const registeremail = result.user.email;
    expect(registeremail).toEqual('NotArindam@unsw.edu.au');
  });
  test('Testing a valid email', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const uid1 = JSON.parse(id1.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/setemail/v2`,
      {
        json: {
          token: uid1.token,
          email: 'NotArindam@unsw.edu.au',
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    expect(res.statusCode).toBe(OK);
    const userProfile = request('GET', `${url}:${port}/user/profile/v3`,
      {
        qs: {
          token: uid1.token,
          uId: 1,
        },
        headers: {
          token: uid1.token,
        },
      }
    );
    const result = JSON.parse(userProfile.getBody() as any);
    const registeremail = result.user.email;
    expect(registeremail).toEqual('NotArindam@unsw.edu.au');
  });
  test('Testing if email is invalid', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee'
      },
    });
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'RobotRobot@gmail.com',
        password: '123821',
        nameFirst: 'Boop',
        nameLast: 'Beep',
      },
    });
    const uid2 = JSON.parse(id2.getBody() as any);
    const res = request('PUT', `${url}:${port}/user/profile/setemail/v2`,
      {
        json: {
          email: 'Arindam@unsw.edu.au',
        },
        headers: {
          token: uid2.token,
        },
      }
    );
    expect(res.statusCode).toStrictEqual(400);
  });
});
describe('userStatsV1', () => {
  test('testing a valid case of displaying userStats', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const uId1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const id1 = JSON.parse(uId1.getBody() as any);
    const uId2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly3@gmail.com',
        password: 'KBrT45sPq9',
        nameFirst: 'Kellys',
        nameLast: 'Browns',
      },
    });
    const id2 = JSON.parse(uId2.getBody() as any);
    const channelId1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: id1.token,
      }
    });
    const idc1 = JSON.parse(channelId1.getBody() as any);

    request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: idc1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${id1.token}`
      },
    });

    request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: idc1.channelId,
        message: 'hello23',
      },
      headers: {
        token: `${id1.token}`
      },
    });

    request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: idc1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${id1.token}`
      },
    });

    request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [id2.authUserId],
      },
      headers: {
        token: `${id1.token}`
      },
    });

    const userInfo = request('GET', `${url}:${port}/user/stats/v1`, {
      json: {
        token: id1.token,
      },
      headers: {
        token: `${id1.token}`
      },
    });

    const res = JSON.parse(userInfo.getBody() as any);
    res.userStats.channelsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    res.userStats.dmsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    res.userStats.messagesSent.forEach((object : any) => {
      delete object.timeStamp;
    });
    expect(userInfo.statusCode).toBe(OK);
    expect(res).toStrictEqual({
      userStats: {
        channelsJoined: [{ numChannelsJoined: 0 }],
        dmsJoined: [{ numDmsJoined: 0 }, { numDmsJoined: 1 }],
        messagesSent: [
          { numMessagesSent: 0 },
          { numMessagesSent: 1 },
          { numMessagesSent: 2 },
          { numMessagesSent: 3 }
        ],
        involvementRate: res.userStats.involvementRate
      }
    });
  });

  test('testing an invalid case for user/stats/v1', () => {
    const uId1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kel@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const id1 = JSON.parse(uId1.getBody() as any);
    const uId2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kellsy3@gmail.com',
        password: 'KBrT45sPq9',
        nameFirst: 'Kellsys',
        nameLast: 'Brdowns',
      },
    });
    const id2 = JSON.parse(uId2.getBody() as any);
    const channelId1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: id1.token,
      }
    });
    const idc1 = JSON.parse(channelId1.getBody() as any);

    request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: idc1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${id1.token}`
      },
    });

    request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: idc1.channelId,
        message: 'hello23',
      },
      headers: {
        token: `${id1.token}`
      },
    });

    request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: idc1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${id1.token}`
      },
    });

    request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [id2.authUserId],
      },
      headers: {
        token: `${id1.token}`
      },
    });

    const userInfo = request('GET', `${url}:${port}/user/stats/v1`, {
      json: {
        token: 'hehehehe',
      },
      headers: {
        token: 'hehehehe'
      },
    });
    expect(userInfo.statusCode).toBe(403);
  });
});
