import { Badge, Button, Code, Description, Input, Modal, Popover, Slider, Spacer, Tag, Tooltip } from "@geist-ui/core";
import { Mic, Music, CheckInCircle, MoreVertical, Trash2, Copy, Repeat, VolumeX, Edit3, Info, Sunrise } from '@geist-ui/icons'
import React from "react";
import Draggable from "react-draggable";
import * as Tone from "tone";
import LayerInterface from "../../interfaces/models/LayerInterface";
import { initResize } from "./helpers/resize";

interface TimelineLayerProps {
  layer: LayerInterface,
  timelineDuration: number,
  timelineWidth: number,
  soundBufferDate: string|null,
  soundBuffer: Blob|null,
  commitLayer: any,
  deleteLayer: any,
  duplicateLayer: any,
};

interface TimelineLayerState {
  currentLayer: LayerInterface,
  tonePlayer: any|null,
  committed: boolean|null, // if true, there partner should see it
  muted: boolean,
  flaggedForDelete: boolean,
  renaming: boolean,
  newName: string,
  layerMaxWidth: number,
};

class TimelineLayer extends React.Component<TimelineLayerProps, TimelineLayerState> {

  static layerMinWidth: number = 120;

  constructor(props:TimelineLayerProps) {
    super(props);
    this.state = {
      committed: (props.layer?.layerId ?? null) !== null,
      currentLayer: props.layer,
      tonePlayer: null,
      muted: false,
      flaggedForDelete: false,
      renaming: false,
      newName: '',
      layerMaxWidth: (props.layer.duration / props.timelineDuration) * props.timelineWidth,
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
    this.handleDragStop = this.handleDragStop.bind(this);
  }

  componentDidMount() {
    if (this.state.tonePlayer === null) {
      this.createTonePlayer(this.props.layer.fileName, this.props.soundBuffer, this.props.layer.bucketUrl);
    }
    initResize(`timeline-layer-${this.props.layer.layerId === null ? this.state.currentLayer.name : this.props.layer.layerId}`, 
      TimelineLayer.layerMinWidth, this.state.layerMaxWidth,
      'timeline-layer-resizer-l', 'timeline-layer-resizer-r',
      this.updateTrimmedStart, this.updateTrimmedEnd);
  }

  componentWillUnmount() {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.stop();
  }

  componentDidUpdate(prevProps:TimelineLayerProps, prevState:TimelineLayerState) {
    if (JSON.stringify(prevState.currentLayer) !== JSON.stringify(this.state.currentLayer) 
      || (prevState.flaggedForDelete !== this.state.flaggedForDelete && this.state.flaggedForDelete === true)) {
      console.log('updated layer', this.state.currentLayer);
      this.setState({
        committed: false,
      });
    }

    if (prevProps.layer.duration !== this.props.layer.duration 
      || prevProps.timelineDuration !== this.props.timelineDuration
      || prevProps.timelineWidth !== this.props.timelineWidth) {
      
      this.setState({
        layerMaxWidth: (this.props.layer.duration / this.props.timelineDuration) * this.props.timelineWidth,
      });
    }
  };

  createTonePlayer(fileName: string|null, buffer: Blob|null, bucketUrl: string|null) {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();

    if (fileName !== null) {
      this.setState({
        tonePlayer: new Tone.Player('../../' + fileName + '.mp3').toDestination(),
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
        <p>Name <Code>{this.state.currentLayer.name}</Code></p>
        <p>Artist <Code>{this.state.currentLayer.member.firstname}{' '}{this.state.currentLayer.member.lastname}</Code></p>
        <p>Duration <Code>{this.props.layer.duration - this.state.currentLayer.trimmedStartDuration - this.state.currentLayer.trimmedEndDuration}</Code></p>
        <p>Original Duration <Code>{this.props.layer.duration}</Code></p>
      </>
      }></Description>
    );
  };

  handleCommit() {
    if (this.state.flaggedForDelete === true) {
      this.props.deleteLayer(this.state.currentLayer);
    } else {
      this.props.commitLayer(this.state.currentLayer);
    }
    this.setState({
      committed: true,
    });
  };

  handlePlayer() {
    if (this.state.tonePlayer === null) return;
    this.state.tonePlayer.start(0, this.state.currentLayer.trimmedStartDuration, 
      this.props.layer.duration - this.state.currentLayer.trimmedStartDuration - this.state.currentLayer.trimmedEndDuration);
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
    this.setState(prevState => ({
      currentLayer:{
        ...prevState.currentLayer,
        name: this.state.newName,
      },
      newName: '',
      renaming: false,
    }));
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
    this.setState(prevState => ({
      currentLayer:{
        ...prevState.currentLayer,
        fadeInDuration: val,
      }
    }));
  };

  handleFadeOut(val:number) {
    this.setState(prevState => ({
      currentLayer:{
        ...prevState.currentLayer,
        fadeOutDuration: val,
      }
    }));
  };

  handleReverse() {
    this.setState(prevState => ({
      currentLayer:{
        ...prevState.currentLayer,
        reversed: !prevState.currentLayer.reversed,
      }
    }));
  };

  handleDuplicate() {
    this.props.duplicateLayer(this.state.currentLayer);
  }

  handleDelete() {
    this.setState({
      flaggedForDelete: !this.state.flaggedForDelete,
    });
  };

  updateTrimmedStart(deltaX:number) {
    const startTimeChange = deltaX * (this.props.layer.duration / this.state.layerMaxWidth);
    let trimmedStartDuration = this.state.currentLayer.trimmedStartDuration + (deltaX * (this.props.layer.duration / this.state.layerMaxWidth));
    if (trimmedStartDuration < 0) trimmedStartDuration = 0;
    else if (trimmedStartDuration > this.props.layer.duration) trimmedStartDuration = this.props.layer.duration;
    this.setState(prevState => ({
      currentLayer:{
        ...prevState.currentLayer,
        trimmedStartDuration: trimmedStartDuration,
        startTime: prevState.currentLayer.startTime + startTimeChange < 0 ? 0.0 : prevState.currentLayer.startTime + startTimeChange,
      }
    }));
  };

  updateTrimmedEnd(deltaX:number) {
    let trimmedEndDuration = this.state.currentLayer.trimmedEndDuration + (deltaX * (this.props.layer.duration / this.state.layerMaxWidth));
    if (trimmedEndDuration < 0) trimmedEndDuration = 0;
    else if (trimmedEndDuration > this.props.layer.duration) trimmedEndDuration = this.props.layer.duration;
    this.setState(prevState => ({
      currentLayer:{
        ...prevState.currentLayer,
        trimmedEndDuration: trimmedEndDuration,
      }
    }));
  };

  handleDragStop = (event:any, info:any) => {
    // console.log('Event name: ', event.type);
    // console.log(event, info);
    this.setState(prevState => ({
      currentLayer:{
        ...prevState.currentLayer,
        y: info.y,
        startTime: info.x * (this.props.timelineDuration / this.props.timelineWidth)
      }
    }));
  }

  render() {
    return (
      <Draggable
        bounds=".layer-container" // "parent"
        handle=".timeline-layer-details"
        onStop={this.handleDragStop}
        defaultPosition={{x: this.state.currentLayer.startTime * (this.props.timelineWidth / this.props.timelineDuration), y: this.state.currentLayer.y}}
      >
        <div className="timeline-layer" id={`timeline-layer-${this.props.layer.layerId === null ? this.state.currentLayer.name : this.props.layer.layerId}`} 
          style={{minWidth: `${TimelineLayer.layerMinWidth}px`, maxWidth: `${this.state.layerMaxWidth}px`, 
          width: (this.props.layer.duration - this.state.currentLayer.trimmedStartDuration - this.state.currentLayer.trimmedEndDuration) * (this.state.layerMaxWidth / this.props.layer.duration),
        }}
        >
          
          <Modal visible={this.state.renaming} onClose={this.handleRename}>
            <Modal.Title>Rename Layer</Modal.Title>
            <Modal.Content>
              <Input clearable initialValue={this.state.newName} placeholder="name goes here" width="100%" onChange={this.setNewName} />
            </Modal.Content>
            <Modal.Action passive onClick={this.handleRename}>Cancel</Modal.Action>
            <Modal.Action passive onClick={this.setName}>Submit</Modal.Action>
          </Modal>
          
          <div className='timeline-layer-resizer timeline-layer-resizer-l'></div>

          <div className="timeline-layer-details">
            {this.state.committed === false && <div>
              <Tooltip text={'Commit - let your partner see your layer'}
                placement="bottomStart" type="dark" className="timeline-layer-commit-tooltip">
                <Button style={{backgroundColor: this.state.flaggedForDelete ? "red" : "green"}} iconRight={
                  <CheckInCircle color="white" scale={0.25}/>
                } auto px={0.7} className="timeline-layer-commit-btn"
                onClick={this.handleCommit}/>
              </Tooltip>
            </div>}

            {this.state.muted ? <div className="timeline-muted-layer-wav"></div>
              : <div className="timeline-layer-wav"></div>}
            
            <div>
              <Popover
                content={
                  <>
                  <Popover.Item title style={{justifyContent: 'center'}}>
                    Layer Details
                    <Spacer w={3}/>
                    <Popover
                      content={this.getInfo()}
                      style={{display: 'flex', paddingRight: '5px'}}
                      placement="rightStart"
                      >
                      <Info />
                    </Popover>
                  </Popover.Item>
                  {this.props.layer.layerId !== null && <Popover.Item style={{justifyContent: 'center', minWidth: '170px'}}>
                    <Button auto icon={<Edit3 />} type="secondary" ghost onClick={this.handleRename} style={{width: '100%', height: '100%'}}>
                      Rename
                    </Button>
                  </Popover.Item>}
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
                    <Slider value={this.state.currentLayer.fadeInDuration} min={0} max={this.props.layer.duration} 
                      step={0.5} onChange={this.handleFadeIn} />
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center'}}>
                    Fade Out
                  </Popover.Item>
                  <Popover.Item>
                    <Slider value={this.state.currentLayer.fadeOutDuration} min={0} max={this.props.layer.duration} 
                      step={0.5} onChange={this.handleFadeOut} />
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center'}}>
                    <Button auto icon={<Repeat />} 
                      onClick={this.handleReverse} style={{width: '100%', height: '100%'}}>
                      {this.state.currentLayer.reversed ?
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

            <div className="timeline-layer-initials">
              <Badge.Anchor placement="bottomRight" className="timeline-layer-initials">
                <Badge scale={0.1} type="warning">
                  {this.props.layer.fileName === null ? 
                  <Mic size={16} color="white"/> :
                  <Music size={16} color="white"/>}
                </Badge>
                <Tag type="default" invert>{this.props.layer.member.firstname[0]}{this.props.layer.member.lastname[0]}</Tag>
              </Badge.Anchor>
            </div>
          </div>

          <div className='timeline-layer-resizer timeline-layer-resizer-r'></div>
        </div>
      </Draggable>
    )
  };
}

export default TimelineLayer;