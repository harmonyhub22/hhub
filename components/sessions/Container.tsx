import React, { CSSProperties, FC, useCallback, useEffect, useState } from 'react'
import TimelineLayer from '../ui/Timeline-Layer'
import LayerInterface from '../../interfaces/models/LayerInterface';
import NeverCommittedLayer from '../../interfaces/NeverComittedLayer';

interface ContainerProps {
  layers: LayerInterface[],
  neverCommittedLayers: NeverCommittedLayer[],
  commitLayer: any,
  duplicateLayer: any,
  deleteLayer: any,
  width: number,
  seconds: number,
  addBuffer: any,
  deleteBuffer:any,
}

interface ContainerState {
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: ContainerProps) {
    super(props);
  };

  componentDidMount() {
    // console.log(this.props);
  }

  render() {
    return (
      <div key={`${this.props.seconds}-${this.props.width}`} className="layer-container">

        {this.props.layers.map((layer:LayerInterface, i:number) => {      
          return (
          <TimelineLayer
            key={`${JSON.stringify(layer)}`}
            layer={layer}
            soundBufferDate={null}
            soundBuffer={null}
            timelineDuration={this.props.seconds}
            timelineWidth={this.props.width}
            commitLayer={this.props.commitLayer}
            duplicateLayer={this.props.duplicateLayer}
            deleteLayer={this.props.deleteLayer}
            addBuffer={this.props.addBuffer}
            deleteBuffer={this.props.deleteBuffer}
          />
          )
        })}

        {this.props.neverCommittedLayers.map((neverCommittedLayer:NeverCommittedLayer, i:number) => {
          return (
            <TimelineLayer 
              key={`never-comitted-layer-${i}`}
              layer={neverCommittedLayer.layer}
              soundBufferDate={neverCommittedLayer.stagingSoundBufferDate}
              soundBuffer={neverCommittedLayer.stagingSoundBuffer}
              timelineDuration={this.props.seconds}
              timelineWidth={this.props.width}
              commitLayer={this.props.commitLayer}
              duplicateLayer={this.props.duplicateLayer}
              deleteLayer={this.props.deleteLayer}
              addBuffer={this.props.addBuffer}
              deleteBuffer={this.props.deleteBuffer}
            />
          )
        })}
      </div>
    );
  }
}

export default Container;