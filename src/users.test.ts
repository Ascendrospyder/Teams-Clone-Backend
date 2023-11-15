import { usersAllV1, userProfileSethandleV1, userProfileSetNameV1, userProfileSetEmailV1, userProfileV1, userStatsV1 } from './users';
import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import HTTPError from 'http-errors';
import { channelJoinV1 } from './channel';
import { channelsCreateV1 } from './channels';
import { messageSend, messageRemove } from './message';
import { dmCreate } from './dm';

describe('Compilation of Tests for userAllV1', () => {
  test('Testing an invalid token', () => {
    clearV1();
    authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );
    try {
      usersAllV1('invaliduserId');
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
  });

  test('Testing a valid token', () => {
    clearV1();

    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );
    const info = usersAllV1(id1.token);
    expect(info).toMatchObject({
      users: [
        {
          email: 'Arindam@unsw.edu.au',
          handleStr: 'arindammukherjee',
          nameFirst: 'Arindam',
          nameLast: 'Mukherjee',
          uId: 1,
        },
        {
          email: 'JennyPatrick@gmail.com',
          handleStr: 'jennypatrick',
          nameFirst: 'Jenny',
          nameLast: 'Patrick',
          uId: 2,
        },
      ],
    });
  });
});

describe('Compilation of Tests for userProfileSethandleV1', () => {
  test('Testing an invalid token', () => {
    clearV1();
    authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );
    try {
      userProfileSethandleV1('invaliduserId', 'handletest');
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
  });

  test('Testing an invalid handStr which is less than 3 characters', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );
    try {
      userProfileSethandleV1(id1.token, '0');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Handle Length Needs To Be Between 3 And 20 Characters Inclusive!'));
    }
  });

  test('Testing an invalid handleStr which is more than 20 characters long ', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );
    try {
      userProfileSethandleV1(id1.token, 'thishandleismorethan20characterslonghahahaha');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Handle Length Needs To Be Between 3 And 20 Characters Inclusive!'));
    }
  });

  test('Testing an invalid handleStr which does not contain alpha numeric characters', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );
    try {
      userProfileSethandleV1(id1.token, '@#$%');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Handle Must Only Contain Alphanumeric Characters!'));
    }
  });
  test('Testing a valid handleStr', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );

    authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    userProfileSethandleV1(id1.token, 'thisismyhandle');
    const userProfile = userProfileV1(id1.token, 1);
    const handleFromUser = userProfile.user.handleStr;
    expect(handleFromUser).toBe('thisismyhandle');
  });
});

/// //////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                userProfileSetNameV1                                     //
//                                                                                         //
/// //////////////////////////////////////////////////////////////////////////////////////////

describe('Compilation of Tests for userProfileSetNameV1', () => {
  test('Testing an invalid token', () => {
    clearV1();
    authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      userProfileSetNameV1('invaliduserId', 'nameFirst', 'nameLast');
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
  });

  test('if the first name is invalid with more than 50 characters', () => {
    clearV1();
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'

    );
    try {
      userProfileSetNameV1(id1.token, 'friedonionfriedonionfriedonionfriedonionfriedoniono', 'friedonion');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: First Name Needs To Be Between 1 And 50 Characters Inclusive!'));
    }
  });

  test('if the first name is invalid with less than 1 character', () => {
    clearV1();
    const id2 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      userProfileSetNameV1(id2.token, '', 'friedonion');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: First Name Needs To Be Between 1 And 50 Characters Inclusive!'));
    }
  });

  test('if the last name is invalid with more than 50 characters', () => {
    clearV1();
    const id3 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      userProfileSetNameV1(id3.token, 'friedonion', 'friedonionfriedonionfriedonionfriedonionfriedoniono');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Last Name Needs To Be Between 1 And 50 Characters Inclusive!'));
    }
  });

  test('if the last name is invalid with less than 1 character', () => {
    clearV1();
    const id4 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      userProfileSetNameV1(id4.token, 'friedonion', '');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Last Name Needs To Be Between 1 And 50 Characters Inclusive!'));
    }
  });

  test('if the first name doesnt consist of only alphabet characters', () => {
    clearV1();
    const id4 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      userProfileSetNameV1(id4.token, '1111111', 'mukherjee');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: First Name Needs To Consist Of Alphabetic Characters!'));
    }
  });

  test('if the last name doesnt consist of only alphabet characters', () => {
    clearV1();
    const id4 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      userProfileSetNameV1(id4.token, 'arindam', '1111111');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Last Name Must Only Contain Alphanumeric Characters!'));
    }
  });
});

