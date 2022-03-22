import { Avatar, Badge, Button, Input, Modal, Popover, Slider, Tag, Tooltip } from "@geist-ui/core";
import { PlayFill, PauseFill, Moon, Mic, Music, CheckInCircle, MoreVertical } from '@geist-ui/icons'
import React from "react";
import * as Tone from "tone";

interface TimelineLayerProps {
  stagingSoundName: string|null,
  soundBufferDate: string|null,
  stagingSoundBuffer: Blob|null,
  duration: number,
  initialTimelinePosition: number,
  creatorInitials: string,
};

interface TimelineLayerState {
  tonePlayer: any|null,
  committed: boolean|null, // if true, there partner should see it
  timelinePosition: number, // beats or seconds (tbd) from the beginning of timeline
  trimmedStart: number, // ie. song is 10 seconds and they trim a second off of the beginning, trimmedStart = 1
  trimmedEnd: number, // ie. song is 10 seconds and they trim 2 seconds off of the end, trimmedEnd = 2
  // optional options
  muted: boolean,
  name: string,
  fadeInDuration: number,
  fadeOutDuration: number,
  reversed: boolean,
  flaggedForDelete: boolean,
  renaming: boolean,
  newName: string,
};

class TimelineLayer extends React.Component<TimelineLayerProps, TimelineLayerState> {

  constructor(props:TimelineLayerProps) {
    super(props);
    this.state = {
      committed: false,
      timelinePosition: props.initialTimelinePosition,
      trimmedStart: 0,
      trimmedEnd: 0,
      tonePlayer: null,
      muted: false,
      name: `Layer-${Date.now()}`,
      fadeInDuration: 0,
      fadeOutDuration: 0,
      reversed: false,
      flaggedForDelete: false,
      renaming: false,
      newName: '',
    };
    this.handlePlayer = this.handlePlayer.bind(this);
    this.createTonePlayer = this.createTonePlayer.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.handleFadeIn = this.handleFadeIn.bind(this);
    this.handleFadeOut = this.handleFadeOut.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleReverse = this.handleReverse.bind(this);
    this.setName = this.setName.bind(this);
    this.setNewName = this.setNewName.bind(this);
    this.playerOptionsContent = this.playerOptionsContent.bind(this);
  }

  componentDidMount() {
    if (this.state.tonePlayer === null) {
      this.createTonePlayer(this.props.stagingSoundName, this.props.stagingSoundBuffer);
    }
  }

  componentWillUnmount() {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.stop();
  }

  componentDidUpdate(prevProps:TimelineLayerProps, prevState:TimelineLayerState) {
    if (prevState.fadeInDuration !== this.state.fadeInDuration
      || prevState.fadeOutDuration !== this.state.fadeOutDuration
      || prevState.flaggedForDelete !== this.state.flaggedForDelete
      || prevState.name !== this.state.name
      || prevState.reversed !== this.state.reversed
      || prevState.timelinePosition !== this.state.timelinePosition
      || prevState.trimmedStart !== this.state.trimmedStart
      || prevState.trimmedEnd !== this.state.trimmedEnd) {
      
      this.setState({
        committed: false,
      });
    }
  };

  createTonePlayer(name: string|null, buffer: Blob|null) {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();

    if (name !== null) {
      this.setState({
        tonePlayer: new Tone.Player('../../' + name + '.mp3').toDestination(),
      });
    } else if (buffer !== null) {
      this.setState({
        tonePlayer: new Tone.Player(URL.createObjectURL(buffer)).toDestination(),
      });
    }
  }

  handleCommit() {
    this.setState({
      committed: true,
    });
  };

  handlePlayer() {
    if (this.state.tonePlayer === null) return;
    this.state.tonePlayer.start(0, this.state.trimmedStart, 
      this.props.duration - this.state.trimmedStart - this.state.trimmedEnd);
  };

  handleRename() {
    this.setState({
      renaming: this.state.renaming,
    });
  };

  setNewName(e:any) {
    this.setState({
      newName: e.target.value,
    });
  };

