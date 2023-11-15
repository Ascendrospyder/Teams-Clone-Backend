import {authRegisterV1, authLoginV1} from './auth'
import {userProfileV1} from './users'
import {clearV1} from './other';


/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                authRegisterV1                                           //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////

test('Testing auth registeration using a correct authUserid', () => {
    clearV1();
    const test_input = authRegisterV1("Arindam@unsw.edu.au", '234562', 'Arindam', 'Mukherjee'); 
    const authUserId = test_input.authUserId;  
    expect(authUserId).toBe(1); 
}); 

test('If the entered password is of the incorrect length', () => {
    clearV1();
    const authUserId = authRegisterV1("Arindam@unsw.edu.au", '23452', 'Arindam', 'Mukherjee');
    expect(authUserId).toMatchObject({error: 'error'}); 
}); 

test('If the entered first name is invalid with less than 1 character', () => {
    clearV1();
    const authUserId = authRegisterV1("Arindam@unsw.edu.au", '234522', '', 'Mukherjee');
    expect(authUserId).toMatchObject({error: 'error'}); 
});

test('If the entered first name is invalid with more than 50 character', () => {
    clearV1();
    const authUserId = authRegisterV1("Arindam@unsw.edu.au", '234522', 'servicepartnersmedicalpractitionerslegalrequirementsfordoctorsthiswasarandomgooglesearch', 'Mukherjee');
    expect(authUserId).toMatchObject({error: 'error'}); 
});

test('If the entered last name is invalid with less than one character', () => {
    clearV1();
    const authUserId = authRegisterV1("Arindam@unsw.edu.au", '234522', 'Arindam', '');
    expect(authUserId).toMatchObject({error: 'error'}); 
});

test('If the entered last name is invalid with more than 50 character', () => {
    clearV1();
    const authUserId = authRegisterV1("Arindam@unsw.edu.au", '234522', 'Arindam', 'servicepartnersmedicalpractitionerslegalrequirementsfordoctorsthiswasarandomgooglesearch');
    expect(authUserId).toMatchObject({error: 'error'}); 
});

test('2 users register the same name', () => {
    clearV1();
    const authUserId1 = authRegisterV1("Arindam@unsw.edu.au", '234522', 'Arindam', 'hello');
    const authUserId2 = authRegisterV1("Arinda1m@unsw.edu.au", '234522', 'Arindam', 'hello');
    expect(userProfileV1(authUserId1.authUserId, authUserId1.authUserId).handleStr).toEqual('arindamhello'); 
    expect(userProfileV1(authUserId1.authUserId, authUserId2.authUserId).handleStr).toEqual('arindamhello0'); 
});

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
//                                authLoginV1                                              //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////

describe('authLoginV1',() => {
    // the user will first register and then will log in with different conditions.
    test('user is able to login with correct details', () => {
        clearV1();
        authRegisterV1('exampleemail@gmail.com', 'testpassword123', 'firstname', 'lastname');
        const authUserId = authLoginV1('exampleemail@gmail.com','testpassword123');
        expect(authUserId.authUserId).toBe(1); 

    });
    test('user enters email that does not exist', () => {
        clearV1();
        authRegisterV1('exampleemail@gmail.com', 'testpassword123', 'firstname', 'lastname');
        const authUserId = authLoginV1('idonoexist@gmail.com','testpassword123');
        expect(authUserId).toMatchObject({error: 'error'});
    });
    test('user enters password that is incorrect', () => {
        clearV1();
        authRegisterV1('exampleemail@gmail.com', 'testpassword123', 'firstname', 'lastname');
        const authUserId = authLoginV1('exampleemail@gmail.com','wrongpasswordlol');
        expect(authUserId).toMatchObject({error: 'error'});
    });
})