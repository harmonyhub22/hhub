import { AnyMxRecord } from "dns";
import React, { Component } from "react";
import Layer from "../../interfaces/models/Layer";
import Session from "../../interfaces/models/Session";
import SessionData from "../../interfaces/session_data";
import LayersCreated from "../../interfaces/socket-data/layers_created";
import Member from "../../interfaces/models/Member";

interface SessionUIProps {}

interface SessionUIState {
  layers: Layer | null;
  session: Session;
  sessionData: SessionData;
  partner: Member;
}
class SessionUI extends Component<SessionUIProps, SessionUIState> {
  constructor(props: SessionUIProps) {
    super(props);
    // this.state = {

    // };
  }
  partnerLayer(layerId: string) {
    if (session?.sessionId === undefined) return;
    const layer: Layer | null = getLayerById(session?.sessionId, layerId);
    if (layer === null || layer === undefined) {
      console.log("could not get partner layer");
      return;
    }
    setLayers([...layers, layer]);
  }
  render() {
    return <div></div>;
  }
}

export default SessionUI;
