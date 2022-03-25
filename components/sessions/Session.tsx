import React, { Component } from "react";
import { Button, Drawer, Modal, Text } from "@geist-ui/core";
import Member from "../../interfaces/models/Member";
import SessionInterface from "../../interfaces/models/SessionInterface";
import { getSession } from "../../api/Session";
import LayerInterface from "../../interfaces/models/LayerInterface";
import Timeline from "./Timeline";
import SessionMembers from "./SessionMembers";
import SessionOptions from "./SessionOptions";
import Router from 'next/router'
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";
import Palette from "../ui/Palette";
import { IoIosColorPalette } from "react-icons/io";

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
}

class Session extends Component<SessionProps, SessionState> {
  constructor(props: SessionProps) {
    super(props);
    this.state = {
      session: null,
      partner: null,
      mustReturnHome: false,
      neverCommittedLayers: [],
      showPalette: false,
    };
    this.commitLayer = this.commitLayer.bind(this);
    this.stageLayer = this.stageLayer.bind(this);
    this.showPalette = this.showPalette.bind(this);
  }

  async componentDidMount() {
    if (this.props.socket === undefined || this.props.member === undefined) {
      this.setState({
        mustReturnHome: true,
      });
    }
    const sessionId = window.localStorage.getItem('sid');
    if (sessionId === null) return;
    const session: SessionInterface|null = await getSession(sessionId);
    if (session === null) return;
    this.setState({
      session: session,
      partner: session.member1.memberId !== this.props.member.memberId ? session.member1 : session.member2,
    });
    if (this.props.socket === null || this.props.socket === undefined) return;
    console.log('joining session');
    this.props.socket.emit('join_session', { sessionId: sessionId });
  };

  async commitLayer(layerData:LayerInterface) {
    if (layerData.layerId === null) { // add new layer

    } else { // edit existing layer

    }
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

  render() {
    return (
      <>
        <Modal width="35rem" visible={this.state.mustReturnHome} disableBackdropClick>
          <Modal.Title>Return to Home Page</Modal.Title>
          <Modal.Content>
            <p>To rejoin your session please return home</p>
            <Button onClick={() => {window.location.assign("/")}}>Return Home</Button>
          </Modal.Content>
        </Modal>

        <SessionMembers youMemberId={this.props.member.memberId}
          member1={this.state.session?.member1 ?? null} member2={this.state.session?.member2 ?? null} />

        <Text h4 style={{textAlign: 'center'}}>Your Collaborative Session</Text>

        <Timeline layers={this.state.session?.layers ?? []} neverCommittedLayers={this.state.neverCommittedLayers} 
          commitLayer={this.commitLayer} stageLayer={this.stageLayer} />

        <SessionOptions socket={this.props.socket} sessionId={this.state.session?.sessionId ?? null}
          partnerFirstname={this.state.partner?.firstname ?? ""} />

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
