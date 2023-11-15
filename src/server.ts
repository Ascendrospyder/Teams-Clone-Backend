import express, { Request, Response } from 'express';
import fs from 'fs';
import { getData } from './dataStore';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import { clearV1 } from './other';
import { userProfileV1, usersAllV1, userProfileSethandleV1, userProfileSetNameV1, userProfileSetEmailV1, usersStatsV1, userStatsV1 } from './users';
import { authRegisterV1, authLoginV1, authPasswordRequest, authPasswordReset } from './auth';
import { channelMessagesV1, channelDetailsV1, channelJoinV1, channelInviteV1, channelLeaveV1, channelRemoveOwnerV1 } from './channel';
import { channelsCreateV1, channelsListV1, channelsListallV1 } from './channels';
import { messageSend, messageRemove, messageEdit, messageReactV1, messageUnreactV1, messagePinV1, messageUnpinV1, messageSendLater, messageSendLaterDm, shareMessageV1 } from './message';
import { dmCreate, dmLeaveV1, dmMessages, sendDm, dmRemoveV1, dmList, dmDetails } from './dm';
import { channelAddOwnerV1 } from './channel';
import { authLogoutV1 } from './authLogoutV1';
import { searchV1 } from './searchV1';
import { userPermissionRemoveV1, userPermissionChangeV1 } from './admin';
// import { checkHashedToken } from './helper';
import { getNotificationsV1 } from './getNotifications';
import { standupStart, standupActive, standupSend } from './standup';
import errorHandler from 'middleware-http-errors';

// Set up web app, use JSON
const app = express();
app.use(express.json());
// Use middleware that allows for access from other domains
app.use(cors());
app.use(express.static('public'));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req, res, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// clear/v1    <-- done
app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
});

// user/profile/v3    <--- done
app.get('/user/profile/v3', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const uId = req.query.uId as any;
  res.json(userProfileV1(token, (parseInt(uId))));
});

app.post('/auth/register/v3', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV1(email, password, nameFirst, nameLast));
});

// auth/login/v3
app.post('/auth/login/v3', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(authLoginV1(email, password));
});

// channel/messages/v3  <--- done
app.get('/channel/messages/v3', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const channelId: any = req.query.channelId;
  const start: any = req.query.start;
  res.json(channelMessagesV1(token, parseInt(channelId), parseInt(start)));
});

// channels/create/v3 <-- done
app.post('/channels/create/v3', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const { name, isPublic } = req.body;
  res.json(channelsCreateV1(token, name, isPublic));
});

// channel/details/v3   <--- done
app.get('/channel/details/v3', (req: Request, res: Response) => {
  const token: any = req.headers.token;
  const channelId: any = req.query.channelId;
  res.json(channelDetailsV1(token, parseInt(channelId)));
});

// channel/join/v3  <-- done
app.post('/channel/join/v3', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const channelId = req.body.channelId;
  res.json(channelJoinV1(token, parseInt(channelId)));
});

// channels/list/v3 <-- done
app.get('/channels/list/v3', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  res.json(channelsListV1(token));
});

// channels/listall/v3   <---- done
app.get('/channels/listall/v3', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  res.json(channelsListallV1(token));
});

// channel/invite/v3   <--- done
app.post('/channel/invite/v3', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const { channelId, uId } = req.body as any;
  res.json(channelInviteV1(token, parseInt(channelId), parseInt(uId)));
});

// message/send/v2
app.post('/message/send/v2', (req: Request, res: Response) => {
  const { channelId, message } = req.body as any;
  res.json(messageSend(req.header('token'), parseInt(channelId), message));
});

// message/remove/v2
app.delete('/message/remove/v2', (req: Request, res: Response) => {
  const { messageId } = req.query as any;
  res.json(messageRemove(req.header('token'), parseInt(messageId)));
});

// users/all/v2     <----- done
app.get('/users/all/v2', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  res.json(usersAllV1(token));
});

// user/profile/setname/v2 <-- done
app.put('/user/profile/setname/v2', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const { nameFirst, nameLast } = req.body as any;
  res.json(userProfileSetNameV1(token, nameFirst, nameLast));
});

