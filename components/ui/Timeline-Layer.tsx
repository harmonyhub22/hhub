import { Button, Input, Modal, Popover, Slider } from "@geist-ui/core";
import { PlayFill, PauseFill, Moon, Mic, Music, CheckInCircle } from '@geist-ui/icons'
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
    this.setName = this.setName.bind(this);
    this.setNewName = this.setNewName.bind(this);
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

  handleMute() {
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

  playerOptionsContent = () => (
    <>
      <Popover.Item title>
        <span>Layer Options</span>
      </Popover.Item>
      <Popover.Item>
        <Button auto type="abort" onClick={this.handleRename}>Rename</Button>
      </Popover.Item>
      <Popover.Item>
        <Button auto type="abort" onClick={this.handleMute}>
          {this.state.muted ?
          <span>Unmute</span> : <span>Mute</span>}
        </Button>
      </Popover.Item>
      <Popover.Item>
        <span>Fade In</span>
        <Slider value={this.state.fadeInDuration} min={0} max={this.props.duration} 
          onChange={this.handleFadeIn} />
      </Popover.Item>
      <Popover.Item>
        <span>Fade Out</span>
        <Slider value={this.state.fadeOutDuration} min={0} max={this.props.duration} 
          onChange={this.handleFadeIn} />
      </Popover.Item>
      <Popover.Item>
        <Button auto type="abort" onClick={this.handleReverse}>
          {this.state.reversed ?
          <span>Unreverse</span> : <span>Reverse</span>}
        </Button>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item>
        <Button auto type="error" onClick={this.handleDelete}>Delete</Button>
      </Popover.Item>
    </>
  )

  render() {
    return (
      <>
        <div className="timeline-layer">
          {this.state.committed === false && <div>
            <Button iconRight={
              <CheckInCircle color="green" />
            } auto scale={2/3} px={0.6}
            onClick={this.handleCommit} className="play-btn" />
          </div>}
            
          <Popover content={this.playerOptionsContent}>
            <div className="timeline-layer-wav"></div>
          </Popover>

          <div style={{display: 'flex'}}>
            {this.props.stagingSoundName === null ? <Mic color="white"/> : <Music color="white"/>}
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