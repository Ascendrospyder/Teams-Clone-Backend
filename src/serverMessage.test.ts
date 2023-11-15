import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;

const OK = 200;

describe('messagesend', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful message sent', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(message.getBody() as any);
    expect(message.statusCode).toBe(OK);
    expect(res.messageId).toEqual(1);
  });

  test('channelId is invalid', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: 654896,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(message.statusCode).toBe(400);
    // expect(res).toEqual({ error: 'error' });
  });
});

describe('messageremove', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful message removed', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const messageres = JSON.parse(message.getBody() as any);
    const messagemove = request('DELETE', `${url}:${port}/message/remove/v2`, {
      qs: {
        messageId: messageres.messageId,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(messagemove.getBody() as any);
    expect(messagemove.statusCode).toBe(OK);
    expect(res).toEqual({});
  });

  test('messageId is invalid', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);

    const message = request('DELETE', `${url}:${port}/message/remove/v2`, {
      qs: {
        messageId: 654896,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(message.statusCode).toEqual(400);
  });

  describe('messagesend', () => {
    beforeEach(() => {
      request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    });
    test('successful message removed', () => {
      const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
        json: {
          email: 'Arindam@unsw.edu.au',
          password: '234562',
          nameFirst: 'Arindam',
          nameLast: 'Mukherjee',
        },
      });
      const uId2 = JSON.parse(uId2reg.getBody() as any);
      const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
        json: {
          name: 'testchannel1',
          isPublic: true,
        },
        headers: {
          token: uId2.token,
        }
      });
      const channelId1 = JSON.parse(channelId1create.getBody() as any);
      const message = request('POST', `${url}:${port}/message/send/v2`, {
        json: {
          channelId: channelId1.channelId,
          message: 'hello',
        },
        headers: {
          token: `${uId2.token}`
        },
      });
      const messageres = JSON.parse(message.getBody() as any);
      const messagemove = request('DELETE', `${url}:${port}/message/remove/v2`, {
        qs: {
          messageId: messageres.messageId,
        },
        headers: {
          token: `${uId2.token}`
        },
      });
      const res = JSON.parse(messagemove.getBody() as any);
      expect(messagemove.statusCode).toBe(OK);
      expect(res).toEqual({});
    });

    test('messageId is invalid', () => {
      const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
        json: {
          email: 'Arindam@unsw.edu.au',
          password: '234562',
          nameFirst: 'Arindam',
          nameLast: 'Mukherjee',
        },
      });
      const uId2 = JSON.parse(uId2reg.getBody() as any);

      const message = request('DELETE', `${url}:${port}/message/remove/v2`, {
        qs: {
          messageId: 654896,
        },
        headers: {
          token: `${uId2.token}`
        },
      });
      expect(message.statusCode).toBe(400);
    });
  });
});

