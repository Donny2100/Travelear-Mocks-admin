import { SUBSCRIBE, UNSUBSCRIBE, REMOVE_REQUEST } from './constants';

/**
 * Subscribe track
 * @returns {{type}}
 */
export function subscribe() {
  return {
    type: SUBSCRIBE
  };
}

/**
 * Un subscribe track
 * @returns {{type}}
 */
export function unsubscribe() {
  return {
    type: UNSUBSCRIBE
  };
}

/**
 * Remove track
 * @param id
 * @returns {{type, payload: {id: *}}}
 */
export function remove(id) {
  return {
    type: REMOVE_REQUEST,
    payload: {
      id
    }
  };
}
