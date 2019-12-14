import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import { compose } from 'redux';
import isEmpty from 'lodash/isEmpty';
import { makeSelectAuth } from '../../modules/auth';
import { removeService } from '../../modules/track/service';
import {
  defaultPropsData,
  handleSubmit,
  withData,
  withLoading
} from '../../hoc';
import queryString from '../../helpers/query-string';

import Upload from '../../components/Upload';

import { connect } from 'react-redux';
import { REMOVED } from '../../modules/track/constants';

const initialValues = {
  name: '',
  location: '',
  latitude: '',
  longitude: '',
  tags: '',
  image: '',
  file: '',
  bio: ''
};

class NewTrack extends Component {
  constructor(props) {
    super(props);
    const track = this.props.data;
    this.state = {
      track: isEmpty(track) ?
      initialValues :
      {
        ...track,
        recorded: moment(track.recorded.toDate()).format('YYYY-MM-DD')
      },
      errors: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAudioDuration = this.handleAudioDuration.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    const track = this.props.data;
    if (user.role === 'creator' && track.isPublic) {
      alert('Track approved, you can not edit content.');
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const { user } = this.props;
    const { track } = this.state;

    if (user.role === 'creator' && track.isPublic) {
      alert('Track approved, you can not edit content.');
      return;
    }

    this.props.updatePending(true);
    const { search } = this.props.location;
    const { id } = queryString.parse(search);
    const errors = this.validate(track);

    if (isEmpty(errors)) {
      let preData = track;
      if (!id) {
        preData = {
          isPublic: false,
          author: user.id,
          authorName: user.name ? user.name : '',
          plays: 0,
          duration: '',
          ...track,
          recorded: moment(track.recorded).toDate(),
          timestamp: new Date(),
        };
      } else {
        preData.recorded = moment(track.recorded).toDate();
      }

      this.props
        .handleSave(id, preData)
        .then(() => {
          alert('Save successfully!');
          this.props.history.push('/');
        })
        .catch(error => {
          alert(error.message);
          this.props.updatePending(false);
        });
    } else {
      this.setState({
        errors
      });
    }
  }

  handleAudioDuration(e) {
    const duration = e.target.duration;
    const transformed = moment.utc(moment.duration(duration, 'second').asMilliseconds());
    let durationString;

    if (transformed.hour()) {
      durationString = transformed.format('HH:m:ss');
    } else {
      durationString = transformed.format('m:ss');
    }

    this.setState({
      ...this.state,
      track: {
        ...this.state.track,
        duration: durationString
      }
    })
  }

  transformValue(name, value) {
    if (name === "latitude" || name === "longitude") {
      return parseFloat(value);
    }
    return value;
  }

  handleChange(e) {
    const { value, name } = e.target;
    const { track } = this.state;
    this.setState({
      track: { ...track, [name]: this.transformValue(name, value) }
    });
  }

  handleClear() {
    this.setState({
      track: initialValues
    });
  }

  handleDelete() {
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
  validate(data) {
    let errors = {};
    if (!data.name) {
      errors = { ...errors, name: 'Name is required!' };
    }
    if (!data.location) {
      errors = { ...errors, location: 'Location is required!' };
    }
    if (!data.latitude) {
      errors = { ...errors, latitude: 'Latitude is required!' };
    }
    if (!data.longitude) {
      errors = { ...errors, longitude: 'Longitude is required!' };
    }
    if (!data.image) {
      errors = { ...errors, image: 'Image is required!' };
    }
    if (!data.file) {
      errors = { ...errors, file: 'Audio is required!' };
    }
    if (!data.recorded) {
      errors = { ...errors, recorded: 'Recorded date is required!' };
    }
    return errors;
  }
  showButtonDelete() {
    const { track } = this.state;
    const { user } = this.props;
    if (!track.id) {
      return null;
    } else {
      if (
        user.role === 'admin' ||
        (user.role === 'creator' && !track.isPublic)
      ) {
        return (
          <button
            className="width-small-button"
            onClick={() => this.handleDelete()}
          >
            Delete
          </button>
        );
      }
      return null;
    }
  }
  render() {
    const { track, errors } = this.state;
    return (
      <div className="flex-full flex-center flex-column">
        <div className="flex-full flex-column flex-center">
          <form onSubmit={this.handleSubmit}>
            <div className="flex-full form new-track">
              <span className="title-page">
                {track.id ? 'Edit track' : 'New Track'}
              </span>
              <input
                type="text"
                value={track.name}
                onChange={this.handleChange}
                name="name"
                placeholder="Track Name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
              <input
                type="text"
                value={track.location}
                onChange={this.handleChange}
                name="location"
                placeholder="Track Location"
              />
              {errors.location && (
                <span className="error">{errors.location}</span>
              )}
              <div className="row_new_track">
                <input
                  type="number"
                  value={track.latitude}
                  onChange={this.handleChange}
                  name="latitude"
                  placeholder="Latitude"
                  min="-90"
                  max="90"
                  step="any"
                />
                {errors.latitude && (
                  <span className="error">{errors.latitude}</span>
                )}
                <input
                  type="number"
                  value={track.longitude}
                  onChange={this.handleChange}
                  name="longitude"
                  placeholder="Longitude"
                  min="-180"
                  max="180"
                  step="any"
                />
                {errors.longitude && (
                  <span className="error">{errors.longitude}</span>
                )}
              </div>
              <textarea
                rows={5}
                value={track.tags}
                onChange={this.handleChange}
                name="tags"
                placeholder="Tags"
              />
              <Upload
                type="input"
                value={track.image}
                accept="image"
                placeholder="Upload Image"
                onChange={this.handleChange}
                name="image"
              />
              {track.image && <img src={track.image} width={200} alt="Track" />}
              {errors.image && <span className="error">{errors.image}</span>}
              <Upload
                type="input"
                value={track.file}
                accept="audio"
                placeholder="Upload Audio"
                onChange={this.handleChange}
                name="file"
              />
              {errors.file && <span className="error">{errors.file}</span>}
              {track.file && (
                <audio key={track.file} controls onLoadedMetadata={this.handleAudioDuration}>
                  <source src={track.file} />
                </audio>
              )}
              <input
                type="date"
                name="recorded"
                value={track.recorded}
                onChange={this.handleChange}
                placeholder="Recorded Date"
              />
              <input
                type="text"
                name="bio"
                value={track.bio}
                onChange={this.handleChange}
                placeholder="Bio"
                style={{ marginBottom: 15 }}
              />
              <button
                className="width-small-button button-submit-new"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
          {this.showButtonDelete()}
          <button className="width-small-button" onClick={this.handleClear}>
            Clear
          </button>
        </div>
      </div>
    );
  }
}

NewTrack.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  updatePending: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired
};

NewTrack.defaultProps = {};

const mapStateToProps = state => {
  const { user } = makeSelectAuth(state);
  return {
    user
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
)(NewTrack);
