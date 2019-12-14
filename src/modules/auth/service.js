import { signIn, signOut, signUp } from '../../firebase';

/**
 * firebase sign in api
 * @param {object} input payload
 */
const signInRequest = async input => {
  const { email, password, remember } = input;
  await signIn(email, password, remember);
};

/**
 * firebase sign up api
 * @param {object} param0 payload
 */
const signUpRequest = ({ email, password }) => signUp(email, password);

/**
 * firebase sign out api
 */
const signOutRequest = async () => {
  await signOut();
};
export { signInRequest, signOutRequest, signUpRequest };
