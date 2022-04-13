import React from "react";
import LayerInterface from "../../interfaces/models/LayerInterface";
import Crunker from "./Crunker";
import { Button, Badge, Spacer } from "@geist-ui/core";
import { PlayFill, PauseFill } from "@geist-ui/icons";
import { initTimelineClick } from "../helpers/resize";
import * as Tone from "tone";
import ComittedLayer from "./ComittedLayer";
import StagedLayerInterface from "../../interfaces/StagedLayerInterface";
import StagedLayer from "./StagedLayer";

interface TimelineProps {
  comittedLayers: LayerInterface[],
  stagedLayers: StagedLayerInterface[],
  sessionEnded: boolean,
  bpm: number|null,
  commitStagedLayer: any,
  duplicateStagedLayer: any,
  deleteStagedLayer: any,
  stageLayer: any,
  deleteComittedLayer: any,
  duplicateComittedLayer: any,
  updateFinalBuffer: any,
};

interface TimelineState {
  seconds: number,
  buffer: any,
  bufferMap: any,
  isPlaying: boolean,
  tonePlayer: any,
  currentSeconds: number,
  paused: boolean,
  timer: any,
  crunker: any,
};

class Timeline extends React.Component<TimelineProps, TimelineState> {

  static TimelineWrapperId: string = "timeline-wrapper";
  static MinTimelineSeconds: number = 20;
  static SecondWidth: number = 50; // px
  static MaxTimelineSeconds: number = 360 // 6 minutes

  constructor(props:TimelineProps) {
    super(props);
    this.state = {
      seconds: Timeline.MinTimelineSeconds,
      buffer: null,
      bufferMap: {},
      isPlaying: false,
      tonePlayer: null,
      paused: false,
      currentSeconds: 0,
      timer: null,
      crunker: null,
    };
    this.updateTimelineBuffer = this.updateTimelineBuffer.bind(this);
    this.deleteTimelineBuffer = this.deleteTimelineBuffer.bind(this);
    this.playSongsoFar = this.playSongsoFar.bind(this);
    this.increaseTimeline = this.increaseTimeline.bind(this);
    this.updateCurrentSeconds = this.updateCurrentSeconds.bind(this);
  };

  componentDidMount() {
    const crunker = new Crunker();
    crunker.notSupported(() => {
      alert('crunker not supported');
    });
    this.setState({
      crunker: crunker,
    });
    initTimelineClick(this.updateCurrentSeconds);
  };

  componentDidUpdate(prevProps:TimelineProps, prevState:TimelineState) {
    if (prevProps.sessionEnded !== this.props.sessionEnded && this.props.sessionEnded === true) {
      const bufferMap = this.state.bufferMap;
      const comittedLayerIds: string[] = this.props.comittedLayers.map((layer:LayerInterface) => layer.layerId);
      Object.keys(bufferMap).forEach((layerId:string) => {
        if (!comittedLayerIds.includes(layerId)) {
          delete bufferMap[layerId];
        }
      });
      if (Object.keys(bufferMap).length > 0) {
        const finalBuffer = this.state.crunker.mergeAudio(Object.values(bufferMap));
        this.setState({
          bufferMap: bufferMap,
          buffer: finalBuffer,
        });
        this.props.updateFinalBuffer(finalBuffer);
      } else {
        this.props.updateFinalBuffer(null);
      }
    }
    if (prevProps.comittedLayers.length !== this.props.comittedLayers.length) {
      const bufferMap = this.state.bufferMap;
      let layerIds: string[] = this.props.comittedLayers.map((layer:LayerInterface) => layer.layerId);
      layerIds = [...layerIds, ...this.props.stagedLayers.map((stagedLayer:StagedLayerInterface) => stagedLayer.layer.layerId)];
      console.log(layerIds);
      Object.keys(bufferMap).forEach((layerId:string) => {
        if (!layerIds.includes(layerId)) {
          delete bufferMap[layerId];
        }
      });
      console.log(bufferMap);
      if (this.state.timer !== null) clearInterval(this.state.timer);
      if (this.state.tonePlayer !== null) {
        if (this.state.tonePlayer.state === "started") this.state.tonePlayer.stop();
        this.state.tonePlayer.dispose();
      }
      if (Object.values(bufferMap).length === 0) {
        this.setState({
          buffer: null,
          tonePlayer: null,
          bufferMap: bufferMap,
          currentSeconds: 0,
          paused: false,
          isPlaying: false,
        });
      } else {
        const buffer = this.state.crunker.mergeAudio(Object.values(bufferMap));
        const player = new Tone.Player(buffer).toDestination();
        player.onstop = () => {
          clearInterval(this.state.timer);
          if (!this.state.paused) {
            this.setState({
              currentSeconds: 0,
              paused: false,
              isPlaying: false,
            });
          }
        };
        this.setState({
          buffer: buffer,
          tonePlayer: player,
          bufferMap: bufferMap,
          currentSeconds: 0,
          paused: false,
          isPlaying: false,
        });
      }
    }
  };

