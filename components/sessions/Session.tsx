import React, { Component } from "react";
import { Modal, Text } from "@geist-ui/core";
import Member from "../../interfaces/models/Member";
import SessionInterface from "../../interfaces/models/SessionInterface";
import { getSession } from "../../api/Session";
import LayerInterface from "../../interfaces/models/LayerInterface";
import Timeline from "./Timeline";
import SessionMembers from "./SessionMembers";
import SessionOptions from "./SessionOptions";

interface SessionProps {
  member: any;
  socket: any;
}

interface SessionState {
  session: SessionInterface|null;
  partner: Member|null;
}

class Session extends Component<SessionProps, SessionState> {
  constructor(props: SessionProps) {
    super(props);
    this.state = {
      session: null,
      partner: null,
    };
    this.commitLayer = this.commitLayer.bind(this);
  }

  async componentDidMount() {
    const sessionId = window.localStorage.getItem('sid');
    if (sessionId === null) return;
    const session: SessionInterface|null = await getSession(sessionId);
    if (session === null) return;
    this.setState({
      session: session,
      partner: session.member1.memberId === this.props.member.memberId ? session.member2 : session.member1,
    });
  };

  async commitLayer(layerData:LayerInterface) {
    if (layerData.layerId === null) { // add new layer

    } else { // edit existing layer

    }
  }

  render() {
    return (
      <>
        <Modal>
          <Modal.Title>Finishing Song</Modal.Title>
          <Modal.Content>
            <p>Would you like to leave or download the song</p>
          </Modal.Content>
          <Modal.Action passive onClick={() => {}}>
            Leave
          </Modal.Action>
          {
            <Modal.Action passive onClick={() => {}}>
              Download
            </Modal.Action>
          }
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
