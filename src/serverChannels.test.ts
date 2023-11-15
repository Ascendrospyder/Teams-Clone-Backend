import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;
const OK = 200;

describe('channelListV1', () => {
  test('printing out one public channel that the user is part of', () => {
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

    // create channel
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    // create channel array from existing channels

    const req1 = request('GET', `${url}:${port}/channels/list/v3`, {
      headers: { token: uId2.token },
    });
    const data3 = JSON.parse(channelId1create.getBody() as any);
    const channelarray = [{ channelId: data3.channelId, name: 'testchannel1' }];
    const data2 = JSON.parse(req1.getBody() as any);
    expect(req1.statusCode).toBe(OK);
    expect(data2).toStrictEqual({
      channels: channelarray,
    });
  });
});

describe('channelListallV1', () => {
  test('printing out an array for all channels (member for 2 of 3 private channels)', () => {
  // create user
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const uId1reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId1 = JSON.parse(uId1reg.getBody() as any);

    // create second user
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arin3321dam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);

    // create channel
    const channel1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: false,
      },
      headers: {
        token: uId1.token,
      }
    });

    // create 2nd channel
    const channel2 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: false,
      },
      headers: {
        token: uId1.token,
      }
    });

    // create 3rd channel
    const channel3 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: false,
      },
      headers: {
        token: uId2.token,
      }
    });
    const data1 = JSON.parse(channel1.getBody() as any);
    const data2 = JSON.parse(channel2.getBody() as any);
    const data3 = JSON.parse(channel3.getBody() as any);
    // create channel array from existing channels
    const channelarray = [{ channelId: data1.channelId, name: 'testchannel1' }, { channelId: data2.channelId, name: 'testchannel1' }, { channelId: data3.channelId, name: 'testchannel1' }];
    const req1 = request('GET', `${url}:${port}/channels/listall/v3`, {
      headers: { token: uId1.token },
    });
    expect(req1.statusCode).toBe(OK);
    const data = JSON.parse(req1.getBody() as any);
    expect(data).toStrictEqual({
      channels: channelarray,
    });
  });
});
