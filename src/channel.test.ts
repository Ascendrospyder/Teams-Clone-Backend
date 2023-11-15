import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { channelAddOwnerV1, channelDetailsV1, channelInviteV1, channelJoinV1, channelLeaveV1, channelMessagesV1, channelRemoveOwnerV1 } from './channel';
import { channelsCreateV1, channelsListallV1, channelsListV1 } from './channels';
import HTTPError from 'http-errors';

/// //////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                channelLeaveV1                                           //
//                                                                                         //
/// //////////////////////////////////////////////////////////////////////////////////////////
describe('channelLeaveV1', () => {
  test('Testing leaving a valid channel', () => {
    // create some users
    clearV1();
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const id2 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id3 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );

    const idc1 = channelsCreateV1(id1.token, 'Ice Cream', true);
    channelJoinV1(id2.token, idc1.channelId); // join the channel
    try {
      channelsListV1('wrong string');
    } catch (e) {

    }
    try {
      channelsCreateV1('wrong string', 'icecream', true);
    } catch (e) {

    }
    try {
      channelsCreateV1(id1.token, '', true);
    } catch (e) {

    }
    channelsListV1(id1.token);
    channelsListallV1(id1.token);
    channelDetailsV1(id1.token, idc1.channelId);
    try {
      channelDetailsV1('hi', idc1.channelId);
    } catch (e) {

    }
    try {
      channelDetailsV1(id1.token, 12321);
    } catch (e) {

    }
    try {
      channelDetailsV1(id3.token, idc1.channelId);
    } catch (e) {

    }
    const channelLeave = channelLeaveV1(id2.token, idc1.channelId);
    expect(channelLeave).toMatchObject({});
  });

  test('Testing leaving with an invalid token', () => {
    clearV1();
    // registering a user in
    const id1 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    // creating a channel
    channelsCreateV1(id1.token, 'Ice Cream', true);
    try {
      channelLeaveV1('invalidtoken', 1);
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
  });
  test('user tries to leave a channel they are not part of', () => {
    clearV1();
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const id2 = authRegisterV1(
      'JohnSmith@gmail.com',
      'inventingNewPasswordsMakesMeCry',
      'John',
      'Smith'
    );
    const id3 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    // I create a channel and I join it
    const idc1 = channelsCreateV1(id1.token, 'Ice Cream', true);
    try {
      channelLeaveV1(id2.token, idc1.channelId);
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: User Is Not A Member Of Channel!'));
    }
    try {
      channelJoinV1('hi', idc1.channelId);
    } catch (err) {
    }
    try {
      channelJoinV1(id2.token, 43243242);
    } catch (err) {
    }
    try {
      channelJoinV1(id1.token, idc1.channelId);
    } catch (err) {
    }
    const idc2 = channelsCreateV1(id1.token, 'Ice Cream', false);
    try {
      channelJoinV1(id2.token, idc2.channelId);
    } catch (err) {
    }

    try {
      channelInviteV1('id1.token', idc2.channelId, 2);
    } catch (err) {
    }
    try {
      channelInviteV1(id1.token, idc2.channelId, 232131);
    } catch (err) {
    }
    try {
      channelInviteV1(id1.token, 31232131, 2);
    } catch (err) {
    }
    try {
      channelInviteV1(id1.token, idc2.channelId, id1.authUserId);
    } catch (err) {
    }
    try {
      channelInviteV1(id1.token, idc2.channelId, 2);
    } catch (err) {
    }
    try {
      channelInviteV1(id1.token, idc2.channelId, 2);
    } catch (err) {
    }
    // channelInviteV1(id1.token, idc2.channelId, 2)
    try {
      channelMessagesV1('id1.token', idc2.channelId, 0);
    } catch (err) {
    }
    try {
      channelMessagesV1(id1.token, 321321321, 0);
    } catch (err) {
    }
    try {
      channelMessagesV1(id1.token, idc2.channelId, 312321321321);
    } catch (err) {
    }
    try {
      channelMessagesV1(id3.token, idc2.channelId, 0);
    } catch (err) {
    }
    channelAddOwnerV1(id1.token, idc2.channelId, 2);
    channelRemoveOwnerV1(id1.token, idc2.channelId, 2);
    try {
      channelRemoveOwnerV1(id1.token, 312321312, 2);
    } catch (e) {

    }
    channelAddOwnerV1(id1.token, idc2.channelId, 2);
    channelLeaveV1(id2.token, idc2.channelId);
    try {
      channelLeaveV1(id1.token, 32131321);
    } catch (e) {

    }
  });
});
