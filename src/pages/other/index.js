import loadable from 'react-loadable';

// Use react-loadable to make component-centric code splitting.

export const ListPage = loadable({
  loader: () => import('./List'),
  loading: () => null
});

export const NewTrack = loadable({
  loader: () => import('./NewTrack'),
  loading: () => null
});

export const Profile = loadable({
  loader: () => import('./Profile'),
  loading: () => null
});

export const ReviewTrack = loadable({
  loader: () => import('./ReviewTrack'),
  loading: () => null
});

export const UserList = loadable({
  loader: () => import('./UserList'),
  loading: () => null
});

export const UserForm = loadable({
  loader: () => import('./UserForm'),
  loading: () => null
});
