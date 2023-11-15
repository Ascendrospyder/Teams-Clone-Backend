import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { channelJoinV1, channelMessagesV1 } from './channel';
import { channelsCreateV1 } from './channels';
import {
  messageSend,
  messageRemove,
  messageEdit,
  messageReactV1,
  messageUnreactV1,
  messagePinV1,
  messageUnpinV1,
  messageSendLater,
  messageSendLaterDm,
} from './message';
import { dmCreate, sendDm, dmMessages } from './dm';
import HTTPError from 'http-errors';
import { getData } from './dataStore';

describe('messagesend', () => {
  beforeEach(() => {
    clearV1();
  });
  test('successful message sent', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    messageSend(user.token, channelId1.channelId, 'hello');
    const messagesent2 = messageSend(user.token, channelId1.channelId, 'hi');
    expect(messagesent2.messageId).toEqual(2);
    const messages = channelMessagesV1(user.token, channelId1.channelId, 0);
    messages.messages.forEach((object: any) => {
      delete object.timeSent;
    });
    expect(messages).toMatchObject({
      messages: [
        {
          messageId: 2,
          uId: user.authUserId,
          message: 'hi',
        },
        {
          messageId: 1,
          uId: user.authUserId,
          message: 'hello',
        },
      ],
      start: 0,
      end: -1,
    });
  });
  test('channelId is invalid', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    channelsCreateV1(user.token, 'testchannel', true);
    try {
      messageSend(user.token, 6548965049654, 'hello');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid channelId'));
    }
  });
  // sends a message that is 0 characters long and one that is 1001 characters long
  test('message is invalid length', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    try {
      messageSend(user.token, channelId1.channelId, '');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message length'));
    }
    const message = 'a'.repeat(1001);
    try {
      messageSend(user.token, channelId1.channelId, message);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message length'));
    }
  });

  test('user is not part of the channel', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari3232ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    try {
      messageSend(user2.token, channelId1.channelId, 'hello');
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of channel'));
    }
  });
});

describe('messageremove', () => {
  beforeEach(() => {
    clearV1();
  });
  test('successful message removed', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hello');
    messageSend(user.token, channelId1.channelId, 'hi');
    const messageremove = messageRemove(user.token, messagesent.messageId);

    expect(messageremove).toEqual({});
    const messages = channelMessagesV1(user.token, channelId1.channelId, 0);
    messages.messages.forEach((object: any) => {
      delete object.timeSent;
    });
    expect(messages).toMatchObject({
      messages: [
        {
          messageId: 2,
          uId: user.authUserId,
          message: 'hi',
        },
      ],
      start: 0,
      end: -1,
    });
  });

  test('successful dm message removed', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Arin321dam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dmId = dmCreate(user.token, [user2.authUserId]);
    const messagesent = sendDm(user.token, dmId.dmId, 'hello');
    sendDm(user.token, dmId.dmId, 'hi');
    const messageremove = messageRemove(user.token, messagesent.messageId);

    expect(messageremove).toEqual({});
  });
  test('messageId is invalid', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    messageSend(user.token, channelId1.channelId, 'hello');
    try {
      messageRemove(user.token, 473289482);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid messageId'));
    }
  });

  test('user tries to delete owners message', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Arin3232dam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    channelJoinV1(user2.token, channelId1.channelId);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hello');
    try {
      messageRemove(user2.token, messagesent.messageId);
    } catch (e) {
      expect(e).toEqual(
        HTTPError(403, '403: user does not have owner permissions')
      );
    }
  });

  test('owner deletes users message', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Arin3232dam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    channelJoinV1(user2.token, channelId1.channelId);
    const messagesent = messageSend(user2.token, channelId1.channelId, 'hello');
    const messageremove = messageRemove(user2.token, messagesent.messageId);
    expect(messageremove).toEqual({});
    const messages = channelMessagesV1(user.token, channelId1.channelId, 0);
    messages.messages.forEach((object: any) => {
      delete object.timeSent;
    });
    expect(messages).toMatchObject({
      messages: [],
      start: 0,
      end: -1,
    });
  });

  test('user is not part of the channel', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Arin3232dam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hello');
    try {
      messageRemove(user2.token, messagesent.messageId);
    } catch (e) {
      expect(e).toEqual(
        HTTPError(403, '403: user does not have owner permissions')
      );
    }
  });
});

