import { io } from "socket.io-client";
import Layer from "../interfaces/models/Layer";
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
    if (!response.ok) {
      throw new Error(await response.json());
    }
    const queue: Queue = await response.json();
    return queue;
  } catch (e) {
    console.log(e);
    return null;
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
    if (!response.ok) {
      throw new Error(await response.json());
    }
    const s: Session = await response.json();
    console.log(s);
    return s;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSession = async (sessionId: string) => {
  try {
    const response = await fetch(
      config.server_url + "api/session/" + sessionId,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(await response.json());
    }
    const s: Session = await response.json();
    console.log(s);
    return s;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const postLayer = async (sessionId: string, layerData: any) => {
  try {
    const response = await fetch(
      config.server_url + "api/session/" + sessionId + "/layers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(layerData),
      }
    );
    const l: Layer = await response.json();
    console.log(l);
    return l;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const postLayerRecording = async (
  sessionId: string,
  layerId: string,
  formData: FormData
) => {
  try {
    const response = await fetch(
      config.server_url + "api/session/" + sessionId + "/layers/" + layerId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );
    const l: Layer = await response.json();
    console.log(l);
    return l;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getLayerById = async (sessionId: string, layerId: string) => {
  try {
    const response = await fetch(
      config.server_url + "api/session/" + sessionId + "/layers/" + layerId,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(await response.json());
    }
    const l: Layer = await response.json();
    console.log(l);
    return l;
  } catch (e) {
    console.log(e);
    return null;
  }
};
