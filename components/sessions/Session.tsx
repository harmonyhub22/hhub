import React, { Component } from "react";
import { Button, Drawer, Modal, Text } from "@geist-ui/core";
import Member from "../../interfaces/models/Member";
import SessionInterface from "../../interfaces/models/SessionInterface";
import { syncDeleteLayer, syncGetSession, syncPostLayer } from "../../api/Session";
import LayerInterface from "../../interfaces/models/LayerInterface";
import Timeline from "./Timeline";
import SessionInfo from "./SessionInfo";
import SessionOptions from "./SessionOptions";
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";
import Palette from "../ui/Palette";
import { IoIosColorPalette } from "react-icons/io";
import End from "./End";
import { get, getAllKeys } from "../ui/helpers/indexedDb";
import Confetti from "react-confetti";


interface SessionProps {
  member: any,
  socket: any,
}

interface SessionState {
  session: SessionInterface|null,
  partner: Member|null,
  mustReturnHome: boolean,
  neverCommittedLayers: NeverCommittedLayer[],
  showPalette: boolean,
  sessionEnded: boolean,
  finalBuffer: any,
  bpm: number|null,
}

class Session extends Component<SessionProps, SessionState> {

  static socketPullLayerMsg: string = 'pull_layer';

  constructor(props: SessionProps) {
    super(props);
    this.state = {
      session: null,
      partner: null,
      mustReturnHome: false,
      neverCommittedLayers: [],
      showPalette: false,
      sessionEnded: false,
      finalBuffer: null,
      bpm: null,
    };
    this.setSession = this.setSession.bind(this);
    this.updateSession = this.updateSession.bind(this);
    this.commitLayer = this.commitLayer.bind(this);
    this.deleteLayer = this.deleteLayer.bind(this);
    this.duplicateLayer = this.duplicateLayer.bind(this);
    this.stageLayer = this.stageLayer.bind(this);
    this.showPalette = this.showPalette.bind(this);
    this.endSession = this.endSession.bind(this);
    this.registerPullLayer = this.registerPullLayer.bind(this);
    this.updateBuffer = this.updateBuffer.bind(this);
    this.tellPartnerToPull = this.tellPartnerToPull.bind(this);
    this.updateBpm = this.updateBpm.bind(this);
    this.updateStagedLayer = this.updateStagedLayer.bind(this);
  }

  setSession(session:SessionInterface|null) {
    this.setState({
      session: session,
      sessionEnded: (session?.endTime ?? null === null) ? false : true,
    });
  };

  updateSession() {
    if (this.state.session === null) return;
    syncGetSession(this.state.session.sessionId, this.setSession);
  };

  componentDidMount() {
    if (this.props.socket === undefined || this.props.member === undefined) {
      this.setState({
        mustReturnHome: true,
      });
    }
    const sessionId = window.localStorage.getItem('sessionId');
    if (sessionId === null) return;
    syncGetSession(sessionId, this.setSession);
    
    if (this.props.socket === null || this.props.socket === undefined) return;
    this.props.socket.emit('join_session', { sessionId: sessionId });
    this.props.socket.on(Session.socketPullLayerMsg, this.registerPullLayer);
  };

  componentDidUpdate(prevProps:SessionProps, prevState:SessionState) {
    if (JSON.stringify(prevState.session) !== JSON.stringify(this.state.session) && this.state.session !== null) {
      console.log(this.state.session);
      this.setState({
        partner: this.state.session.member1.memberId !== this.props.member.memberId ? this.state.session.member1 : this.state.session.member2,
      });
    }
  }

  componentWillUnmount() {
    if (this.props.socket !== undefined && this.props.socket !== null) {
      this.props.socket.off(Session.socketPullLayerMsg, this.registerPullLayer);
    }
  }

  registerPullLayer() {
    console.log('heard partner upload layer');
    this.updateSession();
  };

  tellPartnerToPull() {
    if (this.state.session !== null) {
      this.props.socket.emit('pull_layer', { sessionId: this.state.session.sessionId });
    }
  };

  commitLayer(layerData:LayerInterface, layerBlob:Blob|null) {
    console.log('commit layer', layerData);
    if (this.state.session === null || this.state.session === undefined) return;
    syncPostLayer(this.state.session.sessionId, layerData, layerBlob, this.updateSession, this.tellPartnerToPull);
    if (layerData.layerId === null) { // its a never comitted layer
      const newNeverCommittedLayers: NeverCommittedLayer[] = [];
      this.state.neverCommittedLayers.forEach((layer:NeverCommittedLayer) => {
        if (layer.layer.name !== layerData.name) newNeverCommittedLayers.push(layer);
      });
      this.setState({
        neverCommittedLayers: newNeverCommittedLayers,
      });
    }
  };

