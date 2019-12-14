import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import {
  defaultPropsData,
  handleSubmit,
  withData,
  withLoading
} from '../../hoc';
import queryString from '../../helpers/query-string';
import { removeService } from '../../modules/track/service';
import { makeSelectTrack } from '../../modules/track';
import { REMOVED } from '../../modules/track/constants';
import { connect } from 'react-redux';

class ReviewTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: this.props.data
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleSubmit() {
    this.props.updatePending(true);
    const { search } = this.props.location;
    const { id } = queryString.parse(search);
    this.props
      .handleSave(id, { ...this.state.track, isPublic: true })
      .then(() => {
        alert('Publish successfully!');
        this.props.updatePending(false);
        this.props.history.push('/');
      })
      .catch(error => {
        alert(error.message);
        this.props.updatePending(false);
      });
  }

  handleRemove() {
    const { track } = this.state;
    removeService(track.id)
      .then(() => {
        this.props.dispatch({ type: REMOVED, payload: { id: track.id } });
        this.props.history.push('/');
        alert('Remove successfully!');
      })
      .catch(error => {
        alert(error.message);
      });
  }

  render() {
    const { track } = this.state;
    return (
      <div className="flex-full flex-center flex-column">
        <div className="flex-full form">
          <span className="title-page">Review Track</span>
          <div className="detail-container">
            <div className="detail-info">
              <img
                src={track.image}
                alt={track.name}
                height="130"
                width="130"
              />
              <div className="flex-full flex-column detail-info-right">
                <span className="detail-name">{track.name}</span>
                <span>{track.authorName}</span>
                <span>{track.location}</span>
                <div>
                  <span>{track.latitude}</span>
                  <span>{track.longitude}</span>
                </div>
                <span>{track.tags}</span>
              </div>
            </div>
            <audio controls className="audio">
              <source src={track.file} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <button
            className="width-small-button button-public-detail"
            onClick={this.handleSubmit}
          >
            Public
          </button>
          <button className="width-small-button" onClick={this.handleRemove}>
            Delete
          </button>
        </div>
      </div>
    );
  }
}

ReviewTrack.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  updatePending: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired
};

ReviewTrack.defaultProps = {};

const mapStateToProps = state => {
  const { loading, data } = makeSelectTrack(state);
  return {
    loading,
    data
  };
};

const mapDispatchToProps = dispatch => ({ dispatch });

const withReducer = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withReducer,
  defaultPropsData,
  withData,
  withLoading,
  handleSubmit
)(ReviewTrack);
