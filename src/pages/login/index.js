import loadable from 'react-loadable';

// Use react-loadable to make component-centric code splitting.

export const LoginPage = loadable({
  loader: () => import('./Login'),
  loading: () => null
});

export const RegisterPage = loadable({
  loader: () => import('./Register'),
  loading: () => null
});
