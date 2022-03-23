import { CSSProperties, FC, useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import StagedLayer from './ui/StagedLayer'
import { snapToGrid as doSnapToGrid } from './snapToGrid'
import update from 'immutability-helper'
import SubmittedLayer from './ui/SubmittedLayer'
import TimelineLayer from './ui/Timeline-Layer'
import Layer from '../interfaces/models/Layer'

interface LayerBox {
  id: string;
  top: number;
  left: number;
  stagingSoundName: string | null;
  stagingSoundBuffer: AudioBuffer | null;
  duration: number;
}

const styles: CSSProperties = {
  width: "100%",
  height: 60,
  position: "relative",
  border: "1px dashed gray",
};

export interface ContainerProps {
  snapToGrid: boolean;
  layers: Layer[];
  handleNewLayer: any;
}

export const Container: FC<ContainerProps> = ({ snapToGrid, layers, handleNewLayer }) => {
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
        if (snapToGrid) {
          [left, top] = doSnapToGrid(left, top);
        }

        moveBox(item.id, left, top);

        handleNewLayer(placedLayer);

        return undefined;
      },
    }),
    [moveBox]
  );

  useEffect(() => {
    // want the container to be large enough height to hold all submitted layers plus room for 1 more
    const newContainerHeight = layers.length * 60 + 60;
    setContainerHeight(newContainerHeight);
  }, [layers]);

  return (
    // if we uncomment the collect: in useDrop(), add logic to show "Drop here!" if .isOver
    <div ref={drop} style={styles}>
      {layerBox.id === "-1" ? (
        <p>Drop your layer here!</p>
      ) : (
        layers.map((layer, i) => {
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
