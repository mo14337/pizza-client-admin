import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_SERVICE_URL);
console.log(import.meta.env.VITE_SOCKET_SERVICE_URL);
socket.on("connect", () => {
  console.log("Connected to socket server", socket.id);
});
socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

export default socket;
