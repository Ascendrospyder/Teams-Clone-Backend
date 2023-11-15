import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;

describe('HTTP Testing: Testing shareMessageV1 route', () => {
  test('Testing Unauthorised User', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const text = 'bananas and apples and oranges';
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const idc2 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'ice cream',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel2 = JSON.parse(idc2.getBody() as any);
    const msgId1 = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channel1.channelId,
        message: text,
      },
      headers: {
        token: user1.token,
      },
    });
    const msg = JSON.parse(msgId1.getBody() as any);
    const res = request('POST', `${url}:${port}/message/share/v1`, {
      json: {
        ogMessageId: msg.messageId,
        channelId: channel2.channelId,
        dmId: -1,
        message: '',
      },
      headers: {
        token: '$invalidToken$',
      }
    });
    expect(res.statusCode).toBe(403);
  });
  test('Testing When ChannelId and DMId Are Invalid', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const text = 'bananas and apples and oranges';
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const msgId1 = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channel1.channelId,
        message: text,
      },
      headers: {
        token: user1.token,
      },
    });
    const msg = JSON.parse(msgId1.getBody() as any);
    const res = request('POST', `${url}:${port}/message/share/v1`, {
      json: {
        ogMessageId: msg.messageId,
        channelId: -5,
        dmId: -7,
        message: '',
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toBe(400);
  });
  test('Checking There Is Only 1 Destination (Either A Channel OR DM)', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'James',
        nameLast: 'Brown',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const text = 'bananas and apples and oranges';
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const dm1 = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [user2.authUserId],
      },
      headers: {
        token: user1.token,
      },
    });
    const dm = JSON.parse(dm1.getBody() as any);
    const msgId1 = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channel1.channelId,
        message: text,
      },
      headers: {
        token: user1.token,
      },
    });
    const msg = JSON.parse(msgId1.getBody() as any);
    const res = request('POST', `${url}:${port}/message/share/v1`, {
      json: {
        ogMessageId: msg.messageId,
        channelId: channel1.channelId,
        dmId: dm.dmId,
        message: '',
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toBe(400);
  });
  test('Authuser Not Member Of Channel Where The Message Originates From', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'James',
        nameLast: 'Brown',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const text = 'bananas and apples and oranges';
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const idc2 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'ice cream',
        isPublic: true,
      },
      headers: {
        token: user2.token,
      },
    });
    const channel2 = JSON.parse(idc2.getBody() as any);
    const msgId1 = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channel1.channelId,
        message: text,
      },
      headers: {
        token: user1.token,
      },
    });
    const msg = JSON.parse(msgId1.getBody() as any);
    const res = request('POST', `${url}:${port}/message/share/v1`, {
      json: {
        ogMessageId: msg.messageId,
        channelId: channel2.channelId,
        dmId: -1,
        message: '',
      },
      headers: {
        token: user2.token,
      }
    });
    expect(res.statusCode).toBe(400);
  });
  test('Authuser Not Member Of DM Where The Message Originates From', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'James',
        nameLast: 'Brown',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'harry@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Harry',
        nameLast: 'Brown',
      },
    });
    const user3 = JSON.parse(id3.getBody() as any);
    const text = 'bananas and apples and oranges';
    const dm1 = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [user2.authUserId],
      },
      headers: {
        token: user1.token,
      },
    });
    const dm1Data = JSON.parse(dm1.getBody() as any);
    const dm2 = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [user1.authUserId],
      },
      headers: {
        token: user2.token,
      },
    });
    const dm2Data = JSON.parse(dm2.getBody() as any);
    const dmMsgId1 = request('POST', `${url}:${port}/message/senddm/v2`, {
      json: {
        dmId: dm1Data.dmId,
        message: text,
      },
      headers: {
        token: user1.token,
      },
    });
    const dmMsg = JSON.parse(dmMsgId1.getBody() as any);
    const res = request('POST', `${url}:${port}/message/share/v1`, {
      json: {
        ogMessageId: dmMsg.messageId,
        channelId: -1,
        dmId: dm2Data.dmId,
        message: '',
      },
      headers: {
        token: user3.token,
      }
    });
    expect(res.statusCode).toBe(400);
  });
  test('AuthUser is not a member of the Dm that the message is being shared with', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'James',
        nameLast: 'Brown',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const id3 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'harry@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Harry',
        nameLast: 'Brown',
      },
    });
    const user3 = JSON.parse(id3.getBody() as any);
    const text = 'bananas and apples and oranges';
    const dm1 = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [user2.authUserId],
      },
      headers: {
        token: user1.token,
      },
    });
    const dm1Data = JSON.parse(dm1.getBody() as any);
    const dm2 = request('POST', `${url}:${port}/dm/create/v2`, {
      json: {
        uIds: [user3.authUserId],
      },
      headers: {
        token: user2.token,
      },
    });
    const dm2Data = JSON.parse(dm2.getBody() as any);
    const dmMsgId1 = request('POST', `${url}:${port}/message/senddm/v2`, {
      json: {
        dmId: dm2Data.dmId,
        message: text,
      },
      headers: {
        token: user2.token,
      },
    });
    const dmMsg = JSON.parse(dmMsgId1.getBody() as any);
    const res = request('POST', `${url}:${port}/message/share/v1`, {
      json: {
        ogMessageId: dmMsg.messageId,
        channelId: -1,
        dmId: dm1Data.dmId,
        message: '',
      },
      headers: {
        token: user3.token,
      }
    });
    expect(res.statusCode).toBe(403);
  });
  test('AuthUser is not a member of the channel that the message is being shared with', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const id2 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'james@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'James',
        nameLast: 'Brown',
      },
    });
    const user2 = JSON.parse(id2.getBody() as any);
    const text = 'bananas and apples and oranges';
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const idc2 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'ice cream',
        isPublic: true,
      },
      headers: {
        token: user2.token,
      },
    });
    const channel2 = JSON.parse(idc2.getBody() as any);
    const msgId1 = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channel1.channelId,
        message: text,
      },
      headers: {
        token: user1.token,
      },
    });
    const msg = JSON.parse(msgId1.getBody() as any);
    const res = request('POST', `${url}:${port}/message/share/v1`, {
      json: {
        ogMessageId: msg.messageId,
        channelId: channel2.channelId,
        dmId: -1,
        message: '',
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toBe(403);
  });
  test('Check Optional Message Greater Than 1000 Characters With valid ChannelId/DmId Combination', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const idc2 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'ice cream',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel2 = JSON.parse(idc2.getBody() as any);
    const msgId1 = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channel1.channelId,
        message: 'something about something',
      },
      headers: {
        token: user1.token,
      },
    });
    const msg = JSON.parse(msgId1.getBody() as any);
    const text = 'B&ywH4&qppmPv817TG@gdPY2xt&ta4@$eOpWOD+D9S=XB9HRaJ*1&XR7wfd$J%nVUsZ+dNg=XoaH=SedBDXPNwC+O+wbRxUE0x1t8kPC2MPF@Eov0AxWNoCkEwh2VcH!Ovw*pT1B75cUf=3guU6H98MhXy+kGgw#Ft2Cq3tEU4%U%V64qFEM3$KxYQ@Oy!Vp9wD$2MW42ww50T!UX7VZONZ+NuMDvv+TCBJM3!PWQk%uvyQjku6pzYc$f&%D93+wjasvt*!PGtcSv50SzEc&tOh3HU*yoH9rWh9fJVFsTB06s%pd===$zrhhOfq$*pJ6+15cJcjN+w7UdvyF2%8gejzRwZ6mTDg%zwTCgG+yrxOh+hEsE!hJ6V4@RR+7hwdUxWCP=U=xRpZ$eq$*T73Mfjc#6k#Bc1%fkXC*KU@Rgjfd6!uMdnQ9p!BreXy9cAk2fE5Ybe+m#X2RZPnp2nKZNco1QR6Gv1TQRzG@fb!JFyNYo$p*&1vPKY4bxReWmJjq815#M&qdrAcf2FGOw@4+XZO0t43ZZaG*%EK1TN+JP5f7!w6!B#dQh5AB1fjZkew59BpMgq+VdPMmkgah3d&D5jrOT$#*98d2@qycAoVzWUYWGDP3PER9jdSb2erooqU#rUkGEwmzhPBnjpf!&=xRGthOkxkKs70Nt#bQY+n8c6VgC6$Q!ds1VEXXxCEs=u*h9tOYVr9sgzckGYD5p@Ao+ycNFgtR+a%NO4A#!KQRH3Cx0BXHs+GQYM+GvfOBvNx2WNd3yaNRWWT$&ncx+47uAK$*@aXBs5GV@2M6f4npwhpA=Jt8rk$C86+7#Ns&hMyQ$aby+NhvJ!kVZ0efEHJoWm0C0SNjmO#SGTt@O&qFbEqT+u$Z7Ky0+tUfm!JD3jXXq&xyw!&CzugkN$A137kMjJ7aEOMdnEwvA1N!ve%9#pdzPBHjUPV6nO2EFcS7mR5YT$MKduXnEPbdty2g+RJW6q=YB5m6BPa&a0kQEs9OQ$aK@tR&E';
    const res = request('POST', `${url}:${port}/message/share/v1`, {
      json: {
        ogMessageId: msg.messageId,
        channelId: channel2.channelId,
        dmId: -1,
        message: text,
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toBe(400);
  });
  test('check with a valid optional message with valid channelId/dmId combination', () => {
    request('DELETE', `${url}:${port}/clear/v1`, { qs: {} });
    const id1 = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
        email: 'kelly@gmail.com',
        password: 'KBrT45Pq9',
        nameFirst: 'Kelly',
        nameLast: 'Brown',
      },
    });
    const user1 = JSON.parse(id1.getBody() as any);
    const idc1 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'Pop Corn',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel1 = JSON.parse(idc1.getBody() as any);
    const idc2 = request('POST', `${url}:${port}/channels/create/v3`, {
      json: {
        name: 'ice cream',
        isPublic: true,
      },
      headers: {
        token: user1.token,
      },
    });
    const channel2 = JSON.parse(idc2.getBody() as any);
    const msgId1 = request('POST', `${url}:${port}/message/send/v2`, {
      json: {
        channelId: channel1.channelId,
        message: 'something about something',
      },
      headers: {
        token: user1.token,
      },
    });
    const msg = JSON.parse(msgId1.getBody() as any);
    const text = 'Last test!';
    const res = request('POST', `${url}:${port}/message/share/v1`, {
      json: {
        ogMessageId: msg.messageId,
        channelId: channel2.channelId,
        dmId: -1,
        message: text,
      },
      headers: {
        token: user1.token,
      }
    });
    expect(res.statusCode).toBe(200);
  });
});
