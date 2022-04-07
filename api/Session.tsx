import { io } from "socket.io-client";
import Queue from "../interfaces/models/Queue";
import SessionInterface from "../interfaces/models/SessionInterface";
import { config } from "../components/config";
import LayerInterface from "../interfaces/models/LayerInterface";
import Crunker from "../components/sessions/Crunker";

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
    const s: SessionInterface = await response.json();
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
    const s: SessionInterface = await response.json();
    console.log(s);
    return s;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const syncGetSession = (sessionId: string, setSession: any) => {
  fetch(
    config.server_url + "api/session/" + sessionId,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response:any) => response.json())
  .then((data:SessionInterface) => {
    setSession(data);
  });
};

export const postLayer = async (sessionId: string, layerData: LayerInterface) => {
  try {
    let url = config.server_url + "api/session/" + sessionId + "/layers";
    if (layerData.layerId !== null) url += "/" + layerData.layerId;
    const response = await fetch(
      url,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(layerData),
      }
    );
    const l: LayerInterface = await response.json();
    console.log(l);
    return l;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const syncPostLayer = (sessionId: string, layerData: LayerInterface, layerBlob: Blob|null, 
  updateSession:any, tellPartnerToPull: any) => {

  let url = config.server_url + "api/session/" + sessionId + "/layers";
  fetch(
    url,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(layerData),
    }
  ).then((response:any) => {
    if (response.ok) {
      return response.json();
    }
  }).then((data:LayerInterface) => {
    if (layerBlob !== null && data.layerId !== null) {
      const fileUploadUrl = layerData.layerId !== null ? `${url}/upload` : `${url}/${data.layerId}/upload`;
      const formData = new FormData();
      formData.append('file', layerBlob, 'file');
      fetch(fileUploadUrl, {
        method: "PUT", 
        credentials: "include",
        body: formData,
      })
      .then(response => {
        if (response.ok) updateSession();
        else throw Error(`Server returned ${response.status}: ${response.statusText}`)
      })
      .catch(err => {
        alert('Could not upload recording :(');
      });
    } else {
      updateSession();
    }
  }).then(() => tellPartnerToPull());
};

export const syncSaveSong = (sessionData: SessionInterface, songBuffer: AudioBuffer | null, duration: number, setSaved: any) => {
  let url = config.server_url +  `api/songs/${sessionData.sessionId}`;
  fetch(
    url,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: 'new song!',
        duration: duration,
      }),
    }
  ).then((response:any) => {
    if (response.ok) {
      return response.json();
    }
    throw Error();
  }).then((data:SessionInterface) => {
    if (songBuffer != null) {
      const crunker = new Crunker();
      const blob = crunker.export(songBuffer, 'audio/mpeg').blob;
      const songUploadUrl = config.server_url + `api/session/${sessionData.sessionId}/upload`;
      const formData = new FormData();
      formData.append('file', blob, 'file');
      fetch(songUploadUrl, {
        method: "PUT", 
        credentials: "include",
        body: formData,
      })
      .then(response => {
        if (response.ok) {
          setSaved(true);
          return;
        }
        setSaved(false);
      })
      .catch(err => {
        setSaved(false);
      });
    }
    else {
      setSaved(true);
    }
  }).catch((e) => setSaved(false));
}

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
    const l: LayerInterface = await response.json();
    console.log(l);
    return l;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const deleteLayer = async (sessionId:string, layerId:string) => {
  try {
    const response = await fetch(
      config.server_url + "api/session/" + sessionId + "/layers/" + layerId,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(await response.json());
    }
    const l: LayerInterface = await response.json();
    console.log(l);
    return l;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const syncDeleteLayer = (sessionId:string, layerId:string, updateSession:any, tellPartnerToPull:any) => {
  fetch(
    config.server_url + "api/session/" + sessionId + "/layers/" + layerId,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response:any) => {
    if (response.ok) {
      updateSession();
      tellPartnerToPull();
    }
  });
}

export const syncEndSession = (sessionId:string, callback:any) => {
  fetch(
    config.server_url + `api/session/${sessionId}/end`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response:any) => {
    if (response.ok)  callback(true);
    callback(false);
  }).catch(err => {
    console.log(err);
    callback(false);
  });
};
