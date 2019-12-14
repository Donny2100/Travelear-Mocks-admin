import { createSelector } from 'reselect';

// select Track
const selectTrack = state => state.get('track');

// make select Track
export const makeSelectTrack = createSelector(selectTrack, track =>
  track.toJS()
);

// make select Pending
export const makeSelectPending = createSelector(
  selectTrack,
  track => track.toJS().pending
);
