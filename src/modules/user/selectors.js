import { createSelector } from 'reselect';

// select User
const selectUser = state => state.get('user');

// make select User
export const makeSelectUser = createSelector(selectUser, track => track.toJS());

// make select Pending
export const makeSelectPending = createSelector(
  selectUser,
  track => track.toJS().pending
);