describe('messageEdit', () => {
  beforeEach(() => {
    clearV1();
  });
  test('successful message edit', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    messageSend(user.token, channelId1.channelId, 'hello');
    const messagesent2 = messageSend(user.token, channelId1.channelId, 'hi');
    const messageedit = messageEdit(
      user.token,
      messagesent2.messageId,
      'changed lol'
    );
    expect(messageedit).toEqual({});
    const messages = channelMessagesV1(user.token, channelId1.channelId, 0);
    messages.messages.forEach((object: any) => {
      delete object.timeSent;
    });
    expect(messages).toMatchObject({
      messages: [
        {
          messageId: 2,
          uId: user.authUserId,
          message: 'changed lol',
        },
        {
          messageId: 1,
          uId: user.authUserId,
          message: 'hello',
        },
      ],
      start: 0,
      end: -1,
    });
  });
  test('channelId is invalid', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    channelsCreateV1(user.token, 'testchannel', true);
    try {
      messageSend(user.token, 6548965049654, 'hello');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid channelId'));
    }
  });
  // sends a message that is 0 characters long and one that is 1001 characters long
  test('message is invalid length', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hi');
    const message = 'a'.repeat(1001);
    try {
      messageEdit(user.token, messagesent.messageId, message);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message length'));
    }
  });

  test('messageId does not refer to valid message', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    messageSend(user.token, channelId1.channelId, 'hi');
    try {
      messageEdit(user.token, 43892321, 'hello');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid messageId'));
    }
  });

  test('user tries to edit owners message', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari3232ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    channelJoinV1(user2.token, channelId1.channelId);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hello');
    try {
      messageEdit(user2.token, messagesent.messageId, 'this should break');
    } catch (e) {
      expect(e).toEqual(
        HTTPError(403, '403: user does not have owner permissions')
      );
    }
  });

  test('owner edits users message', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari3232ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    channelJoinV1(user2.token, channelId1.channelId);
    const messagesent = messageSend(user2.token, channelId1.channelId, 'hello');
    const messageedit = messageEdit(user.token, messagesent.messageId, 'lol');
    expect(messageedit).toEqual({});
    const messages = channelMessagesV1(user.token, channelId1.channelId, 0);
    messages.messages.forEach((object: any) => {
      delete object.timeSent;
    });
    expect(messages).toMatchObject({
      messages: [
        {
          messageId: 1,
          uId: user2.authUserId,
          message: 'lol',
        },
      ],
      start: 0,
      end: -1,
    });
  });

  test('user enters empty message', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hello');
    const messageedit = messageEdit(user.token, messagesent.messageId, '');
    expect(messageedit).toEqual({});
    const messages = channelMessagesV1(user.token, channelId1.channelId, 0);
    messages.messages.forEach((object: any) => {
      delete object.timeSent;
    });
    expect(messages).toMatchObject({
      messages: [],
      start: 0,
      end: -1,
    });
  });
});

