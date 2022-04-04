import { Card, Modal, Text, Button, Input } from "@geist-ui/core";
import { X } from '@geist-ui/icons'
import toast from 'react-hot-toast';
import React from "react";

interface SessionOptionsProps {
  socket: any,
  sessionId: string|null,
  partnerFirstname: string,
  endSession: any,
};

interface SessionOptionsState {
  youVotedToEnd: boolean,
  endSessionVotes: number,
  isMessaging: boolean,
  currentMessage: string,
};

interface SessionSendMsg {
  sessionId: string,
  message: string,
}

interface SessionReceiveMsg {
  name: string,
  message: string,
}

interface EndSessionMsg {
  sessionId: string,
}

class SessionOptions extends React.Component<SessionOptionsProps, SessionOptionsState> {

  static socketEndpointEndSession: string = 'session_vote_end';
  static socketEndpointUndoEndSession: string = 'session_unvote_end';

  static socketEndpointSendRoomMsg: string = 'session_room_message';
  static sessionMsgInputId: string = "session-message-input";

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
    this.registerNewMsg = this.registerNewMsg.bind(this);
    this.onEnterSubmit = this.onEnterSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.socket !== undefined && this.props.socket !== null) {
      this.props.socket.on(SessionOptions.socketEndpointEndSession, this.registerVoteEnd);
      this.props.socket.on(SessionOptions.socketEndpointUndoEndSession, this.registerUnVoteEnd);
      this.props.socket.on(SessionOptions.socketEndpointSendRoomMsg, this.registerNewMsg);
    }
  }

  componentWillUnmount() {
    if (this.props.socket !== undefined && this.props.socket !== null) {
      this.props.socket.off(SessionOptions.socketEndpointEndSession, this.registerVoteEnd);
      this.props.socket.off(SessionOptions.socketEndpointUndoEndSession, this.registerUnVoteEnd);
      this.props.socket.off(SessionOptions.socketEndpointSendRoomMsg, this.registerNewMsg);
    }
  }

  componentDidUpdate(prevProps:SessionOptionsProps, prevState:SessionOptionsState) {
    if (prevState.endSessionVotes !== this.state.endSessionVotes && this.state.endSessionVotes >= 2) {
      this.props.endSession();
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
  };

  registerNewMsg(data: SessionReceiveMsg) {
    console.log('got new message');
    toast((t) => (
      <>
        <div style={{marginRight: "10px"}}>
          <Text h5 my={0}>{data.name}</Text>
          <span>{data.message}</span>
        </div>
        <div style={{marginLeft: "10px"}}>
          <Button onClick={() => toast.dismiss(t.id)} iconRight={<X color="white" />} auto scale={2/3} px={0.6}
            style={{backgroundColor: 'transparent', borderRadius: '50%'}}
          ></Button>
        </div>
      </>
    ), 
    {
      id: data.message,
      icon: '💬',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      }
    });
  }

  voteToEndSession() {
    const data: EndSessionMsg = {
      sessionId: this.props.sessionId ?? ''
    }
    if (this.state.youVotedToEnd) {
      this.props.socket.emit(SessionOptions.socketEndpointUndoEndSession, data);
    } else {
      this.props.socket.emit(SessionOptions.socketEndpointEndSession, data);
    }
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
    const data: SessionSendMsg = {
      sessionId: this.props.sessionId ?? '',
      message: this.state.currentMessage,
    }
    this.props.socket.emit(SessionOptions.socketEndpointSendRoomMsg, data);
    this.setState({
      currentMessage: '',
      isMessaging: false,
    });
  };

  handleMessaging() {
    this.setState({
      isMessaging: !this.state.isMessaging,
    });
  };

  onEnterSubmit(e:any) {
    if(e.key === 'Enter') {  
      e.preventDefault();
      this.sendMessage();     
    }
  }

  render() {
    return (
      <>
        <Modal visible={this.state.isMessaging} onClose={this.handleMessaging}>
          <Modal.Title>Message</Modal.Title>
          <Modal.Content>
            <Input id={SessionOptions.sessionMsgInputId} clearable initialValue={this.state.currentMessage} 
              placeholder="type message here" width="100%" onChange={(e:any) => this.setCurrentMessage(e.target.value)}
              onKeyDown={this.onEnterSubmit} />
          </Modal.Content>
          <Modal.Action passive onClick={this.handleMessaging}>Cancel</Modal.Action>
          <Modal.Action passive onClick={this.sendMessage}>Send</Modal.Action>
        </Modal>
  
        <Card className="session-options">
          <Button auto onClick={this.voteToEndSession} ghost shadow type={this.state.youVotedToEnd ? "error" : "secondary"} style={{marginRight: '5px'}}>
            End Session {this.state.endSessionVotes > 0 ? this.state.endSessionVotes : ""}
          </Button>
          <Button auto onClick={this.handleMessaging} ghost shadow type="warning">
            Message {this.props.partnerFirstname}
          </Button>
        </Card>
      </>
    );
  }
}

export default SessionOptions;