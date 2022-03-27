import React from "react";
import LayerInterface from "../../interfaces/models/LayerInterface";
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";
import Container from "./Container";
import Crunker from "crunker"
import { Button, Tooltip } from "@geist-ui/core";
import { ChevronLeft, ChevronRight } from "@geist-ui/icons";
import { initResizeTimeline } from "../ui/helpers/resize";

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
    this.getSongsoFar = this.getSongsoFar.bind(this);
    this.increaseTimeline = this.increaseTimeline.bind(this);
    this.decreaseTimeline = this.decreaseTimeline.bind(this);
    this.updateTimelineWidth = this.updateTimelineWidth.bind(this);
  };

  componentDidMount() {
    this.setState({
      crunker: new Crunker(),
    })
    this.updateTimelineWidth();
    initResizeTimeline(this.updateTimelineWidth);
  };

  componentDidUpdate(prevProps:TimelineProps, prevState:TimelineState) {
    if (prevProps.layers.length !== this.props.layers.length) {
      console.log('got new layer');
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
    const crunker = new Crunker()
    const temp = crunker.padAudio(buffer,0,startTime);
    const keyValue = layerId === null ? layerName : layerId;
    if (keyValue === null) return;
    const bufferMap = this.state.buffermap;
    if (layerId !== null && layerName !== null) {
      delete bufferMap.layerName;
    }
    console.log(bufferMap)
    bufferMap[keyValue] = temp;
    console.log(bufferMap)
    this.setState({
      buffermap: bufferMap,
    });
    if (Object.keys(bufferMap).length === (this.props.layers.length + this.props.neverCommittedLayers.length)){
      // let crunker = new Crunker();
      // this.setState({
      //   buffer: crunker.mergeAudio(Object.values(bufferMap)),
      // });
      console.log("buffer",buffer)
    }
  }
  
  getSongsoFar(){
    // console.log(this.state.buffer)
    // let crunker = new Crunker();
    // crunker.play(this.state.buffer)
  }


  render() {
    return (
      <div key={`${this.props.layers.length}-${this.props.neverCommittedLayers.length}`} className="timeline-wrapper" id={Timeline.TimelineWrapperId}>
        <Button onClick={this.getSongsoFar}></Button>
        <div key={`${this.state.seconds}-${this.state.width}`}className="timeline-details">
          {Array(this.state.seconds).fill(0).map((_, seconds:number) => {
            return (
              <div key={seconds} className="one-timeline-interval" style={{content: `${seconds}`, width: `${this.state.seconds / Timeline.MaxTimelinePoints * 100}%`}}>
                <div className="timeline-interval-seconds">
                  <span>{seconds !== 0 && seconds}</span>
                </div>
                <div className="half-timeline-interval"></div>
              </div>
            )
          })}
          <div className="timeline-duration-modifier">
            <Tooltip text={'Decrease Duration'} type="dark">
              <Button iconRight={<ChevronLeft color="#320f48" />} auto scale={2/3} 
                className="toggle-timeline-duration-btn" onClick={this.decreaseTimeline} />
            </Tooltip>
            <Tooltip text={'Increase Duration'} type="dark">
              <Button iconRight={<ChevronRight color="#320f48" />} auto scale={2/3} 
                className="toggle-timeline-duration-btn" onClick={this.increaseTimeline} />
            </Tooltip>
          </div>
        </div>
        <Container layers={this.props.layers} neverCommittedLayers={this.props.neverCommittedLayers} 
          commitLayer={this.props.commitLayer} width={this.state.width} seconds={this.state.seconds}
          duplicateLayer={this.props.duplicateLayer}
          deleteLayer={this.props.deleteLayer}
          addBuffer={this.addBuffer}/>
      </div>
    );
  }
};

export default Timeline;