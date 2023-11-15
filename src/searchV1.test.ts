import { authRegisterV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV1 } from './channels';
// import { dmCreate } from './dm';
import { searchV1 } from './searchV1';
import { messageSend } from './message';
import HTTPError from 'http-errors';

describe('Testing SearchV1 function', () => {
  test('Testing When Invalid AuthUser', () => {
    clearV1();
    try {
      searchV1('$invalidToken$', 'notImportant');
    } catch (err) {
      expect(err).toEqual(HTTPError(403, '403: Unauthorized User!'));
    }
  });
  test('Testing Query String Invalid', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    try {
      searchV1(id1.token, '');
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Query of insufficient length!'));
    }
  });
  test('Testing A Query > 1000 characters', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const text = 'B&ywH4&qppmPv817TG@gdPY2xt&ta4@$eOpWOD+D9S=XB9HRaJ*1&XR7wfd$J%nVUsZ+dNg=XoaH=SedBDXPNwC+O+wbRxUE0x1t8kPC2MPF@Eov0AxWNoCkEwh2VcH!Ovw*pT1B75cUf=3guU6H98MhXy+kGgw#Ft2Cq3tEU4%U%V64qFEM3$KxYQ@Oy!Vp9wD$2MW42ww50T!UX7VZONZ+NuMDvv+TCBJM3!PWQk%uvyQjku6pzYc$f&%D93+wjasvt*!PGtcSv50SzEc&tOh3HU*yoH9rWh9fJVFsTB06s%pd===$zrhhOfq$*pJ6+15cJcjN+w7UdvyF2%8gejzRwZ6mTDg%zwTCgG+yrxOh+hEsE!hJ6V4@RR+7hwdUxWCP=U=xRpZ$eq$*T73Mfjc#6k#Bc1%fkXC*KU@Rgjfd6!uMdnQ9p!BreXy9cAk2fE5Ybe+m#X2RZPnp2nKZNco1QR6Gv1TQRzG@fb!JFyNYo$p*&1vPKY4bxReWmJjq815#M&qdrAcf2FGOw@4+XZO0t43ZZaG*%EK1TN+JP5f7!w6!B#dQh5AB1fjZkew59BpMgq+VdPMmkgah3d&D5jrOT$#*98d2@qycAoVzWUYWGDP3PER9jdSb2erooqU#rUkGEwmzhPBnjpf!&=xRGthOkxkKs70Nt#bQY+n8c6VgC6$Q!ds1VEXXxCEs=u*h9tOYVr9sgzckGYD5p@Ao+ycNFgtR+a%NO4A#!KQRH3Cx0BXHs+GQYM+GvfOBvNx2WNd3yaNRWWT$&ncx+47uAK$*@aXBs5GV@2M6f4npwhpA=Jt8rk$C86+7#Ns&hMyQ$aby+NhvJ!kVZ0efEHJoWm0C0SNjmO#SGTt@O&qFbEqT+u$Z7Ky0+tUfm!JD3jXXq&xyw!&CzugkN$A137kMjJ7aEOMdnEwvA1N!ve%9#pdzPBHjUPV6nO2EFcS7mR5YT$MKduXnEPbdty2g+RJW6q=YB5m6BPa&a0kQEs9OQ$aK@tR&E';
    try {
      searchV1(id1.token, text);
    } catch (err) {
      expect(err).toEqual(HTTPError(400, '400: Query maximum limit is 1000 characters!'));
    }
  });
  test('Testing Valid Query', () => {
    clearV1();
    const id1 = authRegisterV1(
      'james@gmail.com',
      'fBrmTP45Pq9',
      'James',
      'Peters'
    );
    const idc = channelsCreateV1(id1.token, 'ice cream', true);
    const text = 'bananas and apples and oranges';
    messageSend(id1.token, idc.channelId, text);
    expect(searchV1(id1.token, 'apples')).toEqual({
      messages:
      [
        {
          channelId: 1,
          dmId: null,
          isPinned: false,
          message: 'bananas and apples and oranges',
          messageId: 1,
          reacts: [{
            reactId: 1,
            uIds: [],
          }],
          sharedMessageId: -1,
          timeSent: ~~(Date.now() / 1000),
          uId: 1
        }
      ]
    });
  });
});
