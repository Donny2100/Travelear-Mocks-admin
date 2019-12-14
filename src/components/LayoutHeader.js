import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class LayoutHeader extends Component {
  render() {
    const { auth } = this.props;
    const { user } = auth;
    return (
      <div className="header">
        <Link to="/">
          <span>travelear</span>
        </Link>
        {auth.isLogin && (
          <div className="header-menu">
            {user.role === 'admin' && <Link to="/admin/user">User</Link>}
            {(user.role === 'admin' || user.role === 'creator') && (
              <Link to="/admin/new-track?collection=tracks">New</Link>
            )}
            <Link to={`/admin/profile?collection=users&id=${auth.user.id}`}>
              Profile
            </Link>
            <a onClick={this.props.logout}>Logout</a>
          </div>
        )}
      </div>
    );
  }
}

LayoutHeader.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

LayoutHeader.defaultProps = {};

export default LayoutHeader;
