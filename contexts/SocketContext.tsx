// ============================================================
// FILE: contexts/SocketContext.tsx
// Only change: added SocketContextType interface and typed createContext
// ============================================================

"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

// ── ADD THIS INTERFACE ──
interface SocketContextType {
  socket: Socket | null;
  userId: string;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  userId: "",
});

export function SocketProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: { userId },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("[Socket] Connected:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    newSocket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, userId }}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketContext };