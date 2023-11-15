import fs from 'fs';
// YOU SHOULD MODIFY THIS OBJECT BELOW
// each user and channel should contain the follow data
/*
user
  uId                   - integer
  nameFirst             - string
  nameLast              - string
  email                 - string
  password              - string
  handleStr             - string
  profileImgUrl         - string
  permissions           - integer
  notifications         - array of objects
  tokens                - string array
  resetCode             - string
  hashedTokens          - string array

channel
  channelId             - integer
  name                  - string
  isPublic              - boolean
  ownerMembers          - integer array
  allMembers            - integer array
  isActive              - boolean
  timeFinish            - integer
  messageQueue          - string array
  userStarted           - integer

message
  messageId             - integer
  channelId             - integer
  uId                   - integer
  dmId                  - integer
  message               - string
  timeSent              - integer
  reacts                - object
  isPinned              - integer
  sharedMessageId       - integer

dm
  dmId                  - integer
  name                  - string
  ownerMembers          - integer array
  allMembers            - integer array

workspaceStats          - object
*/
const data = {
  users: [] as any[],
  channels: [] as any[],
  messages: [] as any[],
  dms: [] as any[],
  workspaceStats: {
    channelsExist: [] as any[],
    dmsExist: [] as any[],
    messagesExist: [] as any[],
    utilizationRate: 0,
  },
};

// YOU SHOULDN'T NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Data Persistence: Saves dataStore to data.json
function setData(data: any) {
  fs.writeFileSync('src/data.json', JSON.stringify(data), { flag: 'w' });
}

export { getData, setData };
