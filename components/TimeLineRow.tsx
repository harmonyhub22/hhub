import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Droppable } from "./Droppable";
import TimeLineLayer from "./TimeLineLayer";

interface TimeLineRowProps {
  maxWidth: number;
  isOver: boolean;
  dropRef: any;
  layer: {
      id: string,
      // more layer metadata
  };
  setLayer: any;
}

class TimeLineRow extends React.Component<TimeLineRowProps> {
  constructor(props: TimeLineRowProps) {
    super(props);
  }

  render() {
    return (
      <tr
        style={{ width: this.props.maxWidth.toString() + "px" }}
        ref={this.props.dropRef}
      >
        <td>
          {/* Use the props of the dropped layer to create a new TimeLineLayer component (extra functionality) */}
          {/* {this.props.basket.map(layer => <TimeLineLayer />)}*/}
          {Object.keys(this.props.layer).length === 0 ? 
            <p>{this.props.layer.id}</p> :
            <p>Nothing yet!</p>
            }
          {this.props.isOver && <p>Drop here!</p>}
        </td>
      </tr>
    );
  }
}

export default Droppable(TimeLineRow);
