import { firestore } from './firebase';

/**
 * format data from snapshot
 * @param entity
 * @param ModalData
 * @returns {*}
 */
export function unwrapSnapshot(entity, ModalData = null) {
  if (ModalData) {
    return new ModalData({ id: entity.id, ...entity.data() });
  }
  return Object.assign({}, { id: entity.id }, entity.data());
}

/**
 * Get collection data from path
 * @param path
 * @param ModalData
 * @returns {Promise<Array>}
 */

export const getCollection = async (path, ModalData = null) =>
  firestore
    .collection(path)
    .get()
    .then(querySnapshot => {
      const entities = [];
      querySnapshot.forEach(entity => {
        entities.push(unwrapSnapshot(entity, ModalData));
      });
      return entities;
    });

/**
 * Add document to collection
 * @param collection
 * @param data
 * @returns {Promise<firebase.firestore.DocumentReference>}
 */
export const addDocument = async (collection, data) =>
  firestore.collection(collection).add(data);

/**
 * Update document to collection
 * @param collection
 * @param id
 * @param data
 * @returns {Promise<firebase.firestore.DocumentReference>}
 */
export const updateDocument = async (collection, id, data) =>
  firestore
    .collection(collection)
    .doc(id)
    .update(data);

/**
 * Remove document
 * @param collection
 * @param id
 * @returns {Promise<void>}
 */
export const removeDocument = async (collection, id) =>
  firestore
    .collection(collection)
    .doc(id)
    .delete();

/**
 * Get document
 * @param collection
 * @param id
 * @returns {Promise<({}&{id}&any)>}
 */
export const getDocument = async (collection, id) =>
  firestore
    .collection(collection)
    .doc(id)
    .get()
    .then(data => unwrapSnapshot(data));

/**
 * Firestore Model
 */
export class Firestore {
  constructor(actions, modalClass, collection) {
    this.actions = actions;
    this.modalClass = modalClass;
    this.collection = collection;
  }

  subscribe(emit, options = {}) {
    let query = firestore.collection(this.collection);
    // make where query
    if ('whereQueries' in options) {
      const { whereQueries } = options;
      whereQueries.forEach(({ attr, eq, value }) => {
        query = query.where(attr, eq, value);
      });
    }
    // make orderBy query
    if ('orderBy' in options) {
      const { orderBy } = options;
      orderBy.forEach(({ attr, value }) => {
        query = query.orderBy(attr, value);
      });
    }
    return query.onSnapshot(
      snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'removed') {
            emit(this.actions.onRemove(change.doc.id));
          } else {
            emit(
              this.actions.onMutate(unwrapSnapshot(change.doc, this.modalClass))
            );
          }
        });
        emit(this.actions.onSuccess());
      },
      error => {
        console.log(error);
      }
    );
  }
}
