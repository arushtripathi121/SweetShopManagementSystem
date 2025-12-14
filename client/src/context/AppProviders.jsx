import { AuthProvider } from "./AuthContext";
import { BuySweetProvider } from "./BuySweetContext";
import { AdminProvider } from "./AdminContext";

export const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
            <BuySweetProvider>
                <AdminProvider>
                    {children}
                </AdminProvider>
            </BuySweetProvider>
        </AuthProvider>
    );
};
