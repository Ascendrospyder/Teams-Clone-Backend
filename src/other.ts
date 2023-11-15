import { setData, getData } from './dataStore';

/*
description - clears the current datastore by setting the length of the users and channels array to 0
arguments - none
returns - {} always
*/

function clearV1() {
  const data = getData();
  data.users.length = 0;
  data.channels.length = 0;
  data.messages.length = 0; // needed to be added for iteration2
  data.dms.length = 0;
  setData(data);
  return {};
}

export { clearV1 };