// user/profile/setemail/v2  <---- done
app.put('/user/profile/setemail/v2', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const email = req.body.email as any;
  res.json(userProfileSetEmailV1(token, email));
});

// user/profile/sethandle/v2   <------- done
app.put('/user/profile/sethandle/v2', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const handleStr = req.body.handleStr as any;
  res.json(userProfileSethandleV1(token, handleStr));
});

// channel/leave/v2  <--- done
app.post('/channel/leave/v2', (req: Request, res: Response) => {
  const channelId = req.body.channelId as any;
  res.json(channelLeaveV1(req.header('token'), parseInt(channelId)));
});

// message/edit/v2
app.put('/message/edit/v2', (req: Request, res: Response) => {
  const { messageId, message } = req.body as any;
  res.json(messageEdit(req.header('token'), parseInt(messageId), message));
});

// channel/addowner/v2   <-- done
app.post('/channel/addowner/v2', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const channelId = req.body.channelId as any;
  const uId = req.body.uId as any;
  res.json(channelAddOwnerV1(token, parseInt(channelId), parseInt(uId)));
});

// channel/removeowner/v2   < -- done
app.post('/channel/removeowner/v2', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const channelId = req.body.channelId as any;
  const uId = req.body.uId as any;
  res.json(channelRemoveOwnerV1(token, parseInt(channelId), parseInt(uId)));
});

// dm/create/v2
app.post('/dm/create/v2', (req: Request, res: Response) => {
  const { uIds } = req.body as any;
  res.json(dmCreate(req.header('token'), uIds));
});

// dm/leave/v2
app.post('/dm/leave/v2', (req: Request, res: Response) => {
  const { dmId } = req.body;
  res.json(dmLeaveV1(req.header('token'), parseInt(dmId)));
});

// dm/remove/v2
app.delete('/dm/remove/v2', (req: Request, res: Response) => {
  const { dmId } = req.query as any;
  res.json(dmRemoveV1(req.header('token'), parseInt(dmId)));
});

// message/senddm/v2
app.post('/message/senddm/v2', (req: Request, res: Response) => {
  const { dmId, message } = req.body as any;
  res.json(sendDm(req.header('token'), parseInt(dmId), message));
});

// dm/messages/v2
app.get('/dm/messages/v2', (req: Request, res: Response) => {
  const { dmId, start } = req.query as any;
  res.json(dmMessages(req.header('token'), parseInt(dmId), parseInt(start)));
});

// dm/list/v2
app.get('/dm/list/v2', (req: Request, res: Response) => {
  res.json(dmList(req.header('token')));
});

// dm/details/v2
app.get('/dm/details/v2', (req: Request, res: Response) => {
  const { dmId } = req.query as any;
  res.json(dmDetails(req.header('token'), parseInt(dmId)));
});

// auth/logout/v2  <-- done
app.post('/auth/logout/v2', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  res.json(authLogoutV1(token));
});

// standup/start/v1
app.post('/standup/start/v1', (req: Request, res: Response) => {
  const { channelId, length } = req.body as any;
  res.json(standupStart(req.header('token'), parseInt(channelId), parseInt(length)));
});

app.post('/message/react/v1', (req: Request, res: Response) => {
  const { messageId, reactId } = req.body as any;
  res.json(messageReactV1(req.header('token'), parseInt(messageId), parseInt(reactId)));
});

app.post('/message/unreact/v1', (req: Request, res: Response) => {
  const { messageId, reactId } = req.body as any;
  res.json(messageUnreactV1(req.header('token'), parseInt(messageId), parseInt(reactId)));
});

// standup/active/v1
app.get('/standup/active/v1', (req: Request, res: Response) => {
  const { channelId } = req.query as any;
  res.json(standupActive(req.header('token'), parseInt(channelId)));
});

app.post('/message/pin/v1', (req: Request, res: Response) => {
  const { messageId } = req.body as any;
  res.json(messagePinV1(req.header('token'), parseInt(messageId)));
});

