import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    if (!user) {
        // Redirect to home if not logged in
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
