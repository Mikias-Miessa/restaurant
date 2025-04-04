import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: true,
  reconnection: true,
  withCredentials: true,
  transports: ["websocket", "polling"],
});
