import React from "react";
import LayerInterface from "../../interfaces/models/LayerInterface";
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";
import Container from "./Container";
import Crunker from "crunker"
import { Button, Tooltip, Badge, Spacer } from "@geist-ui/core";
import { ChevronLeft, ChevronRight, PlayFill, PauseFill } from "@geist-ui/icons";
import { initResizeTimeline } from "../ui/helpers/resize";
import * as Tone from "tone";
var util = require("audio-buffer-utils")

interface TimelineProps {
  layers: LayerInterface[],
  neverCommittedLayers: NeverCommittedLayer[],
  commitLayer: any,
  duplicateLayer: any,
  deleteLayer: any,
  stageLayer: any,
  sessionEnded: boolean,
  updateFinalBuffer: any,
};

interface TimelineState {
  width: number,
  seconds: number,
  buffer: any,
  buffermap: any,
  isPlaying: boolean,
  tonePlayer: any,
  currentSeconds: number,
  paused: boolean,
  timer: any,
};

class Timeline extends React.Component<TimelineProps, TimelineState> {

  static TimelineWrapperId: string = "timeline-wrapper";
  static MaxTimelinePoints: number = 10;
  static MinTimelineSeconds: number = 20;

  constructor(props:TimelineProps) {
    super(props);
    this.state = {
      width: 885, // change
      seconds: Timeline.MinTimelineSeconds, // changee
      buffer: null,
      buffermap: {},
      isPlaying: false,
      tonePlayer: null,
      paused: false,
      currentSeconds: 0,
      timer: null,
    };
    this.addBuffer = this.addBuffer.bind(this);
    this.deleteBuffer = this.deleteBuffer.bind(this);
    this.playSongsoFar = this.playSongsoFar.bind(this);
    this.increaseTimeline = this.increaseTimeline.bind(this);
    this.decreaseTimeline = this.decreaseTimeline.bind(this);
    this.updateTimelineWidth = this.updateTimelineWidth.bind(this);
  };

  componentDidMount() {
    // console.log("util",util);
    // const buf = util.create();
    // console.log("buf", buf);
    this.updateTimelineWidth();
    initResizeTimeline(this.updateTimelineWidth);
  };

  componentDidUpdate(prevProps:TimelineProps, prevState:TimelineState) {
    if (prevProps.layers.length !== this.props.layers.length) {
      console.log('got new layer');
    }
    if (prevState.seconds !== this.state.seconds) {
      /*if (prevState.seconds < this.state.seconds) {
        const offset = document.getElementById(Timeline.TimelineWrapperId)?.offsetTop;
        console.log('offset', offset);
      } */
      this.updateTimelineWidth();

    }
    if (Object.keys(prevState.buffermap).length !== Object.keys(this.state.buffermap).length) {
      console.log(this.state.buffermap);
    }

    if (prevProps.sessionEnded !== this.props.sessionEnded && this.props.sessionEnded === true) {
      this.props.updateFinalBuffer(this.state.buffer);
    }

  }
  

  updateTimelineWidth() {
    let ele = null;
    let timelineWidth = 400;
    try {
      ele = document.getElementById(Timeline.TimelineWrapperId);
      timelineWidth = ele?.getBoundingClientRect()?.width || 400;
      console.log(timelineWidth);
    } catch (e) {
      console.log(e);
    }
    this.setState({
      width: timelineWidth,
    });
  }

  increaseTimeline() {
    this.setState({
      seconds: this.state.seconds + 1,
    });
  }

  decreaseTimeline() {
    this.setState({
      seconds: this.state.seconds - 1,
    });
  }

