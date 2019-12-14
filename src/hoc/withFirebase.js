import { lifecycle, compose, withState, withHandlers } from 'recompose';
import queryString from '../helpers/query-string';
import { addDocument, updateDocument, getDocument } from '../firebase';

/**
 * Higher order function to inject actions to subscribe and unsubscribe something into a component
 * @param {function} subscribe
 * @param {function} unsubscribe 
 */
export function withSubscribe(subscribe, unsubscribe) {
  return lifecycle({
    componentWillMount() {
      this.props.dispatch(subscribe());
    },
    componentWillUnmount() {
      this.props.dispatch(unsubscribe());
    }
  });
}

/**
 * HOC to bind data for a component to a query string in url location and pass it as props to the component
 * updateData and updateLoading are state updater. Refer to defaultPropsData HOC
 */
export const withData = lifecycle({
  componentWillMount() {
    const { search } = this.props.location;
    const { collection, id } = queryString.parse(search);
    const { updateData, updateLoading } = this.props;
    if (id) {
      getDocument(collection, id)
        .then(data => {
          updateData(data);
          updateLoading(false);
        })
        .catch(error => {
          updateLoading(false);
        });
    } else {
      updateLoading(false);
    }
  }
});

/**
 * Compose multiple state updaters into a single higher-order component
 */
export const defaultPropsData = compose(
  withState('loading', 'updateLoading', true),
  withState('pending', 'updatePending', false),
  withState('data', 'updateData', {})
);

/**
 * HOC to inject a function to submit a form
 */
export const handleSubmit = withHandlers({
  handleSave: props => async (id = null, values, collectionName = null) => {
    const { search } = props.location;
    const { collection } = queryString.parse(search);
    if (id) {
      return updateDocument(collectionName || collection, id, values);
    }
    const docRef = await addDocument(collectionName || collection, values);
    return updateDocument(collectionName || collection, docRef.id, { id: docRef.id });
  }
});
