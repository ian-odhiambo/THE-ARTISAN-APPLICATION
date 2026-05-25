import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext.jsx";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    role,
  }) => {
    const success = handleInputErrors({
      fullName,
      username,
      password,
      confirmPassword,
      role,
    });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          password,
          confirmPassword,
          role,
        }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      //we will save it to the local storage, this is a code for implementation of just that
      localStorage.setItem("authUser", JSON.stringify(data));
      //The context value
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }; //  signup function closes here, it is a function nested in a function

  return { loading, signup };
}; // useSignup hook closes here, this is essential, do not move it up or down

export default useSignup;

function handleInputErrors({
  fullName,
  username,
  password,
  confirmPassword,
  role,
}) {
  if (!fullName || !username || !password || !confirmPassword) {
    toast.error("All fields are required");
    return false;
  }

  if (!role || !["customer", "artisan"].includes(role)) {
    toast.error("Please select customer or artisan role.");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return false;
  }

  return true;
}
