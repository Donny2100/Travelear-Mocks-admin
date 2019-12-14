import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import isEmpty from 'lodash/isEmpty';
import {
  defaultPropsData,
  handleSubmit,
  withData,
  withLoading
} from '../../hoc';
import queryString from '../../helpers/query-string';

const initialValues = {
  email: '',
  role: ''
};

class UserForm extends Component {
  constructor(props) {
    super(props);
    const user = this.props.data;
    this.state = {
      user: isEmpty(user) ? initialValues : user,
      errors: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const { user } = this.state;
    this.props.updatePending(true);
    const { search } = this.props.location;
    const { id } = queryString.parse(search);
    this.props
      .handleSave(id, user, 'users')
      .then(() => {
        alert('Updated successfully!');
        this.props.history.push('/admin/user');
      })
      .catch(error => {
        alert(error.message);
        this.props.updatePending(false);
      });
  }

  handleChange(e) {
    const { value, name } = e.target;
    const { user } = this.state;
    this.setState({
      user: { ...user, [name]: value }
    });
  }

  render() {
    const { user } = this.state;
    return (
      <div className="flex-full flex-center flex-column">
        <div className="flex-full flex-column flex-center">
          <form onSubmit={this.handleSubmit}>
            <div className="flex-full form new-track">
              <span className="title-page">Edit User</span>
              <select
                name="role"
                value={user.role}
                onChange={this.handleChange}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="creator">Creator</option>
                <option value="user">User</option>
              </select>
              <button
                className="width-small-button button-submit-new"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

UserForm.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  updatePending: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired
};

UserForm.defaultProps = {};

export default compose(
  defaultPropsData,
  withData,
  withLoading,
  handleSubmit
)(UserForm);