describe('dm send message', () => {
  beforeEach(() => {
    clearV1();
  });
  test('successful message sent', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ar321indam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm = dmCreate(user.token, [user2.authUserId]);
    const message = sendDm(user.token, dm.dmId, 'hello');
    const message2 = sendDm(user2.token, dm.dmId, 'hello');
    expect(message.messageId).toEqual(1);
    expect(message2.messageId).toEqual(2);
    const channel = channelsCreateV1(user.token, 'channel', true);
    const message3 = messageSend(user.token, channel.channelId, 'bruh');
    expect(message3.messageId).toEqual(3);
  });
  test('dm does not exist', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      sendDm(user.token, 37892132, 'fail');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid dmId'));
    }
  });
  test('invalid message length', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ar321indam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm = dmCreate(user.token, [user2.authUserId]);
    const messagesend = 'a'.repeat(1001);
    try {
      sendDm(user.token, dm.dmId, '');
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message length'));
    }
    try {
      sendDm(user2.token, dm.dmId, messagesend);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message length'));
    }
  });
  test('user is not part of the dm', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ar321indam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm = dmCreate(user.token, []);
    const message = sendDm(user.token, dm.dmId, 'hi');
    try {
      sendDm(user2.token, dm.dmId, 'hello');
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of the dm'));
    }
    expect(message.messageId).toEqual(1);
  });

  test('successful dm message edited', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Arin321dam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dmId = dmCreate(user.token, [user2.authUserId]);
    const messagesent = sendDm(user.token, dmId.dmId, 'hello');
    sendDm(user.token, dmId.dmId, 'hi');
    const messageedit = messageEdit(user.token, messagesent.messageId, 'wow');

    expect(messageedit).toEqual({});
  });
});

describe('messagereact', () => {
  beforeEach(() => {
    clearV1();
  });

  test('Testing a valid case of reacting to a message', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari3232ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    channelJoinV1(user2.token, channelId1.channelId);
    const messagesent = messageSend(user.token, channelId1.channelId, 'Hello');
    const messagereact = messageReactV1(user.token, messagesent.messageId, 1);
    expect(messagereact).toMatchObject({});
    const messages = channelMessagesV1(user.token, channelId1.channelId, 0);
    delete messages.messages[0].timeSent;
    expect(messages).toEqual({
      end: -1,
      messages: [
        {
          uId: 1,
          isPinned: false,
          message: 'Hello',
          messageId: 1,
          reacts: [
            {
              isThisUserReacted: true,
              reactId: 1,
              uIds: [1],
            },
          ],
        },
      ],
      start: 0
    });
    const messages2 = channelMessagesV1(user2.token, channelId1.channelId, 0);
    delete messages2.messages[0].timeSent;
    expect(messages2).toEqual({
      end: -1,
      messages: [
        {
          uId: 1,
          isPinned: false,
          message: 'Hello',
          messageId: 1,
          reacts: [
            {
              isThisUserReacted: false,
              reactId: 1,
              uIds: [1],
            },
          ],
        },
      ],
      start: 0
    });
  });

  test('reactId is not a valid react ID', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    try {
      messageReactV1(user.token, messagesent.messageId, 0);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Invalid reactId'));
    }
  });

  test('testing an invalid token', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    try {
      messageReactV1('shshshshs', messagesent.messageId, 1);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, 'Error! Invalid token'));
    }
  });

  test('the message already contains a react with ID reactId from the authorised user', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    messageReactV1(user.token, messagesent.messageId, 1);

    // another user creates a channel
    const channelId2 = channelsCreateV1(user.token, 'testchannel', true);
    messageSend(
      user.token,
      channelId2.channelId,
      'Hey, look I can also create channels, im such a cool kid!'
    );
    try {
      messageReactV1(user.token, messagesent.messageId, 1);
    } catch (e) {
      expect(e).toEqual(
        HTTPError(
          400,
          'Error! Same person cannot react to the same message twice!'
        )
      );
    }
  });

  test('messageId is not a valid message within a channel or DM that the authorised user has joined', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    messageSend(user.token, channelId1.channelId, 'hello');
    try {
      messageReactV1(user.token, 99999999, 1);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Invalid messageId'));
    }
  });
});