  setName() {
    if ((this.state.newName?.length ?? 0) === 0) return;
    this.setState({
      name: this.state.newName,
      newName: '',
    });
  };

  handleMute = async (e:any) => {
    e.preventDefault();
    console.log('hi');
    if (this.state.tonePlayer.state === "started") {
      this.state.tonePlayer.stop();
    }
    this.setState({
      muted: !this.state.muted,
    });
  };

  handleFadeIn(val:number) {
    this.setState({
      fadeInDuration: val,
    });
  };

  handleFadeOut(val:number) {
    this.setState({
      fadeOutDuration: val,
    });
  };

  handleReverse() {
    this.setState({
      reversed: !this.state.reversed,
    });
  };

  handleDelete() {
    // delete the layer
    this.setState({
      flaggedForDelete: !this.state.flaggedForDelete,
    });
  };

  playerOptionsContent() {
    return (<>
      <Popover.Item title>
        Layer Options
      </Popover.Item>
      <Popover.Item style={{justifyContent: 'center'}}>
        <Button auto type="abort" onClick={this.handleRename}>Rename</Button>
      </Popover.Item>
      <Popover.Item style={{justifyContent: 'center'}}>
        <Button auto type="abort" onClick={this.handleMute}>
          {this.state.muted ?
          "Unmute" : "Mute"}
        </Button>
      </Popover.Item>
      <Popover.Item style={{justifyContent: 'center'}}>
        Fade In
      </Popover.Item>
      <Popover.Item>
        <Slider value={this.state.fadeInDuration} min={0} max={this.props.duration} 
          onChange={this.handleFadeIn} />
      </Popover.Item>
      <Popover.Item style={{justifyContent: 'center'}}>
        Fade Out
      </Popover.Item>
      <Popover.Item>
        <Slider value={this.state.fadeOutDuration} min={0} max={this.props.duration} 
          onChange={this.handleFadeIn} />
      </Popover.Item>
      <Popover.Item>
        <Button auto type="abort" onClick={this.handleReverse}>
          {this.state.reversed ?
          "Unreverse" : "Reverse"}
        </Button>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item>
        <Button auto type="error" onClick={this.handleDelete}>Delete</Button>
      </Popover.Item>
    </>);
  }

  render() {
    return (
      <>
        <div className="timeline-layer">
          <div className="timeline-layer-details">
            {this.state.committed === false && <div>
              <Tooltip text={'Commit - let your partner see your layer'} 
                placement="bottom" type="dark" className="timeline-layer-commit-btn">
                <Button style={{backgroundColor: "green", border: "none", borderRadius: '50%'}} iconRight={
                  <CheckInCircle color="white" size={40} />
                } auto px={0.7}
                onClick={this.handleCommit}/>
              </Tooltip>
            </div>}

            <div className="timeline-layer-wav"></div>
            
            <div>
              <Popover content={this.playerOptionsContent} style={{display: 'flex'}} disableItemsAutoClose>
                <MoreVertical />
              </Popover>
            </div>

            <div className="timeline-layer-initials">
              <Badge.Anchor placement="bottomRight" className="timeline-layer-initials">
                <Badge scale={0.1} type="warning">
                  {this.props.stagingSoundName === null ? 
                  <Mic size={16} color="white"/> :
                  <Music size={16} color="white"/>}
                </Badge>
                <Tag type="default" invert>{this.props.creatorInitials}</Tag>
              </Badge.Anchor>
            </div>
          </div>
        </div>
      
        <Modal visible={this.state.renaming} onClose={this.handleRename}>
          <Modal.Title>Rename Layer</Modal.Title>
          <Modal.Content>
            <Input clearable initialValue={this.state.newName} placeholder="name goes here" onChange={this.setNewName} />
          </Modal.Content>
          <Modal.Action passive onClick={this.handleRename}>Cancel</Modal.Action>
          <Modal.Action passive onClick={this.setName}>Submit</Modal.Action>
        </Modal>
      </>
    )
  };
}

export default TimelineLayer;