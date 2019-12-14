import { fromJS } from 'immutable';
import authReducer from '../reducer';
import { LOGIN_SUCCESS, LOGIN_REQUEST, LOGOUT_SUCCESS } from '../constants';

describe('Reducer', () => {
  it('should handle init app', () => {
    const state = undefined;
    const action = { type: '' };
    const stateInit = authReducer(state, action).toJS();
    expect(stateInit.loading).toBeFalsy();
    expect(stateInit.isLogin).toBeFalsy();
    expect(stateInit.user).toEqual({});
  });

  it('should handle login success', () => {
    const initState = fromJS({
      loading: false,
      isLogin: false,
      user: {}
    });
    const user = {
      email: 'isuperdev007@gmail.com',
      uid: '111222333'
    };
    const expectedState = fromJS({
      loading: false,
      isLogin: true,
      user
    });
    const action = {
      type: LOGIN_SUCCESS,
      payload: { user }
    };
    const state = authReducer(initState, action);
    expect(state.toJS()).toEqual(expectedState.toJS());
    expect(state.getIn(['user', 'uid'])).toBe('111222333');
  });

  it('should handle login request', () => {
    const initState = fromJS({
      loading: false,
      isLogin: false,
      user: {}
    });
    const expectedState = fromJS({
      loading: true,
      isLogin: false,
      user: {}
    });
    const user = {
      email: 'isuperdev007@gmail.com',
      uid: '111222333'
    };
    const action = {
      type: LOGIN_REQUEST,
      payload: { user }
    };
    const state = authReducer(initState, action);
    expect(state.toJS()).toEqual(expectedState.toJS());
  });

  it('should handle logout request', () => {
    const user = {
      email: 'isuperdev007@gmail.com',
      uid: '111222333'
    };
    const initState = fromJS({
      loading: false,
      isLogin: true,
      user
    });
    const expectedState = fromJS({
      loading: false,
      isLogin: false,
      user: {}
    });
    const action = {
      type: LOGOUT_SUCCESS
    };
    const state = authReducer(initState, action);
    expect(state.toJS()).toEqual(expectedState.toJS());
  });
});
