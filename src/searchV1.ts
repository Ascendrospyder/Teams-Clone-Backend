import { getData } from './dataStore';
import HTTPError from 'http-errors';
import { getUIdfromtoken } from './helper';

/**
 * Given a query string, returns a collection of messages in all of the channels/DMs that the user
 * has joined that contain the query (case-insensitive).
 * @param token - string: Given to a validated user
 * @param queryStr - string: text being search for
 * @returns messages - object: an object of messages containing the query
 */

function searchV1(token: string, queryStr: string) {
  // Validating token and returning the userId
  const authUserId = getUIdfromtoken(token);
  if (!authUserId) {
    throw HTTPError(403, '403: Unauthorized User!');
  }
  if (queryStr.length < 1) {
    throw HTTPError(400, '400: Query of insufficient length!');
  }
  if (queryStr.length > 1000) {
    throw HTTPError(400, '400: Query maximum limit is 1000 characters!');
  }
  const data = getData();
  queryStr = queryStr.toLowerCase();
  const messages: string[] = [];
  // Check messages for messages containing query
  for (const eachMessage of data.messages) {
    // Convert to lowercase
    const lowerCaseMsg = eachMessage.message.toLowerCase();
    // Search messages
    if (lowerCaseMsg.search(queryStr) !== -1) {
      messages.push(eachMessage);
    }
  }
  return { messages };
}

export { searchV1 };
