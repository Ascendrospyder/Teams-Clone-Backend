import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import {
  dmCreate,
  dmLeaveV1,
  dmRemoveV1,
  sendDm,
  dmMessages,
  dmList,
  dmDetails,
} from './dm';
import { userProfile } from './helper';
import HTTPError from 'http-errors';

describe('dm create', () => {
  beforeEach(() => {
    clearV1();
  });

  test('successful dm create', () => {
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
    const user3 = authRegisterV1(
      'Ari3123412ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm1 = dmCreate(user.token, [user2.authUserId, user3.authUserId]);
    const dm2 = dmCreate(user.token, [user3.authUserId]);
    expect(dm1).toEqual({ dmId: 1 });
    expect(dm2).toEqual({ dmId: 2 });
  });
  test('unsuccessful dm create (uId doesnt exist)', () => {
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
    const user3 = authRegisterV1(
      'Ari3123412ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm2 = dmCreate(user.token, [user3.authUserId]);
    try {
      dmCreate(user.token, [user2.authUserId, 474302480]);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid uIds'));
    }
    expect(dm2).toEqual({ dmId: 1 });
  });

  test('unsuccessful dm create (uId repeats)', () => {
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
    const user3 = authRegisterV1(
      'Ari3412312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm2 = dmCreate(user.token, [user3.authUserId]);
    try {
      dmCreate(user.token, [user2.authUserId, user2.authUserId]);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: duplicate uIds'));
    }
    expect(dm2).toEqual({ dmId: 1 });
  });

  test('unsuccessful dm create (token doesnt exist)', () => {
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
    const user3 = authRegisterV1(
      'Ari3142312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm2 = dmCreate(user.token, [user3.authUserId]);
    try {
      dmCreate('lol', [user2.authUserId, user.authUserId]);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
    expect(dm2).toEqual({ dmId: 1 });
  });

  test('unsuccessful dm create (owner invites themself)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1(
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user3 = authRegisterV1(
      'Ari3124312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm2 = dmCreate(user.token, [user3.authUserId]);
    try {
      dmCreate('user.authUserId', [user.authUserId]);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
    expect(dm2).toEqual({ dmId: 1 });
  });
});

describe('Testing DM leave', () => {
  beforeEach(() => {
    clearV1();
  });

  test('testing a valid case of removing', () => {
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
    const user3 = authRegisterV1(
      'Ari3123412ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      sendDm('lol', 1, 'hello');
    } catch (e) {}
    try {
      dmMessages('lol', 1, 0);
    } catch (e) {}
    const dm1 = dmCreate(user.token, [user2.authUserId, user3.authUserId]);
    const dmLeave = dmLeaveV1(user2.token, dm1.dmId);
    expect(dmLeave).toEqual({});
  });

  test('testing what happens when the token is invalid', () => {
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
    const dm1 = dmCreate(user.token, [user2.authUserId]);
    try {
      dmLeaveV1('invalidtoken', dm1.dmId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
  });

  test('testing invalid dmID', () => {
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

    dmCreate(user.token, [user2.authUserId]);
    try {
      dmLeaveV1(user.token, parseInt('invaliddmid'));
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid dmId'));
    }
  });

  test('dmId is valid and the authorised user is not a member of the DM', () => {
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

    const dm1 = dmCreate(user.token, []);
    try {
      dmLeaveV1(user2.token, dm1.dmId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of the dm'));
    }
  });
});

describe('dm messages', () => {
  beforeEach(() => {
    clearV1();
  });

  test('successful dm messages 0 messages', () => {
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
    const dm1 = dmCreate(user.token, [user2.authUserId]);
    expect(dmMessages(user.token, dm1.dmId, 0)).toEqual({
      messages: [],
      start: 0,
      end: -1,
    });
  });
  test('successful dm messages 1 messages', () => {
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
    const dm1 = dmCreate(user.token, [user2.authUserId]);
    const messageId = sendDm(user.token, dm1.dmId, 'hello');
    const messages = dmMessages(user.token, dm1.dmId, 0);
    messages.messages.forEach((object) => {
      delete object.timeSent;
    });
    messages.messages.sort((a, b) => a.messageId - b.messageId);
    expect(messages).toEqual({
      messages: [
        {
          isPinned: false,
          messageId: messageId.messageId,
          uId: user.authUserId,
          message: 'hello',
          reacts: [
            {
              isThisUserReacted: false,
              reactId: 1,
              uIds: [],
            },
          ],
        },
      ],
      start: 0,
      end: -1,
    });
  });
  test('successful dm messages 50 messages', () => {
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
    const dm1 = dmCreate(user.token, [user2.authUserId]);
    const array = [];
    for (let i = 0; i < 50; i++) {
      sendDm(user.token, dm1.dmId, 'hello');
      array.push({
        messageId: i + 1,
        uId: user.authUserId,
        message: 'hello',
        isPinned: false,
        reacts: [{ isThisUserReacted: false, reactId: 1, uIds: [] }],
      });
    }
    const message = dmMessages(user.token, dm1.dmId, 0);
    array.sort((a, b) => b.messageId - a.messageId);
    message.messages.forEach((object) => {
      delete object.timeSent;
    });
    expect(message).toEqual({ messages: array, start: 0, end: 50 });
  });
  test('unsuccessful dm messages dm doesnt exist', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      dmMessages(user.token, 432423432, 0);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid dmId'));
    }
  });
  test('start is greater than end', () => {
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
    const dm1 = dmCreate(user.token, [user2.authUserId]);
    try {
      dmMessages(user.token, dm1.dmId, 1);
    } catch (e) {
      expect(e).toEqual(
        HTTPError(400, '400: start greater than total messages')
      );
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
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm1 = dmCreate(user.token, []);
    try {
      dmMessages(user2.token, dm1.dmId, 0);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of the channel'));
    }
  });
});

describe('Testing dmRemoveV1', () => {
  beforeEach(() => {
    clearV1();
  });

  test('valid dmRemove', () => {
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
    const user3 = authRegisterV1(
      'Ari3123412ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm1 = dmCreate(user.token, [user2.authUserId, user3.authUserId]);
    const removeDm = dmRemoveV1(user.token, dm1.dmId);
    expect(removeDm).toEqual({});
  });

  test('invalid token', () => {
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
    const user3 = authRegisterV1(
      'Ari3123412ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm1 = dmCreate(user.token, [user2.authUserId, user3.authUserId]);
    try {
      dmRemoveV1('invalidtoken', dm1.dmId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
  });

  test('dmId is valid and the authorised user is not the original DM creator', () => {
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
    const user3 = authRegisterV1(
      'Ari3123412ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm1 = dmCreate(user.token, [user2.authUserId, user3.authUserId]);
    try {
      dmRemoveV1(user3.token, dm1.dmId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user is not part of the dm'));
    }
  });

  test('invalid dmId', () => {
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
    const user3 = authRegisterV1(
      'Ari3123412ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    dmCreate(user.token, [user2.authUserId, user3.authUserId]);
    try {
      dmRemoveV1(user.token, parseInt('invaliddmid'));
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid dmId'));
    }
  });

  test('dmId is valid and the authorised user is no longer in the DM', () => {
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
    const user3 = authRegisterV1(
      'Ari3123412ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm1 = dmCreate(user.token, [user2.authUserId, user3.authUserId]);
    dmRemoveV1(user.token, dm1.dmId);
    try {
      dmRemoveV1(user.token, dm1.dmId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user not part of dm'));
    }
  });
});

describe('messagelist', () => {
  beforeEach(() => {
    clearV1();
  });

  test('creating a list of dms that the user is part of', () => {
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
    const user3 = authRegisterV1(
      'Ari3124312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    dmCreate(user.token, [user2.authUserId, user3.authUserId]);
    dmCreate(user2.token, [user3.authUserId]);
    const array = dmList(user.token);
    expect(array).toEqual({
      dms: [
        {
          dmId: 1,
          name: 'arindammukherjee, arindammukherjee0, arindammukherjee1',
        },
      ],
    });
  });

  test('not creating a list of dms (token does not exist)', () => {
    const user1 = authRegisterV1(
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
    dmCreate(user1.token, [user2.authUserId]);
    try {
      dmList('tokendoesnotexist');
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
  });

  test('creating an empty list of dms (no dms exist)', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const array = dmList(user.token);
    expect(array).toEqual({ dms: [] });
  });

  test('creating an empty list of dms (empty array as they are not part of any existing dms)', () => {
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
    const user3 = authRegisterV1(
      'Ari3124312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    dmCreate(user2.token, [user3.authUserId]);
    const array = dmList(user.token);
    expect(array).toEqual({ dms: [] });
  });
});

describe('dm details', () => {
  beforeEach(() => {
    clearV1();
  });

  test('printing out successful details', () => {
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
    const dm1 = dmCreate(user.token, [user2.authUserId]);
    const details = dmDetails(user.token, dm1.dmId);
    expect(details).toMatchObject({
      name: 'arindammukherjee, arindammukherjee0',
      members: [
        userProfile(user2.authUserId, user2.authUserId),
        userProfile(user.authUserId, user.authUserId),
      ],
    });
  });

  test('unsuccessful due to invalid token', () => {
    const user1 = authRegisterV1(
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
    const dm1 = dmCreate(user1.token, [user2.authUserId]);
    try {
      dmDetails('tokendoesnotexist', dm1.dmId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: invalid token'));
    }
  });

  test('calling dmDetail for an invalid dmId', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1(
      'Ari312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      dmDetails(user.token, 0);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, '400: invalid dmId'));
    }
  });

  test('user tries to call a dm when they are not a member', () => {
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
    const user3 = authRegisterV1(
      'Ari312331212ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const dm1 = dmCreate(user2.token, [user3.authUserId]);
    try {
      dmDetails(user.token, dm1.dmId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, '403: user not part of the dm'));
    }
  });
});
