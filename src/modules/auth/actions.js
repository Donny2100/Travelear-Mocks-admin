/**
 * Auth Actions
 */

import * as Actions from './constants';

/**
 * Login action
 * @param email
 * @param password
 * @param remember
 * @returns {{type, payload: {email: *, password: *, remember: boolean}}}
 */
export function login(email, password, remember = false) {
  return {
    type: Actions.LOGIN_REQUEST,
    payload: {
      email,
      password,
      remember
    }
  };
}

/**
 * Logout action
 * @returns {{type}}
 */
export function logout() {
  return {
    type: Actions.LOGOUT_REQUEST
  };
}

/**
 * Register action
 * @param email
 * @param password
 * @returns {{type: string, payload: {email: *, password: *}}}
 */
export function register(email, password) {
  return {
    type: Actions.SIGN_UP_REQUEST,
    payload: {
      email,
      password
    }
  };
}
