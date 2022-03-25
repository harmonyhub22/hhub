import React, { CSSProperties, FC, useCallback, useEffect, useState } from 'react'
import TimelineLayer from '../ui/Timeline-Layer'
import LayerInterface from '../../interfaces/models/LayerInterface';

interface NeverCommittedLayer {
  layer: LayerInterface, // put stagingFileName as fileName
  stagingSoundBuffer: Blob|null,
  stagingSoundBufferDate: string|null,
}

interface ContainerProps {
  layers: LayerInterface[],
  commitLayer: any,
  width: number,
  seconds: number,
}

interface ContainerState {
  neverCommittedLayers: NeverCommittedLayer[],
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = {
      neverCommittedLayers: [],
    };
  };

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div className="layer-container">

        {this.props.layers.map((layer:LayerInterface, i:number) => {      
          return (
          <TimelineLayer
            key={`layer-${i}`}
            layer={layer}
            soundBufferDate={null}
            soundBuffer={null}
            timelineDuration={this.props.seconds}
            timelineWidth={this.props.width}
            commitLayer={this.props.commitLayer}
          />
          )
        })}

        {this.state.neverCommittedLayers.map((neverCommittedLayer:NeverCommittedLayer, i:number) => {
          return (
            <TimelineLayer 
              key={`never-comitted-layer-${i}`}
              layer={neverCommittedLayer.layer}
              soundBufferDate={neverCommittedLayer.stagingSoundBufferDate}
              soundBuffer={neverCommittedLayer.stagingSoundBuffer}
              timelineDuration={this.props.seconds}
              timelineWidth={this.props.width}
              commitLayer={this.props.commitLayer}
            />
          )
        })}
      </div>
    );
  }
}

export default Container;