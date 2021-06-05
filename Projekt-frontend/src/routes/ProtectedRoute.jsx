import { Route, Redirect } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import React from "react";

const ProtectedRoute = ({ children, ...rest }) => {
    const Auth = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={({ location }) =>
                Auth.isLoggedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/unauthorized",
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default ProtectedRoute;
