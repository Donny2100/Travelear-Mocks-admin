import { fromJS } from 'immutable';
import { makeSelectAuth } from '../selections';

describe('Select auth', () => {
  it('select auth from state', () => {
    const state = fromJS({
      auth: {
        email: 'admin@gmail.com',
        uid: '111222333'
      }
    });
    expect(makeSelectAuth(state)).toEqual(state.get('auth').toJS());
  });
});
