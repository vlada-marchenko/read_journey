import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}