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
  deleteBuffer: any,
  increaseTimeline: any,
  bpm: number|null,
  updateStagedLayer: any,
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
      <div className="layer-container" style={{backgroundSize: `${this.props.bpm === null ? 50 : 50 / (this.props.bpm / 60)}px`}}>

        {this.props.layers.map((layer:LayerInterface, i:number) => {      
          return (
            <TimelineLayer
              key={`${JSON.stringify(layer)}`}
              layer={layer}
              soundBufferId={null}
              timelineDuration={this.props.seconds}
              timelineWidth={this.props.width}
              commitLayer={this.props.commitLayer}
              duplicateLayer={this.props.duplicateLayer}
              deleteLayer={this.props.deleteLayer}
              addBuffer={this.props.addBuffer}
              deleteBuffer={this.props.deleteBuffer}
              increaseTimeline={this.props.increaseTimeline}
              bpm={this.props.bpm}
              updateStagedLayer={this.props.updateStagedLayer}
            />
          )
        })}

        {this.props.neverCommittedLayers.map((neverCommittedLayer:NeverCommittedLayer, i:number) => {
          return (
            <TimelineLayer 
              key={`never-comitted-layer-${i}`}
              layer={neverCommittedLayer.layer}
              soundBufferId={neverCommittedLayer.stagingSoundBufferId}
              timelineDuration={this.props.seconds}
              timelineWidth={this.props.width}
              commitLayer={this.props.commitLayer}
              duplicateLayer={this.props.duplicateLayer}
              deleteLayer={this.props.deleteLayer}
              addBuffer={this.props.addBuffer}
              deleteBuffer={this.props.deleteBuffer}
              increaseTimeline={this.props.increaseTimeline}
              bpm={this.props.bpm}
              updateStagedLayer={this.props.updateStagedLayer}
            />
          )
        })}

        <div id="extend-timeline-zone" className="extend-timeline-zone" style={{width: `${(this.props.width / this.props.seconds) * 2}px`}}></div>
      </div>
    );
  }
}

export default Container;