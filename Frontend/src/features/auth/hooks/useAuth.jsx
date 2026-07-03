import { useContext } from "react";
import { authContext } from "../AuthContext.jsx";
import { register, login, logout } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(authContext);
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);
            const data = await login({ email, password });
            if (data?.user) {
                setUser(data.user);
            }
        } catch (_) {
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);
            const data = await register({ username, email, password });
            if (data?.user) {
                setUser(data.user);
            }
        } catch (_) {
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            setUser(null);
        } catch (_) {
        } finally {
            setLoading(false);
        }
    }

    return { user, loading, handleLogin, handleRegister, handleLogout };
}