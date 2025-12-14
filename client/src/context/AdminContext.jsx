import { createContext, useContext, useState } from "react";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
    const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

    const [addOpen, setAddOpen] = useState(false);

    const [updateOpen, setUpdateOpen] = useState(false);
    const [updateSweetData, setUpdateSweetData] = useState(null);

    const [restockOpen, setRestockOpen] = useState(false);
    const [restockData, setRestockData] = useState(null);

    return (
        <AdminContext.Provider value={{
            adminDashboardOpen, setAdminDashboardOpen,
            addOpen, setAddOpen,
            updateOpen, setUpdateOpen,
            updateSweetData, setUpdateSweetData,
            restockOpen, setRestockOpen,
            restockData, setRestockData
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
