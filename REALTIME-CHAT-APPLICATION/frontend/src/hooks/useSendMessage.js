// import { useState } from "react";
// import useConversation from "../zustand/useConversation";
// import toast from "react-hot-toast";

// const useSendMessage = () => {
//   const [loading, setLoading] = useState(false);
//   const { messages, setMessages, selectedConversation } = useConversation();

//   const sendMessage = async (message) => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `/api/v1/message/send/${selectedConversation._id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ message }),
//         },
//       );
//       if (!res.ok) {
//         let text = "";
//         try {
//           text = await res.text();
//         } catch {}
//         throw new Error(
//           text || `Failed to send message (status ${res.status})`,
//         );
//       }
//       const data = await res.json();
//       if (data?.error) throw new Error(data.error);
//       setMessages((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));
//       return data;
//     } catch (error) {
//       toast.error(error.message);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { sendMessage, loading };
// };

// export default useSendMessage;
