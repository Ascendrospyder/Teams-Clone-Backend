import {authRegisterV1, authLoginV1} from './auth'
import {clearV1} from './other'
import {messagePush} from './helper'
import {channelMessagesV1, channelInviteV1, channelDetailsV1,channelJoinV1} from './channel'
import {channelsCreateV1} from './channels';
import { userProfileV1 } from './users';

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                channelJoinV1                                            //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
describe("channelJoinV1", () => {
  test("If we join an invalid channel", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const idc1 = channelsCreateV1(2, "Chocolate", true);
    expect(channelJoinV1(id1.authUserId, idc1.channelId)).toMatchObject({ error: "error" });
  });

  test("testing if it successfully joins a public channel", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const id2 = authRegisterV1(
      "JennyPatrick@gmail.com",
      "noOneIsGoing2GuessThis",
      "Jenny",
      "Patrick"
    );
    const idc1 = channelsCreateV1(id2.authUserId, "Ice Cream", true);
    channelJoinV1(id1.authUserId, idc1.channelId);
    expect(channelDetailsV1(id1.authUserId, idc1.channelId)).toMatchObject({
      name: "Ice Cream",
      isPublic: true,
      allMembers: [userProfileV1(id1.authUserId, id1.authUserId), userProfileV1(id2.authUserId, id2.authUserId)],
      ownerMembers: [userProfileV1(id2.authUserId, id2.authUserId)],
    });
  });

  test("user is already active in the channel", () => {
    clearV1();
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const id2 = authRegisterV1(
      "JennyPatrick@gmail.com",
      "noOneIsGoing2GuessThis",
      "Jenny",
      "Patrick"
    );
    const id3 = authRegisterV1(
      "james@gmail.com",
      "fBrmTP45Pq9",
      "James",
      "Peters"
    );
    const idc1 = channelsCreateV1(1, "Ice Cream", false);
    expect().toEqual();
  });

  test("channelId refers to a channel that is private and the authorised user is not already a channel member and is not a global owner", () => {
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const id2 = authRegisterV1(
      "JennyPatrick@gmail.com",
      "noOneIsGoing2GuessThis",
      "Jenny",
      "Patrick"
    );
    const idc2 = channelsCreateV1(1, "Ice Cream", false);
    expect(channelJoinV1(id2.authUserId, idc2.channelId)).toMatchObject({ error: "error" });
  });

  test("error should be reproduced if the same person joins again.", () => {
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const id2 = authRegisterV1(
      "JennyPatrick@gmail.com",
      "noOneIsGoing2GuessThis",
      "Jenny",
      "Patrick"
    );
    const idc1 = channelsCreateV1(1, "Ice Cream", false);
    channelJoinV1(id2.authUserId, idc1.channelId);
    expect(channelJoinV1(id2.authUserId, idc1.channelId)).toMatchObject({ error: "error" });
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                channelMessagesV1                                        //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////

describe("channelMessagesV1", () => {
  test("no messages", () => {
    clearV1();
    authRegisterV1("Arindam@unsw.edu.au", "234562", "Arindam", "Mukherjee");
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    let channelId1 = channelsCreateV1(uId.authUserId, "testchannel", true);
    let messages = channelMessagesV1(uId.authUserId, channelId1.channelId, 0);
    expect(messages).toMatchObject({ messages: [], start: 0, end: -1 });
  });

  test("less than 50 messages", () => {
    clearV1();
    authRegisterV1("Arindam@unsw.edu.au", "234562", "Arindam", "Mukherjee");
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    let channelId1 = channelsCreateV1(uId.authUserId, "testchannel", true);
    let messagearray = [];
    // channel will now contain 1 messages
    for (let i = 0; i < 1; i++) {
      messagePush("a", channelId1.channelId, uId.authUserId);
      messagearray.push({
        messageId: i + 1,
        uId: uId.authUserId,
        message: "a",
        timeSent: 1,
      });
    }
    messagearray.sort((a,b) => b.messageId - a.messageId);
    let messages = channelMessagesV1(uId.authUserId, channelId1.channelId, 0);
    expect(messages).toMatchObject({
      messages: messagearray,
      start: 0,
      end: -1,
    });
  });

  test("50 messages", () => {
    clearV1();
    authRegisterV1("Arindam@unsw.edu.au", "234562", "Arindam", "Mukherjee");
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    let channelId1 = channelsCreateV1(uId.authUserId, "testchannel", true);
    let messagearray = [];
    // channel will now contain 50 a messages
    for (let i = 0; i < 50; i++) {
      messagePush("a", channelId1.channelId, uId.authUserId);
      messagearray.push({
        messageId: i + 1,
        uId: uId.authUserId,
        message: "a",
        timeSent: 1,
      });
    }
    messagearray.sort((a,b) => b.messageId - a.messageId);
    let messages = channelMessagesV1(uId.authUserId, channelId1.channelId, 0);
    expect(messages).toMatchObject({
      messages: messagearray,
      start: 0,
      end: 50,
    });
  });

  test("greater than 50 messages", () => {
    clearV1();
    authRegisterV1("Arindam@unsw.edu.au", "234562", "Arindam", "Mukherjee");
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    let channelId1 = channelsCreateV1(uId.authUserId, "testchannel", true);
    let messagearray = [];
    // channel will now contain 51 a messages
    for (let i = 0; i < 51; i++) {
      messagePush("a", channelId1.channelId, uId.authUserId);
      if (i > 0) {
        messagearray.push({
          messageId: i + 1,
          uId: uId.authUserId,
          message: "a",
          timeSent: 1,
        });
      }
    }
    messagearray.sort((a,b) => b.messageId - a.messageId);
    let messages = channelMessagesV1(uId.authUserId, channelId1.channelId, 1);
    expect(messages).toMatchObject({
      messages: messagearray,
      start: 1,
      end: 51,
    });
  });

  test("invalid userID", () => {
    clearV1();
    let userId = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    let channelId1 = channelsCreateV1(userId.authUserId, "testchannel", true);
    let messages = channelMessagesV1("invalid", channelId1.channelId, 1);
    expect(messages).toMatchObject({ error: "error" });
  });

  test("start greater than total number of messages", () => {
    clearV1();
    authRegisterV1("Arindam@unsw.edu.au", "234562", "Arindam", "Mukherjee");
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    let channelId1 = channelsCreateV1(uId.authUserId, "testchannel", true);
    let messagearray = [];
    // channel will now contain 50 a messages
    for (let i = 0; i < 50; i++) {
      messagePush("a", channelId1.channelId, uId.authUserId);
      messagearray.push({
        messageId: i + 1,
        uId: uId.authUserId,
        message: "a",
        timeSent: 1,
      });
    }
    messagearray.sort((a,b) => b.messageId - a.messageId);
    let messages = channelMessagesV1(uId.authUserId, channelId1.channelId, 8000);
    expect(messages).toMatchObject({error: 'error'});
    });

  test("user is not part of the channel", () => {
    clearV1();
    authRegisterV1("Arindam@unsw.edu.au", "234562", "Arindam", "Mukherjee");
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    let channelId1 = channelsCreateV1(uId.authUserId, "testchannel", true);
    let messagearray = [];
    // channel will now contain 50 a messages
    for (let i = 0; i < 50; i++) {
      messagePush("a", channelId1.channelId, uId.authUserId);
      messagearray.push({
        messageId: i + 1,
        uId: uId.authUserId,
        message: "a",
        timeSent: 1,
      });
    }
    messagearray.sort((a,b) => b.messageId - a.messageId);
    let invaliduserid = authRegisterV1("Aridwadwaam@unsw.edu.au", '234562', 'Arindam', 'Mukherjee')
    let messages = channelMessagesV1(invaliduserid.authUserId, channelId1.channelId, 0);
    expect(messages).toMatchObject({error: 'error'});
    });
})

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                channelInviteV1                                          //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////

describe("channelInviteV1", () => {
  test("uId user is not part of the channel", () => {
    // 2nd user will invite 3rd user
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const id2 = authRegisterV1(
      "Arindm@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const id3 = authRegisterV1(
      "james@gmail.com",
      "fBrmTP45Pq9",
      "James",
      "Peters"
    );
    const idc1 = channelsCreateV1(idc1, "Ice Cream", true);
    expect(
      channelInviteV1(id2.authUserId, idc1.channelId, id3.authUserId)
    ).toMatchObject({ error: "error" });
  });

  test("authuserId is invalid", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const idc1 = channelsCreateV1(1, "Ice Cream", true);
    expect(channelInviteV1("random", idc1.channelId, 3)).toMatchObject({
      error: "error",
    });
  });

  test("uId is invalid", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const idc1 = channelsCreateV1(id1.authUserId, "Ice Cream", true);
    expect(channelInviteV1(id1.authUserId, idc1.channelId, "random")).toMatchObject({
      error: "error",
    });
  });

  test("user is already in channel", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const id2 = authRegisterV1(
      "james@gmail.com",
      "fBrmTP45Pq9",
      "James",
      "Peters"
    );
    const idc1 = channelsCreateV1(id1.authUserId, "Ice Cream", true);
    channelInviteV1(id1.authUserId, idc1.channelId, id2.authUserId);
    expect(channelInviteV1(id1.authUserId, idc1.channelId, id2.authUserId)).toMatchObject({ error: "error" });
  });

  test("channelid is invalid", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const id2 = authRegisterV1(
      "james@gmail.com",
      "fBrmTP45Pq9",
      "James",
      "Peters"
    );
    expect(channelInviteV1(id1.authUserId, "random", id2.authUserId)).toMatchObject({
      error: "error",
    });
  });

  test("user invites another user to a public channel", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const id2 = authRegisterV1(
      "james@gmail.com",
      "fBrmTP45Pq9",
      "James",
      "Peters"
    );
    const idc1 = channelsCreateV1(id1.authUserId, "Ice Cream", true);
    channelInviteV1(id1.authUserId, idc1.channelId, id2.authUserId);
    expect(channelDetailsV1(id1.authUserId, idc1.channelId)).toEqual({
      name: "Ice Cream",
      isPublic: true,
      ownerMembers: [userProfileV1(id1.authUserId, id1.authUserId)],
      allMembers: [userProfileV1(id1.authUserId, id1.authUserId), userProfileV1(id2.authUserId, id2.authUserId)],
    });
  });

  test("user invites another user to a private channel", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const id2 = authRegisterV1(
      "james@gmail.com",
      "fBrmTP45Pq9",
      "James",
      "Peters"
    );
    const idc1 = channelsCreateV1(id1.authUserId, "Ice Cream", false);
    channelInviteV1(id1.authUserId, idc1.channelId, id2.authUserId);
    expect(channelDetailsV1(id1.authUserId, idc1.channelId)).toEqual({
      name: "Ice Cream",
      isPublic: false,
      ownerMembers: [userProfileV1(id1.authUserId, id1.authUserId)],
      allMembers: [userProfileV1(id1.authUserId, id1.authUserId), userProfileV1(id2.authUserId, id2.authUserId)],
    });
  });

  test("check if auth", () => {});
});
// auth user if valid

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                channelDetailsV1                                         //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////

