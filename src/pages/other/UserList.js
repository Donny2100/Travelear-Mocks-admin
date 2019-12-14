import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import { withSubscribe } from '../../hoc';
import {
  makeSelectUser,
  subscribe,
  unsubscribe,
  remove
} from '../../modules/user';

class UserList extends Component {
  constructor(props, context) {
    super(props, context);
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete(id) {
    //eslint-disable-next-line
    confirm('Are you want delete this user?')
      ? this.props.dispatch(remove(id))
      : null;
  }

  render() {
    const { data } = this.props;
    return (
      <div className="flex-full flex-center flex-column">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`user/form?collection=users&id=${user.id}`}>
                    Edit
                  </Link>
                  <button
                    style={{ width: '60px' }}
                    onClick={() => this.onDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

UserList.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

UserList.defaultProps = {};

const mapStateToProps = state => {
  const { loading, data } = makeSelectUser(state);
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
const withData = withSubscribe(subscribe, unsubscribe);

export default compose(
  withReducer,
  withData
)(UserList);