app.post('/message/unpin/v1', (req: Request, res: Response) => {
  const { messageId } = req.body as any;
  res.json(messageUnpinV1(req.header('token'), parseInt(messageId)));
});

// standup/send/v1
app.post('/standup/send/v1', (req: Request, res: Response) => {
  const { channelId, message } = req.body as any;
  res.json(standupSend(req.header('token'), parseInt(channelId), message));
});

// message/sendlater/v1
app.post('/message/sendlater/v1', (req: Request, res: Response) => {
  const { channelId, message, timesent } = req.body as any;
  res.json(messageSendLater(req.header('token'), parseInt(channelId), message, parseInt(timesent)));
});

// message/sendlaterdm/v1
app.post('/message/sendlaterdm/v1', (req: Request, res: Response) => {
  const { dmId, message, timesent } = req.body as any;
  res.json(messageSendLaterDm(req.header('token'), parseInt(dmId), message, parseInt(timesent)));
});

// users/stats/v1
app.get('/users/stats/v1', (req: Request, res: Response) => {
  res.json(usersStatsV1());
});

// user/profile/uploadphoto/v1
// app.post('/user/profile/uploadphoto/v1', (req: Request, res: Response) => {
//   const { imgUrl, xStart, yStart, xEnd, yEnd } = req.body as any;
//   res.json(uploadUserPhotoV1(req.header('token'), imgUrl, parseInt(xStart), parseInt(yStart), parseInt(xEnd), parseInt(yEnd)));
// });

// search/v1
app.get('/search/v1', (req: Request, res: Response) => {
  const { queryStr } = req.query as any;
  res.json(searchV1(req.header('token'), queryStr));
});

// message/share/v1
app.post('/message/share/v1', (req: Request, res: Response) => {
  const { ogMessageId, channelId, dmId, message } = req.body as any;
  res.json(shareMessageV1(req.header('token'), ogMessageId, parseInt(channelId), parseInt(dmId), message));
});

// notifications/get/v1  <-- uncomment the lines below when I copy notifications over
app.get('/notifications/get/v1', (req: Request, res: Response) => {
  res.json(getNotificationsV1(req.header('token')));
});

app.get('/user/stats/v1', (req: Request, res: Response) => {
  res.json(userStatsV1(req.header('token')));
});
// auth/passwordreset/request/v1
app.post('/auth/passwordreset/request/v1', (req: Request, res: Response) => {
  const { email } = req.body as any;
  res.json(authPasswordRequest(email));
});

// admin/user/remove/v1
app.delete('/admin/user/remove/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const uId = req.query.uId as any;
  res.json(userPermissionRemoveV1(token, parseInt(uId)));
});

// admin/userpermission/change/v1
app.post('/admin/userpermission/change/v1', (req: Request, res: Response) => {
  const token = req.headers.token as any;
  const permissionId = req.body.permissionId as any;
  const uId = req.body.uId as any;
  res.json(userPermissionChangeV1(token, parseInt(uId), parseInt(permissionId)));
});

// auth/passwordreset/request/v1
app.post('/auth/passwordreset/reset/v1', (req: Request, res: Response) => {
  const { resetCode, newPassword } = req.body as any;
  res.json(authPasswordReset(resetCode, newPassword));
});

// for logging errors
app.use(morgan('dev'));

// handles errors nicely
app.use(errorHandler());

// Reads saved data from file data.json and restores to dataStore
const data = getData();
const allFiles = require('fs').readdirSync('src/');
for (const filename of allFiles) {
  if (filename === 'data.json') {
    const storedData = fs.readFileSync('src/data.json', { flag: 'r' });
    const parsedData = JSON.parse(String(storedData));
    for (const user of parsedData.users) {
      data.users.push(user);
    }
    for (const channel of parsedData.channels) {
      data.channels.push(channel);
    }
    for (const message of parsedData.messages) {
      data.messages.push(message);
    }
    for (const dm of parsedData.dms) {
      data.dms.push(dm);
    }
  }
}

// start server
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${process.env.PORT || config.port}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
