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
  crunker:any,
};

class Timeline extends React.Component<TimelineProps, TimelineState> {

  static TimelineWrapperId: string = "timeline-wrapper";
  static MaxTimelinePoints: number = 10;

  constructor(props:TimelineProps) {
    super(props);
    this.state = {
      width: 885, // change
      seconds: 20, // change
      buffer: null,
      crunker: null,
    };
    this.addBuffer = this.addBuffer.bind(this);
    this.getSongsoFar = this.getSongsoFar.bind(this);
    this.increaseTimeline = this.increaseTimeline.bind(this);
    this.decreaseTimeline = this.decreaseTimeline.bind(this);
    this.updateTimelineWidth = this.updateTimelineWidth.bind(this);
  };

  componentDidMount() {
    const crunker = new Crunker()
    this.updateTimelineWidth();
    initResizeTimeline(this.updateTimelineWidth);
  };

  componentDidUpdate(prevProps:TimelineProps) {
    if (prevProps.layers.length !== this.props.layers.length) {
      console.log('got new layer');
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

  addBuffer(startTime:number, buffer:AudioBuffer) {
    const temp = this.state.crunker.padAudio(buffer,0,startTime)

    this.setState({
      buffer: this.state.crunker.mergeAudio([temp,buffer])
    })

  }
  getSongsoFar(){
    this.state.crunker.play(this.state.buffer)
  }


  render() {
    return (
      <div key={`${this.props.layers.length}-${this.props.neverCommittedLayers.length}`} className="timeline-wrapper" id={Timeline.TimelineWrapperId}>
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