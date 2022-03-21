import { CSSProperties, FC, useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import TimelineLayer from './ui/TimelineLayer'
import { snapToGrid as doSnapToGrid } from './snapToGrid'
import update from 'immutability-helper'

interface LayerBox {
  id: string;
  top: number;
  left: number;
  stagingSoundName: string | null;
  stagingSoundBuffer: AudioBuffer | null;
  showPalette: any;
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
  setLayerInfo: any;
}

export const Container: FC<ContainerProps> = ({ snapToGrid, setLayerInfo }) => {
  const[layerIsPlaced, setLayerIsPlaced] = useState(false);

  const [layerBox, setLayerBox] = useState<LayerBox>({
    id: "-1",
    top: 0,
    left: 0,
    stagingSoundName: null,
    stagingSoundBuffer: null,
    showPalette: null,
    duration: 0,
  });

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      console.log("Going to move the box!");
      console.log("before:");
      console.log(layerBox);

      setLayerBox((prev) => ({
        ...prev,
        top: top,
        left: left,
      }));

      console.log("after:");
      console.log(layerBox);
    },
    [layerBox]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "box",
      // collect: (monitor) => ({
      //   isOver: !!monitor.isOver(),
      // }),
      drop(item: LayerBox, monitor) {
        setLayerIsPlaced(true);
        console.log("Item is being dropped! the item id is " + item.id)
        // if (boxContainer.id === "-1") {
        //   setBoxContainer({
        //     id: item.id,
        //     top: 0,
        //     left: 0,
        //     stagingSoundName: item.stagingSoundName,
        //     stagingSoundBuffer: item.stagingSoundBuffer,
        //     showPalette: item.showPalette,
        //     duration: item.duration,
        //   });
        // }

        setLayerBox({
          id: item.id,
          top: 0,
          left: 0,
          stagingSoundName: item.stagingSoundName,
          stagingSoundBuffer: item.stagingSoundBuffer,
          showPalette: item.showPalette,
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

        return undefined;
      },
    }),
    [moveBox]
  );

  useEffect(() => {
    //console.log("useEffect in container: id is " + layerBox.id)
  }, []);

  return (
    // if we uncomment the collect: in useDrop(), add logic to show "Drop here!" if .isOver
    <div ref={drop} style={styles}>
      {layerBox.id === "-1" ? (
        <p>Drop your layer here!</p>
      ) : (
        <TimelineLayer
          id={layerBox.id}
          top={layerBox.top}
          left={layerBox.left}
          stagingSoundName={layerBox.stagingSoundName}
          stagingSoundBuffer={layerBox.stagingSoundBuffer}
          showPalette={layerBox.showPalette}
          duration={layerBox.duration}
          layerIsPlaced={layerIsPlaced}
        />
      )}
    </div>
  );
}
