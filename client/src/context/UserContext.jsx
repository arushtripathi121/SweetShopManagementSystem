import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Auth Modal
    const [authOpen, setAuthOpen] = useState(false);

    // Buy Sweet Modal
    const [buyOpen, setBuyOpen] = useState(false);
    const [selectedSweetId, setSelectedSweetId] = useState(null);

    // Admin Dashboard toggle
    const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

    // Global sweets storage (loaded once)
    const [sweets, setSweets] = useState([]);

    // Admin Modals
    const [addOpen, setAddOpen] = useState(false);

    const [updateOpen, setUpdateOpen] = useState(false);
    const [updateSweetData, setUpdateSweetData] = useState(null);

    const [restockOpen, setRestockOpen] = useState(false);
    const [restockData, setRestockData] = useState(null);

    return (
        <UserContext.Provider
            value={{
                user, setUser,
                isAdmin, setIsAdmin,
                authOpen, setAuthOpen,
                buyOpen, setBuyOpen,
                selectedSweetId, setSelectedSweetId,
                adminDashboardOpen, setAdminDashboardOpen,

                sweets, setSweets,

                addOpen, setAddOpen,
                updateOpen, setUpdateOpen,
                updateSweetData, setUpdateSweetData,
                restockOpen, setRestockOpen,
                restockData, setRestockData
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
