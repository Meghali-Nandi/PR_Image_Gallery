import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({component: Comp, loggedIn, ...rest}) => {
    return (
        <Route 
        {...rest}
        render = {(props) => {
            return loggedIn ? (
                <Comp {...props} />
            ) : (
                <Redirect to={{
                    pathname: "/",
                    state: {
                        prevLocation: "/",
                        error: "You must log in first !!"
                    }
                }}
            />
            )
            
        }}
        />
    )
}

export default ProtectedRoute