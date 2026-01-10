import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContetx";
import toast from "react-hot-toast";
import { getUserFriendlyError } from "../utils/errorUtils";
const API_BASE = import.meta.env.VITE_API_URL;
const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ important if you're using cookies
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // ✅ Clear storage & context
      localStorage.removeItem("user");
      setAuthUser(null);

      toast.success("Logged out successfully 👋");
      navigate("/login");
    } catch (error) {
      toast.error(getUserFriendlyError(error) || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
