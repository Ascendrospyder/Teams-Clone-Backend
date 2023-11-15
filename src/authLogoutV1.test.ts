import { numberOfTokens } from './helper';
import { authRegisterV1, authLoginV1 } from './auth';
import { clearV1 } from './other';
import { authLogoutV1 } from './authLogoutV1';

describe('Testing the authLogoutV1 function', () => {
  test('Check authLogoutV1 output when the token is valid', () => {
    clearV1();
    const id1 = authRegisterV1('james@gmail.com', 'fBrT45Pq9', 'James', 'Peters');
    expect(authLogoutV1(id1.token)).toEqual({});
  });
  test('Check authLogoutV1 output when 1 token from multiple tokens is removed', () => {
    clearV1();
    authRegisterV1('JennyPatrick@gmail.com', 'noOneIsGoing2GuessThis', 'Jenny', 'Patrick');
    authLoginV1('JennyPatrick@gmail.com', 'noOneIsGoing2GuessThis');
    const id3 = authLoginV1('JennyPatrick@gmail.com', 'noOneIsGoing2GuessThis');
    expect(authLogoutV1(id3.token)).toEqual({});
    expect(numberOfTokens(id3.authUserId)).toEqual(2);
  });
  test('Check authLogoutV1 when a users only token is removed', () => {
    clearV1();
    const id4 = authRegisterV1('JennyPatrick@gmail.com', 'noOneIsGoing2GuessThis', 'Jenny', 'Patrick');
    expect(authLogoutV1(id4.token)).toEqual({});
    expect(numberOfTokens(id4.authUserId)).toEqual(0);
  });
});
