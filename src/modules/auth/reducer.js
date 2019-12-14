import { fromJS } from 'immutable';
import * as Actions from './constants';

const initState = fromJS({
  loading: false,
  isLogin: false,
  user: {}
});

export default function authReducer(state = initState, action = {}) {
  switch (action.type) {
    case Actions.LOGIN_REQUEST:
      return state.set('loading', true);
    case Actions.LOGIN_SUCCESS:
      return state.merge({
        loading: false,
        isLogin: true,
        user: action.payload.user
      });
    case Actions.LOGOUT_REQUEST:
    case Actions.LOGIN_ERROR:
    case Actions.LOGOUT_SUCCESS:
      return initState;
    default:
      return state;
  }
}
