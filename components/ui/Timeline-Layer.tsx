import { Badge, Button, Code, Description, Input, Modal, Popover, Slider, Spacer, Tag, Tooltip } from "@geist-ui/core";
import { Mic, Music, CheckInCircle, MoreVertical, Trash2, Copy, Repeat, VolumeX, Edit3, Info, Sunrise } from '@geist-ui/icons'
import React from "react";
import Draggable from "react-draggable";
import * as Tone from "tone";
import LayerInterface from "../../interfaces/models/LayerInterface";
import { initResize } from "./helpers/resize";
import { get } from "./helpers/indexedDb";
import Palette from "../ui/Palette";
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";

interface TimelineLayerProps {
  layer: LayerInterface,
  timelineDuration: number,
  timelineWidth: number,
  bpm: number|null,
  soundBufferId: string|null,
  commitLayer: any,
  deleteLayer: any,
  duplicateLayer: any,
  addBuffer: any,
  deleteBuffer: any,
  increaseTimeline: any,
  updateStagedLayer: any,
};

interface TimelineLayerState {
  soundBuffer: Blob|null,
  currentLayer: LayerInterface,
  tonePlayer: any|null,
  committed: boolean, // if true, there partner should see it
  flaggedForDelete: boolean,
  renaming: boolean,
  newName: string,
  layerMaxWidth: number,
};

class TimelineLayer extends React.Component<TimelineLayerProps, TimelineLayerState> {

  static layerMinWidth: number = 120;
  static DraggableZoneId: string = 'extend-timeline-zone';
  static SecondWidth: number = 50;

