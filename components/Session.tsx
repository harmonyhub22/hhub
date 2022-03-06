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
    if (response.status === 302) {
      console.log('response redirected');
      window.location.href = (await response.json()).url;
    }
    const queue: Queue = await response.json();
    return queue;
  } catch (e) {
    console.error(e);
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
    if (response.status === 302) {
      console.log('response redirected');
      window.location.href = (await response.json()).url;
    }
    const s: Session = await response.json();
    console.log(s);
    return s;
  } catch (e) {
    console.error(e);
  }
};
