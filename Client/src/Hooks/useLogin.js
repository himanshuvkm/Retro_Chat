import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContetx";
import { getUserFriendlyError } from "../utils/errorUtils";
const API_BASE = import.meta.env.VITE_API_URL;
const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (username, password) => {
        const success = handleInputErrors({

            username,
            password,

        });
        if (!success) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);

            }

            localStorage.setItem("user", JSON.stringify(data.data));
            setAuthUser(data.data);

        } catch (error) {
            toast.error(getUserFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

function handleInputErrors(inputs) {
    const { username, password } = inputs;
    let isValid = true;

    if (!username || !password) {
        toast.error("All fields are required");
        isValid = false;
    }

    return isValid;
}

export default useLogin;
