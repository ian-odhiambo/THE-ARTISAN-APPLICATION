import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext.jsx";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setAuthUser } = useAuthContext(true);

  const login = async (username, password, role = "customer") => {
    const success = handleInputErrors({ username, password, role });
    if (!success) return;

    setLoading(true);
    try {
      console.log("[useLogin] sending:", {
        username,
        passwordLength: password?.length,
        role,
      });

      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      console.log("[useLogin] response status:", res.status);
      console.log("[useLogin] response body:", data);

      if (!res.ok) {
        const msg = data?.error || `Request failed with status ${res.status}`;
        setError(msg);
        throw new Error(msg);
      }

      if (data?.error) {
        setError(data.error);
        throw new Error(data.error);
      }

      localStorage.setItem("authUser", JSON.stringify(data));
      setAuthUser(data);
      setError(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login, error };
};

export default useLogin;

function handleInputErrors({ username, password, role }) {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }
  if (!role || !["customer", "artisan"].includes(role)) {
    toast.error("Please select a valid role");
    return false;
  }

  return true;
}