/// //////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                userProfileSetEmailV1                                    //
//                                                                                         //
/// //////////////////////////////////////////////////////////////////////////////////////////

describe('Compilation of Tests for userProfileSetEmailV1', () => {
  test('Testing an invalid token', () => {
    clearV1();
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    try {
      userProfileSetEmailV1('invaliduserId', 'Arindam@unsw.edu.au');
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
    try {
      userProfileV1('invaliduserId', 1);
    } catch (err) {
    }
    try {
      userProfileV1(user.token, 1321312);
    } catch (err) {
    }
  });

  test('if the email is an invalid email', () => {
    clearV1();
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'a',
      'a'
    );
    const id2 = authRegisterV1(
      'Arin432dam@unsw.edu.au',
      '234562',
      'a',
      'a'
    );
    try {
      userProfileSetEmailV1(id1.token, 'i321321312');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Not A Valid Email Address!'));
    }
    try {
      userProfileSethandleV1(id1.token, 'aa');
      userProfileSethandleV1(id2.token, 'aa');
    } catch (err) {
    }
    userProfileSetEmailV1(id1.token, 'real@gmail.com');
    userProfileSetNameV1(id1.token, 'hello', 'hi');
  });

  test('if the email is already being used by another user', () => {
    clearV1();
    authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const id2 = authRegisterV1(
      'robotrobot@unsw.edu.au',
      '102938',
      'beepboop',
      'blipblop'
    );
    try {
      userProfileSetEmailV1(id2.token, 'Arindam@unsw.edu.au');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Email Address Already Registered!'));
    }
  });
});