  addBuffer(startTime:number, buffer:AudioBuffer, layerId:number | null , layerName:string | null, duration: number) {
    const crunker = new Crunker();
    crunker.notSupported(() => {
      console.log('crunker not supported');
      // Handle no browser support
    });
    if (duration + startTime > this.state.seconds) {
      this.setState({
        seconds: Math.ceil(duration + startTime),
      });
    }
    const temp = crunker.padAudio(buffer,0,startTime);
    const keyValue = layerId === null ? layerName : layerId;
    if (keyValue === null) return;
    const bufferMap = this.state.buffermap;
    if (layerId !== null && layerName !== null) {
      delete bufferMap[layerName];
    }
    bufferMap[keyValue] = temp;
    console.log("buffermap",bufferMap)
    this.setState({
      buffermap: bufferMap,
    });
    if (Object.keys(bufferMap).length === (this.props.layers.length + this.props.neverCommittedLayers.length)) {
      const buffer = crunker.mergeAudio(Object.values(bufferMap));
      try {
        this.state.tonePlayer.dispose();
      } catch (e) { /* do nothing */ }
      if (buffer.numberOfChannels !== 0) {
        console.log('creating toneplayer');
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
        });
      }
    }
  }

  deleteBuffer(layerId: string | null, layerName: string | null){
    const crunker = new Crunker();
    const bufferMap = this.state.buffermap;
    if(layerId !== null) {
      delete bufferMap[layerId];
      this.setState({
        buffermap: bufferMap,
      });
    }
    else if(layerName !== null) {
      delete bufferMap[layerName];
      this.setState({
        buffermap: bufferMap,
      });
    }
    try {
      this.state.tonePlayer.dispose();
    } catch (e) { /* do nothing */ }
    if (Object.keys(bufferMap).length === 0) {
      this.setState({
        buffer: null,
        tonePlayer: null,
      });
      return;
    }
    const buffer = crunker.mergeAudio(Object.values(bufferMap));
    console.log('buffer', buffer);
    console.log(buffer.numberOfChannels);
    if (buffer.numberOfChannels === 0) return;
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
      tonePlayer: new Tone.Player(buffer).toDestination(),
    });
  }
  
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
          currentSeconds: this.state.currentSeconds + 0.1,
        });
      }, 100);
      this.setState({
        timer: timer,
        paused: false,
      });
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  }


  render() {
    return (
      <div style={{overflowX: 'scroll', overflowY: 'hidden'}}>
        <div key={`${this.props.layers.length}-${this.props.neverCommittedLayers.length}`} 
          className="timeline-wrapper" id={Timeline.TimelineWrapperId} style={{width: `${this.state.seconds * 50}px`}}>
          <div key={`${this.state.seconds}-${this.state.width}`}className="timeline-details">
            {Array(this.state.seconds).fill(0).map((_, seconds:number) => {
              return (
                <div key={seconds} className="one-timeline-interval" style={{width: `${this.state.seconds / Timeline.MaxTimelinePoints * 100}%`}}>
                  <div className="timeline-interval-seconds">
                    <span>{seconds !== 0 && seconds}</span>
                  </div>
                  <div className="half-timeline-interval"></div>
                </div>
              )
            })}
            {/*<div className="timeline-duration-modifier">

              <Tooltip text={'Decrease Duration'} type="dark" placement="leftStart">
                <Button iconRight={<ChevronLeft color="black" />} auto scale={2/3} 
                  className="toggle-timeline-duration-btn" onClick={this.decreaseTimeline} shadow type="secondary">
                </Button>
              </Tooltip>
              <Tooltip text={'Increase Duration'} type="dark" placement="topEnd">
                <Button iconRight={<ChevronRight color="black" />} auto scale={2/3} 
                  className="toggle-timeline-duration-btn" onClick={this.increaseTimeline} shadow type="secondary" />
              </Tooltip>
          </div>*/}
          </div>
          <Container layers={this.props.layers} neverCommittedLayers={this.props.neverCommittedLayers} 
            commitLayer={this.props.commitLayer} width={this.state.width} seconds={this.state.seconds}
            duplicateLayer={this.props.duplicateLayer}
            deleteLayer={this.props.deleteLayer}
            addBuffer={this.addBuffer}
            deleteBuffer={this.deleteBuffer} />
        </div>
        <div style={{position: 'absolute', bottom: '5vh'}}>
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
          <Badge>{Math.round(this.state.currentSeconds * 100) / 100}</Badge>
        </div>
        <div className="timeline-player-bar"
          style={{transform: `translate(${this.state.currentSeconds * (this.state.width / this.state.seconds)}px, 0px)`}}>
        </div>
      </div>
    );
  }
};

export default Timeline;