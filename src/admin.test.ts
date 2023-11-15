import { authRegisterV1 } from './auth';
import { channelsCreateV1 } from './channels';
import { channelJoinV1, channelMessagesV1 } from './channel';
import { userPermissionRemoveV1, userPermissionChangeV1 } from './admin';
import { messageSend } from './message';
import { userProfileV1, usersAllV1 } from './users';
import { clearV1 } from './other';
import HTTPError from 'http-errors';

/// //////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                userPermissionRemoveV1                                   //
//                                                                                         //
/// //////////////////////////////////////////////////////////////////////////////////////////

describe('remove member', () => {
  beforeEach(() => {
    clearV1();
  });
  test('invalid token', () => {
    // create two users (1 owner 1 member)
    authRegisterV1(
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

    // remove user
    try {
      userPermissionRemoveV1('invalid token', user2.authUserId);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Invalid Token'));
    }
  });

  test('invalid permission token', () => {
    // create two users (1 owner 1 member)
    authRegisterV1(
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
      'Ari1312312ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    // remove user
    try {
      userPermissionRemoveV1(user2.token, user3.authUserId);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, 'User Is not a Global Owner!'));
    }
  });

  test('unsuccessful remove because inputted invalid user', () => {
    // create two users (1 owner 1 member)
    const user1 = authRegisterV1(
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

    // remove user
    try {
      userPermissionRemoveV1(user1.token, 3);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! No User'));
    }
  });

  test('successful remove of a member of a channel', () => {
    // create two users (1 owner 1 member)
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
    const user3 = authRegisterV1(
      'Ari1112ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user4 = authRegisterV1(
      'Ari112112ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    // create a channel
    const channelId1 = channelsCreateV1(user1.token, 'name', true);
    channelJoinV1(user2.token, channelId1.channelId);
    channelJoinV1(user3.token, channelId1.channelId);
    channelJoinV1(user4.token, channelId1.channelId);

    const channelId2 = channelsCreateV1(user1.token, 'name', true);
    channelJoinV1(user2.token, channelId2.channelId);

    // user2 sends messages
    messageSend(user2.token, channelId1.channelId, 'hello');
    messageSend(user2.token, channelId1.channelId, 'bye');

    // remove user
    userPermissionRemoveV1(user1.token, user2.authUserId);

    const messages = channelMessagesV1(user1.token, channelId1.channelId, 0);
    messages.messages.forEach((object) => {
      delete object.timeSent;
    });

    expect(messages).toMatchObject({
      messages: [
        {
          messageId: 2,
          uId: user2.authUserId,
          message: 'Removed user',
        }, {
          messageId: 1,
          uId: user2.authUserId,
          message: 'Removed user',
        },
      ],
      start: 0,
      end: -1,
    });
  });

  test('unsuccessful remove because inputted invalid user', () => {
    // create two users (1 owner 1 member)
    const user1 = authRegisterV1(
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

    // remove user
    try {
      userPermissionRemoveV1(user1.token, 3);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! No User'));
    }
  });

  test('successful remove of a member of two channels with both having msgs', () => {
    // create two users (1 owner 1 member)
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
    const user3 = authRegisterV1(
      'Ari1112ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const user4 = authRegisterV1(
      'Ari112112ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    // create a channel
    const channelId1 = channelsCreateV1(user1.token, 'name', true);
    channelJoinV1(user2.token, channelId1.channelId);
    channelJoinV1(user3.token, channelId1.channelId);
    channelJoinV1(user4.token, channelId1.channelId);

    const channelId2 = channelsCreateV1(user1.token, 'name', true);
    channelJoinV1(user2.token, channelId2.channelId);

    // user2 sends messages in channel 1
    messageSend(user2.token, channelId1.channelId, 'hello');
    messageSend(user2.token, channelId1.channelId, 'bye');

    // user2 sends msgs in channel 2
    messageSend(user2.token, channelId2.channelId, 'bye');

    // remove user
    userPermissionRemoveV1(user1.token, user2.authUserId);

    const messages = channelMessagesV1(user1.token, channelId1.channelId, 0);
    messages.messages.forEach((object) => {
      delete object.timeSent;
    });

    const messages2 = channelMessagesV1(user1.token, channelId2.channelId, 0);
    messages.messages.forEach((object) => {
      delete object.timeSent;
    });

    expect(messages).toMatchObject({
      messages: [
        {
          messageId: 2,
          uId: user2.authUserId,
          message: 'Removed user',
        }, {
          messageId: 1,
          uId: user2.authUserId,
          message: 'Removed user',
        },
      ],
      start: 0,
      end: -1,
    });
    expect(messages2).toMatchObject({
      messages: [
        {
          messageId: 3,
          uId: user2.authUserId,
          message: 'Removed user',
        },
      ],
      start: 0,
      end: -1,
    });
  });

  test('successful remove of a member of a channel with correct userprofilev1 function', () => {
    // create two users (1 owner 1 member)
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

    // create a channel
    const channelId1 = channelsCreateV1(user1.token, 'name', true);
    channelJoinV1(user2.token, channelId1.channelId);

    // remove user
    userPermissionRemoveV1(user1.token, user2.authUserId);

    // userall
    const info = usersAllV1(user1.token);
    expect(info).toMatchObject({
      users: [
        {
          email: 'Arindam@unsw.edu.au',
          handleStr: 'arindammukherjee',
          nameFirst: 'Arindam',
          nameLast: 'Mukherjee',
          uId: 1,
        },
      ]
    });
  });

  test('successful remove of a member of a channel with correct userprofilev1 function', () => {
    // create two users (1 owner 1 member)
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

    // create a channel
    const channelId1 = channelsCreateV1(user1.token, 'name', true);
    channelJoinV1(user2.token, channelId1.channelId);

    // remove user
    userPermissionRemoveV1(user1.token, user2.authUserId);

    // user profile
    const profile = userProfileV1(user1.token, user2.authUserId);
    expect(profile).toMatchObject({
      user:
        {
          email: '',
          handleStr: '',
          nameFirst: 'Removed',
          nameLast: 'user',
          uId: 2,
        },
    });
  });
});

/// //////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                userPermissionChangeV1                                   //
//                                                                                         //
/// //////////////////////////////////////////////////////////////////////////////////////////

describe('change permission', () => {
  beforeEach(() => {
    clearV1();
  });
  test('invalid token', () => {
    // create two users (1 owner 1 member)
    authRegisterV1(
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
    try {
      userPermissionChangeV1('invalid token', user2.authUserId, 2);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, 'Error! Invalid Token'));
    }
  });

  test('permission change refers to invalid user', () => {
    // create two users (1 owner 1 member)
    const user1 = authRegisterV1(
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
      userPermissionChangeV1(user1.token, 55, 2);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! No User'));
    }
  });

  test('permissionId is the same', () => {
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
    try {
      userPermissionChangeV1(user1.token, user2.authUserId, 2);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Invalid PermissionId'));
    }
  });

  test('permissionId is not valid', () => {
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
    try {
      userPermissionChangeV1(user1.token, user2.authUserId, 40);
    } catch (e) {
      expect(e).toEqual(HTTPError(400, 'Error! Invalid PermissionId'));
    }
  });

  test('unauthorised user changing permissionId', () => {
    // create two users (1 owner 1 member)
    authRegisterV1(
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
      'Ari123112ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    try {
      userPermissionChangeV1(user2.token, user3.authUserId, 1);
    } catch (e) {
      expect(e).toEqual(HTTPError(403, 'Invalid User Changing Permissions!'));
    }
  });

  test('successful permission change to global owner', () => {
    // create two users (1 owner 1 member)
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
    userPermissionChangeV1(user1.token, user2.authUserId, 1);
  });

  test('successful permission change demotion', () => {
    // create two users (1 owner 1 member)
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
    userPermissionChangeV1(user1.token, user2.authUserId, 1);
    userPermissionChangeV1(user1.token, user2.authUserId, 2);
  });
});
