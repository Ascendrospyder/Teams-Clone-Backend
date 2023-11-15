```javascript
// TODO: insert your data structure that contains users + channels info here
// You may also add a short description explaining your design

// example user data structure 
//Unique identifier - multiple could have the same name so a unique identifier is needed to differentiate each user - integer
//First name - store the user's first name so other people and identify them - string
//last name - store the user's last name so other people and identify them - string
//Full name - concatenates the first and last name of a user so that they can @ed in a channel - string
//email - stored so that the user can manage their account without logging in to teams and to also log in to a specific account on teams - string
//password - stored so that a user can log in to the software - string

// example channel data structure
//Unique identifier - a unique integer for a channel so we can identify a channel - integer
//channel name - the name of the channel - string
//ispublic- if the channel is private then only certain users can see it - Boolean
//start - the time when a meeting begins - integer
//end - the time when a meeting ends can be used to calculate the duration of a meeting - integer
//messages - the messages that were send in a meeting - array of strings
let datastore = {
    user: [
        {
        'uniqueID': 1,
        'firstname': 'John',
        'lastname': 'Smith',
        'email': 'sample@gmail.com',
        'password': 'teamspassword',
        'fullname': 'John Smith',
        },
    ],
    channel: [
        {
        'uniqueID': 1,
        'name': 'meeting room',
        'ispublic': true,
        'start': 0,
        'end': 1000,
        'messages': ["Hello","Hi","Bye"],
        },
    ]
}


```
