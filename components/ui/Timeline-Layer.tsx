import { Badge, Button, Code, Description, Input, Modal, Popover, Slider, Tag, Tooltip } from "@geist-ui/core";
import { Mic, Music, CheckInCircle, MoreVertical, Trash2, Copy, Repeat, VolumeX, Edit3, Info, Sunrise } from '@geist-ui/icons'
import React from "react";
import * as Tone from "tone";
import { initResize } from "./helpers/resize";

interface TimelineLayerProps {
  soundName: string|null,
  soundBufferDate: string|null,
  soundBuffer: Blob|null,
  bucketUrl: string|null,
  duration: number,
  initialTimelinePosition: number,
  creatorInitials: string,
  timelineSeconds: number,
  timelineWidth: number,
  trimmedStart: number,
  trimmedEnd: number,
  fadeInDuration: number,
  fadeOutDuration: number,
  reversed: boolean,
  top: number,
};

interface TimelineLayerState {
  tonePlayer: any|null,
  committed: boolean|null, // if true, there partner should see it
  timelinePosition: number, // beats or seconds (tbd) from the beginning of timeline
  trimmedStart: number, // ie. song is 10 seconds and they trim a second off of the beginning, trimmedStart = 1
  trimmedEnd: number, // ie. song is 10 seconds and they trim 2 seconds off of the end, trimmedEnd = 2
  // optional options
  muted: boolean, // must be unique
  name: string,
  fadeInDuration: number,
  fadeOutDuration: number,
  reversed: boolean,
  flaggedForDelete: boolean,
  renaming: boolean,
  newName: string,
  layerMaxWidth: number,
};

class TimelineLayer extends React.Component<TimelineLayerProps, TimelineLayerState> {

  static layerMinWidth: number = 240;

  constructor(props:TimelineLayerProps) {
    super(props);
    this.state = {
      committed: false,
      timelinePosition: props.initialTimelinePosition,
      trimmedStart: props.trimmedStart,
      trimmedEnd: props.trimmedEnd,
      tonePlayer: null,
      muted: false,
      name: `Layer-${Date.now()}`,
      fadeInDuration: props.fadeInDuration,
      fadeOutDuration: props.fadeOutDuration,
      reversed: props.reversed,
      flaggedForDelete: false,
      renaming: false,
      newName: '',
      layerMaxWidth: (props.duration / props.timelineSeconds) * props.timelineWidth,
    };
    this.handlePlayer = this.handlePlayer.bind(this);
    this.createTonePlayer = this.createTonePlayer.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.handleFadeIn = this.handleFadeIn.bind(this);
    this.handleFadeOut = this.handleFadeOut.bind(this);
    this.handleDuplicate = this.handleDuplicate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleReverse = this.handleReverse.bind(this);
    this.setName = this.setName.bind(this);
    this.setNewName = this.setNewName.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.updateTrimmedStart = this.updateTrimmedStart.bind(this);
    this.updateTrimmedEnd = this.updateTrimmedEnd.bind(this);
  }

  componentDidMount() {
    if (this.state.tonePlayer === null) {
      this.createTonePlayer(this.props.soundName, this.props.soundBuffer, this.props.bucketUrl);
    }
    initResize(`timeline-layer-${this.state.name}`, TimelineLayer.layerMinWidth, this.state.layerMaxWidth,
      `resizer-l-${this.state.name}`, `resizer-r-${this.state.name}`, 
      this.updateTrimmedStart, this.updateTrimmedEnd);
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
    if (prevProps.duration !== this.props.duration 
      || prevProps.timelineSeconds !== this.props.timelineSeconds) {
      
      this.setState({
        layerMaxWidth: (this.props.duration / this.props.timelineSeconds) * this.props.timelineWidth,
      });
    }
  };

  createTonePlayer(name: string|null, buffer: Blob|null, bucketUrl: string|null) {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();

    if (name !== null) {
      this.setState({
        tonePlayer: new Tone.Player('../../' + name + '.mp3').toDestination(),
      });
    } else if (buffer !== null) {
      this.setState({
        tonePlayer: new Tone.Player(URL.createObjectURL(buffer)).toDestination(),
      });
    } else if (bucketUrl !== null) {
      this.setState({
        tonePlayer: new Tone.Player(bucketUrl).toDestination(),
      });
    }
  }

