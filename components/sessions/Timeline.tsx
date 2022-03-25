import React from "react";
import LayerInterface from "../../interfaces/models/LayerInterface";
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";
import Container from "./Container";

interface TimelineProps {
  layers: LayerInterface[],
  neverCommittedLayers: NeverCommittedLayer[],
  commitLayer: any,
  stageLayer: any,
};

interface TimelineState {
  width: number,
  seconds: number,
};

class Timeline extends React.Component<TimelineProps, TimelineState> {

  static TimelineWrapperId: string = "timeline-wrapper";

  constructor(props:TimelineProps) {
    super(props);
    this.state = {
      width: 885, // change
      seconds: 10, // change
    };
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

  render() {
    return (
      <div className="timeline-wrapper" id={Timeline.TimelineWrapperId}>
        <Container layers={this.props.layers} neverCommittedLayers={this.props.neverCommittedLayers} 
          commitLayer={this.props.commitLayer} width={this.state.width} seconds={this.state.seconds} />
      </div>
    );
  }
};

export default Timeline;