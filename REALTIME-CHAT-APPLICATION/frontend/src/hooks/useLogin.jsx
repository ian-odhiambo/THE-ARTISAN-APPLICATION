import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext.jsx";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext(true);

  const login = async (username, password) => {
    const success = handleInputErrors({ username, password });
    if (!success) return;

    setLoading(true);
    try {
      console.log("[useLogin] sending:", {
        username,
        passwordLength: password?.length,
      });

      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
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
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("authUser", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;

function handleInputErrors({ username, password }) {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}

