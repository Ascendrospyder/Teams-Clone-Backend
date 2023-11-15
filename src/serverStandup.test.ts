import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;
const OK = 200;

describe('standupstart', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful standupstart', () => {
    const uIdreg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId = JSON.parse(uIdreg.getBody() as any);
    const channel = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'name',
        isPublic: true,
      },
      headers: {
        token: uId.token,
      }
    });
    const channelId = JSON.parse(channel.getBody() as any);
    const standup = request('POST', `${url}:${port}/standup/start/v1`, {
      json: {
        channelId: channelId.channelId,
        length: 10,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    expect(standup.statusCode).toBe(OK);
  });

  test('unsuccessful standupstart', () => {
    const uIdreg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId = JSON.parse(uIdreg.getBody() as any);
    const channel = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        token: uId.token,
        name: 'name',
        isPublic: true,
      },
      headers: {
        token: uId.token,
      }
    });
    const channelId = JSON.parse(channel.getBody() as any);
    const standup = request('POST', `${url}:${port}/standup/start/v1`, {
      json: {
        channelId: channelId.channelId,
        length: -1,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    expect(standup.statusCode).toBe(400);
  });
});

describe('standup active', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful standup active', () => {
    const uIdreg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId = JSON.parse(uIdreg.getBody() as any);
    const channel = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'name',
        isPublic: true,
      },
      headers: {
        token: uId.token,
      }
    });
    const channelId = JSON.parse(channel.getBody() as any);
    request('POST', `${url}:${port}/standup/start/v1`, {
      json: {
        channelId: channelId.channelId,
        length: 10,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    const standactive = request('GET', `${url}:${port}/standup/active/v1`, {
      qs: {
        channelId: channelId.channelId,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    expect(standactive.statusCode).toBe(OK);
  });

  test('successful standup active', () => {
    const uIdreg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId = JSON.parse(uIdreg.getBody() as any);
    const channel = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'name',
        isPublic: true,
      },
      headers: {
        token: uId.token,
      }
    });
    const channelId = JSON.parse(channel.getBody() as any);
    request('POST', `${url}:${port}/standup/start/v1`, {
      json: {
        channelId: channelId.channelId,
        length: 10,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    const standactive = request('GET', `${url}:${port}/standup/active/v1`, {
      qs: {
        channelId: 423432,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    expect(standactive.statusCode).toBe(400);
  });
});

describe('standup send', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful standup send', () => {
    const uIdreg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId = JSON.parse(uIdreg.getBody() as any);
    const channel = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'name',
        isPublic: true,
      },
      headers: {
        token: uId.token,
      }
    });
    const channelId = JSON.parse(channel.getBody() as any);
    request('POST', `${url}:${port}/standup/start/v1`, {
      json: {
        channelId: channelId.channelId,
        length: 10,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    const res = request('POST', `${url}:${port}/standup/send/v1`, {
      json: {
        channelId: channelId.channelId,
        message: 10,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    expect(res.statusCode).toBe(OK);
  });

  test('successful standup send', () => {
    const uIdreg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId = JSON.parse(uIdreg.getBody() as any);
    const channel = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'name',
        isPublic: true,
      },
      headers: {
        token: uId.token,
      }
    });
    const channelId = JSON.parse(channel.getBody() as any);
    request('POST', `${url}:${port}/standup/start/v1`, {
      json: {
        channelId: channelId.channelId,
        length: 0,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    const res = request('POST', `${url}:${port}/standup/send/v1`, {
      json: {
        channelId: 3281903,
        message: 10,
      },
      headers: {
        token: `${uId.token}`,
      },
    });
    expect(res.statusCode).toBe(400);
  });
});
