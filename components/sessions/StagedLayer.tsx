import { Badge, Button, Code, Description, Input, Modal, Popover, Slider, Spacer, Tag, Tooltip } from "@geist-ui/core";
import { Mic, Music, CheckInCircle, MoreVertical, Trash2, Copy, Repeat, VolumeX, Edit3, Info, PlayFill, StopCircle, Volume2, CheckInCircleFill } from '@geist-ui/icons'
import React from "react";
import Draggable from "react-draggable";
import * as Tone from "tone";
import LayerInterface from "../../interfaces/models/LayerInterface";
import { initResize } from "../helpers/resize";
import { get } from "../helpers/indexedDb";
import Palette from "../palette/Palette";
import StagedLayerInterface from "../../interfaces/StagedLayerInterface";

interface StagedLayerProps {

  // from palette layer
  layer: LayerInterface,
  recordingId: string|null,
  recordingBlob: Blob|null,

  // props from timeline
  timelineDuration: number,
  bpm: number|null,

  // timeline updaters
  updateTimelineBuffer: any,
  deleteTimelineBuffer: any,
  increaseTimeline: any,

  // session updaters
  duplicateStagedLayer: any,
  commitStagedLayer: any,
  deleteStagedLayer: any,
};

interface StagedLayerState {
  recordingBlob: Blob|null,
  recordingId: string|null,
  currentLayer: LayerInterface,
  tonePlayer: any|null,
  renaming: boolean,
  newName: string,
  layerMaxWidth: number,
  newFadeInDuration: number,
  newFadeOutDuration: number,
};

class StagedLayer extends React.Component<StagedLayerProps, StagedLayerState> {

  static layerMinWidth: number = 120; // px
  static DraggableZoneId: string = 'extend-timeline-zone'; // mouse over this div id to extend timeline
  static SecondWidth: number = 50; // px (pixels-per-second)

