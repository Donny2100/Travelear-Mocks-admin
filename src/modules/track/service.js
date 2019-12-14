import { Record } from 'immutable';
import { Firestore, removeDocument } from '../../firebase';
import { MUTATE, REMOVED, SUCCESS_SUBSCRIBE } from './constants';

const collection = 'tracks';

const Track = new Record({
  id: null,
  name: '',
  author: '',
  authorName: '',
  duration: '',
  location: '',
  image: {},
  file: '',
  latitude: '',
  longitude: '',
  plays: '',
  recorded: '',
  bio: '',
  tags: 0,
  isPublic: false,
  timestamp: '',
});

const Model = new Firestore(
  {
    onMutate: data => ({
      type: MUTATE,
      payload: { data }
    }),
    onRemove: id => ({
      type: REMOVED,
      payload: { id }
    }),
    onSuccess: () => ({ type: SUCCESS_SUBSCRIBE })
  },
  Track,
  collection
);

export const subscribeService = (emit, options) =>
  Model.subscribe(emit, options);
export const removeService = id => removeDocument(collection, id);
