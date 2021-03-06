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

export const syncJoinWaitQueue = (callback:any) => {
  fetch(
    config.server_url + "api/queue",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response:any) => {
    if (response.ok) return response.json();
    throw new Error();
  }).then((jsonResponse:Queue) => callback(jsonResponse))
  .catch((e:any) => {
    console.log(e);
    callback(null);
  });
};

export const syncLeaveWaitQueue = (callback:any) => {
  const url = config.server_url + 'api/queue';
  fetch(
    url,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response:any) => {
    if (response.ok) return callback(true);
    throw new Error();
  }).catch(e => {
    console.log(e);
    callback(false);
  });
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
  tellPartnerToPull: any) => {

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
      const fileUploadUrl = `${url}/${data.layerId}/upload`;
      const formData = new FormData();
      formData.append('file', layerBlob, 'file');
      fetch(fileUploadUrl, {
        method: "PUT", 
        credentials: "include",
        body: formData,
      })
      .then(response => {
        if (response.ok) {
          tellPartnerToPull();
          return;
        }
        throw new Error(`Server returned ${response.status}: ${response.statusText}`)
      })
      .catch(err => {
        alert('Could not upload recording :(');
      });
    } else {
      tellPartnerToPull();
    }
  });
};

export const syncSaveSong = (sessionData: SessionInterface, songBuffer: AudioBuffer | null, setSaved: any) => {
  if (songBuffer === null || songBuffer === undefined) return setSaved(false);
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
      return;
    }
    throw new Error('could not save');
  }).then(() => {
    const url = config.server_url +  `api/songs/${sessionData.sessionId}`;
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
        }),
      }
    ).then((response:any) => {
      if (response.ok) {
        setSaved(true);
        return response.json();
      }
      throw new Error('could not save song');
    })
  })
  .catch(err => {
    setSaved(false);
  });
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
