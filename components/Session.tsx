import { io } from "socket.io-client";
import Queue from "../interfaces/models/Queue";
import Session from "../interfaces/models/Session";
import { config } from "./config";

export const joinWaitQueue = async () => {
  try {
    const response = await fetch(config.server_url + "api/queue", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.redirected) 
      window.location.href = response.url;
    const queue: Queue = await response.json();
    return queue;
  } catch (e) {
    console.log(e);
  }
};


export const getLiveSession = async () => {
  try {
    const response = await fetch(config.server_url + "api/session/live", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.redirected) 
      window.location.href = response.url;
    const s: Session = await response.json();
    console.log(s);
    return s;
  } catch (e) {
    console.log(e);
  }
};
