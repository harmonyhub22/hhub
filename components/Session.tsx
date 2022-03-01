import { io } from "socket.io-client";
import { config } from "./config";

export const joinWaitQueue = async () => {
  const response = await fetch(config.server_url + "queue", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
