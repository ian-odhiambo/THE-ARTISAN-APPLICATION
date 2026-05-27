import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis.js";

const Conversations = () => {
  const { loading, conversations } = useGetConversations();
  console.log("CONVERSATIONS", conversations);
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {loading && <span className="loading loading-spinner mx-auto"></span>}
      {!loading && conversations.length === 0 && (
        <div className="text-sm text-gray-400 text-center mt-4">
          No matching users found yet.
        </div>
      )}
      {conversations.map((conversation, index) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIndex={index === conversations.length - 1}
        />
      ))}
    </div>
  );
};

export default Conversations;

//THE ORIGINAL STARTER CODE
// import Conversation from "./Conversation"

// const Conversations = () => {
//   return (
//     <div className="py-2 flex flex-col overflow-auto">
//         <Conversation/>
//         <Conversation/>
//         <Conversation/>
//         <Conversation/>
//         <Conversation/>
//         <Conversation/>
//     </div>
//   )
// }

// export default Conversations