describe("channelDetailsv1", () => {
  test("If userId is invalid", () => {
    clearV1();
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const idc1 = channelsCreateV1(idc1, "Ice Cream", true);
    let channelDetails = channelDetailsV1("invaliduserId", 1);
    expect(channelDetails).toMatchObject({ error: "error" });
  });

  test("when channelId provided by member does not refer to an existing channel", () => {
    clearV1();
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const idc1 = channelsCreateV1(idc1, "Ice Cream", true);
    let channelDetails = channelDetailsV1(1, "thisisfalse");
    expect(channelDetails).toMatchObject({ error: "error" });
  });

  test("when channelId provided refers to a existing public channel that the user is not apart of", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const id2 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    let uId2 = authLoginV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry"
    );
    let channelId1 = channelsCreateV1(uId2.authUserId, "testchannel", true);
    let channelDetails = channelDetailsV1(uId.authUserId, 1);
    expect(channelDetails).toMatchObject({ error: "error" });
  });

  test("when channelId provided refers to a existing private channel that the user is not apart of", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    const id2 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    let uId2 = authLoginV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry"
    );
    let channelId1 = channelsCreateV1(uId2.authUserId, "testchannel", false);
    let channelDetails = channelDetailsV1(uId.authUserId, 1);
    expect(channelDetails).toMatchObject({ error: "error" });
  });

  test("when channelId provided refers to a existing private channel that the user is apart of", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    channelsCreateV1(uId.authUserId, "testchannel", false);
    let channelDetails = channelDetailsV1(uId.authUserId, 1);
    expect(channelDetails).toMatchObject({
      name: "testchannel",
      isPublic: false,
      ownerMembers: [userProfileV1(id1.authUserId, id1.authUserId)],
      allMembers: [userProfileV1(id1.authUserId, id1.authUserId)],
    });
  });

  test("when channelId provided refers to a existing public channel that the user is apart of", () => {
    clearV1();
    const id1 = authRegisterV1(
      "Arindam@unsw.edu.au",
      "234562",
      "Arindam",
      "Mukherjee"
    );
    let uId = authLoginV1("Arindam@unsw.edu.au", "234562");
    const idc1 = channelsCreateV1(uId.authUserId, "testchannel", true);
    let channelDetails = channelDetailsV1(uId.authUserId, 1);
    expect(channelDetails).toMatchObject({
      name: "testchannel",
      isPublic: true,
      ownerMembers: [userProfileV1(id1.authUserId, id1.authUserId)],
      allMembers: [userProfileV1(id1.authUserId, id1.authUserId)],
    });
  });
});
