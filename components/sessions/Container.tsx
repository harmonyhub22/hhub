import { CSSProperties, FC, useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import StagedLayer from './ui/StagedLayer'
import update from 'immutability-helper'
import TimelineLayer from './ui/Timeline-Layer'
import Layer from '../interfaces/models/Layer'
import React from 'react'

interface LayerBox {
  id: string;
  top: number;
  left: number;
  stagingSoundName: string | null;
  stagingSoundBuffer: AudioBuffer | null;
  duration: number;
}

interface ContainerProps {
  layers: Layer[];
  handleNewLayer: any;
}

interface ContainerState {
  containerHeight: string,
  layerBox: LayerBox,
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = {
      containerHeight: 60,
      layerBox: null, 
    }
    this.layerDropped = this.layerDropped.bind(this);
  }

  componentDidUpdate(prevProps:ContainerProps) {
    if (prevProps.newLayer.staged !) {

    }
  };

  layerDropped() {
    // add layer
  }

  const [containerHeight, setContainerHeight] = useState(60);

  const [layerBox, setLayerBox] = useState<LayerBox>({
    id: "-1",
    top: 0,
    left: 0,
    stagingSoundName: null,
    stagingSoundBuffer: null,
    duration: 0,
  });

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      // console.log("Going to move the box!");
      // console.log("before:");
      // console.log(layerBox);

      setLayerBox((prev) => ({
        ...prev,
        top: top,
        left: left,
      }));

      // console.log("after:");
      // console.log(layerBox);
    },
    [layerBox]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "box",
      drop(item: LayerBox, monitor: any) {
        console.log("Item is being dropped! the item id is " + item.id)

        const placedLayer: Layer = {
          layer: null,  // TODO: set this (not sure how if we are passing around layer data properly atm)
          submitted: false,
          top: layers.length * 60,
          left: 0,
          stagingSoundName: item.stagingSoundName,
          stagingSoundBuffer: item.stagingSoundBuffer,
          duration: item.duration,
        }

        setLayerBox({
          id: item.id,
          top: layers.length * 60,
          left: 0,
          stagingSoundName: item.stagingSoundName,
          stagingSoundBuffer: item.stagingSoundBuffer,
          duration: item.duration,
        });

        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number;
          y: number;
        };

        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);

        moveBox(item.id, left, top);

        handleNewLayer(placedLayer);

        return undefined;
      },
    }),
    [moveBox]
  );

  componentDidMount() {
    
  }

  useEffect(() => {
    // want the container to be large enough height to hold all submitted layers plus room for 1 more
    const newContainerHeight = layers.length * 60 + 60;
    setContainerHeight(newContainerHeight);
  }, [layers]);


  render() {
    return (
      // if we uncomment the collect: in useDrop(), add logic to show "Drop here!" if .isOver
      <div ref={drop} className="timeline-container">
          {layerBox.id === "-1" ? (
          <p>Drop your layer here!</p>
          ) : (
          this.props.layers.map((layer, i) => {
              // if (timelineLayer.submitted) {
              //   return (
              //     <SubmittedLayer
              //       id={timelineLayer.layer.layerId || "1"}  // TODO: set the layer id properly
              //       top={timelineLayer.top}
              //       left={timelineLayer.left}
              //       stagingSoundName={timelineLayer.stagingSoundName}
              //       stagingSoundBuffer={timelineLayer.stagingSoundBuffer}
              //       duration={timelineLayer.duration}
              //     />
              //   )
              // }
              // else {
              //   return (
              //     <StagedLayer
              //       id={timelineLayer.layer.layerId || "1"}
              //       top={timelineLayer.top}
              //       left={timelineLayer.left}
              //       stagingSoundName={timelineLayer.stagingSoundName}
              //       stagingSoundBuffer={timelineLayer.stagingSoundBuffer}
              //       duration={timelineLayer.duration}
              //       addDuplicate={}
              //     />
              //   )
              // }

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
              />
              )
          })
          )}
      </div>
    );
  }
}

export default Droppable(Container);