  constructor(props:TimelineLayerProps) {
    super(props);
    this.state = {
      soundBuffer: null,
      committed: (props.layer?.layerId ?? null) !== null,
      currentLayer: props.layer,
      tonePlayer: null,
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
    this.handleDrag = this.handleDrag.bind(this);
    this.setSoundBuffer = this.setSoundBuffer.bind(this);
  }

  componentDidMount() {
    console.log('mounted');
    if (this.state.tonePlayer === null)
      this.createTonePlayer(this.props.layer.fileName, this.state.soundBuffer, this.props.layer.bucketUrl);

    initResize(`timeline-layer-${this.props.layer.layerId === null ? this.state.currentLayer.name : this.props.layer.layerId}`, 
      TimelineLayer.layerMinWidth, this.state.layerMaxWidth,
      'timeline-layer-resizer-l', 'timeline-layer-resizer-r',
      this.updateTrimmedStart, this.updateTrimmedEnd);
    
    if (this.props.soundBufferId) {
      get(Palette.db_name, Palette.db_obj_store_name, this.props.soundBufferId, this.setSoundBuffer);
    }
  }

  componentWillUnmount() {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.stop();
  }

  componentDidUpdate(prevProps:TimelineLayerProps, prevState:TimelineLayerState) {
    if (JSON.stringify(prevState.currentLayer) !== JSON.stringify(this.state.currentLayer)) {
      this.props.updateStagedLayer(this.state.currentLayer);
    }

    if (prevState.currentLayer.reversed !== this.state.currentLayer.reversed 
      || prevState.currentLayer.fadeOutDuration!== this.state.currentLayer.fadeOutDuration 
      || prevState.currentLayer.fadeInDuration !== this.state.currentLayer.fadeInDuration
      || prevState.currentLayer.trimmedStartDuration !== this.state.currentLayer.trimmedStartDuration
      || prevState.currentLayer.startTime !== this.state.currentLayer.startTime
      || prevState.currentLayer.muted !== this.state.currentLayer.muted
      || prevState.soundBuffer !== this.state.soundBuffer) {
      this.createTonePlayer(this.props.layer.fileName, this.state.soundBuffer, this.props.layer.bucketUrl);
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
    let tonePlayer: Tone.Player | null = null;
    if (fileName !== null) {
      tonePlayer = new Tone.Player('../../' + fileName + '.mp3').toDestination();
    } else if (buffer !== null && buffer !== undefined) {
      tonePlayer = new Tone.Player(URL.createObjectURL(buffer)).toDestination();
    } else if (bucketUrl !== null) {
      tonePlayer = new Tone.Player(bucketUrl).toDestination();
    }
    if (tonePlayer === null) return;
    tonePlayer.buffer.onload = () => {
      if (tonePlayer === null) return;
      tonePlayer.reverse = this.state.currentLayer.reversed;
      tonePlayer.buffer.reverse = this.state.currentLayer.reversed;
      tonePlayer.fadeIn = this.state.currentLayer.fadeInDuration;
      tonePlayer.fadeOut = this.state.currentLayer.fadeOutDuration;
      tonePlayer.mute = this.state.currentLayer.muted;
      tonePlayer.buffer = tonePlayer.buffer.slice(this.state.currentLayer.trimmedStartDuration,this.state.currentLayer.duration - this.state.currentLayer.trimmedEndDuration);
      this.props.addBuffer(this.state.currentLayer, tonePlayer.buffer);
    }
    this.setState({
      tonePlayer: tonePlayer,
    })
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
      this.props.deleteBuffer(this.state.currentLayer.layerId,this.state.currentLayer.name)
      this.props.deleteLayer(this.state.currentLayer);
    } else {
      console.log('comitting', this.state.currentLayer);
      this.props.commitLayer(this.state.currentLayer, this.state.soundBuffer);
    }
    this.setState({
      committed: true,
    });
  };

  handlePlayer() {
    if (this.state.tonePlayer === null) return;
    this.state.tonePlayer.start(0);
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
      currentLayer:{
        ...this.state.currentLayer,
        name: this.state.newName,
      },
      newName: '',
      renaming: false,
    });
  };

  handleMute(e:any) {
    if (this.state.tonePlayer.state === "started") {
      this.state.tonePlayer.stop();
    }
    const currentLayer = this.state.currentLayer;
    currentLayer.muted = !this.state.currentLayer.muted;
    this.setState({
      currentLayer: currentLayer,
    });
  };

  handleFadeIn(val:number) {
    this.setState({
      currentLayer:{
        ...this.state.currentLayer,
        fadeInDuration: val,
      }
    });
  };

  handleFadeOut(val:number) {
    this.setState({
      currentLayer: {
        ...this.state.currentLayer,
        fadeOutDuration: val,
      }
    });
  };

  handleReverse() {
    this.setState({
      currentLayer:{
        ...this.state.currentLayer,
        reversed: !this.state.currentLayer.reversed,
      }
    });
  };

  handleDuplicate() {
    const neverCommittedLayer: NeverCommittedLayer = {
      layer: this.state.currentLayer,
      stagingSoundBufferId: this.props.soundBufferId,
    }
    this.props.duplicateLayer(neverCommittedLayer);
  };

  handleDelete() {

    this.setState({
      flaggedForDelete: !this.state.flaggedForDelete,
      committed: this.state.committed ? this.state.flaggedForDelete : false,
    });
  };

  updateTrimmedStart(deltaX:number) {
    const deltaTime = deltaX * (this.props.layer.duration / this.state.layerMaxWidth);
    let trimmedStartDuration = this.state.currentLayer.trimmedStartDuration + deltaTime;
    trimmedStartDuration = Math.round(trimmedStartDuration * 1000000 + Number.EPSILON ) / 1000000;
    let trimmedEndDuration = this.state.currentLayer.trimmedEndDuration;
    if (trimmedStartDuration < 0) {
      const leftOverDuration = this.state.currentLayer.trimmedStartDuration - trimmedStartDuration;
      trimmedStartDuration = 0.0;
      if (trimmedEndDuration > 0.0) {
        trimmedEndDuration -= leftOverDuration;
        if (trimmedEndDuration < 0) {
          trimmedEndDuration = 0.0;
        }
      }
    }
    else if (trimmedStartDuration > (this.props.layer.duration - trimmedEndDuration)) {
      trimmedStartDuration = this.props.layer.duration - trimmedEndDuration;
    }
    let startTime = this.state.currentLayer.startTime + deltaTime;
    this.setState({
      currentLayer:{
        ...this.state.currentLayer,
        trimmedStartDuration: trimmedStartDuration,
        trimmedEndDuration: trimmedEndDuration,
        startTime: startTime,
      }
    });
  };

  updateTrimmedEnd(deltaX:number) {
    const deltaTime = deltaX * (this.props.layer.duration / this.state.layerMaxWidth);
    let trimmedEndDuration = this.state.currentLayer.trimmedEndDuration + deltaTime;
    trimmedEndDuration = Math.round(trimmedEndDuration * 1000000 + Number.EPSILON ) / 1000000;
    let trimmedStartDuration = this.state.currentLayer.trimmedStartDuration;
    if (trimmedEndDuration < 0.0) {
      const leftOverDuration = this.state.currentLayer.trimmedEndDuration + trimmedEndDuration;
      trimmedEndDuration = 0.0;
      if (trimmedStartDuration > 0.0) {
        trimmedStartDuration += leftOverDuration;
        if (trimmedStartDuration < 0.0) {
          trimmedStartDuration = 0.0;
        }
      }
    } else if (trimmedEndDuration > (this.props.layer.duration - trimmedStartDuration)) {
      trimmedEndDuration = this.props.layer.duration - trimmedStartDuration
    }
    this.setState({
      currentLayer:{
        ...this.state.currentLayer,
        trimmedEndDuration: trimmedEndDuration,
        trimmedStartDuration: trimmedStartDuration,
      }
    });
  };

  handleDragStop = (event:any, info:any) => {
    this.setState({
      currentLayer:{
        ...this.state.currentLayer,
        y: info.y,
        startTime: info.x * (this.props.timelineDuration / this.props.timelineWidth),
      },
    });
  }

  handleDrag = (event:any, info:any) => {
    if (event.target.id === TimelineLayer.DraggableZoneId) {
      this.props.increaseTimeline();
    }
  };

  setSoundBuffer(soundBuffer:Blob|null) {
    this.setState({
      soundBuffer: soundBuffer,
    });
  };

  render() {
    return (
      <Draggable
        bounds=".layer-container" // "parent"
        handle=".draggable-wav"
        grid={[this.props.bpm === null ? 1 : TimelineLayer.SecondWidth / (this.props.bpm / 60), 1]}
        onStop={this.handleDragStop}
        onDrag={this.handleDrag}
        defaultPosition={{x: this.state.currentLayer.startTime * (this.props.timelineWidth / this.props.timelineDuration), y: this.state.currentLayer.y}}
      >
        <div
          className="timeline-layer" id={`timeline-layer-${this.props.layer.layerId === null ? this.state.currentLayer.name : this.props.layer.layerId}`} 
          style={{minWidth: `${TimelineLayer.layerMinWidth}px`, maxWidth: `${this.state.layerMaxWidth}px`, 
          width: `${(this.props.layer.duration - this.state.currentLayer.trimmedStartDuration - this.state.currentLayer.trimmedEndDuration) * (this.state.layerMaxWidth / this.props.layer.duration)}px`,
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

            {this.state.currentLayer.muted ? <div className="draggable-wav timeline-muted-layer-wav"></div>
              : <div className="draggable-wav timeline-layer-wav"></div>}
            
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
                  <Popover.Item>
                    <Button onClick={this.handlePlayer}>Play</Button>
                  </Popover.Item>
                  {this.props.layer.layerId !== null && <Popover.Item style={{justifyContent: 'center', minWidth: '170px'}}>
                    <Button auto icon={<Edit3 />} type="secondary" ghost onClick={this.handleRename} style={{width: '100%', height: '100%'}}>
                      Rename
                    </Button>
                  </Popover.Item>}
                  <Popover.Item style={{justifyContent: 'center'}}>
                    <Button auto icon={<VolumeX />} type="warning" ghost onClick={this.handleMute} style={{width: '100%', height: '100%'}}>
                      {this.state.currentLayer.muted ?
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