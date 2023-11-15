import {authRegisterV1} from './auth'
import {channelsCreateV1} from './channels'
import {clearV1} from './other'
import { channelsLength, usersLength } from "./helper";

describe("Testing the clearV1 function", () => {
  test("Test clearing 1 user and 1 private channel from the database", () => {
    clearV1();
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const idc1 = channelsCreateV1(id1, "Ice Cream", false);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });
  test("Test clearing 1 user and 1 public channel from the database", () => {
    clearV1();
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const idc1 = channelsCreateV1(id1, "Ice Cream", true);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });

  test("Test clearing 1 user and multiple private channels from the database", () => {
    clearV1();
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const idc6 = channelsCreateV1(1, "Ice Cream", false);
    const idc7 = channelsCreateV1(2, "Chocolate", false);
    const idc8 = channelsCreateV1(3, "Chips", false);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });
  test("Test clearing 1 user and multiple public channels from the database", () => {
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const idc6 = channelsCreateV1(1, "Ice Cream", true);
    const idc7 = channelsCreateV1(2, "Chocolate", true);
    const idc8 = channelsCreateV1(3, "Chips", true);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });

  test("Test clearing 1 user and a mix of public and private channels from the database", () => {
    const id1 = authRegisterV1(
      "JohnSmith@gmail.com",
      "inventingNewPasswordsMakesMeCry",
      "John",
      "Smith"
    );
    const idc6 = channelsCreateV1(1, "Ice Cream", true);
    const idc7 = channelsCreateV1(2, "Chocolate", false);
    const idc8 = channelsCreateV1(3, "Chips", false);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });
  test("Test clearing multiple users and one public channel from the database", () => {
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
    const id4 = authRegisterV1(
      "kelly@gmail.com",
      "KBrT45Pq9",
      "Kelly",
      "Brown"
    );
    const idc6 = channelsCreateV1(1, "Ice Cream", true);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });
  test("Test clearing multiple users and one private channel from the database", () => {
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
    const id4 = authRegisterV1(
      "kelly@gmail.com",
      "KBrT45Pq9",
      "Kelly",
      "Brown"
    );
    const idc6 = channelsCreateV1(1, "Ice Cream", false);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });

  test("Test clearing multiple users and multiple private channels from the database", () => {
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
    const id4 = authRegisterV1(
      "kelly@gmail.com",
      "KBrT45Pq9",
      "Kelly",
      "Brown"
    );
    const idc6 = channelsCreateV1(1, "Ice Cream", false);
    const idc8 = channelsCreateV1(3, "Chips", false);
    const idc9 = channelsCreateV1(4, "Meat Pies", false);
    const idc10 = channelsCreateV1(5, "Jello", false);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });

  test("Test clearing multiple users and multiple public channels from the database", () => {
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
    const id4 = authRegisterV1(
      "kelly@gmail.com",
      "KBrT45Pq9",
      "Kelly",
      "Brown"
    );
    const idc6 = channelsCreateV1(1, "Ice Cream", true);
    const idc8 = channelsCreateV1(3, "Chips", true);
    const idc9 = channelsCreateV1(4, "Meat Pies", true);
    const idc10 = channelsCreateV1(5, "Jello", true);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });

  test("Test clearing multiple users and a mix of private and public channels from the database", () => {
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
    const id4 = authRegisterV1(
      "kelly@gmail.com",
      "KBrT45Pq9",
      "Kelly",
      "Brown"
    );
    const idc6 = channelsCreateV1(1, "Ice Cream", true);
    const idc8 = channelsCreateV1(3, "Chips", true);
    const idc9 = channelsCreateV1(4, "Meat Pies", false);
    const idc10 = channelsCreateV1(5, "Jello", false);
    clearV1();
    expect(channelsLength()).toEqual(0);
    expect(usersLength()).toEqual(0);
  });
});
