import { eventChannel } from 'redux-saga';
import {
  call,
  cancel,
  fork,
  put,
  take,
  takeEvery,
} from 'redux-saga/effects';
import { SUBSCRIBE, UNSUBSCRIBE, REMOVE_REQUEST } from './constants';
import { removeService, subscribeService } from './service';

/**
 * saga effect
 */
function* subscribe() {
  let options = {
    orderBy: [
      { attr: 'timestamp', value: 'desc' }
    ]
  };
  const channel = yield eventChannel(emit => subscribeService(emit, options));
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

/**
 * saga effect
 */
function* watchRequestSubscribeTrack() {
  while (true) {
    yield take(SUBSCRIBE);
    const chanel = yield fork(subscribe);

    yield take(UNSUBSCRIBE);
    yield cancel(chanel);
  }
}

/**
 * saga effect
 */
function* removeTrack({ payload }) {
  const { id } = payload;
  try {
    yield call(removeService, id);
  } catch (error) {
    console.log(error);
  }
}

export default function* trackSagas() {
  yield fork(watchRequestSubscribeTrack);
  yield takeEvery(REMOVE_REQUEST, removeTrack);
}
