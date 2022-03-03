import { io } from "socket.io-client";
import Queue from "../interfaces/models/Queue";
import Session from "../interfaces/models/Session";
import { config } from "./config";

export const joinWaitQueue = async () => {
  const response = await fetch(config.server_url + "queue", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const queue: Queue = await response.json();
  return queue;
};


export const getLiveSession = async () => {
  const response = await fetch(config.server_url + "session/live", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const s: Session = await response.json();
  return s;
};