  increaseTimeline() {
    const newSeconds = this.state.seconds + 1;
    if (newSeconds > Timeline.MaxTimelineSeconds) {
      alert('song limit reached (6 minutes)');
    } else {
      this.setState({
        seconds: newSeconds,
      });
    }
  };

  updateCurrentSeconds(offset:number) {
    if ((this.state.tonePlayer?.state ?? null) === "started") {
      this.setState({
        paused: true,
        isPlaying: false,
      });
      this.state.tonePlayer.stop();
      if (this.state.timer !== null) clearInterval(this.state.timer);
    }
    const currentSeconds: number = offset / 50;
    this.setState({
      currentSeconds: currentSeconds <= this.state.seconds ? currentSeconds : this.state.seconds,
    });
  };

  updateTimelineBuffer(layer:LayerInterface, buffer:AudioBuffer) {
    if (layer.duration - layer.trimmedStartDuration - layer.trimmedEndDuration + layer.startTime > this.state.seconds) {
      const newSeconds = Math.ceil(layer.duration - layer.trimmedStartDuration - layer.trimmedEndDuration + layer.startTime);
      this.setState({
        seconds: newSeconds <= Timeline.MaxTimelineSeconds ? newSeconds : Timeline.MaxTimelineSeconds,
      });
    }
    const temp = this.state.crunker.padAudio(buffer, 0, layer.startTime);
    const bufferMap = this.state.bufferMap;
    delete bufferMap[layer.layerId];
    bufferMap[layer.layerId] = temp;

    this.setState({
      bufferMap: bufferMap,
    });
  
    if (Object.keys(bufferMap).length === (this.props.comittedLayers.length + this.props.stagedLayers.length)) {
      console.log('updating timeline buffer')
      if (this.state.timer !== null) clearInterval(this.state.timer);
      if (this.state.tonePlayer !== null) {
        if (this.state.tonePlayer.state === "started") this.state.tonePlayer.stop();
        this.state.tonePlayer.dispose();
      }
      if (Object.values(bufferMap).length === 0) {
        this.setState({
          buffer: null,
          tonePlayer: null,
          bufferMap: bufferMap,
          currentSeconds: 0,
          paused: false,
          isPlaying: false,
        });
      } else {
        const buffer = this.state.crunker.mergeAudio(Object.values(bufferMap));
        const player = new Tone.Player(buffer).toDestination();
        player.onstop = () => {
          clearInterval(this.state.timer);
          if (!this.state.paused) {
            this.setState({
              currentSeconds: 0,
              paused: false,
              isPlaying: false,
            });
          }
        };
        this.setState({
          buffer: buffer,
          tonePlayer: player,
          bufferMap: bufferMap,
          currentSeconds: 0,
          paused: false,
          isPlaying: false,
        });
      }
    }
  };

  deleteTimelineBuffer(layerId: string){
    const bufferMap = this.state.bufferMap;
    delete bufferMap[layerId];
    this.setState({
      bufferMap: bufferMap,
    });
    if (this.state.timer !== null) clearInterval(this.state.timer);
    if (this.state.tonePlayer !== null) {
      if (this.state.tonePlayer.state === "started") this.state.tonePlayer.stop();
      this.state.tonePlayer.dispose();
    }
    if (Object.values(bufferMap).length === 0) {
      this.setState({
        buffer: null,
        tonePlayer: null,
        bufferMap: bufferMap,
        currentSeconds: 0,
        paused: false,
        isPlaying: false,
      });
    } else {
      const buffer = this.state.crunker.mergeAudio(Object.values(bufferMap));
      const player = new Tone.Player(buffer).toDestination();
      player.onstop = () => {
        clearInterval(this.state.timer);
        if (!this.state.paused) {
          this.setState({
            currentSeconds: 0,
            paused: false,
            isPlaying: false,
          });
        }
      };
      this.setState({
        buffer: buffer,
        tonePlayer: player,
        bufferMap: bufferMap,
        currentSeconds: 0,
        paused: false,
        isPlaying: false,
      });
    }
  };
  
