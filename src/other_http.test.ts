import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;

const OK = 200;

describe('HTTP Tests for ClearV1 function', () => {
  test('Testing successful clearing of user array', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'JennyPatrick@gmail.com',
        password: 'noOneIsGoing2GuessThis',
        nameFirst: 'Jenny',
        nameLast: 'Patrick',
      },
    });
    const res = request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const result = JSON.parse(res.getBody() as any);
    expect(res.statusCode).toBe(OK);
    expect(result).toEqual({});
  });
  test('Testing clearing of channels array (and consequently the whole of dataStore) ', () => {
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
    request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Quick Rich Schemes!',
        isPublic: 0
      },
      headers: {
        token: user1.token,
      }
    });
    const res = request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const result = JSON.parse(res.getBody() as any);
    expect(res.statusCode).toBe(OK);
    expect(result).toEqual({});
  });
});
