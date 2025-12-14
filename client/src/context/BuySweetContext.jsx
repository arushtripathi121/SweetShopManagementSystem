import { createContext, useContext, useState } from "react";

const BuySweetContext = createContext(null);

export const BuySweetProvider = ({ children }) => {
    const [buyOpen, setBuyOpen] = useState(false);
    const [selectedSweetId, setSelectedSweetId] = useState(null);

    return (
        <BuySweetContext.Provider value={{
            buyOpen,
            setBuyOpen,
            selectedSweetId,
            setSelectedSweetId
        }}>
            {children}
        </BuySweetContext.Provider>
    );
};

export const useBuySweet = () => useContext(BuySweetContext);
