import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);

    // NEW STATE FOR BUY MODAL
    const [buyOpen, setBuyOpen] = useState(false);
    const [selectedSweetId, setSelectedSweetId] = useState(null);

    return (
        <UserContext.Provider
            value={{
                user, setUser,
                isAdmin, setIsAdmin,
                authOpen, setAuthOpen,
                buyOpen, setBuyOpen,
                selectedSweetId, setSelectedSweetId
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
