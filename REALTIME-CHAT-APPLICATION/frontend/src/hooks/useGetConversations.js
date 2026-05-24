// import { useEffect } from "react";
// import { useState } from "react";
// import { useAuthContext } from "../context/AuthContext.jsx";
// import toast from "react-hot-toast";

// const useGetConversations = () => {
//   const [loading, setLoading] = useState(false);
//   const [conversations, setConversations] = useState([]);
//   const { authUser } = useAuthContext();

//   useEffect(() => {
//     const getConversation = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("/api/v1/users", { credentials: "include" });
//         const data = await res.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setConversations(filterOppositeRole(data, authUser));
//       } catch (error) {
//         toast.error(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getConversation();
//   }, [authUser]);

//   return { loading, conversations };
// };

// function filterOppositeRole(users, authUser) {
//   if (!users?.length) return users;
//   const role = authUser?.role || "customer";
//   const oppositeRole = role === "artisan" ? "customer" : "artisan";
//   return users.filter((user) => user.role === oppositeRole);
// }

// export default useGetConversations;
