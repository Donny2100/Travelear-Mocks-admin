import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { makeSelectAuth } from '../modules/auth';

const PrivateRoute = ({ component: Component, isLogin, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLogin ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
  isLogin: PropTypes.bool.isRequired,
  location: PropTypes.object
};

PrivateRoute.defaultProps = {
  location: {}
};

const mapStateToProps = state => {
  const { isLogin } = makeSelectAuth(state);
  return {
    isLogin
  };
};

export default withRouter(connect(mapStateToProps)(PrivateRoute));
