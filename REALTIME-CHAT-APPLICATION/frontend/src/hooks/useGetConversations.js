import { useEffect } from "react";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const getConversation = async () => {
      setLoading(true);
      try {
        const backend = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const url = `${backend}/api/v1/users`;
        console.log("[useGetConversations] fetching", url);
        const res = await fetch(url, { credentials: "include" });
        console.log("[useGetConversations] response status:", res.status);

        let data;
        try {
          data = await res.json();
        } catch (e) {
          const text = await res.text();
          console.log("[useGetConversations] non-JSON response body:", text);
          throw new Error(text || "Failed to parse response");
        }

        console.log("[useGetConversations] response body:", data);
        if (data?.error) {
          throw new Error(data.error);
        }
        const filtered = filterOppositeRole(data, authUser);
        console.log("[useGetConversations] authUser role:", authUser?.role);
        console.log("[useGetConversations] authUser full:", authUser);

        console.log("[useGetConversations] received users count:", Array.isArray(data) ? data.length : data);
        console.log("[useGetConversations] filtered users count:", filtered?.length);
        setConversations(filtered);


      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversation();
  }, [authUser]);

  return { loading, conversations };
};

function filterOppositeRole(users, authUser) {
  if (!users?.length) return users;
  const role = authUser?.role || "customer";
  const oppositeRole = role === "artisan" ? "customer" : "artisan";
  return users.filter((user) => user.role === oppositeRole);
}

export default useGetConversations;