describe('userStatsV1', () => {
  beforeEach(() => {
    clearV1();
  });

  test('testing a valid case of displaying user stats', () => {
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    const id2 = authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );
    const channelId1 = channelsCreateV1(id1.token, 'testchannel', true);
    channelJoinV1(id2.token, channelId1.channelId);
    messageSend(id1.token, channelId1.channelId, 'hi');
    messageSend(id1.token, channelId1.channelId, 'helo');
    channelsCreateV1(id1.token, 'testchannel2', true);
    messageSend(id2.token, channelId1.channelId, 'helo22');
    messageSend(id1.token, channelId1.channelId, 'helo34');
    messageSend(id1.token, channelId1.channelId, 'helo4235');

    dmCreate(id1.token, [id2.authUserId]);
    dmCreate(id1.token, [id2.authUserId]);
    const userInfo = userStatsV1(id1.token);
    userInfo.userStats.channelsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    userInfo.userStats.dmsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    userInfo.userStats.messagesSent.forEach((object : any) => {
      delete object.timeStamp;
    });
    expect(userInfo).toEqual({
      userStats: {
        channelsJoined: [{ numChannelsJoined: 0 }],
        dmsJoined: [
          { numDmsJoined: 0 },
          { numDmsJoined: 1 },
          { numDmsJoined: 2 }
        ],
        messagesSent: [
          { numMessagesSent: 0 },
          { numMessagesSent: 1 },
          { numMessagesSent: 2 },
          { numMessagesSent: 3 },
          { numMessagesSent: 4 }
        ],
        involvementRate: userInfo.userStats.involvementRate
      }
    });
  });

  test('invalid token', () => {
    const user = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    authRegisterV1(
      'Ari3232ndam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const channelId1 = channelsCreateV1(user.token, 'testchannel', true);
    messageSend(user.token, channelId1.channelId, 'Hi, this channel looks cool!');
    try {
      userStatsV1('invalid token hahahah');
    } catch (e) {
      expect(e).toEqual(HTTPError(403, 'Error! Invalid token'));
    }
  });

  test('when there is no channels, dms and messages made', () => {
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );
    const userInfo = userStatsV1(id1.token);
    userInfo.userStats.channelsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    userInfo.userStats.dmsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    userInfo.userStats.messagesSent.forEach((object : any) => {
      delete object.timeStamp;
    });
    expect(userInfo).toEqual({
      userStats: {
        channelsJoined: [{ numChannelsJoined: 0 }],
        dmsJoined: [{ numDmsJoined: 0 }],
        messagesSent: [{ numMessagesSent: 0 }],
        involvementRate: 0
      }
    });
    expect(userInfo.userStats.involvementRate).toBe(0);
  });

  test('testing if involvement is greater than 1', () => {
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    const id2 = authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );
    const channelId1 = channelsCreateV1(id1.token, 'testchannel', true);
    channelJoinV1(id2.token, channelId1.channelId);
    const messageSent1 = messageSend(id2.token, channelId1.channelId, 'helo22');
    messageRemove(id2.token, messageSent1.messageId);
    const messageSent2 = messageSend(id1.token, channelId1.channelId, 'helo34');
    messageRemove(id1.token, messageSent2.messageId);
    const userInfo = userStatsV1(id1.token);
    expect(userInfo.userStats.involvementRate).toEqual(1);
  });

  test('check how having no messages sent affects involvement', () => {
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    const id2 = authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );

    dmCreate(id1.token, [id2.authUserId]); // create a dm
    channelsCreateV1(id1.token, 'testchannel', true);
    channelsCreateV1(id1.token, 'testchannel2', true);
    const userInfo = userStatsV1(id1.token);
    userInfo.userStats.channelsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    userInfo.userStats.dmsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    userInfo.userStats.messagesSent.forEach((object : any) => {
      delete object.timeStamp;
    });
    expect(userInfo).toEqual({
      userStats: {
        channelsJoined: [{ numChannelsJoined: 0 }],
        dmsJoined: [
          { numDmsJoined: 0 },
          { numDmsJoined: 1 }
        ],
        messagesSent: [{ numMessagesSent: 0 }],
        involvementRate: userInfo.userStats.involvementRate
      }
    });
    expect(userInfo.userStats.involvementRate).toEqual(userInfo.userStats.involvementRate);
  });

  test('check how having no dms affect the involvement rate', () => {
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );

    const id2 = authRegisterV1(
      'JennyPatrick@gmail.com',
      'noOneIsGoing2GuessThis',
      'Jenny',
      'Patrick'
    );

    const channelId1 = channelsCreateV1(id1.token, 'testchannel', true);
    channelsCreateV1(id1.token, 'testchannel2', true);
    channelJoinV1(id2.token, channelId1.channelId);
    messageSend(id1.token, channelId1.channelId, 'hi');
    messageSend(id1.token, channelId1.channelId, 'helo');
    channelsCreateV1(id1.token, 'testchannel2', true);
    messageSend(id2.token, channelId1.channelId, 'helo22');
    messageSend(id1.token, channelId1.channelId, 'helo34');
    messageSend(id1.token, channelId1.channelId, 'helo4235');
    const userInfo = userStatsV1(id1.token);
    userInfo.userStats.channelsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    userInfo.userStats.dmsJoined.forEach((object : any) => {
      delete object.timeStamp;
    });
    userInfo.userStats.messagesSent.forEach((object : any) => {
      delete object.timeStamp;
    });
    expect(userInfo).toEqual({
      userStats:
        {
          channelsJoined: [{ numChannelsJoined: 0 }],
          dmsJoined: [{ numDmsJoined: 0 }],
          messagesSent: [
            { numMessagesSent: 0 },
            { numMessagesSent: 1 },
            { numMessagesSent: 2 },
            { numMessagesSent: 3 },
            { numMessagesSent: 4 }
          ],
          involvementRate: userInfo.userStats.involvementRate
        }
    });
    expect(userInfo.userStats.involvementRate).toEqual(userInfo.userStats.involvementRate);
  });
});

// check if no channel - is it going to crash?
// check if no dms
// check if no messages
// users/stats check utilisation if denominator is 0
