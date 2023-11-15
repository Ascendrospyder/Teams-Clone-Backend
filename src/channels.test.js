import { authRegisterV1, authLoginV1 } from './auth';
import { clearV1 } from './other';
import { channelJoinV1 } from './channel';
import {
  channelsCreateV1,
  channelsListV1,
  channelsListallV1,
} from './channels';

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                channelsCreateV1                                         //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////

describe('channelsCreateV1', () => {
  test('Creates mutliple channels', () => {
    clearV1();
    const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
    const channelid1 = channelsCreateV1(uId.authUserId, 'testchannel', true);
    const channelid2 = channelsCreateV1(uId.authUserId, 'testchannel', false);
    expect(channelid1.channelId).toBe(1);
    expect(channelid2.channelId).toBe(2);
  });

  test('invalid name length', () => {
    clearV1();
    const id1 = authRegisterV1(
      'Arindam@unsw.edu.au',
      '234562',
      'Arindam',
      'Mukherjee'
    );
    const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
    // name with length 0
    const channelid1 = channelsCreateV1(uId.authUserId, '', true);
    // name with length greater than 20
    const channelid2 = channelsCreateV1(
      uId.authUserId,
      '54783905748235748903254780948372',
      true
    );
    expect(channelid1).toMatchObject({ error: 'error' });
    expect(channelid2).toMatchObject({ error: 'error' });
  });

  test('invalid authUserId', () => {
    clearV1();
    const channelid1 = channelsCreateV1('wrongID!!!', 'name', true);
    expect(channelid1).toMatchObject({ error: 'error' });
  });
});

//////////////////////////////////////////////////////////////
//                                                          //
//                  channelsListallV1 Tests                 //
//                                                          //
//////////////////////////////////////////////////////////////

