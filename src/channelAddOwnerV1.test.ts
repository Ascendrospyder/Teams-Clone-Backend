import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV1 } from './channels';
import { channelJoinV1, channelAddOwnerV1 } from './channel';
import { numberOfOwnersOfChannel } from './helper';
import HTTPError from 'http-errors';

describe('Testing promoting user to owner of channel', () => {
  test('Promoting 1 member to owner', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id2 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id3 = authRegisterV1(
      'kelly@gmail.com',
      'KBrT45Pq9',
      'Kelly',
      'Brown'
    );
    const id4 = authRegisterV1(
      'lucky@gmail.com',
      'fBrT99Qq9',
      'Lucky',
      'Nelly'
    );
    const id5 = authRegisterV1(
      'Peter@gmail.com',
      'fBrT45Pq9',
      'Peter',
      'Smith'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    channelJoinV1(id2.token, idc.channelId);
    channelJoinV1(id3.token, idc.channelId);
    channelJoinV1(id4.token, idc.channelId);
    channelJoinV1(id5.token, idc.channelId);
    expect(channelAddOwnerV1(id1.token, idc.channelId, id2.authUserId)).toEqual({});
    expect(numberOfOwnersOfChannel(idc.channelId)).toEqual(2);
  });
  test('Promoting a 2nd member to owner', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id2 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id3 = authRegisterV1(
      'kelly@gmail.com',
      'KBrT45Pq9',
      'Kelly',
      'Brown'
    );
    const id4 = authRegisterV1(
      'lucky@gmail.com',
      'fBrT99Qq9',
      'Lucky',
      'Nelly'
    );
    const id5 = authRegisterV1(
      'Peter@gmail.com',
      'fBrT45Pq9',
      'Peter',
      'Smith'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    channelJoinV1(id2.token, idc.channelId);
    channelJoinV1(id3.token, idc.channelId);
    channelJoinV1(id4.token, idc.channelId);
    channelJoinV1(id5.token, idc.channelId);
    channelAddOwnerV1(id1.token, idc.channelId, id4.authUserId);
    expect(channelAddOwnerV1(id1.token, idc.channelId, id3.authUserId)).toEqual({});
    expect(numberOfOwnersOfChannel(idc.channelId)).toEqual(3);
  });
});

