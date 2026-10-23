import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export function useRequireAuth() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function requireAuth(action: () => void) {
        if (user) {
            action();
            return;
        }
        toast("Sign in to save favorites", { id: "auth-required" });
        navigate("/login", { state: { from: location.pathname } });
    }

    return { user, requireAuth };
}