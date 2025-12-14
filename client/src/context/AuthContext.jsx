import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);

    return (
        <AuthContext.Provider value={{
            user, setUser,
            isAdmin, setIsAdmin,
            authOpen, setAuthOpen
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
