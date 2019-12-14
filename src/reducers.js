import { combineReducers } from 'redux-immutable';

import { trackReducer } from './modules/track';
import { authReducer } from './modules/auth';
import { userReducer } from './modules/user';

// Turns an object whose values are different reducing functions into a single reducing function you can pass to createStore
const rootApp = combineReducers({
  track: trackReducer,
  auth: authReducer,
  user: userReducer
});

export default rootApp;
