import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeSelectAuth, logout } from '../modules/auth';
import LayoutHeader from '../components/LayoutHeader';

import {
  ListPage,
  NewTrack,
  Profile,
  ReviewTrack,
  UserForm,
  UserList
} from './other';

class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  logout(e) {
    e.preventDefault();
    this.props.dispatch(logout());
  }
  render() {
    const { auth } = this.props;
    const {
      user: { role }
    } = auth;
    return (
      <div className="container flex-column">
        <LayoutHeader auth={auth} logout={this.logout} />
        <Switch>
          <Route path="/" exact name="ListPage" component={ListPage} />
          <Route
            path="/admin/list"
            exact
            name="Category List"
            component={ListPage}
          />
          <Route
            path="/admin/user"
            exact
            name="User List"
            component={UserList}
          />
          <Route
            path="/admin/user/form"
            exact
            name="User Form"
            component={UserForm}
          />
          {role !== 'user' && (
            <Route
              path="/admin/new-track"
              name="NewTrack"
              component={NewTrack}
            />
          )}
          <Route
            path="/admin/profile"
            exact
            name="Profile"
            component={Profile}
          />
          <Route
            path="/admin/review-track"
            name="ReviewTrack"
            component={ReviewTrack}
          />
          <Route render={() => <p>Not found</p>} />
        </Switch>
      </div>
    );
  }
}

AppLayout.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const auth = makeSelectAuth(state);
  return {
    auth
  };
};

export default withRouter(connect(mapStateToProps)(AppLayout));