  constructor(props:StagedLayerProps) {
    super(props);
    this.state = {
      recordingBlob: props.recordingBlob,
      recordingId: props.recordingId,
      currentLayer: props.layer,
      tonePlayer: null,
      renaming: false,
      newName: '',
      layerMaxWidth: props.layer.duration * StagedLayer.SecondWidth,
      newFadeInDuration: 0,
      newFadeOutDuration: 0,
    };

    // bind the functions to this component
    this.updateLocalStorage = this.updateLocalStorage.bind(this);
    this.getLocalStorage = this.getLocalStorage.bind(this);
    this.removeLocalStorage = this.removeLocalStorage.bind(this);
    this.handlePlayer = this.handlePlayer.bind(this);
    this.createTonePlayer = this.createTonePlayer.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.handleFadeIn = this.handleFadeIn.bind(this);
    this.handleFadeOut = this.handleFadeOut.bind(this);
    this.setFadeInDuration = this.setFadeInDuration.bind(this);
    this.setFadeOutDuration = this.setFadeOutDuration.bind(this);
    this.handleDuplicate = this.handleDuplicate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.setName = this.setName.bind(this);
    this.setNewName = this.setNewName.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.updateTrimmedStart = this.updateTrimmedStart.bind(this);
    this.updateTrimmedEnd = this.updateTrimmedEnd.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  componentDidMount() {
    // console.log('mounted staged layer', this.props.layer.layerId);
    // get data from localstorage
    const cachedState: StagedLayerState|null = this.getLocalStorage();
    if (cachedState === null) { // nothing is saved, so save initial data
      this.updateLocalStorage(this.state);
      this.createTonePlayer(this.state.currentLayer.fileName, this.state.recordingBlob);
      initResize(`staged-layer-${this.state.currentLayer.layerId}`, 
        StagedLayer.layerMinWidth, this.state.layerMaxWidth, 'staged-layer-resizer-l', 'staged-layer-resizer-r',
        this.updateTrimmedStart, this.updateTrimmedEnd);
    } else { // there is data
      // retrieve the blob recording
      if (cachedState.recordingId !== null && cachedState.recordingId !== undefined) {
        get(Palette.db_name, Palette.db_obj_store_name, cachedState.recordingId, (idbBlob: Blob|null) => {
          if (idbBlob !== null && idbBlob !== undefined) {
            this.createTonePlayer(null, idbBlob);
          }
        });
      } else {
        if (this.state.tonePlayer === null)
          this.createTonePlayer(cachedState.currentLayer.fileName, null);
      }
      initResize(`staged-layer-${cachedState.currentLayer.layerId}`, 
        StagedLayer.layerMinWidth, cachedState.layerMaxWidth, 'staged-layer-resizer-l', 'staged-layer-resizer-r',
        this.updateTrimmedStart, this.updateTrimmedEnd);
      this.setState({
        currentLayer: cachedState.currentLayer,
        layerMaxWidth: cachedState.currentLayer.duration * StagedLayer.SecondWidth,
        newName: cachedState.newName,
        recordingId: cachedState.recordingId,
        renaming: cachedState.renaming,
        newFadeInDuration: cachedState.newFadeInDuration,
        newFadeOutDuration: cachedState.newFadeOutDuration,
      });
    }
  }

  componentWillUnmount() {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.stop();
  }

  componentDidUpdate(prevProps:StagedLayerProps, prevState:StagedLayerState) {

    // update the layer in local storage
    if (JSON.stringify(prevState, (key:string, value:any) => {
      if (key === 'recordingBlob' || key === 'tonePlayer') return null;
      else return value;
    }) !== JSON.stringify(this.state, (key:string, value:any) => {
      if (key === 'recordingBlob' || key === 'tonePlayer') return null;
      else return value;
    })) {
      this.updateLocalStorage(this.state);
      if (this.state.tonePlayer === null) {
        this.createTonePlayer(this.state.currentLayer.fileName, this.state.recordingBlob);
      }
    }

    // component draggable updated so we need new listeners
    if (prevState.currentLayer.startTime !== this.state.currentLayer.startTime) {
      initResize(`staged-layer-${this.state.currentLayer.layerId}`, 
        StagedLayer.layerMinWidth, this.state.layerMaxWidth, 'staged-layer-resizer-l', 'staged-layer-resizer-r',
        this.updateTrimmedStart, this.updateTrimmedEnd);
    }

    // create a new tonePlayer
    if (prevState.currentLayer.fadeOutDuration!== this.state.currentLayer.fadeOutDuration 
      || prevState.currentLayer.fadeInDuration !== this.state.currentLayer.fadeInDuration
      || prevState.currentLayer.trimmedStartDuration !== this.state.currentLayer.trimmedStartDuration
      || prevState.currentLayer.trimmedEndDuration !== this.state.currentLayer.trimmedEndDuration
      || prevState.currentLayer.startTime != this.state.currentLayer.startTime
      || prevState.currentLayer.muted != this.state.currentLayer.muted
      || prevState.recordingId !== this.state.recordingId) {
      this.createTonePlayer(this.state.currentLayer.fileName, this.state.recordingBlob);
    }
  };

  // update the local storage for caching the layer
  updateLocalStorage(currentState: StagedLayerState) {
    const data: string = JSON.stringify(currentState, (key:string, value:any) => {
      if (key === 'recordingBlob' || key === 'tonePlayer') return null;
      else return value;
    });
    window.localStorage.setItem(`staged-layer-${this.props.layer.layerId}`, data);
  }

  // get the local storage for the cached layer
  getLocalStorage() {
    const data: string|null = window.localStorage.getItem(`staged-layer-${this.props.layer.layerId}`);
    if (data === null) return null;
    return JSON.parse(data);
  }

  // remove local storage
  removeLocalStorage() {
    window.localStorage.removeItem(`staged-layer-${this.props.layer.layerId}`);
  }

  // one function to create the tonePlayer
  createTonePlayer(fileName: string|null, recordingBlob: Blob|null) {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();

    let tonePlayer: Tone.Player | null = null;
    console.log('creating toneplayer');

    if (fileName !== null && fileName !== undefined) {
      tonePlayer = new Tone.Player('../../' + fileName + '.mp3',
       onload = () => {
        if (tonePlayer === null) return;
        tonePlayer.fadeIn = this.state.currentLayer.fadeInDuration;
        tonePlayer.fadeOut = this.state.currentLayer.fadeOutDuration;
        tonePlayer.mute = this.state.currentLayer.muted;
        tonePlayer.buffer = tonePlayer.buffer.slice(this.state.currentLayer.trimmedStartDuration,this.state.currentLayer.duration - this.state.currentLayer.trimmedEndDuration);
        this.props.updateTimelineBuffer(this.state.currentLayer, tonePlayer.buffer);
       }).toDestination();
    }
    else if (recordingBlob !== null && recordingBlob !== undefined) {
      tonePlayer = new Tone.Player(URL.createObjectURL(recordingBlob),
      onload = () => {
        if (tonePlayer === null) return;
        tonePlayer.fadeIn = this.state.currentLayer.fadeInDuration;
        tonePlayer.fadeOut = this.state.currentLayer.fadeOutDuration;
        tonePlayer.mute = this.state.currentLayer.muted;
        tonePlayer.buffer = tonePlayer.buffer.slice(this.state.currentLayer.trimmedStartDuration,this.state.currentLayer.duration - this.state.currentLayer.trimmedEndDuration);
        this.props.updateTimelineBuffer(this.state.currentLayer, tonePlayer.buffer);
       }).toDestination();
    }

    this.setState({
      tonePlayer: tonePlayer,
    });
  };

  getInfo() {
    return (
      <Description title="Layer Details" style={{padding: '0px 10px 0px 10px'}} content={
      <>
        <p>Name <Code>{this.state.currentLayer.name}</Code></p>
        <p>Artist <Code>{this.state.currentLayer.member.firstname}{' '}{this.state.currentLayer.member.lastname}</Code></p>
        <p>Start Time <Code>{Math.round(this.state.currentLayer.startTime * 100) / 100}s</Code></p>
        <p>Duration <Code>{Math.round((this.state.currentLayer.duration - this.state.currentLayer.trimmedStartDuration - this.state.currentLayer.trimmedEndDuration) * 100) / 100}s</Code></p>
        <p>Fade In <Code>{Math.round((this.state.currentLayer.fadeInDuration) * 100) / 100}s</Code></p>
        <p>Fade Out <Code>{Math.round((this.state.currentLayer.fadeOutDuration) * 100) / 100}s</Code></p>
        <p>Sound <Code>{(this.state.currentLayer.bucketUrl !== null || this.state.recordingId !== null) ? "Recording" : this.state.currentLayer.fileName}</Code></p>
      </>
      }></Description>
    );
  };

  // commit the layer, this component will unmount next
  handleCommit() {
    console.log('comitting staged layer', this.state.currentLayer.layerId);
    this.removeLocalStorage();
    this.props.deleteTimelineBuffer(this.state.currentLayer.layerId);
    this.props.commitStagedLayer(this.state.currentLayer, this.state.recordingBlob);
  };

  // delete the layer, the component will soon unmount
  handleDelete() {
    this.removeLocalStorage();
    this.props.deleteTimelineBuffer(this.state.currentLayer.layerId);
    this.props.deleteStagedLayer(this.state.currentLayer);
  };

  handleDuplicate() {
    const stagedLayer: StagedLayerInterface = {
      layer: JSON.parse(JSON.stringify(this.state.currentLayer)),
      recordingId: (' ' + this.state.recordingId).slice(1),
      recordingBlob: this.state.recordingBlob !== null && this.state.recordingBlob !== undefined ? 
        new Blob([this.state.recordingBlob], {type: this.state.recordingBlob.type}) : null,
    };
    this.props.duplicateStagedLayer(stagedLayer);
  };

  // play the tonePlayer
  handlePlayer() {
    if (this.state.tonePlayer === null) return;
    if (this.state.tonePlayer.state === "started") this.state.tonePlayer.stop();
    else this.state.tonePlayer.start(0);
  };

  // ** renaming layer section
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
  // ** end renaming layer section

  handleMute(e:any) {
    if (this.state.tonePlayer !== null && this.state.tonePlayer.state === "started") {
      this.state.tonePlayer.stop();
    }
    this.setState({
      currentLayer: {
        ...this.state.currentLayer,
        muted: !this.state.currentLayer.muted,
      }
    });
  };

  // ** fade tonePlayer section
  handleFadeIn(val:number) {
    this.setState({
      newFadeInDuration: val,
    });
  };

  handleFadeOut(val:number) {
    this.setState({
      newFadeOutDuration: val,
    });
  };

  setFadeInDuration() {
    this.setState({
      currentLayer: {
        ...this.state.currentLayer,
        fadeInDuration: this.state.newFadeInDuration,
      }
    });
  };

  setFadeOutDuration() {
    this.setState({
      currentLayer: {
        ...this.state.currentLayer,
        fadeOutDuration: this.state.newFadeOutDuration,
      }
    });
  };
  // ** end fade tonePlayer section

  // ** trimming tonePlayer section
  updateTrimmedStart(deltaX:number) {
    const deltaTime = deltaX * (this.state.currentLayer.duration / this.state.layerMaxWidth);
    let trimmedStartDuration = this.state.currentLayer.trimmedStartDuration + deltaTime;
    trimmedStartDuration = Math.round(trimmedStartDuration * 1000000 + Number.EPSILON ) / 1000000;
    let trimmedEndDuration = this.state.currentLayer.trimmedEndDuration;
    if (trimmedStartDuration < 0) {
      const leftOverDuration = this.state.currentLayer.trimmedStartDuration - trimmedStartDuration;
      trimmedStartDuration = 0.0;
      if (trimmedEndDuration > 0.0) {
        trimmedEndDuration -= Math.abs(leftOverDuration);
        if (trimmedEndDuration < 0) {
          trimmedEndDuration = 0.0;
        }
      }
    }
    else if (trimmedStartDuration > (this.state.currentLayer.duration - trimmedEndDuration)) {
      trimmedStartDuration = this.state.currentLayer.duration - trimmedEndDuration;
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
    const deltaTime = deltaX * (this.state.currentLayer.duration / this.state.layerMaxWidth);
    let trimmedEndDuration = this.state.currentLayer.trimmedEndDuration + deltaTime;
    trimmedEndDuration = Math.round(trimmedEndDuration * 1000000 + Number.EPSILON ) / 1000000;
    let trimmedStartDuration = this.state.currentLayer.trimmedStartDuration;
    if (trimmedEndDuration < 0.0) {
      const leftOverDuration = this.state.currentLayer.trimmedEndDuration + trimmedEndDuration;
      trimmedEndDuration = 0.0;
      if (trimmedStartDuration > 0.0) {
        trimmedStartDuration -= Math.abs(leftOverDuration);
        if (trimmedStartDuration < 0.0) {
          trimmedStartDuration = 0.0;
        }
      }
    } else if (trimmedEndDuration > (this.state.currentLayer.duration - trimmedStartDuration)) {
      trimmedEndDuration = this.state.currentLayer.duration - trimmedStartDuration
    }
    this.setState({
      currentLayer:{
        ...this.state.currentLayer,
        trimmedEndDuration: trimmedEndDuration,
        trimmedStartDuration: trimmedStartDuration,
      }
    });
  };
  // ** end trimming tonePlayer section

  // ** draggable section
  handleDragStop = (event:any, info:any) => {
    this.setState({
      currentLayer:{
        ...this.state.currentLayer,
        y: info.y,
        startTime: info.x / StagedLayer.SecondWidth,
      },
    });
  }

  handleDrag = (event:any, info:any) => {
    if (event.target.id === StagedLayer.DraggableZoneId) {
      console.log('increasing timeline');
      this.props.increaseTimeline();
    }
  };
  // ** end draggable section

  render() {
    return (
      <Draggable
        key={`${this.state.currentLayer.startTime}`}
        bounds=".layer-container" // "parent"
        handle=".draggable-wav"
        grid={[this.props.bpm === null ? 1 : StagedLayer.SecondWidth / (this.props.bpm / 60), 1]}
        onStop={this.handleDragStop}
        onDrag={this.handleDrag}
        defaultPosition={{x: this.state.currentLayer.startTime * StagedLayer.SecondWidth, y: this.state.currentLayer.y}}
      >
        <div
          className="staged-layer" id={`staged-layer-${this.props.layer.layerId}`} 
          style={{minWidth: `${StagedLayer.layerMinWidth}px`, maxWidth: `${this.state.layerMaxWidth}px`, 
          width: `${(this.state.currentLayer.duration - this.state.currentLayer.trimmedStartDuration - this.state.currentLayer.trimmedEndDuration) * StagedLayer.SecondWidth}px`,
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
          
          <div className='staged-layer-resizer staged-layer-resizer-l'></div>

          <div className="staged-layer-details">
            <div>
              <Tooltip text={'Commit - let your partner see your layer'}
                placement="bottomStart" type="dark" className="staged-layer-commit-tooltip">
                <Button style={{backgroundColor: "green"}} iconRight={
                  <CheckInCircle color="white" scale={0.25}/>
                } auto px={0.7} className="staged-layer-commit-btn"
                onClick={this.handleCommit}/>
              </Tooltip>
            </div>

            {this.state.currentLayer.muted ? <div className="draggable-wav timeline-muted-layer-wav"></div>
              : <div className="draggable-wav staged-layer-wav"></div>}
            
            <div>
              <Popover
                placement={this.state.currentLayer.y < 150 ? "bottom" : this.state.currentLayer.y < 400 ? "right" : "top"}
                content={
                  <>
                  <Popover.Item title style={{justifyContent: 'center'}}>
                    {this.state.tonePlayer !== null && 
                    <Tooltip text={this.state.currentLayer.muted ? 'Unmute' : 'Mute'}
                      placement="top" type="dark">
                      <Button
                        iconRight={this.state.currentLayer.muted ? <Volume2/> : <VolumeX/>}
                        auto
                        type="secondary"
                        ghost
                        scale={2/3}
                        px={0.6}
                        onClick={this.handleMute}
                        style={{display: 'flex', borderRadius: '50%', alignItems: 'center'}}
                      />
                    </Tooltip>}
                    <Spacer w={1}/>
                    {this.state.tonePlayer !== null && 
                    <Tooltip text={'Play'}
                      placement="top" type="dark">
                      <Button
                        iconRight={this.state.tonePlayer.state === "started" ? <StopCircle /> : <PlayFill/>}
                        auto
                        type="secondary"
                        ghost
                        scale={2/3}
                        px={0.6}
                        onClick={this.handlePlayer}
                        style={{display: 'flex', borderRadius: '50%', alignItems: 'center'}}
                      />
                    </Tooltip>}
                    <Spacer w={1}/>
                    <Tooltip text={'Details'}
                      placement="top" type="dark">
                      <Popover
                        content={this.getInfo()}
                        style={{display: 'flex', paddingRight: '5px', cursor: 'pointer'}}
                        >
                        <Info size={36} />
                      </Popover>
                    </Tooltip>
                  </Popover.Item>
                  {/*<Popover.Item style={{justifyContent: 'center', padding: '0'}}>
                    Fade In {this.state.newFadeInDuration !== this.state.currentLayer.fadeInDuration 
                      && <><Spacer w={1}/><Button icon={<CheckInCircleFill />} onClick={this.setFadeInDuration} auto scale={2/3} px={0.6}
                        style={{borderRadius: '50%'}}></Button></>}
                  </Popover.Item>
                  <Popover.Item>
                    <Slider value={this.state.newFadeInDuration} min={0}
                      max={this.state.currentLayer.duration - this.state.currentLayer.trimmedStartDuration - this.state.currentLayer.trimmedEndDuration} 
                      step={0.1} onChange={this.handleFadeIn} />
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center', padding: '0'}}>
                    Fade Out {this.state.newFadeOutDuration !== this.state.currentLayer.fadeOutDuration 
                      && <><Spacer w={1}/><Button icon={<CheckInCircleFill />} onClick={this.setFadeOutDuration} auto scale={2/3} px={0.6}
                        style={{borderRadius: '50%'}}></Button></>}
                  </Popover.Item>
                  <Popover.Item>
                    <Slider value={this.state.newFadeOutDuration} min={0} 
                      max={this.state.currentLayer.duration - this.state.currentLayer.trimmedStartDuration - this.state.currentLayer.trimmedEndDuration} 
                      step={0.1} onChange={this.handleFadeOut} />
                  </Popover.Item>*/}
                  
                  <Popover.Item line />
                  <Popover.Item style={{justifyContent: 'center', minWidth: '170px'}}>
                    <Button auto icon={<Edit3 />} type="warning" onClick={this.handleRename} style={{width: '100%', height: '100%'}}>
                      Rename
                    </Button>
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center'}}>
                    <Button auto icon={<Copy />} type="success" onClick={this.handleDuplicate} style={{width: '100%', height: '100%'}}>
                      Duplicate
                    </Button>
                  </Popover.Item>
                  <Popover.Item style={{justifyContent: 'center'}}>
                    <Button auto icon={<Trash2 />} type="error" onClick={this.handleDelete} style={{width: '100%', height: '100%'}}>
                      Delete
                    </Button>
                  </Popover.Item>
                  </>
                } style={{display: 'flex', cursor: 'pointer'}} disableItemsAutoClose>
                <MoreVertical />
              </Popover>
            </div>

            <div className="staged-layer-initials">
              <Badge.Anchor placement="bottomRight" className="staged-layer-initials">
                <Badge scale={0.1} type="warning">
                  {this.state.currentLayer.fileName === null ? 
                  <Mic size={16} color="white"/> :
                  <Music size={16} color="white"/>}
                </Badge>
                <Tag type="default" invert>{this.state.currentLayer.member.firstname[0]}{this.state.currentLayer.member.lastname[0]}</Tag>
              </Badge.Anchor>
            </div>
          </div>

          <div className='staged-layer-resizer staged-layer-resizer-r'></div>
        </div>
      </Draggable>
    )
  };
}

export default StagedLayer;