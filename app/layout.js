import { AuthProvider } from "./context/AuthContext";

const Layout = ({ children }) => {

    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
};
export default Layout;