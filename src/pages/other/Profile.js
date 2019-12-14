import React, { Component } from "react";
import PropTypes from "prop-types";

import { compose } from "redux";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";

import {
  withData,
  withLoading,
  defaultPropsData,
  handleSubmit
} from "../../hoc";
import queryString from "../../helpers/query-string";

import Upload from "../../components/Upload";
import { makeSelectAuth } from "../../modules/auth";
import { firestore } from "../../firebase";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.data,
      errors: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  updateTracks(id, authorName) {
    firestore
      .collection("tracks")
      .where("author", "==", id)
      .get()
      .then(function(querySnapshot) {
        const batch = firestore.batch();
        querySnapshot.forEach(function(doc) {
          const setTrack = firestore.collection("tracks").doc(doc.id);
          batch.update(setTrack, { authorName });
        });
        batch.commit().then(function() {
          console.log("Update successfully!");
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.updatePending(true);
    const { search } = this.props.location;
    const { id } = queryString.parse(search);
    const { user } = this.state;
    const errors = this.validate(user);
    const { role, email } = this.props.user;
    if (isEmpty(errors)) {
      this.props
        .handleSave(id, { ...user, role, email })
        .then(() => {
          alert("Save successfully!");
          this.updateTracks(id, user.name);
          this.props.updatePending(false);
        })
        .catch(error => {
          this.props.updatePending(false);
        });
    } else {
      this.setState({ errors });
    }
  }

  handleChange(e) {
    const { value, name } = e.target;
    this.setState({
      user: { ...this.state.user, [name]: value }
    });
  }

  validate(data) {
    let errors = {};
    if (!data.name) {
      errors = { ...errors, name: "Name is required!" };
    }
    if (!data.bio) {
      errors = { ...errors, bio: "Bio is required!" };
    }
    return errors;
  }

  render() {
    const { user, errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="flex-full flex-center flex-column">
          <div className="flex-full form new-track">
            <span className="title-page">Profile</span>
            <Upload name="profileImage" value={user.image} onChange={this.handleChange} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={this.handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
            <input
              type="text"
              name="location"
              value={user.location}
              onChange={this.handleChange}
              placeholder="Location"
            />
            <input
              type="date"
              name="birthday"
              value={user.birthday}
              onChange={this.handleChange}
              placeholder="Date of birth"
            />
            <input
              type="text"
              name="bio"
              value={user.bio}
              onChange={this.handleChange}
              placeholder="Bio"
            />
            {errors.bio && <span className="error">{errors.bio}</span>}
            <button
              type="submit"
              className="width-small-button margin-large-button"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    );
  }
}

Profile.propTypes = {
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  updatePending: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired
};

Profile.defaultProps = {};

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
)(Profile);
