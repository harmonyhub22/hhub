import React, { CSSProperties, FC, useCallback, useEffect, useState } from 'react'
import TimelineLayer from '../ui/Timeline-Layer'
import { Layers } from '@geist-ui/icons';
import { Droppable } from './Droppable';
import LayerInterface from '../../interfaces/models/LayerInterface';
import Draggable from 'react-draggable';

interface NeverCommittedLayer {
  id: string,
  top: number,
  left: number,

  name: string|null,
  stagingFileName: string|null,
  stagingSoundBuffer: Blob|null,
  stagingSoundBufferDate: string|null,
  duration: number;
  trimmedStart: number,
  trimmedEnd: number,
  fadeInDuration: number,
  fadeOutDuration: number,
  reversed: boolean,
}

interface ContainerProps {
  layers: LayerInterface[],
  commitLayer: any,
  width: number,
  seconds: number,
}

interface ContainerState {
  neverCommittedLayers: any[],
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = {
      neverCommittedLayers: [],
    };
    this.layerDropped = this.layerDropped.bind(this);
  };

  layerDropped(newLayer: any, monitor: any) {
    // if its a palette layer that we are dropping
    if (newLayer.dropped === false) {
      // add this to the dropped layers
      newLayer.dropped = true;
      this.setState({
        neverCommittedLayers: [newLayer, ...this.state.neverCommittedLayers],
      });
    }

    // otherwise, we already dropped it and the user just moved the timeline layer
    else {
      const delta = monitor.getDifferenceFromInitialOffset() as {
        x: number;
        y: number;
      };
  
      let left = Math.round(newLayer.left + delta.x);
      let top = Math.round(newLayer.top + delta.y);
  
      // TODO: get the layer by id, then change the left and top props of it
    }
  }

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
            layerId={layer.layerId}
            memberId={layer.memberId}
            name={layer.name}
            fileName={layer.fileName}
            soundBufferDate={null}
            soundBuffer={null}
            bucketUrl={layer.bucketUrl}
            duration={layer.duration}
            initialStartTime={layer.startTime}
            creatorInitials={'aa'} // layer.initials}
            timelineSeconds={this.props.seconds}
            timelineWidth={this.props.width}
            top={60} // need to figure out a better way for this
            trimmedStart={layer.trimmedStartDuration}
            trimmedEnd={layer.trimmedEndDuration}
            fadeInDuration={layer.fadeInDuration}
            fadeOutDuration={layer.fadeOutDuration}
            reversed={layer.reversed}
            commitLayer={this.props.commitLayer}
          />
          )
        })}

        {this.state.neverCommittedLayers.map((layer:NeverCommittedLayer, i:number) => {
          return (
            <TimelineLayer 
              key={`never-comitted-layer-${i}`}
              layerId={null}
              memberId={null}
              name={layer.name}
              fileName={layer.stagingFileName}
              soundBufferDate={layer.stagingSoundBufferDate}
              soundBuffer={layer.stagingSoundBuffer}
              duration={layer.duration}
              initialStartTime={0} // need to change to whereever they drop it at
              creatorInitials={'aa'} // `${member.firstname[0]}${member.lastname[0]}`}
              timelineSeconds={10}
              timelineWidth={883}
              top={layer.top}
              bucketUrl={null}
              trimmedStart={layer.trimmedStart}
              trimmedEnd={layer.trimmedStart}
              fadeInDuration={layer.fadeInDuration}
              fadeOutDuration={layer.fadeOutDuration}
              reversed={layer.reversed}
              commitLayer={this.props.commitLayer}
            />
          )
        })}
      </div>
    );
  }
}

export default Container;