describe('messageUnreactV1', () => {
  beforeEach(() => {
    clearV1();
  });
  test('testing a valid case of unreacting', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');

    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'Hello');
    messageReactV1(user.token, messagesent.messageId, 1);
    expect(
      messageUnreactV1(user.token, messagesent.messageId, 1)
    ).toMatchObject({});
  });

  test('Testing an invalid token', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    messageReactV1(user.token, messagesent.messageId, 1);
    try {
      messageUnreactV1('heheheheh', messagesent.messageId, 1);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, 'Error! Invalid token'));
    }
  });

  test('testing an invalid reactId', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    messageReactV1(user.token, messagesent.messageId, 1);
    try {
      messageUnreactV1(user.token, messagesent.messageId, 99999);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Invalid reactId'));
    }
  });

  test('testing an invalid messageId', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hello');
    messageReactV1(user.token, messagesent.messageId, 1);
    try {
      messageUnreactV1(user.token, 99999999999, 1);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Invalid messageId'));
    }
  });

  test('the message does not contain a react with ID reactId from the authorised user', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    try {
      messageUnreactV1(user.token, messagesent.messageId, 1);
    } catch (e) {
      expect(e).toEqual(
        HTTPError(
          400,
          'Error! User cannot unreact a message that has not been reacted'
        )
      );
    }
  });
});

/// //////////////////////////////message pin/////////////////////////////////////////
describe('messagePinV1', () => {
  beforeEach(() => {
    clearV1();
  });

  test('valid pin', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');

    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'Hello');
    messagePinV1(user.token, messagesent.messageId);
    const data = getData();
    expect(data.messages[0].isPinned).toBe(true);
  });

  test('testing an invalid token', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    try {
      messagePinV1('shshshshs', messagesent.messageId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, 'Error! Invalid token'));
    }
  });

  test('testing an invalid messageId', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    messageSend(user.token, channelId1.channelId, 'hello');
    try {
      messagePinV1(user.token, 99999999999);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Invalid messageId'));
    }
  });

  test('testing pinning a message which has already been pinned  ', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hello');
    messagePinV1(user.token, messagesent.messageId);
    try {
      messagePinV1(user.token, messagesent.messageId);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Message is already pinned'));
    }
  });

  test('testing pinning message where user is not an owner', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari3232ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    try {
      messagePinV1(user2.token, messagesent.messageId);
    } catch (e) {
      expect(e).toEqual(
        HTTPError(
          403,
          'Error! You are not authorised to pin in this channel/dm'
        )
      );
    }
  });
});
/// /////////////////////////////////messageunpin//////////////////////////////
describe('messageUnpinV1', () => {
  beforeEach(() => {
    clearV1();
  });

  test('testing a valid case of unreacting', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');

    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'Hello');
    messagePinV1(user.token, messagesent.messageId);
    messageUnpinV1(user.token, messagesent.messageId);
    const data = getData();
    expect(data.messages[0].isPinned).toBe(false);
  });

  test('testing an invalid token', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1('Ari3232ndam@unsw.edu.au', '234562', 'Arindam', 'Mukherjee');
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    messagePinV1(user.token, messagesent.messageId);
    try {
      messageUnpinV1('thisisnotatoken', messagesent.messageId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, 'Error! Invalid token'));
    }
  });

  test('testing an invalid messageId', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hello');
    messagePinV1(user.token, messagesent.messageId);
    try {
      messageUnpinV1(user.token, 999999999);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Invalid messageId'));
    }
  });

  test('testing if we try to unpin a message that has not been pinned', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(user.token, channelId1.channelId, 'hello');
    try {
      messageUnpinV1(user.token, messagesent.messageId);
    } catch (e) {
      expect(e).toEqual(
        HTTPError(
          400,
          'Error! You are trying to unpin a message that was never pinned'
        )
      );
    }
  });

  test('testing unpinning message where user is not an owner', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user2 = authRegisterV1(
      'Ari3232ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesent = messageSend(
      user.token,
      channelId1.channelId,
      'Hi, this channel looks cool!'
    );
    messagePinV1(user.token, messagesent.messageId);
    try {
      messageUnpinV1(user2.token, messagesent.messageId);
    } catch (e) {
      expect(e).toEqual(
        HTTPError(
          403,
          'Error! You are not authorised to unpin in this channel/dm'
        )
      );
    }
  });
});

