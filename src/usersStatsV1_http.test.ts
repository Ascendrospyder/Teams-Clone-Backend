import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;

describe('HTTP Testing: Testing usersStatsV1 route', () => {
  test('Testing Calling Route', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const res = request('GET', `${url}:${port}/users/stats/v1`, { qs: {} });
    expect(res.statusCode).toBe(200);
  });
});
