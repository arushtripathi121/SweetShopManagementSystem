import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    return (
        <UserContext.Provider
            value={{
                user, setUser,
                isAdmin, setIsAdmin,
                authOpen, setAuthOpen
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
