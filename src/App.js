import React, { PureComponent } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { auth, getDocument } from './firebase';
import AppLayout from './pages/AppLayout';
import PrivateRoute from './components/PrivateRoute';
import configureStore from './store';
import { LoginPage, RegisterPage } from './pages/login';
import { Loading } from './components/Loading';
import './App.css';
import './index.css';

const store = configureStore({
  auth: {
    isLogin: false,
    user: {},
    loading: false
  }
});

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  /**
   * Add an observer for changes to the user's sign-in state.
   */
  componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        const userInfo = await getDocument('users', user.uid);
        const userData = {
          uid: user.uid,
          email: user.email,
          ...userInfo
        };
        store.dispatch({
          type: 'auth/LOGIN_SUCCESS',
          payload: { user: userData }
        });
      }
      this.setState({
        isReady: true
      });
    });
  }

  render() {
    const { isReady } = this.state;
    if (!isReady) {
      return <Loading />;
    }
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/login" exact name="Login" component={LoginPage} />
            <Route
              path="/register"
              exact
              name="Login"
              component={RegisterPage}
            />
            <PrivateRoute path="/" name="Dashboard" component={AppLayout} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
