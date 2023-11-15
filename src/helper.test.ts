import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV1 } from './channels';
import { utilization, userProfile, numberOfTokens, numberOfOwnersOfChannel, getHashOf, getResetCode } from './helper';
import { dmCreate } from './dm';

describe('Testing Utilization function In Helper.ts', () => {
  test('Testing When Zero Users Exist', () => {
    clearV1();
    expect(utilization()).toEqual(0);
  });
  test('Testing A User Being A Member Of A Channel', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    channelsCreateV1(id1.token, 'ice cream', true);
    expect(utilization()).toEqual(1);
  });
  test('Testing A User Being A Member Of A Channel', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id2 = authRegisterV1(
      'kelly@gmail.com',
      'fBrmTP45Pq9',
      'Kelly',
      'Peters'
    );
    dmCreate(id1.token, [id2.authUserId]);
    expect(utilization()).toEqual(1);
  });
});

// /////////////////////////////////////////////////////////////////////////////

describe('Testing UserProfile function In Helper.ts', () => {
  test('Testing When AuthUser Is Valid and User Exists In DataStore', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const id2 = authRegisterV1(
      'kelly@gmail.com',
      'fBrmTP45Pq9',
      'Kelly',
      'Peters'
    );
    expect(userProfile(id1.authUserId, id2.authUserId)).toEqual({
      uId: 2,
      email: 'kelly@gmail.com',
      nameFirst: 'Kelly',
      nameLast: 'Peters',
      handleStr: 'kellypeters',
    });
  });
});

// ////////////////////////////////////////////////////////////////////////////

describe('Testing numberOfTokens function In Helper.ts', () => {
  test('Testing When AuthUser Is Valid and User Exists In DataStore', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    expect(numberOfTokens(id1.authUserId)).toEqual(1);
  });
});

// ////////////////////////////////////////////////////////////////////////////

describe('Testing numberOfOwnersOfChannel function In Helper.ts', () => {
  test('Testing When 1 Owner Exists', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    expect(numberOfOwnersOfChannel(idc.channelId)).toEqual(1);
  });
});

// ////////////////////////////////////////////////////////////////////////////

describe('Testing getHashOf function In Helper.ts', () => {
  test('Testing random test', () => {
    clearV1();
    const text = 'randomStuff';
    expect(getHashOf(text)).toEqual(getHashOf(text));
  });
});

// /////////////////////////////////////////////////////////////////////////////

describe('Testing getResetCode function In Helper.ts', () => {
  test('Testing When A Reset Code Is Requested', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    expect(getResetCode(id1.token)).toEqual(getResetCode(id1.token));
  });
});
