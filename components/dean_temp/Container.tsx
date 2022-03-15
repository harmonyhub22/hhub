import { CSSProperties, FC, useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { DraggableBox } from './DraggableBox'
import { snapToGrid as doSnapToGrid } from './snapToGrid'
import update from 'immutability-helper'
import type { DragItem } from './interfaces'

export interface ContainerProps {
  snapToGrid: boolean,
  maxWidth: number,
}

interface BoxMap {
  [key: string]: { top: number; left: number; title: string }
}

export const Container: FC<ContainerProps> = ({ snapToGrid, maxWidth }) => {
  const [styles, setStyles] = useState({
    width: 100,
    height: 60,
    position: "relative",
  });

  const [boxes, setBoxes] = useState<BoxMap>({
    a: { top: 0, left: 0, title: 'Drag me around' },
  })

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      )
    },
    [boxes],
  )

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number
          y: number
        }

        let left = Math.round(item.left + delta.x)
        let top = Math.round(item.top + delta.y)
        if (snapToGrid) {
          ;[left, top] = doSnapToGrid(left, top)
        }

        moveBox(item.id, left, top)
        return undefined
      },
    }),
    [moveBox],
  )

  useEffect(() => {
    setStyles({
      width: maxWidth,
      height: 60,
      position: "relative",
    });
  }, []);

  return (
    <div ref={drop} style={styles}>
      {Object.keys(boxes).map((key) => (
        <DraggableBox
          key={key}
          id={key}
          {...(boxes[key] as { top: number; left: number; title: string })}
        />
      ))}
    </div>
  )
}
