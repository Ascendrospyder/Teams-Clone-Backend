import {
  authRegisterV1,
  authPasswordRequest,
  authLoginV1,
  authPasswordReset,
} from './auth';
import { channelsListallV1 } from './channels';
import { clearV1 } from './other';
import HTTPError from 'http-errors';
import { getResetCode } from './helper';
import { authLogoutV1 } from './authLogoutV1';
describe('password request', () => {
  beforeEach(() => {
    clearV1();
  });
  test('successful password request', () => {
    const user = authRegisterV1(
      'thecomp1531email@gmail.com',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const request = authPasswordRequest('thecomp1531email@gmail.com');
    expect(request).toEqual({});
    try {
      channelsListallV1(user.token);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
    try {
      authLogoutV1('heello');
    } catch (e) {

    }
    try {
      authLoginV1('thecomp1531email@gmail.com', 'hello bruh');
    } catch (e) {

    }
    try {
      authLoginV1('thecomp13232531email@gmail.com', 'hello bruh');
    } catch (e) {

    }
  });

  test('unsuccessful password request', () => {
    authRegisterV1(
      'thecomp151email@gmail.com',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const request = authPasswordRequest('thecomp1531email@gmail.com');
    expect(request).toEqual({});
  });
});

describe('password reset', () => {
  beforeEach(() => {
    clearV1();
  });
  test('unsuccessful password reset (invalid code)', () => {
    try {
      authPasswordReset('hello', '123456');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid reset code'));
    }
  });

  test('unsuccessful password reset (invalid password)', () => {
    const user = authRegisterV1(
      'thecomp1531email@gmail.com',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      authPasswordReset(getResetCode(user.token), '12345');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid password'));
    }
    try {
      authRegisterV1('thecomp1531email@gmail.com',
        '234562',
        'Arindam',
        'Mukherjee');
    } catch (e) {
    }
    try {
      authRegisterV1('bruh',
        '234562',
        'Arindam',
        'Mukherjee');
    } catch (e) {
    }
    try {
      authRegisterV1('thecomp13232531email@gmail.com',
        '',
        'Arindam',
        'Mukherjee');
    } catch (e) {
    }
    try {
      authRegisterV1('thecomp15343431email@gmail.com',
        '234562',
        '',
        'Mukherjee');
    } catch (e) {
    }
    try {
      authRegisterV1('theco21321321mp1531email@gmail.com',
        '234562',
        'Arindam',
        '');
    } catch (e) {
    }
  });
});