describe('Compilation of Tests for the function channelsListallV1.js', () => {
  describe('Check when authUserId is invalid', () => {
    test('when no channels exist', () => {
      clearV1();
      const id1 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const id2 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      expect(channelsListallV1('invalid data type')).toMatchObject({
        error: 'error',
      });
    });

    test('when 1 channel exists that is private', () => {
      clearV1();
      const id3 = authRegisterV1(
        'james@gmail.com',
        'fBrT45Pq9',
        'James',
        'Peters'
      );
      const channelid = channelsCreateV1(id3.authUserId, 'Ice Cream', true);
      expect(channelsListallV1('invalid data type')).toMatchObject({
        error: 'error',
      });
    });

    test('when 1 channel exists that is public', () => {
      clearV1();
      const id4 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id5 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const channelId1 = channelsCreateV1(id4.authUserId, 'Ice Cream', false);
      expect(channelsListallV1('invalid data type')).toMatchObject({
        error: 'error',
      });
    });

    test('when multiple channels exist that are private', () => {
      clearV1();
      const id6 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id7 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id8 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const channelid2 = channelsCreateV1(id6.authUserId, 'Ice Cream', true);
      const channelid3 = channelsCreateV1(id7.authUserId, 'Chocolate', true);
      expect(channelsListallV1('invalid data type')).toMatchObject({
        error: 'error',
      });
    });

    test('when multiple channels exist that are public', () => {
      clearV1();
      const id9 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id10 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const channelid4 = channelsCreateV1(id9.authUserId, 'Ice Cream', false);
      const channelid5 = channelsCreateV1(id10.authUserId, 'Chocolate', false);
      const channelid6 = channelsCreateV1(id9.authUserId, 'Chips', false);
      const channelid7 = channelsCreateV1(id10.authUserId, 'Meat Pies', false);
      expect(channelsListallV1('invalid data type')).toMatchObject({
        error: 'error',
      });
    });
  });
  // -----------------------------------------------------------------------------------------------------------------------------------//
  //  ----------------------------- All the tests below are for a valid authUserId ----------------------------------------------------//
  //----------------------------------------------------------------------------------------------------------------------------------//

  describe('Check the channelsListAll function when authUserId is valid', () => {
    test('when no channels exist', () => {
      clearV1();
      const id1 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const id2 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      expect(channelsListallV1(id1.authUserId, id2.authUserId)).toEqual({
        channels: [],
      });
    });

    test('when 1 channel exists that is private', () => {
      clearV1();
      const id3 = authRegisterV1(
        'james@gmail.com',
        'fBrT45Pq9',
        'James',
        'Peters'
      );
      const id4 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      let uId = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const channelid1 = channelsCreateV1(id3.authUserId, 'Ice Cream', false);
      expect(channelsListallV1(id3.authUserId, id4.authUserId)).toEqual({
        channels: [{ channelId: 1, name: 'Ice Cream' }],
      });
    });

    test('when 1 channel exists that is public', () => {
      clearV1();
      const id5 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id6 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const channelid2 = channelsCreateV1(id6.authUserId, 'Ice Cream', true);
      expect(channelsListallV1(id5.authUserId, id6.authUserId)).toEqual({
        channels: [{ channelId: 1, name: 'Ice Cream' }],
      });
    });

    test('when multiple channels exist that are private', () => {
      clearV1();
      const id7 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id8 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id9 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const channelid3 = channelsCreateV1(id7.authUserId, 'Ice Cream', false);
      const channelid4 = channelsCreateV1(id8.authUserId, 'Chocolate', false);
      expect(
        channelsListallV1(id7.authUserId, id8.authUserId, id9.authUserId)
      ).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
        ],
      });
    });

    test('when multiple channels exist that are public', () => {
      clearV1();
      const id10 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id11 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id12 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const channelid5 = channelsCreateV1(id10.authUserId, 'Ice Cream', true);
      const channelid6 = channelsCreateV1(id11.authUserId, 'Chocolate', true);
      const channelid7 = channelsCreateV1(id10.authUserId, 'Chips', true);
      const channelid8 = channelsCreateV1(id11.authUserId, 'Meat Pies', true);
      expect(
        channelsListallV1(id10.authUserId, id11.authUserId, id12.authUserId)
      ).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });
  });

  describe('Check the channelsListAll function when only 1 member in 1 channel', () => {
    test('channel is private', () => {
      clearV1();
      const id13 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id14 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id15 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const channelid9 = channelsCreateV1(id14.authUserId, 'Ice Cream', false);
      expect(
        channelsListallV1(id13.authUserId, id14.authUserId, id15.authUserId)
      ).toEqual({ channels: [{ channelId: 1, name: 'Ice Cream' }] });
    });

    test('channel is public', () => {
      clearV1();
      const id16 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id17 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const channelid10 = channelsCreateV1(id17.authUserId, 'Ice Cream', true);
      expect(channelsListallV1(id16.authUserId, id17.authUserId)).toEqual({
        channels: [{ channelId: 1, name: 'Ice Cream' }],
      });
    });
  });

  describe('Check the channelsListAll function when only 1 member in multiple channels', () => {
    test('All channels are private', () => {
      clearV1();
      const id1 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id2 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id3 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id4 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id5 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid1 = channelsCreateV1(id1.authUserId, 'Ice Cream', false);
      const channelid2 = channelsCreateV1(id1.authUserId, 'Chocolate', false);
      const channelid3 = channelsCreateV1(id1.authUserId, 'Chips', false);
      const channelid4 = channelsCreateV1(id1.authUserId, 'Meat Pies', false);
      expect(
        channelsListallV1(
          id1.authUserId,
          id2.authUserId,
          id3.authUserId,
          id4.authUserId,
          id5.authUserId
        )
      ).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });

    test('All channels are public', () => {
      clearV1();
      const id6 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id7 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id8 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id9 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id10 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid5 = channelsCreateV1(id7.authUserId, 'Ice Cream', true);
      const channelid6 = channelsCreateV1(id7.authUserId, 'Chocolate', true);
      const channelid7 = channelsCreateV1(id7.authUserId, 'Chips', true);
      const channelid8 = channelsCreateV1(id7.authUserId, 'Meat Pies', true);
      expect(
        channelsListallV1(
          id6.authUserId,
          id7.authUserId,
          id8.authUserId,
          id9.authUserId,
          id10.authUserId
        )
      ).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });

    test('Channels are a mix of private and public', () => {
      clearV1();
      authRegisterV1('kelly@gmail.com', 'fBrT45Pq9', 'Kelly', 'Brown');
      const id11 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id12 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      authRegisterV1('Peter@gmail.com', 'fBrT45Pq9', 'Peter', 'Smith');
      authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      channelsCreateV1(id12.authUserId, 'Ice Cream', false);
      channelsCreateV1(id12.authUserId, 'Chocolate', false);
      channelsCreateV1(id12.authUserId, 'Chips', true);
      channelsCreateV1(id12.authUserId, 'Meat Pies', true);
      expect(channelsListallV1(id11.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });
  });

  describe('Check the channelsListAll function when multiple members in 1 channel', () => {
    test('All channels are private', () => {
      clearV1();
      const id13 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id14 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id15 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      authRegisterV1('Peter@gmail.com', 'fBrT45Pq9', 'Peter', 'Smith');
      authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid9 = channelsCreateV1(id13.authUserId, 'Ice Cream', true);
      const channelid10 = channelsCreateV1(id15.authUserId, 'Chocolate', true);
      const channelid11 = channelsCreateV1(id14.authUserId, 'Chips', true);
      channelJoinV1(id15.authUserId, channelid9.channelId);
      channelJoinV1(id13.authUserId, channelid9.channelId);
      channelJoinV1(id14.authUserId, channelid9.channelId);
      channelJoinV1(id15.authUserId, channelid9.channelId);
      expect(channelsListallV1(id13.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
        ],
      });
    });

    test('All channels are public', () => {
      clearV1();
      const id16 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id17 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id18 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id19 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id20 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid12 = channelsCreateV1(id16.authUserId, 'Ice Cream', true);
      const channelid13 = channelsCreateV1(id18.authUserId, 'Chocolate', true);
      const channelid14 = channelsCreateV1(id17.authUserId, 'Chips', true);
      channelJoinV1(id18.authUserId, channelid12.channelId);
      channelJoinV1(id16.authUserId, channelid12.channelId);
      channelJoinV1(id17.authUserId, channelid12.channelId);
      channelJoinV1(id18.authUserId, channelid12.channelId);
      expect(channelsListallV1(id19.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
        ],
      });
    });

    test('Channels are a mix of private and public', () => {
      clearV1();
      const id21 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id22 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id23 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      authRegisterV1('Peter@gmail.com', 'fBrT45Pq9', 'Peter', 'Smith');
      authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid15 = channelsCreateV1(id21.authUserId, 'Ice Cream', false);
      const channelid16 = channelsCreateV1(id23.authUserId, 'Chocolate', true);
      const channelid17 = channelsCreateV1(id22.authUserId, 'Chips', false);
      channelJoinV1(id23.authUserId, channelid15.channelId);
      channelJoinV1(id21.authUserId, channelid15.channelId);
      channelJoinV1(id22.authUserId, channelid15.channelId);
      channelJoinV1(id23.authUserId, channelid15.channelId);
      expect(channelsListallV1(id22.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
        ],
      });
    });
  });

  describe('Check the channelsListAll function when there are multiple members in multiple channels', () => {
    test('All channels are private', () => {
      clearV1();
      const id24 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id25 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id26 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id27 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id28 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid18 = channelsCreateV1(id24.authUserId, 'Ice Cream', false);
      const channelid19 = channelsCreateV1(id25.authUserId, 'Chocolate', false);
      const channelid20 = channelsCreateV1(id26.authUserId, 'Chips', false);
      const channelid21 = channelsCreateV1(id27.authUserId, 'Meat Pies', false);
      channelJoinV1(id26.authUserId, channelid19.channelId);
      channelJoinV1(id24.authUserId, channelid19.channelId);
      channelJoinV1(id26.authUserId, channelid21.channelId);
      channelJoinV1(id24.authUserId, channelid20.channelId);
      channelJoinV1(id27.authUserId, channelid19.channelId);
      channelJoinV1(id24.authUserId, channelid21.channelId);
      channelJoinV1(id27.authUserId, channelid18.channelId);
      channelJoinV1(id25.authUserId, channelid18.channelId);
      expect(channelsListallV1(id25.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });

    test('All channels are public', () => {
      clearV1();
      const id29 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id30 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id31 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id32 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id33 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid22 = channelsCreateV1(id29.authUserId, 'Ice Cream', true);
      const channelid23 = channelsCreateV1(id30.authUserId, 'Chocolate', true);
      const channelid24 = channelsCreateV1(id31.authUserId, 'Chips', true);
      const channelid25 = channelsCreateV1(id33.authUserId, 'Meat Pies', true);
      channelJoinV1(id29.authUserId, channelid23.channelId);
      channelJoinV1(id29.authUserId, channelid23.channelId);
      channelJoinV1(id31.authUserId, channelid25.channelId);
      channelJoinV1(id29.authUserId, channelid24.channelId);
      channelJoinV1(id32.authUserId, channelid23.channelId);
      channelJoinV1(id29.authUserId, channelid25.channelId);
      channelJoinV1(id33.authUserId, channelid22.channelId);
      channelJoinV1(id30.authUserId, channelid22.channelId);
      expect(channelsListallV1(id31.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });

    test('Channels are a mix of private and public', () => {
      clearV1();
      const id34 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id35 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id36 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id37 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Sean',
        'Smith'
      );
      const id38 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid26 = channelsCreateV1(id37.authUserId, 'Ice Cream', false);
      const channelid27 = channelsCreateV1(id35.authUserId, 'Chocolate', true);
      const channelid28 = channelsCreateV1(id36.authUserId, 'Chips', true);
      const channelid29 = channelsCreateV1(id37.authUserId, 'Meat Pies', false);
      channelJoinV1(id36.authUserId, channelid27.channelId);
      channelJoinV1(id37.authUserId, channelid27.channelId);
      channelJoinV1(id36.authUserId, channelid29.channelId);
      channelJoinV1(id37.authUserId, channelid28.channelId);
      channelJoinV1(id37.authUserId, channelid27.channelId);
      channelJoinV1(id37.authUserId, channelid29.channelId);
      channelJoinV1(id37.authUserId, channelid26.channelId);
      channelJoinV1(id35.authUserId, channelid26.channelId);
      expect(channelsListallV1(id35.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });
  });

  describe('check the channelsListAll function when there is a mix of multiple and single user channels', () => {
    test('All channels are private', () => {
      clearV1();
      const id1 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id2 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id3 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id4 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id5 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid1 = channelsCreateV1(id1.authUserId, 'Ice Cream', false);
      const channelid2 = channelsCreateV1(id2.authUserId, 'Chocolate', false);
      const channelid3 = channelsCreateV1(id3.authUserId, 'Chips', false);
      const channelid4 = channelsCreateV1(id4.authUserId, 'Meat Pies', false);
      channelJoinV1(id3.authUserId, channelid2.channelId);
      channelJoinV1(id2.authUserId, channelid3.channelId);
      channelJoinV1(id3.authUserId, channelid4.channelId);
      channelJoinV1(id4.authUserId, channelid2.channelId);
      expect(channelsListallV1(id5.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });

    test('All channels are public', () => {
      clearV1();
      const id6 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id7 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id8 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id9 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id10 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid5 = channelsCreateV1(id6.authUserId, 'Ice Cream', true);
      const channelid6 = channelsCreateV1(id7.authUserId, 'Chocolate', true);
      const channelid7 = channelsCreateV1(id8.authUserId, 'Chips', true);
      const channelid8 = channelsCreateV1(id9.authUserId, 'Meat Pies', true);
      channelJoinV1(id8.authUserId, channelid6.channelId);
      channelJoinV1(id7.authUserId, channelid7.channelId);
      channelJoinV1(id8.authUserId, channelid8.channelId);
      channelJoinV1(id9.authUserId, channelid6.channelId);
      expect(channelsListallV1(id7.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });

    test('Channels are a mix of private and public', () => {
      clearV1();
      const id11 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id12 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id13 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id14 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id15 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid9 = channelsCreateV1(id11.authUserId, 'Ice Cream', true);
      const channelid10 = channelsCreateV1(id12.authUserId, 'Chocolate', false);
      const channelid11 = channelsCreateV1(id13.authUserId, 'Chips', false);
      const channelid12 = channelsCreateV1(id14.authUserId, 'Meat Pies', true);
      channelJoinV1(id13.authUserId, channelid10.channelId);
      channelJoinV1(id12.authUserId, channelid11.channelId);
      channelJoinV1(id13.authUserId, channelid12.channelId);
      channelJoinV1(id13.authUserId, channelid10.channelId);
      expect(channelsListallV1(id11.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });
  });

  describe('check the channelsListAll function after authUser has created a single/multiple channels', () => {
    test('creates a single channel', () => {
      clearV1();
      const id16 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id17 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id18 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id19 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id20 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid13 = channelsCreateV1(id16.authUserId, 'Ice Cream', true);
      const channelid14 = channelsCreateV1(id17.authUserId, 'Chocolate', false);
      const channelid15 = channelsCreateV1(id18.authUserId, 'Chips', false);
      const channelid16 = channelsCreateV1(id19.authUserId, 'Meat Pies', true);
      expect(channelsListallV1(id17.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });

    test('creates multiple channels', () => {
      clearV1();
      const id21 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id22 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id23 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id24 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id25 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid17 = channelsCreateV1(id23.authUserId, 'Ice Cream', true);
      const channelid18 = channelsCreateV1(id23.authUserId, 'Chocolate', false);
      const channelid19 = channelsCreateV1(id23.authUserId, 'Chips', false);
      const channelid20 = channelsCreateV1(id24.authUserId, 'Meat Pies', true);
      expect(channelsListallV1(id23.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });

    test('check when authUser has not created a channel', () => {
      clearV1();
      const id26 = authRegisterV1(
        'kelly@gmail.com',
        'fBrT45Pq9',
        'Kelly',
        'Brown'
      );
      const id27 = authRegisterV1(
        'lucky@gmail.com',
        'fBrT45Pq9',
        'Lucky',
        'Nelly'
      );
      const id28 = authRegisterV1(
        'JennyPatrick@gmail.com',
        'noOneIsGoing2GuessThis',
        'Jenny',
        'Patrick'
      );
      const id29 = authRegisterV1(
        'Peter@gmail.com',
        'fBrT45Pq9',
        'Peter',
        'Smith'
      );
      const id30 = authRegisterV1(
        'JohnSmith@gmail.com',
        'inventingNewPasswordsMakesMeCry',
        'John',
        'Smith'
      );
      const channelid21 = channelsCreateV1(id28.authUserId, 'Ice Cream', true);
      const channelid22 = channelsCreateV1(id28.authUserId, 'Chocolate', false);
      const channelid23 = channelsCreateV1(id28.authUserId, 'Chips', false);
      const channelid24 = channelsCreateV1(id29.authUserId, 'Meat Pies', true);
      expect(channelsListallV1(id27.authUserId)).toEqual({
        channels: [
          { channelId: 1, name: 'Ice Cream' },
          { channelId: 2, name: 'Chocolate' },
          { channelId: 3, name: 'Chips' },
          { channelId: 4, name: 'Meat Pies' },
        ],
      });
    });
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                channelsListV1                                           //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////

test('If userId is invalid', () => {
  clearV1();
  const array = channelsListV1('invaliduserId');
  expect(array).toMatchObject({ error: 'error' });
});

test('Printing out one public channel that the user is a part of', () => {
  clearV1();
  const Id1 = authRegisterV1(
    'Arindam@unsw.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
  const channelId1 = channelsCreateV1(uId.authUserId, 'testchannel', true);
  let array = channelsListV1(uId.authUserId);
  expect(array).toEqual({ channels: [{ channelId: 1, name: 'testchannel' }] });
});

test('Printing out one private channel that the user is a part of', () => {
  clearV1();
  const Id1 = authRegisterV1(
    'Arindam@unsw.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
  const channelId1 = channelsCreateV1(uId.authUserId, 'testchannel', false);
  let array = channelsListV1(uId.authUserId);
  expect(array).toEqual({ channels: [{ channelId: 1, name: 'testchannel' }] });
});

test('Printing out two public channels that the user is a part of', () => {
  clearV1();
  const Id1 = authRegisterV1(
    'Arindam@unsw.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
  const channelId1 = channelsCreateV1(uId.authUserId, 'testchannel', true);
  const channelId2 = channelsCreateV1(uId.authUserId, 'testchannel2', true);
  let array = channelsListV1(uId.authUserId);
  expect(array).toEqual({
    channels: [
      { channelId: 1, name: 'testchannel' },
      { channelId: 2, name: 'testchannel2' },
    ],
  });
});

test('Printing out two private channels that the user is a part of', () => {
  clearV1();
  const Id1 = authRegisterV1(
    'Arindam@unsw.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
  const channelId1 = channelsCreateV1(uId.authUserId, 'testchannel', true);
  const channelId2 = channelsCreateV1(uId.authUserId, 'testchannel2', true);
  let array = channelsListV1(uId.authUserId);
  expect(array).toEqual({
    channels: [
      { channelId: 1, name: 'testchannel' },
      { channelId: 2, name: 'testchannel2' },
    ],
  });
});

test('Printing out one private and one public channel that the user is a part of', () => {
  clearV1();
  const Id1 = authRegisterV1(
    'Arindam@unsw.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
  const channelId1 = channelsCreateV1(uId.authUserId, 'testchannel', false);
  const channelId2 = channelsCreateV1(uId.authUserId, 'testchannel2', true);
  let array = channelsListV1(uId.authUserId);
  expect(array).toEqual({
    channels: [
      { channelId: 1, name: 'testchannel' },
      { channelId: 2, name: 'testchannel2' },
    ],
  });
});

test('Printing out all the channels that the user is part of, with the exception of the other users channel', () => {
  clearV1();
  const Id1 = authRegisterV1(
    'Arindam@unsw.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
  const channelId1 = channelsCreateV1(uId.authUserId, 'testchannel', true);
  const channelId2 = channelsCreateV1(uId.authUserId, 'testchannel2', true);
  const Id2 = authRegisterV1(
    'Arindam@gmail.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId2 = authLoginV1('Arindam@gmail.edu.au', '234562');
  const channelId3 = channelsCreateV1(uId2.authUserId, 'testchannel3', true);
  let array = channelsListV1(uId.authUserId);
  expect(array).toEqual({
    channels: [
      { channelId: 1, name: 'testchannel' },
      { channelId: 2, name: 'testchannel2' },
    ],
  });
});

test('Printing out an empty array for no channels', () => {
  clearV1();
  const Id1 = authRegisterV1(
    'Arindam@unsw.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
  let array = channelsListV1(uId.authUserId);
  expect(array).toEqual({ channels: [] });
});

test('Printing out an empty array for private channels that the user is not part of', () => {
  clearV1();
  const Id1 = authRegisterV1(
    'Arindam@unsw.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId = authLoginV1('Arindam@unsw.edu.au', '234562');
  const Id2 = authRegisterV1(
    'Arindam@gmail.edu.au',
    '234562',
    'Arindam',
    'Mukherjee'
  );
  const uId2 = authLoginV1('Arindam@gmail.edu.au', '234562');
  const channelId1 = channelsCreateV1(uId2.authUserId, 'testchannel', false);
  const channelId2 = channelsCreateV1(uId2.authUserId, 'testchannel2', false);
  let array = channelsListV1(uId.authUserId);
  expect(array).toEqual({ channels: [] });
});
