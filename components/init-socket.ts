import { io } from "socket.io-client";
import { config } from "./config";

export const createSocket = () => {
    console.log(config.server_url);
    const socket = io(config.server_url + '');
    socket.on('connect', () => {
        console.log('connected!');
    });
  
    socket.on("disconnect", () => {
      console.log("disconnected!");
    });
  
    socket.on('message', function(msg) {
      console.log(msg);
    });
    
    socket.on("error", (error) => {
      console.log('error connecting!!')
    });

    return socket
};