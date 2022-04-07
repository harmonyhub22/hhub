import { io } from "socket.io-client";
import { config } from "../components/config";

export const createSocket = (memberId: string) => {
  const socket = io(config.socket_url + "", {
    query: {
      memberId: memberId,
    },
  });
  socket.on("connect", () => {
    console.log("socket connected!");
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected!");
  });

  socket.on("message", (msg) => {
    console.log('socket message', msg);
  });

  socket.on("error", (error) => {
    console.log("socker had error connecting!!");
  });

  return socket;
};
