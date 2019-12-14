import { auth } from './firebase';

/**
 * Sign in firebase email and password
 * @param email
 * @param password
 * @param remember
 * @returns {Promise<any>}
 */
export function signIn(email, password, remember = false) {
  const persistence = remember ? 'local' : 'none';
  return new Promise((resolve, reject) => {
    auth
      .setPersistence(persistence)
      .then(() =>
        auth
          .signInWithEmailAndPassword(email, password)
          .then(() => resolve({ success: true }))
      )
      .catch(error => reject(error));
  });
}

/**
 * Sign up user firebase with email and password
 * @param email
 * @param password
 * @returns {Promise<any>}
 */
export function signUp(email, password) {
  return new Promise((resolve, reject) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const { uid, email } = auth.currentUser;
        return resolve({ uid, email });
      })
      .catch(error => reject(error));
  });
}

/**
 * Sign out
 * @returns {Promise<any>}
 */
export function signOut() {
  return new Promise((resolve, reject) => {
    auth
      .signOut()
      .then(() => resolve())
      .catch(error => reject(error));
  });
}
