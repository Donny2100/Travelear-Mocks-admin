import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

import { config, fireStoreSetting } from '../config/firebase';

// Initialize the default app
export const defaultApp = firebase.initializeApp(config);

export const auth = defaultApp.auth();
export const storage = defaultApp.storage();
export const firestore = defaultApp.firestore();

firestore.settings(fireStoreSetting);
