import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);

    // BUY SWEETS STATE
    const [buyOpen, setBuyOpen] = useState(false);
    const [selectedSweetId, setSelectedSweetId] = useState(null);

    // NEW ADMIN DASHBOARD STATE
    const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

    return (
        <UserContext.Provider
            value={{
                user, setUser,
                isAdmin, setIsAdmin,
                authOpen, setAuthOpen,
                buyOpen, setBuyOpen,
                selectedSweetId, setSelectedSweetId,
                adminDashboardOpen, setAdminDashboardOpen
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
