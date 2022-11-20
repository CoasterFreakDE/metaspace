import { io } from "socket.io-client";


export function setupServerConnection() {
  const socket = io("ws://45.9.60.102:25571");

  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  socket.on("error", (error) => {
    console.log(error);
  });

  return socket;
}