describe('Testing inputs to the channelAddOwnerV1 function', () => {
  test('Testing with invalid authUserId', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id2 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id3 = authRegisterV1(
      'kelly@gmail.com',
      'KBrT45Pq9',
      'Kelly',
      'Brown'
    );
    const id4 = authRegisterV1(
      'lucky@gmail.com',
      'fBrT99Qq9',
      'Lucky',
      'Nelly'
    );
    const id5 = authRegisterV1(
      'Peter@gmail.com',
      'fBrT45Pq9',
      'Peter',
      'Smith'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    channelJoinV1(id2.token, idc.channelId);
    channelJoinV1(id3.token, idc.channelId);
    channelJoinV1(id4.token, idc.channelId);
    channelJoinV1(id5.token, idc.channelId);
    channelAddOwnerV1(id1.token, idc.channelId, id2.authUserId);
    try {
      channelAddOwnerV1('$notAValidToken$', idc.channelId, id3.authUserId);
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
  });
  test('Invalid uId', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id2 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id3 = authRegisterV1(
      'kelly@gmail.com',
      'KBrT45Pq9',
      'Kelly',
      'Brown'
    );
    const id4 = authRegisterV1(
      'lucky@gmail.com',
      'fBrT99Qq9',
      'Lucky',
      'Nelly'
    );
    const id5 = authRegisterV1(
      'Peter@gmail.com',
      'fBrT45Pq9',
      'Peter',
      'Smith'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    channelJoinV1(id2.token, idc.channelId);
    channelJoinV1(id3.token, idc.channelId);
    channelJoinV1(id4.token, idc.channelId);
    channelJoinV1(id5.token, idc.channelId);
    channelAddOwnerV1(id1.token, idc.channelId, id2.authUserId);
    channelAddOwnerV1(id1.token, idc.channelId, id4.authUserId);
    try {
      channelAddOwnerV1(id1.token, idc.channelId, -5000);
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Invalid User!'));
    }
  });
  test('Invalid channel', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id2 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id3 = authRegisterV1(
      'kelly@gmail.com',
      'KBrT45Pq9',
      'Kelly',
      'Brown'
    );
    const id4 = authRegisterV1(
      'lucky@gmail.com',
      'fBrT99Qq9',
      'Lucky',
      'Nelly'
    );
    const id5 = authRegisterV1(
      'Peter@gmail.com',
      'fBrT45Pq9',
      'Peter',
      'Smith'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    channelJoinV1(id2.token, idc.channelId);
    channelJoinV1(id3.token, idc.channelId);
    channelJoinV1(id4.token, idc.channelId);
    channelJoinV1(id5.token, idc.channelId);
    channelAddOwnerV1(id1.token, idc.channelId, id4.authUserId);
    try {
      channelAddOwnerV1(id2.token, -8, id2.authUserId);
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Invalid Channel!'));
    }
  });
  test('AuthUser not owner of channel', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id2 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id3 = authRegisterV1(
      'kelly@gmail.com',
      'KBrT45Pq9',
      'Kelly',
      'Brown'
    );
    const id4 = authRegisterV1(
      'lucky@gmail.com',
      'fBrT99Qq9',
      'Lucky',
      'Nelly'
    );
    const id5 = authRegisterV1(
      'Peter@gmail.com',
      'fBrT45Pq9',
      'Peter',
      'Smith'
    );
    const id7 = authRegisterV1(
      'Hasan@unsw.edu.au',
      '234562',
      'Hasan',
      'Mubarak'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    channelJoinV1(id2.token, idc.channelId);
    channelJoinV1(id3.token, idc.channelId);
    channelJoinV1(id4.token, idc.channelId);
    channelJoinV1(id5.token, idc.channelId);
    channelAddOwnerV1(id1.token, idc.channelId, id4.authUserId);
    try {
      channelAddOwnerV1(id7.token, idc.channelId, id2.authUserId);
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Authorized User Does Not Have Owner Permissions!'));
    }
  });
  test('The uId is not a member of channel', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id2 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id3 = authRegisterV1(
      'kelly@gmail.com',
      'KBrT45Pq9',
      'Kelly',
      'Brown'
    );
    const id4 = authRegisterV1(
      'lucky@gmail.com',
      'fBrT99Qq9',
      'Lucky',
      'Nelly'
    );
    const id5 = authRegisterV1(
      'Peter@gmail.com',
      'fBrT45Pq9',
      'Peter',
      'Smith'
    );
    const id7 = authRegisterV1(
      'Hasan@unsw.edu.au',
      '234562',
      'Hasan',
      'Mubarak'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    channelJoinV1(id2.token, idc.channelId);
    channelJoinV1(id3.token, idc.channelId);
    channelJoinV1(id4.token, idc.channelId);
    channelJoinV1(id5.token, idc.channelId);
    channelAddOwnerV1(id1.token, idc.channelId, id2.authUserId);
    channelAddOwnerV1(id1.token, idc.channelId, id4.authUserId);
    try {
      channelAddOwnerV1(id1.token, idc.channelId, id7.authUserId);
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Does Not Satisfy Requirements for Promotion!'));
    }
  });
  test('An existing owner is added as an owner', () => {
    clearV1();
    const id1 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id2 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id3 = authRegisterV1(
      'kelly@gmail.com',
      'KBrT45Pq9',
      'Kelly',
      'Brown'
    );
    const id4 = authRegisterV1(
      'lucky@gmail.com',
      'fBrT99Qq9',
      'Lucky',
      'Nelly'
    );
    const id5 = authRegisterV1(
      'Peter@gmail.com',
      'fBrT45Pq9',
      'Peter',
      'Smith'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    channelJoinV1(id2.token, idc.channelId);
    channelJoinV1(id3.token, idc.channelId);
    channelJoinV1(id4.token, idc.channelId);
    channelJoinV1(id5.token, idc.channelId);
    channelAddOwnerV1(id1.token, idc.channelId, id2.authUserId);
    channelAddOwnerV1(id1.token, idc.channelId, id4.authUserId);
    try {
      channelAddOwnerV1(id1.token, idc.channelId, id2.authUserId);
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: User Is Already A Channel Owner!'));
    }
  });
});
