// src/utils/auth.js

export const isLoggedIn = () => {
    return !!sessionStorage.getItem('authToken');
};

export const handleLogin = (userToken, userEmail) => {
    sessionStorage.setItem('authToken', userToken);
    sessionStorage.setItem('userEmail', userEmail);
};

export const getUserEmail = () => {
    return sessionStorage.getItem('userEmail') || '';
};

export default handleLogin;
