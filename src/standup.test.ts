import { authRegisterV1 } from './auth';
import { channelJoinV1, channelMessagesV1 } from './channel';
import { channelsCreateV1 } from './channels';
import { standupStart, standupActive, standupSend } from './standup';
import { clearV1 } from './other';
import HTTPError from 'http-errors';
import { messageEdit, messageRemove, messageSend, messageSendLater, messageSendLaterDm } from './message';

describe('standup start', () => {
  beforeEach(() => {
    clearV1();
  });

  test('successful standup start', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    channelJoinV1(user2.token, channelid.channelId);
    const start = standupStart(user.token, channelid.channelId, 10);
    expect(start.timeFinish).toBeGreaterThan(~~(Date.now() / 1000));
  });

  test('unsuccessful standup start (invalid channelid)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      standupStart(user.token, 472384328, 10);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid channelId'));
    }
  });

  test('unsuccessful standup start (invalid token)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    try {
      standupStart('dwaundiwa', channelid.channelId, 10);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid uId'));
    }
  });
  test('unsuccessful standup start (length is negative)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    try {
      standupStart(user.token, channelid.channelId, -10);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid length'));
    }
  });

  test('unsuccessful standup start (standup already in progress)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    standupStart(user.token, channelid.channelId, 10);
    try {
      standupStart(user.token, channelid.channelId, 10);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: standup already in progress'));
    }
  });

  test('unsuccessful standup start (user is not part of the channel)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    try {
      standupStart(user2.token, channelid.channelId, 10);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of the channel'));
    }
  });
});

describe('standup active', () => {
  beforeEach(() => {
    clearV1();
  });

  test('successful standup active', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    const start = standupStart(user.token, channelid.channelId, 10);
    const active = standupActive(user.token, channelid.channelId);
    expect(active).toEqual({ isActive: true, timeFinish: start.timeFinish });
  });

  test('successful standup active', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    standupStart(user.token, channelid.channelId, 1);
    const starttime = Date.now();
    let now = starttime;
    while ((now - starttime) < 2000) {
      now = Date.now();
    }
    const active = standupActive(user.token, channelid.channelId);
    expect(active).toEqual({ isActive: false, timeFinish: null });
  });

  test('successful standup active (no active standup)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    const active = standupActive(user.token, channelid.channelId);
    expect(active).toEqual({ isActive: false, timeFinish: null });
  });

  test('unsucessful standup active (invalid token)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    standupStart(user.token, channelid.channelId, 10);
    try {
      standupActive('dwanydu8wa2', channelid.channelId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
  });

  test('unsucessful standup active (invalid channelId)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    standupStart(user.token, channelid.channelId, 10);
    try {
      standupActive(user.token, 231321);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid channelId'));
    }
  });

  test('unsucessful standup active (user is not part of the channel)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari321312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    standupStart(user.token, channelid.channelId, 10);
    try {
      standupActive(user2.token, channelid.channelId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of the channel'));
    }
  });
});

describe('standup start', () => {
  beforeEach(() => {
    clearV1();
  });

  test('successful standup send', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    messageSend(user.token, channelid.channelId, 'hello');
    try {
      messageSend('user.token', channelid.channelId, 'hello');
    } catch (e) {
    }
    try {
      messageRemove('user.token', 1);
    } catch (e) {
    }
    try {
      messageEdit('user.token', 1, 'lol');
    } catch (e) {
    }
    try {
      messageSendLater(user.token, channelid.channelId, 'lol', 5000000);
    } catch (e) {
    }
    try {
      messageSendLaterDm(user.token, 483294090, 'lol', 5000000);
    } catch (e) {
    }
    channelJoinV1(user2.token, channelid.channelId);
    standupStart(user.token, channelid.channelId, 2);
    const send = standupSend(user.token, channelid.channelId, 'hi');
    expect(send).toEqual({});
    standupSend(user2.token, channelid.channelId, 'hello');
    const starttime = Date.now();
    let now = starttime;
    while ((now - starttime) < 3000) {
      now = Date.now();
    }
    standupActive(user.token, channelid.channelId);
    const message = channelMessagesV1(user.token, channelid.channelId, 0);
    const messagelist = message.messages[0].message;
    expect(messagelist).toEqual('arindammukherjee: hi\narindammukherjee0: hello');
  });

  test('unsuccessful standup send (no token)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    channelJoinV1(user2.token, channelid.channelId);
    standupStart(user.token, channelid.channelId, 2);
    try {
      standupSend('user.token', channelid.channelId, 'hi');
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
  });

  test('unsuccessful standup send (no channel)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    channelJoinV1(user2.token, channelid.channelId);
    standupStart(user.token, channelid.channelId, 2);
    try {
      standupSend(user.token, 37283912, 'hi');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid channelId'));
    }
  });

  test('unsuccessful standup send (no channel)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    channelJoinV1(user2.token, channelid.channelId);
    try {
      standupSend(user.token, channelid.channelId, 'hi');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: standup not active'));
    }
  });

  test('unsuccessful standup send (user not part of the channel)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    standupStart(user.token, channelid.channelId, 2);
    try {
      standupSend(user2.token, channelid.channelId, 'hi');
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of the channel'));
    }
  });

  test('unsuccessful standup send (1000 length character)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelid = channelsCreateV1(user.token, 'name', true);
    standupStart(user.token, channelid.channelId, 2);
    const messagesend = 'a'.repeat(1001);
    try {
      standupSend(user.token, channelid.channelId, messagesend);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message'));
    }
  });
});
