import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [bodyType, setBodyType] = useState(localStorage.getItem('bodyType') || null);

    // Load user from local storage if needed (mock auth persistence)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.bodyType) setBodyType(parsedUser.bodyType);
        }
    }, []);

    const login = (data) => {
        console.log("UserContext: Logging in user:", data.user.id);
        setUser(data.user);
        if (data.user.bodyType) setBodyType(data.user.bodyType);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
    };

    const logout = () => {
        console.log("UserContext: Logging out, clearing storage");
        setUser(null);
        setBodyType(null);
        localStorage.clear();
        window.location.href = '/';
    };

    const saveBodyType = (type) => {
        setBodyType(type);
        localStorage.setItem('bodyType', type);
        // If logged in, we should ideally sync this to backend
    };

    return (
        <UserContext.Provider value={{ user, bodyType, login, logout, saveBodyType }}>
            {children}
        </UserContext.Provider>
    );
};
