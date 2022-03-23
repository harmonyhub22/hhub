import React from "react";

export interface BoxProps {
  yellow?: boolean;
  preview?: boolean;
  boxWidth: number;
}

class Box extends React.Component <BoxProps> {

  constructor(props:BoxProps) {
    super(props)
  }

  render() {
    return (
      <div
        className="container-box"
        role={this.props.preview ? "BoxPreview" : "Box"}
        style={{width: `${this.props.boxWidth * 58}px`, backgroundColor: this.props.yellow ? "yellow" : "white"}}
      >
        <p>Drag me to the timeline!</p>
      </div>
    );
  }
}

export default Box;