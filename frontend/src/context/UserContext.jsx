import React, { createContext, useState, useEffect } from 'react';
import { updateProfile } from '../services/api';

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

    const login = async (data) => {
        console.log("UserContext: Logging in user:", data.user.id);
        let updatedUser = data.user;
        
        // If user has no bodyType in backend but we have one locally, sync it
        if (!updatedUser.bodyType && bodyType) {
            try {
                // Sync to backend
                updatedUser = await updateProfile({ 
                    bodyType,
                    // If we have scores/stats in registration state we could sync them too
                });
            } catch (err) {
                console.error("Failed to sync local bodyType on login:", err);
            }
        }

        setUser(updatedUser);
        if (updatedUser.bodyType) setBodyType(updatedUser.bodyType);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('token', data.token);
    };

    const logout = () => {
        console.log("UserContext: Logging out, clearing storage");
        setUser(null);
        setBodyType(null);
        localStorage.clear();
        window.location.href = '/';
    };

    const saveBodyType = async (type) => {
        setBodyType(type);
        localStorage.setItem('bodyType', type);
        
        // If logged in, sync this to backend
        if (user) {
            try {
                const updatedUser = await updateProfile({ bodyType: type });
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } catch (err) {
                console.error("Failed to sync bodyType to backend:", err);
            }
        }
    };

    return (
        <UserContext.Provider value={{ user, bodyType, login, logout, saveBodyType }}>
            {children}
        </UserContext.Provider>
    );
};