  getInfo() {
    return (
      <Description title="Layer Info" style={{padding: '0px 10px 0px 10px'}} content={
      <>
        <p>Committed <Code>{this.state.committed ? "Yes" : "No"}</Code></p>
        <p>Name <Code>{this.state.name}</Code></p>
        <p>Created <Code>{this.state.name}</Code></p>
        <p>Artist <Code>{this.state.name}</Code></p>
        <p>Duration <Code>{this.props.duration - this.state.trimmedStart - this.state.trimmedEnd}</Code></p>
        <p>Original Duration <Code>{this.props.duration}</Code></p>
      </>
      }></Description>
    );
  };

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
      renaming: !this.state.renaming,
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
      renaming: false,
    });
  };

  handleMute(e:any) {
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
    console.log(this.state.reversed);
    this.setState({
      reversed: !this.state.reversed,
    });
  };

  handleDuplicate() {
    // duplicate
  }

  handleDelete() {
    // delete the layer
    this.setState({
      flaggedForDelete: !this.state.flaggedForDelete,
    });
  };

  updateTrimmedStart(deltaX:number) {
    let trimmedStart = this.state.trimmedStart + (deltaX * (this.props.duration / this.state.layerMaxWidth));
    if (trimmedStart < 0) trimmedStart = 0;
    else if (trimmedStart > this.props.duration) trimmedStart = this.props.duration;
    this.setState({
      trimmedStart: trimmedStart,
    });
  };

  updateTrimmedEnd(deltaX:number) {
    let trimmedEnd = this.state.trimmedEnd + (deltaX * (this.props.duration / this.state.layerMaxWidth));
    if (trimmedEnd < 0) trimmedEnd = 0;
    else if (trimmedEnd > this.props.duration) trimmedEnd = this.props.duration;
    this.setState({
      trimmedEnd: trimmedEnd,
    });
  };

  render() {
    return (
      <>
        <Modal visible={this.state.renaming} onClose={this.handleRename}>
          <Modal.Title>Rename Layer</Modal.Title>
          <Modal.Content>
            <Input clearable initialValue={this.state.newName} placeholder="name goes here" width="100%" onChange={this.setNewName} />
          </Modal.Content>
          <Modal.Action passive onClick={this.handleRename}>Cancel</Modal.Action>
          <Modal.Action passive onClick={this.setName}>Submit</Modal.Action>
        </Modal>

        <div className="timeline-layer" id={`timeline-layer-${this.state.name}`} 
          style={{minWidth: TimelineLayer.layerMinWidth, maxWidth: this.state.layerMaxWidth, 
          width: (this.props.duration - this.state.trimmedStart - this.state.trimmedEnd) * (this.state.layerMaxWidth / this.props.duration)}}>
          <div className='timeline-layer-resizer timeline-layer-resizer-l' id={`resizer-l-${this.state.name}`}></div>

          <div className="timeline-layer-details">
            {this.state.committed === false && <div>
              <Tooltip text={'Commit - let your partner see your layer'} 
                placement="bottomStart" type="dark" className="timeline-layer-commit-btn">
                <Button style={{backgroundColor: this.state.flaggedForDelete ? "red" : "green", border: "none", borderRadius: '50%'}} iconRight={
                  <CheckInCircle color="white" size={40} />
                } auto px={0.7}
                onClick={this.handleCommit}/>
              </Tooltip>
            </div>}

            {this.state.muted ? <div className="timeline-muted-layer-wav"></div> : <div className="timeline-layer-wav"></div>}
            
            <div>
              <Popover
                content={
                  <>
                  <Popover.Item title style={{justifyContent: 'center'}}>
                    Layer Options
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center', minWidth: '170px'}}>
                    <Button auto icon={<Edit3 />} type="secondary" ghost onClick={this.handleRename} style={{width: '100%', height: '100%'}}>
                      Rename
                    </Button>
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center'}}>
                    <Button auto icon={<VolumeX />} type="warning" ghost onClick={this.handleMute} style={{width: '100%', height: '100%'}}>
                      {this.state.muted ?
                      "Unmute" : "Mute"}
                    </Button>
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center'}}>
                    Fade In
                  </Popover.Item>
                  <Popover.Item>
                    <Slider value={this.state.fadeInDuration} min={0} max={this.props.duration} 
                      step={0.5} onChange={this.handleFadeIn} />
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center'}}>
                    Fade Out
                  </Popover.Item>
                  <Popover.Item>
                    <Slider value={this.state.fadeOutDuration} min={0} max={this.props.duration} 
                      step={0.5} onChange={this.handleFadeOut} />
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center'}}>
                    <Button auto icon={<Repeat />} 
                      onClick={this.handleReverse} style={{width: '100%', height: '100%'}}>
                      {this.state.reversed ?
                      "Unreverse" : "Reverse"}
                    </Button>
                  </Popover.Item>
                  
                  <Popover.Item line />

                  <Popover.Item style={{justifyContent: 'center'}}>
                    <Button auto icon={<Copy />} type="success" onClick={this.handleDuplicate} style={{width: '100%', height: '100%'}}>
                      Duplicate
                    </Button>
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center'}}>
                    {this.state.flaggedForDelete ? 
                    <Button auto icon={<Sunrise />} type="success-light" onClick={this.handleDelete} style={{width: '100%', height: '100%'}}>
                      Restore
                    </Button> :
                    <Button auto icon={<Trash2 />} type="error" onClick={this.handleDelete} style={{width: '100%', height: '100%'}}>
                      Delete
                    </Button>}
                  </Popover.Item>
                  </>
                } style={{display: 'flex'}} disableItemsAutoClose>
                <MoreVertical />
              </Popover>
            </div>
            
            <div>
              <Popover
                content={this.getInfo()}
                style={{display: 'flex', paddingRight: '5px'}}>
                <Info />
              </Popover>
            </div>

            <div className="timeline-layer-initials">
              <Badge.Anchor placement="bottomRight" className="timeline-layer-initials">
                <Badge scale={0.1} type="warning">
                  {this.props.soundName === null ? 
                  <Mic size={16} color="white"/> :
                  <Music size={16} color="white"/>}
                </Badge>
                <Tag type="default" invert>{this.props.creatorInitials}</Tag>
              </Badge.Anchor>
            </div>
          </div>

          <div className='timeline-layer-resizer timeline-layer-resizer-r' id={`resizer-r-${this.state.name}`}></div>
        </div>
      </>
    )
  };
}

export default TimelineLayer;