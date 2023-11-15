import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;
const OK = 200;

describe('http tests for admin/user/remove/v1', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });

  test('Testing successful admin/user/remove/v1', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'baby@unsw.edu.au',
        password: '234562',
        nameFirst: 'bear',
        nameLast: 'rawrawr',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);

    const res = request('DELETE', `${url}:${port}/admin/user/remove/v1`, {
      qs: {
        uId: uId2.authUserId,
      },
      headers: {
        token: `${uId1.token}`
      },
    });
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(res.getBody() as any);
    expect(result).toEqual({});
  });

  test('Testing unsuccessful admin/user/remove/v1 for not valid user', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const res = request('DELETE', `${url}:${port}/admin/user/remove/v1`, {
      qs: {
        uId: 5,
      },
      headers: {
        token: `${uId1.token}`
      },
    });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('Testing unsuccessful admin/user/remove/v1 for not valid token', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'baby@unsw.edu.au',
        password: '234562',
        nameFirst: 'bear',
        nameLast: 'rawrawr',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);

    const res = request('DELETE', `${url}:${port}/admin/user/remove/v1`, {
      qs: {
        uId: uId2.authUserId,
      },
      headers: {
        token: '$invalidtoken',
      },
    });
    expect(res.statusCode).toStrictEqual(403);
  });

  test('Testing unsuccessful admin/user/remove/v1 for one global owner', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const res = request('DELETE', `${url}:${port}/admin/user/remove/v1`, {
      qs: {
        uId: uId1.authUserId,
      },
      headers: {
        token: `${uId1.token}`,
      },
    });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('Testing unsuccessful admin/user/remove/v1 for not a global owner', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'baby@unsw.edu.au',
        password: '234562',
        nameFirst: 'bear',
        nameLast: 'rawrawr',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);

    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'ghost@unsw.edu.au',
        password: '234562',
        nameFirst: 'boo',
        nameLast: 'scaryscary',
      },
    });
    const uId3 = JSON.parse(id3.getBody() as any);

    const res = request('DELETE', `${url}:${port}/admin/user/remove/v1`, {
      qs: {
        uId: uId3.authUserId,
      },
      headers: {
        token: `${uId2.token}`,
      },
    });
    expect(res.statusCode).toStrictEqual(403);
  });
});

describe('http tests for admin/userpermission/change/v1', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });

  test('Testing successful admin/userpermission/change/v1', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'baby@unsw.edu.au',
        password: '234562',
        nameFirst: 'bear',
        nameLast: 'rawrawr',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);

    const res = request('POST', `${url}:${port}/admin/userpermission/change/v1`, {
      json: {
        uId: uId2.authUserId,
        permissionId: 1,
      },
      headers: {
        token: `${uId1.token}`
      },
    });
    expect(res.statusCode).toBe(OK);
    const result = JSON.parse(res.getBody() as any);
    expect(result).toEqual({});
  });

  test('Testing unsuccessful admin/userpermission/change/v1 for invalid userId', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const res = request('POST', `${url}:${port}/admin/userpermission/change/v1`, {
      json: {
        uId: 2,
        permissionId: 1,
      },
      headers: {
        token: `${uId1.token}`
      },
    });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('Testing unsuccessful admin/userpermission/change/v1 for invalid token', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    JSON.parse(id1.getBody() as any);

    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    const uId2 = JSON.parse(id1.getBody() as any);

    const res = request('POST', `${url}:${port}/admin/userpermission/change/v1`, {
      json: {
        uId: uId2.authUserId,
        permissionId: 1,
      },
      headers: {
        token: '$invalidtoken',
      },
    });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('Testing unsuccessful admin/userpermission/change/v1 for invalid permissionId', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'baby@unsw.edu.au',
        password: '234562',
        nameFirst: 'bear',
        nameLast: 'rawrawr',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);

    const res = request('POST', `${url}:${port}/admin/userpermission/change/v1`, {
      json: {
        uId: uId2.authUserId,
        permissionId: -1,
      },
      headers: {
        token: `${uId1.token}`,
      },
    });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('Testing unsuccessful admin/userpermission/change/v1 for same permissionId', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    const uId1 = JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'baby@unsw.edu.au',
        password: '234562',
        nameFirst: 'bear',
        nameLast: 'rawrawr',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);

    const res = request('POST', `${url}:${port}/admin/userpermission/change/v1`, {
      json: {
        uId: uId2.authUserId,
        permissionId: 2,
      },
      headers: {
        token: `${uId1.token}`,
      },
    });
    expect(res.statusCode).toStrictEqual(400);
  });

  test('Testing unsuccessful admin/userpermission/change/v1 for unauthorised user', () => {
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'dragon@unsw.edu.au',
        password: '234562',
        nameFirst: 'firefire',
        nameLast: 'firefire',
      },
    });
    JSON.parse(id1.getBody() as any);

    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'baby@unsw.edu.au',
        password: '234562',
        nameFirst: 'bear',
        nameLast: 'rawrawr',
      },
    });
    const uId2 = JSON.parse(id2.getBody() as any);

    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'spider@unsw.edu.au',
        password: '234562',
        nameFirst: 'fang',
        nameLast: 'web',
      },
    });
    const uId3 = JSON.parse(id3.getBody() as any);

    const res = request('POST', `${url}:${port}/admin/userpermission/change/v1`, {
      json: {
        uId: uId2.authUserId,
        permissionId: 1,
      },
      headers: {
        token: `${uId3.token}`,
      },
    });
    expect(res.statusCode).toStrictEqual(403);
  });
});
