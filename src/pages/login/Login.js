import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { login } from '../../modules/auth';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.onLogin = this.onLogin.bind(this);
  }
  onLogin(e) {
    e.preventDefault();
    const { username, password } = this.state;
    this.props.dispatch(login(username, password, true));
  }
  render() {
    const {
      auth: { isLogin }
    } = this.props;
    const { username, password } = this.state;
    if (isLogin) {
      return <Redirect to="/" />;
    }
    return (
      <div className="flex-full flex-column flex-center">
        <h2 style={{ textAlign: 'center' }}>Login Page</h2>
        <form onSubmit={this.onLogin} className="form login">
          <input
            type="text"
            value={username}
            onChange={e => this.setState({ username: e.target.value })}
            name="username"
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            name="password"
            placeholder="Password"
          />
          <button className="margin-large-button" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    isLogin: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired
  }).isRequired
};

Login.defaultProps = {};

const mapStateToProps = state => ({
  auth: state.get('auth').toJS()
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
