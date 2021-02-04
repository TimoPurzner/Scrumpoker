import React, {createContext, Component} from 'react';
import User from '../../model/user';

export const UserContext = createContext({});

class UserProvider extends Component {
    state = {
        light: 'a',
        dark: 'b'
    }
    render() {
        return(
            <UserContext.Provider value={{...this.state}}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserProvider;