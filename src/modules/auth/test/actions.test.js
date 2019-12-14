import { logout, login } from '../actions';
import { LOGIN_REQUEST, LOGOUT_REQUEST } from '../constants';

describe('Auth actions', () => {
  describe('Logout Action', () => {
    it('has a type of LOGOUT_REQUEST', () => {
      const expected = {
        type: LOGOUT_REQUEST
      };
      expect(logout()).toEqual(expected);
    });
  });

  describe('Login Action', () => {
    it('has a type of LOGIN_REQUEST and login info', () => {
      const email = 'isuperdev007@gmail.com';
      const password = '123456';
      const expected = {
        type: LOGIN_REQUEST,
        payload: {
          email,
          password,
          remember: false
        }
      };
      expect(login(email, password)).toEqual(expected);
    });

    it('has a type of LOGIN_REQUEST and login info and remember property', () => {
      const email = 'isuperdev007@gmail.com';
      const password = '123456';
      const expected = {
        type: LOGIN_REQUEST,
        payload: {
          email,
          password,
          remember: true
        }
      };
      expect(login(email, password, true)).toEqual(expected);
    });
  });
});
