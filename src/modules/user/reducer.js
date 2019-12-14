import { fromJS } from 'immutable';
import { MUTATE, REMOVED, SUBSCRIBE, SUCCESS_SUBSCRIBE } from './constants';
import * as Actions from '../auth/constants';

export const initState = new fromJS({
  loading: false,
  data: []
});

export function userReducer(state = initState, { type, payload }) {
  const data = state.get('data');
  switch (type) {
    case SUBSCRIBE:
      return state.set('loading', true);
    case SUCCESS_SUBSCRIBE:
      return state.set('loading', false);
    case MUTATE:
      // Update data
      if (data.find(value => value.get('id') === payload.data.get('id'))) {
        return state.set(
          'data',
          data.map(value => {
            if (value.get('id') === payload.data.get('id')) {
              return payload.data;
            }
            return value;
          })
        );
      }
      // Add new data
      return state.set('data', data.push(payload.data));
    case REMOVED:
      return state.set(
        'data',
        data.filter(value => value.get('id') !== payload.id)
      );
    case Actions.LOGOUT_SUCCESS:
      return initState;
    default:
      return state;
  }
}
