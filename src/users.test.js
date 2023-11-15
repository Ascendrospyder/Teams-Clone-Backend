import { userProfileV1 } from './users';
import { authRegisterV1, authLoginV1 } from './auth';
import {clearV1} from './other';


describe('Compilation of Tests for userProfileV1.js', () => {  
    
  test('Check when UId is invalid and authUserId is valid', () => {

    // uId is excessively high. We're not facebook (yet!).
    clearV1();
    authRegisterV1('james@gmail.com', 'fBrT45Pq9', 'James', 'Peters');
    expect(userProfileV1(1, 55000)).toMatchObject({error: 'error'});
    
    // uId = 0. Not possible if this function is being accessed as you need to be
    // logged in with a user Id.
    clearV1();
    authRegisterV1('kelly@gmail.com','fBrT45Pq9', 'Kelly', 'Brown');
    authRegisterV1('lucky@gmail.com','fBrT45Pq9', 'Lucky', 'Nelly');
    expect(userProfileV1(2, 0)).toMatchObject({error: 'error'});

    // uId is negative. Not possible given the way uId's are allocated.
    clearV1();
    authRegisterV1('kelly@gmail.com','fBrT45Pq9', 'Kelly', 'Brown');
    authRegisterV1('lucky@gmail.com','fBrT45Pq9', 'Lucky', 'Nelly');
    authRegisterV1('Peter@gmail.com','fBrT45Pq9', 'Peter', 'Smith');
    expect(userProfileV1(3, -5)).toMatchObject({error: 'error'});

    // uId is blank. Not possible given the way uId's are allocated.
    clearV1();
    authRegisterV1('kelly@gmail.com','fBrT45Pq9', 'Kelly', 'Brown');
    authRegisterV1('lucky@gmail.com','fBrT45Pq9', 'Lucky', 'Nelly');
    expect(userProfileV1(1, '')).toMatchObject({error: 'error'});

    // uId is a string. Not possible given the way uId's are allocated.
    clearV1();
    authRegisterV1('kelly@gmail.com','fBrT45Pq9', 'Kelly', 'Brown');
    authRegisterV1('lucky@gmail.com','fBrT45Pq9', 'Lucky', 'Nelly');
    authRegisterV1('Peter@gmail.com','fBrT45Pq9', 'Peter', 'Smith'); 
    expect(userProfileV1(2, '9')).toMatchObject({error: 'error'});    
  });
  
  test('Check when a UId is invalid and uthUserId is valid', () => {

    // authUserId not existing due to insufficient users currently stored in the database. 
    clearV1();
    authRegisterV1('kelly@gmail.com','fBrT45Pq9', 'Kelly', 'Brown');
    authRegisterV1('lucky@gmail.com','fBrT45Pq9', 'Lucky', 'Nelly');
    authRegisterV1('Peter@gmail.com','fBrT45Pq9', 'Peter', 'Smith');
    expect(userProfileV1(10, 2)).toMatchObject({error: 'error'});

    // authUserId number not possible given the algorithm used to create them.
    clearV1();
    authRegisterV1('kelly@gmail.com','fBrT45Pq9', 'Kelly', 'Brown');
    authRegisterV1('lucky@gmail.com','fBrT45Pq9', 'Lucky', 'Nelly');
    expect(userProfileV1(-1, 3)).toMatchObject({error: 'error'});

  });

  test('Check when UId is valid and authUserId is valid', () => {
    
    clearV1();
    authRegisterV1('JohnSmith@gmail.com', 'inventingNewPasswordsMakesMeCry', 'John', 'Smith');
    authRegisterV1('JennyPatrick@gmail.com', 'noOneIsGoing2GuessThis', 'Jenny', 'Patrick');
    expect(userProfileV1(1, 2)).toEqual({uId: 2, email: 'JennyPatrick@gmail.com', nameFirst: 'Jenny', nameLast: 'Patrick', handleStr: 'jennypatrick'});
   
  });
  
});
