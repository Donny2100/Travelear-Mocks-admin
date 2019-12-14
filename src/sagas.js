import { all } from 'redux-saga/effects';
import { authSaga } from './modules/auth';
import { trackSagas } from './modules/track';
import { userSagas } from './modules/user';

/**
 * Creates an effect description that instructs the middleware to run multiple effects in parallel and wait for all of them to complete
 */
export default function* rootSagas() {
  yield all([authSaga(), trackSagas(), userSagas()]);
}
