import { CSSProperties, FC, useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { DraggableBox } from './DraggableBox'
import { snapToGrid as doSnapToGrid } from './snapToGrid'
import update from 'immutability-helper'

export interface ContainerProps {
  snapToGrid: boolean;
  maxWidth: number;
  setLayerInfo: any;
}

interface BoxContainer {
  id: string;
  top: number;
  left: number;
  stagingSoundName: string | null;
  stagingSoundBuffer: AudioBuffer | null;
}

export const Container: FC<ContainerProps> = ({ snapToGrid, maxWidth, setLayerInfo }) => {
  const [styles, setStyles] = useState({
    width: 100,
    height: 60,
    position: "relative",
    border: "2px solid black",
  });

  const [boxContainer, setBoxContainer] = useState<BoxContainer>({
    id: "-1",
    top: 0,
    left: 0,
    stagingSoundName: null,
    stagingSoundBuffer: null,
  });

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      console.log("Going to move the box!");
      console.log("before:");
      console.log(boxContainer);

      setBoxContainer((prev) => ({
        ...prev,
        top: top,
        left: left,
      }));

      console.log("after:");
      console.log(boxContainer);
    },
    [boxContainer]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "box",
      // collect: (monitor) => ({
      //   isOver: !!monitor.isOver(),
      // }),
      drop(item: BoxContainer, monitor) {
        console.log("Item is being dropped! the item id is " + item.id)
        if (boxContainer.id === "-1") {
          setBoxContainer({
            id: item.id,
            top: 0,
            left: 0,
            stagingSoundName: item.stagingSoundName,
            stagingSoundBuffer: item.stagingSoundBuffer,
          });
        }

        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number;
          y: number;
        };

        if (delta.x != 0 || delta.y != 0) {
          let left = Math.round(item.left + delta.x);
          let top = Math.round(item.top + delta.y);
          if (snapToGrid) {
            [left, top] = doSnapToGrid(left, top);
          }
  
          moveBox(item.id, left, top);
        }
        return undefined;
      },
    }),
    [moveBox]
  );

  useEffect(() => {
    setStyles({
      width: maxWidth,
      height: 60,
      position: "relative",
      border: "2px solid black",
    });
  }, []);

  return (
    // if we uncomment the collect: in useDrop(), add logic to show "Drop here!" if .isOver
    <div ref={drop} style={styles}>
      {boxContainer.id === "-1"
      ? <p>Drop your layer here!</p>
      : <DraggableBox
          id={boxContainer.id}
          top={boxContainer.top}
          left={boxContainer.left}
          stagingSoundName={boxContainer.stagingSoundName}
          stagingSoundBuffer={boxContainer.stagingSoundBuffer}
        />
      }
    </div>
  );
}
