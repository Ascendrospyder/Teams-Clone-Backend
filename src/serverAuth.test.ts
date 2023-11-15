import request from 'sync-request';
import config from './config.json';
import { getResetCode } from './helper';

const port = config.port;
const url = config.url;
const OK = 200;

describe('authLoginV1', () => {
  // the user will first register and then will log in with different conditions.
  test('successful register', () => {
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
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({
      token: data.token,
      authUserId: 1,
      hashedToken: data.hashedToken,
    });
  });
  test('If the entered password is of the incorrect length', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '34562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    expect(res.statusCode).toBe(400);
  });
  test('If the entered first name is invalid with less than 1 character', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: '',
        nameLast: 'Mukherjee',
      },
    });
    expect(res.statusCode).toBe(400);
  });
  test('If the entered first name is invalid with more than 50 character', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'servicepartnersmedicalpractitionerslegalrequirementsfordoctorsthiswasarandomgooglesearch',
        nameLast: 'Mukherjee',
      },
    });
    expect(res.statusCode).toBe(400);
  });
  test('If the entered last name is invalid with less than one character', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: '',
      },
    });
    expect(res.statusCode).toBe(400);
  });
  test('If the entered last name is invalid with less than one character', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'servicepartnersmedicalpractitionerslegalrequirementsfordoctorsthiswasarandomgooglesearch',
      },
    });
    expect(res.statusCode).toBe(400);
  });
  test('If the entered email is invalid', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'thisisnotanemail',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'servicepartnersmedicalpractitionerslegalrequirementsfordoctorsthiswasarandomgooglesearch',
      },
    });
    expect(res.statusCode).toBe(400);
  });
});
describe('authLoginV1', () => {
  test('successful login', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const res = request('POST', `${url}:${port}/auth/login/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
      },
    });
    expect(res.statusCode).toBe(OK);
    const data = JSON.parse(res.getBody() as any);

    expect(data).toStrictEqual({
      token: data.token,
      authUserId: 1,
      hashedToken: data.hashedToken,
    });
  });
  test('unsuccessful login', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const res = request('POST', `${url}:${port}/auth/login/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '23456274823043728',
      },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('authLogoutv1', () => {
  // the user will first register and then will log in with different conditions.
  test('successful logout', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const user = JSON.parse(reg.getBody() as any);
    const res = request('POST', `${url}:${port}/auth/logout/v2`, {
      headers: {
        token: user.token,
      },
    });
    const data = JSON.parse(res.getBody() as any);
    expect(res.statusCode).toBe(OK);
    expect(data).toStrictEqual({});
  });
  test('unsuccessful logout', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const res = request('POST', `${url}:${port}/auth/logout/v2`, {
      headers: {
        token: 'failure!',
      },
    });
    expect(res.statusCode).toBe(403);
  });
});

describe('auth passwordrest', () => {
  // the user will first register and then will log in with different conditions.
  it('successful password request', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'thecomp1531email@gmail.com',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const res1 = request(
      'POST', `${url}:${port}/auth/passwordreset/request/v1`, { json: { email: 'thecomp1531email@gmail.com' } }
    );
    expect(res1.statusCode).toEqual(OK);
  });
});

describe('auth passwordreset', () => {
  // the user will first register and then will log in with different conditions.
  test('successful password reset', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'thecomp1531email@gmail.com',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });

    request('POST', `${url}:${port}/auth/passwordreset/request/v1`, {
      json: {
        email: 'thecomp1531email@gmail.com',
      },
    });
    const data = JSON.parse(res.getBody() as any);
    const res2 = request('POST', `${url}:${port}/auth/passwordreset/reset/v1`, {
      json: {
        resetCode: getResetCode(data.token),
        newPassword: '12345',
      },
    });
    expect(res2.statusCode).toEqual(400);
  });

  test('unsuccessful password request', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res1 = request('POST', `${url}:${port}/auth/passwordreset/reset/v1`, {
      json: {
        resetCode: 'bruh',
        newPassword: '123456',
      },
    });
    expect(res1.statusCode).toEqual(400);
  });
});
