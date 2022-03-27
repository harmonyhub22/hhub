import React from "react";
import LayerInterface from "../../interfaces/models/LayerInterface";
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";
import Container from "./Container";
import { Button, Tooltip } from "@geist-ui/core";
import { ChevronLeft, ChevronRight } from "@geist-ui/icons";

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
};

class Timeline extends React.Component<TimelineProps, TimelineState> {

  static TimelineWrapperId: string = "timeline-wrapper";
  static MaxTimelinePoints: number = 10;

  constructor(props:TimelineProps) {
    super(props);
    this.state = {
      width: 885, // change
      seconds: 20, // change
    };
    this.increaseTimeline = this.increaseTimeline.bind(this);
    this.decreaseTimeline = this.decreaseTimeline.bind(this);
    this.getRange = this.getRange.bind(this);
  };

  componentDidMount() {
    let ele = null;
    let timelineWidth = 400;
    try {
      ele = document.getElementById(Timeline.TimelineWrapperId);
      timelineWidth = parseInt(ele?.style.width.slice(0,-2) || "400px", 10);
    } catch (e) {/* do nothing */}
    this.setState({
      width: timelineWidth,
    });
  };

  componentDidUpdate(prevProps:TimelineProps) {
    if (prevProps.layers.length !== this.props.layers.length) {
      console.log('got new layer');
    }
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
    console.log(this.state.seconds - 1);
  }

  getRange() {
    const start = 0;
    const stop = Timeline.MaxTimelinePoints;
    const step = Math.floor(this.state.seconds / Timeline.MaxTimelinePoints);
    const arr = [];
    for (var i=start;i<stop;i+=step){
      arr.push(i);
    }
    return arr;
  };

  render() {
    return (
      <div key={`${this.props.layers.length}-${this.props.neverCommittedLayers.length}`} className="timeline-wrapper" id={Timeline.TimelineWrapperId}>
        <div key={`${this.state.seconds}-${this.state.width}`}className="timeline-details">
          {this.getRange().map((seconds:number) => {
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
                px={0.6} className="toggle-timeline-duration-btn" onClick={this.decreaseTimeline} />
            </Tooltip>
            <Tooltip text={'Increase Duration'} type="dark">
              <Button iconRight={<ChevronRight color="#320f48" />} auto scale={2/3} 
                px={0.6} className="toggle-timeline-duration-btn" onClick={this.increaseTimeline} />
            </Tooltip>
          </div>
        </div>
        <Container layers={this.props.layers} neverCommittedLayers={this.props.neverCommittedLayers} 
          commitLayer={this.props.commitLayer} width={this.state.width} seconds={this.state.seconds}
          duplicateLayer={this.props.duplicateLayer}
          deleteLayer={this.props.deleteLayer} />
      </div>
    );
  }
};

export default Timeline;