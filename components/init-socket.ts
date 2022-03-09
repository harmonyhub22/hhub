import { io } from "socket.io-client";
import { config } from "./config";

export const createSocket = (memberId: string) => {
  console.log(config.server_url);
  const socket = io(config.socket_url + "", {
    query: {
      memberId: memberId,
    },
  });
  socket.on("connect", () => {
    console.log("connected!");
  });

  socket.on("disconnect", () => {
    console.log("disconnected!");
  });

  socket.on("message", (msg) => {
    console.log(msg);
  });

  socket.on("error", (error) => {
    console.log("error connecting!!");
  });

  return socket;
};
