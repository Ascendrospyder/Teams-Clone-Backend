import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;
const OK = 200;

describe('channelMessagesV1', () => {
  // the user will first register and then will log in with different conditions.
  test('successful messages', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const data = JSON.parse(res.getBody() as any);
    const channelid = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel',
        isPublic: true,
      },
      headers: {
        token: data.token,
      }
    });
    const channelId1 = JSON.parse(channelid.getBody() as any);
    const res2 = request('GET', `${url}:${port}/channel/messages/v3`, {
      qs: { channelId: channelId1.channelId, start: 0 },
      headers: {
        token: data.token
      }
    });
    expect(res2.statusCode).toBe(OK);

    const data2 = JSON.parse(res2.getBody() as any);
    expect(data2).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
  });
  test('unsuccessful messages', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res2 = request('GET', `${url}:${port}/channel/messages/v3`, {
      qs: { channelId: '0', start: 0 },
      headers: {
        token: 'inValidToken'
      }
    });
    expect(res2.statusCode).toBe(403);
  });
});

test('channelsCreateV1', () => {
  request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  const res = request('POST', `${url}:${port}/auth/register/v3`, {
    json: {
      email: 'Arindam@unsw.edu.au',
      password: '234562',
      nameFirst: 'Arindam',
      nameLast: 'Mukherjee',
    },
  });
  const data = JSON.parse(res.getBody() as any);

  const channelid1 = request('POST', `${url}:${port}/channels/create/v3`, {
    json: {
      name: 'testchannel',
      isPublic: true,
    },
    headers: {
      token: data.token,
    }
  });
  expect(channelid1.statusCode).toBe(OK);
  const result = JSON.parse(channelid1.getBody() as any);
  expect(result).toStrictEqual({ channelId: 1 });
});

describe('channelDetailsV1', () => {
  test('printing out details for invalid channel', () => {
    // create user
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });

    // request invalid channel
    const req1 = request('GET', `${url}:${port}/channel/details/v3`, {
      qs: { channelId: '0' },
      headers: {
        token: 'invalid'
      }
    });
    expect(req1.statusCode).toBe(403);
  });

  test('when channelId provided refers to a existing private channel that the user is not apart of', () => {
    // create user
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channel = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const cId = JSON.parse(channel.getBody() as any);
    const req1 = request('GET', `${url}:${port}/channel/details/v3`, {
      qs: { channelId: cId.channelId },
      headers: {
        token: uId2.token
      }
    });
    expect(req1.statusCode).toBe(OK);
    const result = JSON.parse(req1.getBody() as any);
    expect(result).toStrictEqual({
      name: 'testchannel',
      isPublic: true,
      ownerMembers: [
        {
          email: 'Arindam@unsw.edu.au',
          handleStr: 'arindammukherjee',
          nameFirst: 'Arindam',
          nameLast: 'Mukherjee',
          uId: 1,
        },
      ],
      allMembers: [
        {
          email: 'Arindam@unsw.edu.au',
          handleStr: 'arindammukherjee',
          nameFirst: 'Arindam',
          nameLast: 'Mukherjee',
          uId: 1,
        },
      ],
    });
  });
});

test('If we join an invalid channel', () => {
  request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  const uId = request('POST', `${url}:${port}/auth/register/v3`, {
    json: {
      email: 'Arindam@unsw.edu.au',
      password: '234562',
      nameFirst: 'Arindam',
      nameLast: 'Mukherjee',
    },
  });
  const id1 = JSON.parse(uId.getBody() as any);

  const res = request('POST', `${url}:${port}/channel/join/v3`, {
    json: {
      channelId: -1,
    },
    headers: {
      token: id1.token
    }
  });
  expect(res.statusCode).toBe(400);
});

test('testing if it successfully joins a public channel', () => {
  request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });

  const uId1 = request('POST', `${url}:${port}/auth/register/v3`, {
    json: {
      email: 'Arindam@unsw.edu.au',
      password: '234562',
      nameFirst: 'Arindam',
      nameLast: 'Mukherjee',
    },
  });

  const id1 = JSON.parse(uId1.getBody() as any);

  const uId2 = request('POST', `${url}:${port}/auth/register/v3`, {
    json: {
      email: 'JennyPatrick@gmail.com',
      password: 'noOneIsGoing2GuessThis',
      nameFirst: 'Jenny',
      nameLast: 'Patrick',
    },
  });

  const id2 = JSON.parse(uId2.getBody() as any);

  const uIdc1 = request('POST', `${url}:${port}/channels/create/v3`, {
    json: {
      name: 'Ice Cream',
      isPublic: true,
    },
    headers: {
      token: id2.token,
    }
  });

  const idc1 = JSON.parse(uIdc1.getBody() as any);

  const join = request('POST', `${url}:${port}/channel/join/v3`, {
    json: {
      channelId: idc1.channelId,
    },
    headers: {
      token: id1.token
    }
  });
  expect(join.statusCode).toBe(OK);
  const result = JSON.parse(join.getBody() as any);
  expect(result).toStrictEqual({});
  const res = request('GET', `${url}:${port}/channel/details/v3`, {
    qs: {
      channelId: idc1.channelId,
    },
    headers: {
      token: id1.token
    }
  });

  const data = JSON.parse(res.getBody() as any);
  expect(data).toStrictEqual({
    name: 'Ice Cream',
    isPublic: true,
    allMembers: [
      {
        email: 'Arindam@unsw.edu.au',
        handleStr: 'arindammukherjee',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
        uId: 1,
      },
      {
        email: 'JennyPatrick@gmail.com',
        handleStr: 'jennypatrick',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
        uId: 2,
      },
    ],
    ownerMembers: [
      {
        email: 'JennyPatrick@gmail.com',
        handleStr: 'jennypatrick',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
        uId: 2,
      },
    ],
  });
});

describe('channelLeaveV1', () => {
  test('If we leave an invalid channel', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const uId = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });

    const id1 = JSON.parse(uId.getBody() as any);

    const res = request('POST', `${url}:${port}/channel/leave/v2`, {
      json: {
        channelId: -1,
      },
      headers: {
        token: id1.token,
      }
    });
    expect(res.statusCode).toBe(400);
  });

  test('testing if it successfully leaves a public channel', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });

    const uId1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    JSON.parse(uId1.getBody() as any);
    const uId2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    const id2 = JSON.parse(uId2.getBody() as any);
    const uIdc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Ice Cream',
        isPublic: true,
      },
      headers: {
        token: id2.token,
      }
    });
    const idc1 = JSON.parse(uIdc1.getBody() as any);
    const res = request('POST', `${url}:${port}/channel/leave/v2`, {
      json: {
        token: id2.token,
        channelId: idc1.channelId,
      },
      headers: {
        token: id2.token
      }
    });
    expect(res.statusCode).toBe(OK);
    const data = JSON.parse(res.getBody() as any); // this might be wrong
    expect(data).toStrictEqual({});
  });
});
