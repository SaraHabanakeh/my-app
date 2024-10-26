// PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth.js';

const PrivateRoute = ({ element: Element }) => {

    return isLoggedIn() ? <Element /> : <Navigate to="/" />;
};

export default PrivateRoute;
