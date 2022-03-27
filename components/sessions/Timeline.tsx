import React from "react";
import LayerInterface from "../../interfaces/models/LayerInterface";
import NeverCommittedLayer from "../../interfaces/NeverComittedLayer";
import Container from "./Container";
import Crunker from "crunker"

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

  constructor(props:TimelineProps) {
    super(props);
    this.state = {
      width: 885, // change
      seconds: 10, // change
      buffer: null,
      crunker: null,
    };
    this.addBuffer = this.addBuffer.bind(this);
    this.getSongsoFar = this.getSongsoFar.bind(this);
  };

  componentDidMount() {
    const crunker = new Crunker()
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
        <div className="timeline-details">
          {Array.from(Array(this.state.seconds).keys()).map((seconds:number) => {
            return (
              <>{seconds}</>
            )
          })}
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