  deleteLayer(layerData:LayerInterface) {
    if (layerData.layerId !== null && this.state.session !== null) { // comitted
      syncDeleteLayer(this.state.session.sessionId, layerData.layerId, this.updateSession, this.tellPartnerToPull);
    } else {
      const newNeverCommittedLayers: NeverCommittedLayer[] = [];
      this.state.neverCommittedLayers.forEach((layer:NeverCommittedLayer) => {
        if (layer.layer.name !== layerData.name) newNeverCommittedLayers.push(layer);
      });
      this.setState({
        neverCommittedLayers: newNeverCommittedLayers,
      });
    }
  }

  duplicateLayer(layerData:NeverCommittedLayer) {
    const newLayerData: NeverCommittedLayer = layerData;
    newLayerData.layer.name = `layer-${Date.now()}`;
    newLayerData.layer.startTime = layerData.layer.startTime + layerData.layer.duration - layerData.layer.trimmedEndDuration - layerData.layer.trimmedStartDuration;
    this.stageLayer(newLayerData);
  }

  stageLayer(newLayer:NeverCommittedLayer) {
    this.setState({
      neverCommittedLayers: [...this.state.neverCommittedLayers, newLayer],
    });
    console.log([...this.state.neverCommittedLayers, newLayer]);
  }

  updateStagedLayer(updatedLayer:LayerInterface) {
    if (updatedLayer.layerId === null) { // never committed
      const neverCommittedLayers = this.state.neverCommittedLayers;
      this.state.neverCommittedLayers.forEach((l:NeverCommittedLayer, i:number) => {
        if (l.layer.name === updatedLayer.name) {
          neverCommittedLayers[i].layer = updatedLayer;
          return;
        }
      });
      this.setState({
        neverCommittedLayers: neverCommittedLayers,
      });
    } else if (this.state.session !== null) {
      const layers = this.state.session.layers;
      this.state.session.layers.forEach((l:LayerInterface, i:number) => {
        if (l.layerId === updatedLayer.layerId) {
          layers[i] = updatedLayer;
          return;
        }
      });
      this.setState({
        session: {
          ...this.state.session,
          layers: layers,
        },
      });
    }
  };

  showPalette(show:boolean) {
    this.setState({
      showPalette: show,
    });
  };

  endSession(){
    this.setState({
      sessionEnded: true,
    });
  }

  updateBuffer(buffer:any) {
    this.setState({
      finalBuffer: buffer,
    });
  };

  updateBpm(bpm:number|null) {
    this.setState({
      bpm: bpm,
    });
  };

  render() {
    return (
      <>
      {this.state.sessionEnded &&  <Confetti tweenDuration={500} numberOfPieces = {150}
            drawShape={(ctx:any) => {
            ctx.beginPath()
            for(let i = 0; i < 22; i++) {
              const angle = 0.35 * i
              const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
              const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
              ctx.lineTo(x, y)
            }
            ctx.stroke()
            ctx.closePath()
          }} >
        </Confetti>}
        <Modal width="35rem" visible={this.state.mustReturnHome} disableBackdropClick>
          <Modal.Title>Return to Home Page</Modal.Title>
          <Modal.Content style={{textAlign: 'center'}}>
            <p>To rejoin your session please return home</p>
            <Button onClick={() => {window.location.assign("/")}}>Return Home</Button>
          </Modal.Content>
        </Modal>

        <Modal width="35rem" visible={this.state.sessionEnded} disableBackdropClick>
          <Modal.Title>Session Complete</Modal.Title>
          <Modal.Content style={{textAlign: 'center'}}>
            <End member = {this.props.member} session={this.state.session} songBuffer={this.state.finalBuffer} />
          </Modal.Content>
        </Modal>

        <SessionInfo youMemberId={this.props.member.memberId}
          member1={this.state.session?.member1 ?? null} member2={this.state.session?.member2 ?? null}
          startTime={this.state.session?.startTime ?? null}
          bpm={this.state.bpm}
          updateBpm={this.updateBpm} />

        <div className="session-content">
          <Timeline
            layers={this.state.session?.layers ?? []} neverCommittedLayers={this.state.neverCommittedLayers} 
            commitLayer={this.commitLayer} duplicateLayer={this.duplicateLayer}
            deleteLayer={this.deleteLayer}
            stageLayer={this.stageLayer}
            sessionEnded={this.state.sessionEnded}
            updateFinalBuffer={this.updateBuffer}
            bpm={this.state.bpm} 
            updateStagedLayer={this.updateStagedLayer}
          />
        </div>

        <SessionOptions socket={this.props.socket} sessionId={this.state.session?.sessionId ?? null}
          partnerFirstname={this.state.partner?.firstname ?? ""} endSession={this.endSession} />

        <div className="palette-open-button">
          <Button type="secondary-light" style={{borderRadius: '6px 6px 0px 0px'}}
            onClick={() => this.showPalette(true)} icon={<IoIosColorPalette />}>
            Open Palette
          </Button>
        </div>

        <Drawer
          visible={this.state.showPalette}
          onClose={() => this.showPalette(false)}
          placement="right"
        >
          <Drawer.Content>
            <Palette stageLayer={this.stageLayer} showPalette={this.showPalette} member={this.props.member} />
          </Drawer.Content>
        </Drawer>
      </>
    );
  }
}

export default Session;