describe('messagesendlater', () => {
  beforeEach(() => {
    clearV1();
  });
  test('successful message sentlater', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const sendtime = ~~(Date.now() / 1000) + 2;
    messageSend(user.token, channelId1.channelId, 'hello');
    const messagesent2 = messageSendLater(
      user.token,
      channelId1.channelId,
      'hi',
      ~~(Date.now() / 1000) + 2
    );
    expect(messagesent2.messageId).toEqual(2);
    const messages = channelMessagesV1(user.token, channelId1.channelId, 0);
    expect(messages.messages[0].timeSent).toEqual(sendtime);
  });

  test('unsuccessful message sentlater (no channel)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    try {
      messageSendLater(
        user.token,
        channelId1.channelId,
        'hi',
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid channelId'));
    }
  });

  test('unsuccessful message sentlater (invalid length)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesend = 'a'.repeat(1001);
    try {
      messageSendLater(
        user.token,
        channelId1.channelId,
        messagesend,
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message'));
    }
    try {
      messageSendLater(
        user.token,
        channelId1.channelId,
        '',
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message'));
    }
  });

  test('unsuccessful message sentlater (invalid time)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    const messagesend = 'a'.repeat(1001);
    try {
      messageSendLater(
        user.token,
        channelId1.channelId,
        messagesend,
        ~~(Date.now() / 1000) - 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid time'));
    }
  });

  test('unsuccessful message sentlater (user not part of channel)', () => {
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
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    try {
      messageSendLater(
        user2.token,
        channelId1.channelId,
        'hi',
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of the channel'));
    }
  });

  test('unsuccessful message sentlater (invalid token)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    try {
      messageSendLater(
        'bruh',
        channelId1.channelId,
        'hi',
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
  });
});

describe('messagesendlaterdm', () => {
  beforeEach(() => {
    clearV1();
  });
  test('successful message sentlater', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = dmCreate(user.token, []);
    const sendtime = ~~(Date.now() / 1000) + 2;
    sendDm(user.token, channelId1.dmId, 'hello');
    const messagesent2 = messageSendLaterDm(
      user.token,
      channelId1.dmId,
      'hi',
      ~~(Date.now() / 1000) + 2
    );
    expect(messagesent2.messageId).toEqual(2);
    const messages = dmMessages(user.token, channelId1.dmId, 0);
    expect(messages.messages[0].timeSent).toEqual(sendtime);
  });

  test('unsuccessful message sentlaterdm (no channel)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = dmCreate(user.token, []);
    try {
      messageSendLaterDm(
        user.token,
        channelId1.dmId,
        'hi',
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid dmId'));
    }
  });

  test('unsuccessful message sentlaterdm (invalid length)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = dmCreate(user.token, []);
    const messagesend = 'a'.repeat(1001);
    try {
      messageSendLaterDm(
        user.token,
        channelId1.dmId,
        messagesend,
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message'));
    }
    try {
      messageSendLaterDm(
        user.token,
        channelId1.dmId,
        '',
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid message'));
    }
  });

  test('unsuccessful message sentlaterdm (invalid time)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = dmCreate(user.token, []);
    const messagesend = 'a'.repeat(1001);
    try {
      messageSendLaterDm(
        user.token,
        channelId1.dmId,
        messagesend,
        ~~(Date.now() / 1000) - 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid time'));
    }
  });

  test('unsuccessful message sentlaterdm (user not part of dm)', () => {
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
    const channelId1 = dmCreate(user.token, []);
    try {
      messageSendLaterDm(
        user2.token,
        channelId1.dmId,
        'hi',
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of the dm'));
    }
  });

  test('unsuccessful message sentlaterdm (invalid token)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = dmCreate(user.token, []);
    try {
      messageSendLaterDm(
        'bruh',
        channelId1.dmId,
        'hi',
        ~~(Date.now() / 1000) + 2
      );
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
  });
});
