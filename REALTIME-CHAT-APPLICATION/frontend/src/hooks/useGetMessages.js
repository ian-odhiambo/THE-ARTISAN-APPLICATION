import {useEffect, useState} from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const {messages, setMessages, selectedConversation}= useConversation();
  
  useEffect(()=>{
    const getMessages = async () => {
        setLoading(true)
        try{
            const res = await fetch(`/api/v1/message/${selectedConversation._id}`);
            if(!res.ok){
              // backend may return HTML (404), so avoid res.json() parse crash
              let text = "";
              try{ text = await res.text(); } catch {}
              throw new Error(text || `Failed to fetch messages (status ${res.status})`);
            }
            let data;
            try {
              data = await res.json();
            } catch {
              throw new Error("Server returned a non-JSON response for messages");
            }
            if(data?.error) throw new Error(data.error)
            // setMessages(data)
            setMessages(data.messages || data)

        }catch(error){
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }

    if(selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages])


  return {messages, loading};
}

export default useGetMessages;