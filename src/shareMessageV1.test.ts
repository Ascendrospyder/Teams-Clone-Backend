// tests
// unauthorised user  -- done
// invalid channelId and invalid dmId -- done
// channelId !== -1 and dmId !== -1 || channelId === dmId -- done
// valid channelId and dm combination: need to create message, and create channel and dm
//   1. original message dmId === -1 or null (looking at channels) && authuser not member of channel where the message originates from <-- done
//   2. original message channelId === -1 or null (looking at dm's now) && authuser not a member of channel where the message originates from ** done
// valid channelId authUser is not a member of the channel that the message is being shared with <-- done
// valid dmId authUser is not a member of the dm that the message is being shared with <-- done
// check optional message greater than 1000 characters with valid channelId/dmId combination done
// check with a valid optional message with valid channelId/dmId combination

import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV1 } from './channels';
import { dmCreate, sendDm } from './dm';
import { messageSend, shareMessageV1 } from './message';
import HTTPError from 'http-errors';

describe('Testing shareMessageV1 function', () => {
  test('Testing When Invalid AuthUser', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    const idm = messageSend(id1.token, idc.channelId, 'Hello there!');
    try {
      shareMessageV1('$invalidToken$', idm.messageId, idc.channelId, -1, '');
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
  });
  test('Testing When ChannelId and DMId Are Invalid', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    const idm = messageSend(id1.token, idc.channelId, 'Hello there!');
    try {
      shareMessageV1(id1.token, idm.messageId, -5, -7, '');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Invalid channelId and dmId!'));
    }
  });
  test('Checking There Is Only 1 Destination (Either A Channel OR DM)', () => {
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
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    const idDm = dmCreate(id1.token, [id2.authUserId]);
    const idm = messageSend(id1.token, idc.channelId, 'Hello there!');
    try {
      shareMessageV1(id1.token, idm.messageId, idc.channelId, idDm.dmId, '');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: channelId or dmId is invalid!'));
    }
  });
  test('Authuser Not Member Of Channel Where The Message Originates From', () => {
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
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    const idm = messageSend(id1.token, idc.channelId, 'Hello there!');
    dmCreate(id1.token, [id2.authUserId]);
    try {
      shareMessageV1(id2.token, idm.messageId, idc.channelId, -1, '');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Not a valid message within a channel that user has joined!'));
    }
  });
  test('Authuser Not Member Of DM Where The Message Originates From', () => {
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
    const id3 = authRegisterV1(
      'jacko@gmail.com',
      'fBrmTP45Pq9',
      'Jack',
      'Peters'
    );
    const idDm = dmCreate(id1.token, [id2.authUserId]);
    const idDmMsg = sendDm(id1.token, idDm.dmId, 'My Oh My!');
    try {
      shareMessageV1(id3.token, idDmMsg.messageId, -1, idDm.dmId, '');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Not a valid message within a DM that user has joined!'));
    }
  });
  test('AuthUser is not a member of the channel that the message is being shared with', () => {
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
    const idc1 = channelsCreateV1(id1.token, 'ice cream', true);
    const idc2 = channelsCreateV1(id2.token, 'Cars', true);
    const idm = messageSend(id1.token, idc1.channelId, 'Hello there!');
    try {
      shareMessageV1(id1.token, idm.messageId, idc2.channelId, -1, '');
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: User not a member of Channel that the message will be shared with!'));
    }
  });
  test('AuthUser is not a member of the Dm that the message is being shared with', () => {
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
    const id3 = authRegisterV1(
      'jacko@gmail.com',
      'fBrmTP45Pq9',
      'Jack',
      'Peters'
    );
    const idc1 = channelsCreateV1(id2.token, 'ice cream', true);
    const idDm = dmCreate(id3.token, [id1.authUserId]);
    const idm = messageSend(id2.token, idc1.channelId, 'Hello there!');
    try {
      shareMessageV1(id2.token, idm.messageId, -1, idDm.dmId, '');
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: User not a member of Dm that the message will be shared with!'));
    }
  });
  test('Check Optional Message Greater Than 1000 Characters With valid ChannelId/DmId Combination', () => {
    clearV1();
    authRegisterV1(
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
    const text = 'B&ywH4&qppmPv817TG@gdPY2xt&ta4@$eOpWOD+D9S=XB9HRaJ*1&XR7wfd$J%nVUsZ+dNg=XoaH=SedBDXPNwC+O+wbRxUE0x1t8kPC2MPF@Eov0AxWNoCkEwh2VcH!Ovw*pT1B75cUf=3guU6H98MhXy+kGgw#Ft2Cq3tEU4%U%V64qFEM3$KxYQ@Oy!Vp9wD$2MW42ww50T!UX7VZONZ+NuMDvv+TCBJM3!PWQk%uvyQjku6pzYc$f&%D93+wjasvt*!PGtcSv50SzEc&tOh3HU*yoH9rWh9fJVFsTB06s%pd===$zrhhOfq$*pJ6+15cJcjN+w7UdvyF2%8gejzRwZ6mTDg%zwTCgG+yrxOh+hEsE!hJ6V4@RR+7hwdUxWCP=U=xRpZ$eq$*T73Mfjc#6k#Bc1%fkXC*KU@Rgjfd6!uMdnQ9p!BreXy9cAk2fE5Ybe+m#X2RZPnp2nKZNco1QR6Gv1TQRzG@fb!JFyNYo$p*&1vPKY4bxReWmJjq815#M&qdrAcf2FGOw@4+XZO0t43ZZaG*%EK1TN+JP5f7!w6!B#dQh5AB1fjZkew59BpMgq+VdPMmkgah3d&D5jrOT$#*98d2@qycAoVzWUYWGDP3PER9jdSb2erooqU#rUkGEwmzhPBnjpf!&=xRGthOkxkKs70Nt#bQY+n8c6VgC6$Q!ds1VEXXxCEs=u*h9tOYVr9sgzckGYD5p@Ao+ycNFgtR+a%NO4A#!KQRH3Cx0BXHs+GQYM+GvfOBvNx2WNd3yaNRWWT$&ncx+47uAK$*@aXBs5GV@2M6f4npwhpA=Jt8rk$C86+7#Ns&hMyQ$aby+NhvJ!kVZ0efEHJoWm0C0SNjmO#SGTt@O&qFbEqT+u$Z7Ky0+tUfm!JD3jXXq&xyw!&CzugkN$A137kMjJ7aEOMdnEwvA1N!ve%9#pdzPBHjUPV6nO2EFcS7mR5YT$MKduXnEPbdty2g+RJW6q=YB5m6BPa&a0kQEs9OQ$aK@tR&E';
    const idc1 = channelsCreateV1(id2.token, 'ice cream', true);
    const idm = messageSend(id2.token, idc1.channelId, 'Hello there!');
    try {
      shareMessageV1(id2.token, idm.messageId, idc1.channelId, -1, text);
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Length of message is greater than 1000 characters!'));
    }
  });
  test('check with a valid optional message with valid channelId/dmId combination', () => {
    clearV1();
    authRegisterV1(
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
    const idc1 = channelsCreateV1(id2.token, 'ice cream', true);
    const idc2 = channelsCreateV1(id2.token, 'Cars', true);
    const idm = messageSend(id2.token, idc1.channelId, 'Hello there!');
    expect(shareMessageV1(id2.token, idm.messageId, idc2.channelId, -1, 'Why hello there back!')).toEqual({ sharedMessageId: 0 });
  });
});
