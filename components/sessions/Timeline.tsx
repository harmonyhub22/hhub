import React from "react";
import LayerInterface from "../../interfaces/models/LayerInterface";
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";
import Container from "./Container";
import Crunker from "crunker"
import { Button, Tooltip } from "@geist-ui/core";
import { ChevronLeft, ChevronRight } from "@geist-ui/icons";
import { initResizeTimeline } from "../ui/helpers/resize";
var util = require("audio-buffer-utils")

interface TimelineProps {
  layers: LayerInterface[],
  neverCommittedLayers: NeverCommittedLayer[],
  commitLayer: any,
  duplicateLayer: any,
  deleteLayer: any,
  stageLayer: any,
};

interface TimelineState {
  width: number,
  seconds: number,
  buffer: any,
  buffermap: any,
  crunker:any,
};

class Timeline extends React.Component<TimelineProps, TimelineState> {

  static TimelineWrapperId: string = "timeline-wrapper";
  static MaxTimelinePoints: number = 10;
  static SecondWidth: number = 30;

  constructor(props:TimelineProps) {
    super(props);
    this.state = {
      width: 885, // change
      seconds: 20, // changee
      buffer: null,
      buffermap: {},
      crunker:null,
    };
    this.addBuffer = this.addBuffer.bind(this);
    this.deleteBuffer = this.deleteBuffer.bind(this);
    this.getSongsoFar = this.getSongsoFar.bind(this);
    this.increaseTimeline = this.increaseTimeline.bind(this);
    this.decreaseTimeline = this.decreaseTimeline.bind(this);
    this.updateTimelineWidth = this.updateTimelineWidth.bind(this);
  };

  componentDidMount() {
    let crunker = null;
    try {
      try {
        crunker = new Crunker();
      } catch (e) {
        // do nothing
      }
    } catch (e) {
      console.log(e);
    }
    // console.log("util",util);
    // const buf = util.create();
    // console.log("buf", buf);
    this.setState({
      crunker: crunker,
    });
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

  addBuffer(startTime:number, buffer:AudioBuffer, layerId:number | null , layerName:string | null) {
    if (this.state.crunker === null) {
      console.log('crunker undefined');
      return;
    }
    const temp = this.state.crunker.padAudio(buffer,0,startTime);
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
    if (Object.keys(bufferMap).length === (this.props.layers.length + this.props.neverCommittedLayers.length)){
      this.setState({
        buffer: this.state.crunker.mergeAudio(Object.values(bufferMap)),
      });
      console.log("buffer",buffer)
    }
  }
  deleteBuffer(layerId: string | null, layerName: string | null){
    const bufferMap = this.state.buffermap;
    if(layerId!==null){
      delete bufferMap[layerId];
      this.setState({
        buffermap: bufferMap,
      });
    }
    else if(layerName!==null){
      delete bufferMap[layerName];
      this.setState({
        buffermap: bufferMap,
      });
    }
    this.setState({
      buffer: this.state.crunker.mergeAudio(Object.values(bufferMap)),
    });
  }
  
  getSongsoFar(){
    console.log("current buffer",this.state.buffer)

    this.state.crunker.play(this.state.buffer)
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
            <div className="timeline-duration-modifier">
              {/*<span>Adjust Timeline Duration</span>*/}
              <Tooltip text={'Decrease Duration'} type="dark" placement="leftStart">
                <Button iconRight={<ChevronLeft color="black" />} auto scale={2/3} 
                  className="toggle-timeline-duration-btn" onClick={this.decreaseTimeline} shadow type="secondary">
                </Button>
              </Tooltip>
              <Tooltip text={'Increase Duration'} type="dark" placement="topEnd">
                <Button iconRight={<ChevronRight color="black" />} auto scale={2/3} 
                  className="toggle-timeline-duration-btn" onClick={this.increaseTimeline} shadow type="secondary" />
              </Tooltip>
            </div>
          </div>
          <Container layers={this.props.layers} neverCommittedLayers={this.props.neverCommittedLayers} 
            commitLayer={this.props.commitLayer} width={this.state.width} seconds={this.state.seconds}
            duplicateLayer={this.props.duplicateLayer}
            deleteLayer={this.props.deleteLayer}
            addBuffer={this.addBuffer}
            deleteBuffer={this.deleteBuffer} />
        </div>
      </div>
    );
  }
};

export default Timeline;