  playSongsoFar() {
    if ((this.state.tonePlayer?.loaded ?? false) === false) return;
    if (this.state.tonePlayer.state === "started") {
      this.setState({
        paused: true,
      });
      this.state.tonePlayer.stop();
    } else {
      this.state.tonePlayer.start(0, this.state.currentSeconds);
      const timer = setInterval(() => {
        this.setState({
          currentSeconds: this.state.tonePlayer.state === "started" ? this.state.currentSeconds + 0.05 : this.state.currentSeconds,
        });
      }, 50);
      this.setState({
        timer: timer,
        paused: false,
      });
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  render() {
    return (
      <div style={{overflowX: 'scroll', overflowY: 'hidden', borderRadius: '20px', boxShadow: '0px 0px 18px 0px rgb(0 0 0 / 50%)'}}>
        <div className="timeline-wrapper" id={Timeline.TimelineWrapperId} style={{width: `${this.state.seconds * Timeline.SecondWidth}px`, 
          maxWidth: `${Timeline.MaxTimelineSeconds * Timeline.SecondWidth}px`}}>
          <div id="timeline-details" className="timeline-details">
            {Array(this.state.seconds).fill(0).map((_, seconds:number) => {
              return (
                <div key={seconds} className="one-timeline-interval" 
                  style={{width: `${Timeline.SecondWidth}px`, borderLeft: seconds !== 0 ? '1px solid whitesmoke' : 'none'}}>
                  <div className="timeline-interval-seconds">
                    <span>{seconds !== 0 && seconds}</span>
                  </div>
                  <div className="half-timeline-interval"></div>
                </div>
              )
            })}
            <div className="timeline-click-listener"></div>
          </div>
          <div className="layer-outer-container">
            <div className="layer-container" style={{backgroundSize: `${this.props.bpm === null ? 50 : 50 / (this.props.bpm / 60)}px`}}>
              {this.props.comittedLayers.map((layer:LayerInterface, i:number) => {      
                return (
                  <ComittedLayer
                    key={`comitted-layer-${layer.layerId}`}
                    layer={layer}
                    timelineDuration={this.state.seconds}
                    duplicateComittedLayer={this.props.duplicateComittedLayer}
                    deleteComittedLayer={this.props.deleteComittedLayer}
                    updateTimelineBuffer={this.updateTimelineBuffer}
                    deleteTimelineBuffer={this.deleteTimelineBuffer}
                  />
                )
              })}

              {this.props.stagedLayers.map((stagedLayer:StagedLayerInterface, i:number) => {
                return (
                  <StagedLayer 
                    key={`staged-layer-${stagedLayer.layer.layerId}`}
                    layer={stagedLayer.layer}
                    recordingId={stagedLayer.recordingId}
                    recordingBlob={stagedLayer.recordingBlob}
                    timelineDuration={this.state.seconds}
                    bpm={this.props.bpm}
                    commitStagedLayer={this.props.commitStagedLayer}
                    duplicateStagedLayer={this.props.duplicateStagedLayer}
                    deleteStagedLayer={this.props.deleteStagedLayer}
                    updateTimelineBuffer={this.updateTimelineBuffer}
                    deleteTimelineBuffer={this.deleteTimelineBuffer}
                    increaseTimeline={this.increaseTimeline}
                  />
                )
              })}

              <div id="extend-timeline-zone" className="extend-timeline-zone" style={{width: `${1.5 * 50}px`}}></div>
            </div>

            <div className="timeline-player-bar"
              style={{transform: `translate(${this.state.currentSeconds * 50}px, 0px)`}}>
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', bottom: '5vh', zIndex: '400'}}>
          <Button
            iconRight={this.state.isPlaying ? 
              <PauseFill color="#c563c5" />
              :
              <PlayFill color="#c563c5" />
            }
            auto
            scale={2 / 3}
            px={0.6}
            onClick={this.playSongsoFar}
            className="play-btn"
            shadow
            style={{border: '2px solid #320f48', marginLeft: '20px'}}
          />
          <Spacer inline w={0.5} />
          <Badge>{Math.floor(this.state.currentSeconds)}</Badge>
        </div>
      </div>
    );
  }
};

export default Timeline;