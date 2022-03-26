import { Card, Modal, Text, Button, Input } from "@geist-ui/core";
import React from "react";

interface SessionOptionsProps {
  socket: any,
  sessionId: string|null,
  partnerFirstname: string,
};

interface SessionOptionsState {
  youVotedToEnd: boolean,
  endSessionVotes: number,
  isMessaging: boolean,
  currentMessage: string,
};

class SessionOptions extends React.Component<SessionOptionsProps, SessionOptionsState> {
  constructor(props:SessionOptionsProps) {
    super(props);
    this.state = {
      youVotedToEnd: false,
      endSessionVotes: 0,
      isMessaging: false,
      currentMessage: "",
    }
    this.voteToEndSession = this.voteToEndSession.bind(this);
    this.registerVoteEnd = this.registerVoteEnd.bind(this);
    this.registerUnVoteEnd = this.registerUnVoteEnd.bind(this);
    this.handleMessaging = this.handleMessaging.bind(this);
    this.setCurrentMessage = this.setCurrentMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    if (this.props.socket !== undefined && this.props.socket !== null) {
      this.props.socket.on("session_vote_end", this.registerVoteEnd);
      this.props.socket.on("session_unvote_end", this.registerUnVoteEnd);
    }
  }

  componentWillUnmount() {
    if (this.props.socket !== undefined && this.props.socket !== null) {
      this.props.socket.off("session_vote_end", this.registerVoteEnd);
      this.props.socket.off("session_unvote_end", this.registerUnVoteEnd);
    }
  }

  registerVoteEnd() {
    this.setState({
      endSessionVotes: this.state.endSessionVotes + 1,
    });
  };

  registerUnVoteEnd() {
    this.setState({
      endSessionVotes: this.state.endSessionVotes - 1,
    });
  }

  voteToEndSession() {
    this.setState({
      youVotedToEnd: !this.state.youVotedToEnd,
    });
  };

  setCurrentMessage(val:string) {
    this.setState({
      currentMessage: val,
    });
  };

  sendMessage() {
    this.props.socket.emit("room-message", { message: this.state.currentMessage });
    this.setState({
      currentMessage: "",
      isMessaging: false,
    });
  };

  handleMessaging() {
    this.setState({
      isMessaging: !this.state.isMessaging,
    });
  };

  render() {
    return (
      <>
        <Modal visible={this.state.isMessaging} onClose={this.handleMessaging}>
          <Modal.Title>Message</Modal.Title>
          <Modal.Content>
            <Input clearable initialValue={this.state.currentMessage} placeholder="type message here" width="100%" onChange={(e) => this.setCurrentMessage(e.target.value)} />
          </Modal.Content>
          <Modal.Action passive onClick={this.handleMessaging}>Cancel</Modal.Action>
          <Modal.Action passive onClick={this.sendMessage}>Send</Modal.Action>
        </Modal>
  
        <Card className="session-options">
          <Button auto onClick={this.voteToEndSession} type={this.state.youVotedToEnd ? "error" : "secondary"} style={{marginRight: '5px'}}>
            End Session {this.state.endSessionVotes > 0 ? this.state.endSessionVotes : ""}
          </Button>
          <Button auto onClick={this.handleMessaging} type="warning">
            Message {this.props.partnerFirstname}
          </Button>
        </Card>
      </>
    );
  }
}

export default SessionOptions;