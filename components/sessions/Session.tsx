import React, { Component } from "react";
import { Button, Drawer, Modal, Text } from "@geist-ui/core";
import Member from "../../interfaces/models/Member";
import SessionInterface from "../../interfaces/models/SessionInterface";
import { deleteLayer, getSession, postLayer, syncDeleteLayer, syncGetSession, syncPostLayer } from "../../api/Session";
import LayerInterface from "../../interfaces/models/LayerInterface";
import Timeline from "./Timeline";
import SessionMembers from "./SessionMembers";
import SessionOptions from "./SessionOptions";
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";
import Palette from "../ui/Palette";
import { IoIosColorPalette } from "react-icons/io";
import End from "./End";


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
  }

  setSession(session:SessionInterface|null) {
    this.setState({
      session: session,
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
    const sessionId = window.localStorage.getItem('sid');
    if (sessionId === null) return;
    syncGetSession(sessionId, this.setSession);
    
    if (this.props.socket === null || this.props.socket === undefined) return;
    console.log('joining session');
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
    this.updateSession();
  }

  commitLayer(layerData:LayerInterface) {
    console.log('commit layer', layerData);
    if (this.state.session === null || this.state.session === undefined) return;
    syncPostLayer(this.state.session.sessionId, layerData, this.updateSession);
    if (layerData.layerId === null) { // its a never comitted layer
      console.log('comitting staged layer');
      const newNeverCommittedLayers: NeverCommittedLayer[] = [];
      this.state.neverCommittedLayers.forEach((layer:NeverCommittedLayer) => {
        if (layer.layer.name !== layerData.name) newNeverCommittedLayers.push(layer);
      });
      this.setState({
        neverCommittedLayers: newNeverCommittedLayers,
      });
      console.log('never comitted layers', newNeverCommittedLayers.length);
    }
    this.props.socket.emit('pull_layer', { sessionId: this.state.session.sessionId });
  };

  deleteLayer(layerData:LayerInterface) {
    if (layerData.layerId !== null && this.state.session !== null) { // comitted
      syncDeleteLayer(this.state.session.sessionId, layerData.layerId, this.updateSession);
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

  duplicateLayer(layerData:LayerInterface) {

  }

  stageLayer(newLayer:NeverCommittedLayer) {
    this.setState({
      neverCommittedLayers: [...this.state.neverCommittedLayers, newLayer],
    });
  }

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

  render() {
    return (
      <div style={{overflowX: 'scroll', overflowY: 'hidden'}}>
        <Modal width="35rem" visible={this.state.mustReturnHome} disableBackdropClick>
          <Modal.Title>Return to Home Page</Modal.Title>
          <Modal.Content style={{textAlign: 'center'}}>
            <p>To rejoin your session please return home</p>
            <Button onClick={() => {window.location.assign("/")}}>Return Home</Button>
          </Modal.Content>
        </Modal>

        <Modal width="35rem" visible={this.state.sessionEnded} disableBackdropClick>
          <Modal.Title>Return to Home Page</Modal.Title>
          <Modal.Content style={{textAlign: 'center'}}>
            <End member = {this.props.member} session = {this.state.session}/>
          </Modal.Content>
        </Modal>

        <SessionMembers youMemberId={this.props.member.memberId}
          member1={this.state.session?.member1 ?? null} member2={this.state.session?.member2 ?? null} />

        <Timeline layers={this.state.session?.layers ?? []} neverCommittedLayers={this.state.neverCommittedLayers} 
          commitLayer={this.commitLayer} duplicateLayer={this.duplicateLayer}
          deleteLayer={this.deleteLayer}
          stageLayer={this.stageLayer} />

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
      </div>
    );
  }
}

export default Session;
