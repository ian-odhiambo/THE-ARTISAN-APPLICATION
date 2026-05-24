import { createContext,useState,useEffect,useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const socketContext = createContext();

export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser} = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("http://localhost:8000", {
                query: {
                    userId: authUser._id
                }
            });

            

            setSocket(socket);

            //socket.on is used to listen to the events.It can be used both in the client and server side
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            })

            return () => socket.close();
        }else{
            if(socket) {
                socket.close();
                setSocket(null)
            }
        }
    },[authUser]);
    return (
        <socketContext.Provider value={{socket,onlineUsers}}>
            {children}
        </socketContext.Provider>
    )
}
 