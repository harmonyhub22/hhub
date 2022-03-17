import { CSSProperties, FC, memo, useEffect } from 'react'
import { useDrag, DragSourceMonitor } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { Box } from './Box'

function getStyles(
  left: number,
  top: number,
  isDragging: boolean,
): CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  }
}

export interface DraggableBoxProps {
  id: string;
  left: number;
  top: number;
  stagingSoundName: string | null;
  stagingSoundBuffer: AudioBuffer | null;
}

export const DraggableBox: FC<DraggableBoxProps> = memo(function DraggableBox(
  props,
) {
  const { id, left, top, stagingSoundName, stagingSoundBuffer } = props
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "box",
      item: { id, left, top,  },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top],
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  return (
    <div
      ref={drag}
      style={getStyles(left, top, isDragging)}
      role="DraggableBox"
    >
      <Box stagingSoundBuffer={stagingSoundBuffer} stagingSoundName={stagingSoundName} />
    </div>
  )
})
