import { createSelector } from 'reselect';

const selectAuth = state => state.get('auth');

export const makeSelectAuth = createSelector(selectAuth, auth => auth.toJS());
