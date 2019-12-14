import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import sortBy from 'lodash/sortBy';

import { withSubscribe } from '../../hoc';
import { makeSelectTrack, subscribe, unsubscribe } from '../../modules/track';
import { makeSelectAuth } from '../../modules/auth';
import { Track } from './components/Track';

class List extends Component {
  render() {
    const { data, role, useId } = this.props;
    return (
      <div className="flex-full flex-center flex-column">
        <div className="list flex-full">
          {data.map(track => (
            <Track key={track.id} role={role} track={track} useId={useId} />
          )).reverse()}
        </div>
      </div>
    );
  }
}

List.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  role: PropTypes.string,
  useId: PropTypes.string.isRequired
};

List.defaultProps = {
  role: 'user'
};

/**
 * Filter tracks by the user role
 * - Admin has full access to all tracks
 * - Creators can't see all pending tracks created by other creators
 * - Normal users can only see public tracks
 * @param {State} state 
 */
const mapStateToProps = state => {
  const { loading, data } = makeSelectTrack(state);

  const {
    user: { role, id }
  } = makeSelectAuth(state);

  let preData;
  if (role === 'admin') {
    preData = data;
  } else if (role === 'creator') {
    preData = data.filter(track => track.isPublic || track.author === id)
  } else {
    preData = data.filter(track => track.isPublic)
  }

  return {
    loading,
    data: sortBy(preData, 'timestamp'),
    role,
    useId: id
  };
};

const mapDispatchToProps = dispatch => ({ dispatch });

const withReducer = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withData = withSubscribe(subscribe, unsubscribe);

export default compose(
  withReducer,
  withData
)(List);
