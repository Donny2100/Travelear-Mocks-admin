import { call, put, takeLatest } from 'redux-saga/effects';
import * as Actions from './constants';
import { signInRequest, signOutRequest, signUpRequest } from './service';
import { auth, getDocument, updateDocument } from '../../firebase';

/**
 * login effect
 * @param {{ payload: object }} param0
 */
export function* loginSaga({ payload }) {
  const { email, password, remember } = payload;
  try {
    yield call(signInRequest, { email, password, remember });
    const uid = auth.currentUser.uid;
    const user = yield call(getDocument, 'users', uid);
    yield put({
      type: 'auth/LOGIN_SUCCESS',
      payload: { user }
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: Actions.LOGIN_ERROR,
      payload: { error }
    });
  }
}

/**
 * register effect
 * @param {{ payload: object }} param0
 */
export function* registerSaga({ payload }) {
  const { email, password } = payload;
  try {
    const user = yield call(signUpRequest, { email, password });
    const userData = { id: user.uid, role: 'user', email: user.email, uid: user.uid, joined: new Date() };
    yield call(updateDocument, 'users', user.uid, userData);
    yield put({
      type: 'auth/LOGIN_SUCCESS',
      payload: { user: userData }
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: Actions.SIGN_UP_ERROR,
      payload: { error }
    });
  }
}

/**
 * logout effect
 * @param {{ payload: object }} param0
 */
function* logoutSaga() {
  try {
    yield call(signOutRequest);
    yield put({ type: Actions.LOGOUT_SUCCESS });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Spawns a saga on each action dispatched to the store that matches pattern. and automatically cancels any previous saga task started previous if it's still running
 */
export default function* authSaga() {
  yield takeLatest(Actions.LOGIN_REQUEST, loginSaga);
  yield takeLatest(Actions.SIGN_UP_REQUEST, registerSaga);
  yield takeLatest(Actions.LOGOUT_REQUEST, logoutSaga);
}
