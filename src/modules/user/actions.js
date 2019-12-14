import { SUBSCRIBE, UNSUBSCRIBE, REMOVE_REQUEST } from './constants';

/**
 * Subscribe user
 * @returns {{type}}
 */
export function subscribe() {
  return {
    type: SUBSCRIBE
  };
}

/**
 * Un subscribe user
 * @returns {{type}}
 */
export function unsubscribe() {
  return {
    type: UNSUBSCRIBE
  };
}

/**
 * Remove user
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
