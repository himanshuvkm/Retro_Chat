import { useEffect, useState, createContext, useContext } from "react";
import { useAuthContext } from "./AuthContetx"; // Custom hook for authentication state
import { io } from "socket.io-client";          // Client-side Socket.io library

// Create a context for socket
const SocketContext = createContext();

// Custom hook for using socket context easily in components
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);       // Store socket instance
  const [onlineUsers, setOnlineUsers] = useState([]); // Store list of online users
  const { authUser } = useAuthContext();            // Get logged-in user info from AuthContext

  useEffect(() => {
    if (authUser) {
      // If user is logged in, connect to backend socket server
      const newSocket = io(import.meta.env.VITE_API_URL || "https://chatapplication-8385.onrender.com", {
        query: { userId: authUser._id }, // Pass userId in handshake query
      });

      setSocket(newSocket); // Save socket instance in state

      // Listen for "getOnlineUsers" event from server
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users); // Update online users list
      });

      // Cleanup: close socket when component unmounts or user logs out
      return () => {
        newSocket.close();
      };
    } else {
      // If no user is logged in, close any existing socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);
  // Effect runs whenever `authUser` changes (login/logout)

  return (
    // Provide socket instance + onlineUsers to all children components
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
