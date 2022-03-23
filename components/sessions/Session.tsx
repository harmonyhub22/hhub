import React, { Component } from "react";
import { Modal } from "@geist-ui/core";
import Member from "../../interfaces/models/Member";
import SessionInterface from "../../interfaces/models/SessionInterface";

interface SessionProps {
  member: any;
  socket: any;
}
interface SessionState {
  session: SessionInterface | null;
  partner: Member | null;
}
class Session extends Component<SessionProps, SessionState> {
  constructor(props: SessionProps) {
    super(props);
    this.state = {
      session: null,
      partner: null,
    };
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
      </>
    );
  }
}

export default Session;
