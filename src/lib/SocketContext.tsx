import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "./goat-api";

type SocketContextType = {
  socket: Socket | null;
  connected: boolean;
};

const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketUrl = BACKEND_URL.replace("/api", "");

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on("connect", () => {
      console.log("[Socket.io] Connected to server");
      setConnected(true);

      const activeId = localStorage.getItem("goat_active_server_id");
      if (activeId) {
        newSocket.emit("join_server", activeId);
      }
    });

    newSocket.on("disconnect", () => {
      console.log("[Socket.io] Disconnected from server");
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const activeId = localStorage.getItem("goat_active_server_id");
      if (activeId && socket && connected) {
        socket.emit("join_server", activeId);
      }
    };

    window.addEventListener("storage", handleStorage);

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === "goat_active_server_id") {
        const event = new Event("goatServerChanged");
        window.dispatchEvent(event);
      }
    };

    window.addEventListener("goatServerChanged", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("goatServerChanged", handleStorage);
      localStorage.setItem = originalSetItem;
    };
  }, [socket, connected]);

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>;
};
