import { FC, CSSProperties, useEffect, useState, memo } from 'react'
import { Box } from './Box'

const styles: CSSProperties = {
  display: 'inline-block',
}

export interface BoxDragPreviewProps {
  boxWidth: number;
}

export interface BoxDragPreviewState {
  tickTock: any
}

export const BoxDragPreview: FC<BoxDragPreviewProps> = memo(function BoxDragPreview({boxWidth}) {
  const [tickTock, setTickTock] = useState(false);

  useEffect(
    function subscribeToIntervalTick() {
      const interval = setInterval(() => setTickTock(!tickTock), 500);
      return () => clearInterval(interval);
    },
    [tickTock]
  );

  return (
    <div style={styles}>
      <Box
        yellow={tickTock}
        boxWidth={boxWidth}
        preview
      />
    </div>
  );
});
