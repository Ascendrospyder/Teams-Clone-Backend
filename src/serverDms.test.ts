import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;
const OK = 200;

describe('dmsCreate', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful dmcreate', () => {
    const uIdreg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId = JSON.parse(uIdreg.getBody() as any);
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arin43dam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const dm = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId],
      },
      headers: {
        token: `${uId.token}`
      },
    });
    expect(dm.statusCode).toBe(OK);
  });

  test('unsuccessful dmcreate', () => {
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arind43am@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const dm = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId],
      },
      headers: {
        token: '5489548390543dsas'
      },
    });
    expect(dm.statusCode).toBe(403);
  });
});

describe('HTTP tests for dmLeave', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });

  test('successful dmLeave', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arin43dam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });

    const uId2 = JSON.parse(id2.getBody() as any);

    const dmID = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId],
      },
      headers: {
        token: `${uId1.token}`
      },
    });

    const dm = JSON.parse(dmID.getBody() as any);

    const res = request('POST', `${url}:${port}/dm/leave/v2`, {
      json: {
        dmId: dm.dmId,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(res.statusCode).toBe(OK);
  });

  test('unsuccessful dm leave', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arin43dam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });

    const uId2 = JSON.parse(id2.getBody() as any);

    const dmID = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId],
      },
      headers: {
        token: `${uId1.token}`
      },
    });

    JSON.parse(dmID.getBody() as any);

    const res = request('POST', `${url}:${port}/dm/leave/v2`, {
      json: {
        dmId: 'invaliddmid',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('dm/messages/v1', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });

  test('successful dmmessages', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arin43dam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });

    const uId2 = JSON.parse(id2.getBody() as any);

    const dmID = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId],
      },
      headers: {
        token: `${uId1.token}`
      },
    });

    const dm = JSON.parse(dmID.getBody() as any);

    const res = request('GET', `${url}:${port}/dm/messages/v2`, {
      qs: {
        dmId: dm.dmId,
        start: 0,
      },
      headers: {
        token: `${uId1.token}`
      },
    });
    expect(res.statusCode).toBe(OK);
    const dmres = JSON.parse(res.getBody() as any);
    expect(dmres).toEqual({ messages: [], start: 0, end: -1 });
  });

  test('unsuccessful dm messages', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);
    const res = request('GET', `${url}:${port}/dm/messages/v2`, {
      qs: {
        dmId: 324324234,
        start: 0,
      },
      headers: {
        token: `${uId1.token}`
      },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('Http tests for dmRemoveV1', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });

  test('Testing successful dmRemove', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'jack@unsw.edu.au',
        password: '234562',
        nameFirst: 'Jack',
        nameLast: 'James',
      },
    });

    const uId2 = JSON.parse(id2.getBody() as any);

    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@unsw.edu.au',
        password: '2344562',
        nameFirst: 'James',
        nameLast: 'Jones',
      },
    });

    const uId3 = JSON.parse(id3.getBody() as any);

    const dmID = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId, uId3.authUserId],
      },
      headers: {
        token: `${uId1.token}`
      },
    });

    const dm1 = JSON.parse(dmID.getBody() as any);

    const res = request('DELETE', `${url}:${port}/dm/remove/v2`, {
      qs: {
        dmId: dm1.dmId,
      },
      headers: {
        token: `${uId1.token}`
      },
    });
    expect(res.statusCode).toBe(OK);
    const data = JSON.parse(res.getBody() as any);

    expect(data).toEqual({});
  });

  test('testing an unsuccessful dmRemove attempt', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arin43dam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });

    const uId2 = JSON.parse(id2.getBody() as any);

    const dmID = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId],
      },
      headers: {
        token: `${uId1.token}`
      },
    });

    const dm1 = JSON.parse(dmID.getBody() as any);

    const res = request('DELETE', `${url}:${port}/dm/remove/v2`, {
      qs: {
        dmId: dm1.dmId,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(res.statusCode).toBe(403);
  });
});

describe('dmsList', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful dmsList', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam444@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);
    const dm1 = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId],
      },
      headers: {
        token: `${uId1.token}`
      },
    });

    JSON.parse(dm1.getBody() as any);

    const list = request('GET', `${url}:${port}/dm/list/v2`, {
      qs: {
      },
      headers: {
        token: `${uId2.token}`
      },
    });

    expect(list.statusCode).toBe(OK);

    const res = JSON.parse(list.getBody() as any);

    expect(res).toEqual({
      dms: [{
        dmId: 1,
        name: 'arindammukherjee, arindammukherjee0',
      }]
    });
  });

  test('unsuccessful dmsList', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam444@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);
    const dm1 = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId],
      },
      headers: {
        token: `${uId1.token}`
      },
    });

    JSON.parse(dm1.getBody() as any);

    const list = request('GET', `${url}:${port}/dm/list/v2`, {
      qs: {
      },
      headers: {
        token: 'errortoken'
      },
    });

    expect(list.statusCode).toBe(403);
  });
});

describe('dmsDetails', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful dmsDetails', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam444@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);
    const dmID = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId2.authUserId],
      },
      headers: {
        token: `${uId1.token}`
      },
    });
    const dm = JSON.parse(dmID.getBody() as any);
    const details = request('GET', `${url}:${port}/dm/details/v2`, {
      qs: {
        dmId: dm.dmId,
      },
      headers: {
        token: `${uId1.token}`
      },
    });

    expect(details.statusCode).toBe(OK);
    const res = JSON.parse(details.getBody() as any);
    expect(res).toEqual({
      name: 'arindammukherjee, arindammukherjee0',
      members:
          [{
            email: 'Arindam444@unsw.edu.au',
            handleStr: 'arindammukherjee0',
            nameFirst: 'Arindam',
            nameLast: 'Mukherjee',
            uId: 2,
          },
          {
            email: 'Arindam@unsw.edu.au',
            handleStr: 'arindammukherjee',
            nameFirst: 'Arindam',
            nameLast: 'Mukherjee',
            uId: 1,
          }]
    });
  });
});
