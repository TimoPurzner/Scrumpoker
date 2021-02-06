import React, { Component } from 'react';

const UserContext = React.createContext({
  state: {},
  actions: {},
});

class UserProvider extends Component {
  actions: any;
  constructor(props: any) {
    super(props);
    this.state = {
      user: {},
      loading: true,
      sessionValid: true,
    };
    this.actions = {
      isAuth: this.isAuth,
      logout: this.logout,
    };
  }

  componentWillMount() {}

  isAuth = () => {
    return localStorage.getItem('user_id') ? true : false;
  };

  logout = () => {
    localStorage.removeItem('user_id');
    this.setState({ user: {} });
  };

  render() {
    return (
      <UserContext.Provider
        value={{
          state: this.state,
          actions: this.actions,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export { UserProvider, UserContext };
