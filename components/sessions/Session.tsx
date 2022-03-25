import React, { Component } from "react";
import { Button, Modal, Text } from "@geist-ui/core";
import Member from "../../interfaces/models/Member";
import SessionInterface from "../../interfaces/models/SessionInterface";
import { getSession } from "../../api/Session";
import LayerInterface from "../../interfaces/models/LayerInterface";
import Timeline from "./Timeline";
import SessionMembers from "./SessionMembers";
import SessionOptions from "./SessionOptions";
import Router from 'next/router'

interface SessionProps {
  member: any,
  socket: any,
}

interface SessionState {
  session: SessionInterface|null,
  partner: Member|null,
  mustReturnHome: boolean,
}

class Session extends Component<SessionProps, SessionState> {
  constructor(props: SessionProps) {
    super(props);
    this.state = {
      session: null,
      partner: null,
      mustReturnHome: false,
    };
    this.commitLayer = this.commitLayer.bind(this);
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

        <Timeline layers={this.state.session?.layers ?? []} commitLayer={this.commitLayer} />

        <SessionOptions socket={this.props.socket} sessionId={this.state.session?.sessionId ?? null}
          partnerFirstname={this.state.partner?.firstname ?? ""} />
      </>
    );
  }
}

export default Session;
