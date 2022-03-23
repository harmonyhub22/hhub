import React, { CSSProperties, FC, useCallback, useEffect, useState } from 'react'
import TimelineLayer from '../ui/Timeline-Layer'
import Layer from '../../interfaces/models/Layer'
import { Layers } from '@geist-ui/icons';
import { Droppable } from './Droppable';

interface LayerBox {
  id: string;
  top: number;
  left: number;
  stagingSoundName: string | null;
  stagingSoundBuffer: AudioBuffer | null;
  duration: number;
}

interface ContainerProps {
  submittedLayers: Layer[];
  handleNewLayer: any;
  width: number;
  seconds: number;
}

interface ContainerState {
  droppedLayers: Layer[];
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = {
      droppedLayers: [],
    }
    this.layerDropped = this.layerDropped.bind(this);
  }

  // componentDidUpdate(prevProps:ContainerProps) {
  //   if (prevProps.newLayer.staged !) {

  //   }
  // };

  layerDropped(newLayer: Layer, monitor: any) {
    // if its a palette layer that we are dropping
    if (newLayer.dropped === false) {
      // add this to the dropped layers
      newLayer.dropped = true;
      this.setState((prevState: ContainerState) => ({
        ...prevState,
        droppedLayers: [newLayer, ...prevState.droppedLayers],
      }));
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

  // componentDidMount() {
    
  // }

  render() {
    return (
      <div ref={drop} style={{
        height: this.props.layers.length * 60 + 60,
        width: this.props.width,
      }}>
          {this.state.droppedLayers.length === 0 ? 
            <p>Drop your layer here!</p> : (
            // render submitted layers
            this.props.submittedLayers.map((layer, i) => {          
              return (
              <TimelineLayer stagingSoundName={'Drum1'}
                  soundBufferDate={null}
                  stagingSoundBuffer={null}
                  duration={7}
                  initialTimelinePosition={0}
                  creatorInitials={`${member.firstname[0]}${member.lastname[0]}`}
                  timelineSeconds={10}
                  timelineWidth={883}
                  top={layer.top}
                  left={layer.left}
                  dropped={true}
              />
              )
            });
            // render staged/dropped layers
            this.state.droppedLayers.map((layer, i) => {
              return (
                <TimelineLayer stagingSoundName={'Drum1'}
                  soundBufferDate={null}
                  stagingSoundBuffer={null}
                  duration={7}
                  initialTimelinePosition={0}
                  creatorInitials={`${member.firstname[0]}${member.lastname[0]}`}
                  timelineSeconds={10}
                  timelineWidth={883}
                  top={layer.top}
                  left={layer.left}
                  dropped={true}
              />
              )
            }); 
          )}
      </div>
    );
  }
}

export default Droppable(Container);