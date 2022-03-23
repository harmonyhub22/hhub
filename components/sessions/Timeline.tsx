import React from "react";
import LayerInterface from "../../interfaces/models/LayerInterface";
import Container from "./Container";

interface TimelineProps {
  layers: LayerInterface[],
  commitLayer: any,
};

interface TimelineState {
  width: number,
  seconds: number,
};

class Timeline extends React.Component<TimelineProps, TimelineState> {
  constructor(props:TimelineProps) {
    super(props);
    this.state = {
      width: 0,
      seconds: 0,
    };
  };

  componentDidMount() {
    this.setState({
    });
  };

  render() {
    return (
      <>
        <Container />
      </>
    );
  }
};

export default Timeline;