describe('messageEdit', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful message edit', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const messageres = JSON.parse(message.getBody() as any);
    const messageedit = request('PUT', `${url}:${port}/message/edit/v2`, {
      json: {
        messageId: messageres.messageId,
        message: 'lol'
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(messageedit.getBody() as any);
    expect(messageedit.statusCode).toBe(OK);
    expect(res).toEqual({});
  });

  test('messageId is invalid', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);

    const message = request('PUT', `${url}:${port}/message/edit/v2`, {
      json: {
        messageId: 654896,
        message: 'oops'
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(message.statusCode).toBe(400);
  });
});

describe('sendDm', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful dm message sent', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const uIdreg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arin322dam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId = JSON.parse(uIdreg.getBody() as any);
    const dmcreate = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [uId.authUserId]
      },
      headers: {
        token: `${uId2.token}`
      }
    });
    const dm = JSON.parse(dmcreate.getBody() as any);
    const dmsend = request('POST', `${url}:${port}/message/senddm/v2`, {
      json: {
        dmId: dm.dmId,
        message: 'lol'
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(dmsend.getBody() as any);
    expect(dmsend.statusCode).toBe(OK);
    expect(res).toEqual({ messageId: 1 });
  });
  test('successful dm message sent', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const dmsend = request('POST', `${url}:${port}/message/senddm/v2`, {
      json: {
        dmId: 321321321,
        message: 'lol'
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(dmsend.statusCode).toBe(400);
  });
});

describe('messageReactV1', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });

  test('successful message react', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const messagesent = JSON.parse(message.getBody() as any);
    const react = request('POST', `${url}:${port}/message/react/v1`, {
      json: {
        messageId: messagesent.messageId,
        reactId: 1,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(react.getBody() as any);
    expect(react.statusCode).toBe(OK);
    expect(res).toMatchObject({});
  });

  test('unsuccessful message react', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const messagesent = JSON.parse(message.getBody() as any);
    const react = request('POST', `${url}:${port}/message/react/v1`, {
      json: {
        messageId: messagesent.messageId,
        reactId: 9999,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(react.statusCode).toBe(400);
  });
});

describe('messageUnreactV1', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });

  test('successful messageUnreact', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const messagesent = JSON.parse(message.getBody() as any);
    request('POST', `${url}:${port}/message/react/v1`, {
      json: {
        messageId: messagesent.messageId,
        reactId: 1,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const unreact = request('POST', `${url}:${port}/message/unreact/v1`, {
      json: {
        messageId: messagesent.messageId,
        reactId: 1,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(unreact.getBody() as any);
    expect(unreact.statusCode).toBe(OK);
    expect(res).toMatchObject({});
  });

  test('messageUnreactV1', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const messagesent = JSON.parse(message.getBody() as any);
    request('POST', `${url}:${port}/message/react/v1`, {
      json: {
        messageId: messagesent.messageId,
        reactId: 1,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const unreact = request('POST', `${url}:${port}/message/react/v1`, {
      json: {
        messageId: messagesent.messageId,
        reactId: 9999,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(unreact.statusCode).toBe(400);
  });
});

/// /////////////////////////messagepin//////////////////////
describe('messagePinV1', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });

  test('testing valid messagePin', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const messagesent = JSON.parse(message.getBody() as any);
    const pin = request('POST', `${url}:${port}/message/pin/v1`, {
      json: {
        messageId: messagesent.messageId,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(pin.getBody() as any);
    expect(pin.statusCode).toBe(OK);
    expect(res).toMatchObject({});
  });

  test('testing invalid messagePin', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    JSON.parse(message.getBody() as any);
    const pin = request('POST', `${url}:${port}/message/pin/v1`, {
      json: {
        messageId: 9919292929,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(pin.statusCode).toBe(400);
  });
});

/// //////////////////////////messageunpin////////////////////////
describe('messageUnpinV1', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });

  test('testing valid messageUnpin', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const messagesent = JSON.parse(message.getBody() as any);
    request('POST', `${url}:${port}/message/pin/v1`, {
      json: {
        messageId: messagesent.messageId,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const unpin = request('POST', `${url}:${port}/message/unpin/v1`, {
      json: {
        messageId: messagesent.messageId,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(unpin.getBody() as any);
    expect(unpin.statusCode).toBe(OK);
    expect(res).toMatchObject({});
  });

  test('testing invalid messagePin', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const messagesent = JSON.parse(message.getBody() as any);
    request('POST', `${url}:${port}/message/pin/v1`, {
      json: {
        messageId: messagesent.messageId,
      },
      headers: {
        token: `${uId2.token}`
      },
    });

    const unpin = request('POST', `${url}:${port}/message/unpin/v1`, {
      json: {
        messageId: 99999999,
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(unpin.statusCode).toBe(400);
  });
});

describe('messagesendlater', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful message send later', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/sendlater/v1`, {
      json: {
        channelId: channelId1.channelId,
        message: 'hello',
        timeSent: ~~(Date.now() / 1000) + 2
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(message.getBody() as any);
    expect(message.statusCode).toBe(OK);
    expect(res.messageId).toEqual(1);
  });

  test('successful message send later', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'testchannel1',
        isPublic: true,
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/sendlater/v1`, {
      json: {
        channelId: channelId1.channelId,
        message: '',
        timeSent: ~~(Date.now() / 1000) + 2
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(message.statusCode).toBe(400);
  });
});

describe('messagesendlaterdm', () => {
  beforeEach(() => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
  });
  test('successful message send later dm', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [],
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/sendlaterdm/v1`, {
      json: {
        dmId: channelId1.dmId,
        message: 'hello',
        timeSent: ~~(Date.now() / 1000) + 2
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    const res = JSON.parse(message.getBody() as any);
    expect(message.statusCode).toBe(OK);
    expect(res.messageId).toEqual(1);
  });

  test('successful message send later dm', () => {
    const uId2reg = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'Arindam@unsw.edu.au',
        password: '234562',
        nameFirst: 'Arindam',
        nameLast: 'Mukherjee',
      },
    });
    const uId2 = JSON.parse(uId2reg.getBody() as any);
    const channelId1create = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [],
      },
      headers: {
        token: uId2.token,
      }
    });
    const channelId1 = JSON.parse(channelId1create.getBody() as any);
    const message = request('POST', `${url}:${port}/message/sendlaterdm/v1`, {
      json: {
        dmId: channelId1.dmId,
        message: '',
        timeSent: ~~(Date.now() / 1000) + 2
      },
      headers: {
        token: `${uId2.token}`
      },
    });
    expect(message.statusCode).toBe(400);
  });
});
