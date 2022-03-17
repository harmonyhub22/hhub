import { FC, CSSProperties, useEffect, useState, memo } from 'react'
import { Box } from './Box'

const styles: CSSProperties = {
  display: 'inline-block',
  // transform: 'rotate(-7deg)',
  // WebkitTransform: 'rotate(-7deg)',
}

export interface BoxDragPreviewProps {
  maxWidth: number;
  stagingSoundName: string | null;
  stagingSoundBuffer: AudioBuffer | null;
}

export interface BoxDragPreviewState {
  tickTock: any
}

export const BoxDragPreview: FC<BoxDragPreviewProps> = memo(function BoxDragPreview({
  maxWidth, stagingSoundName, stagingSoundBuffer
}) {
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
        stagingSoundBuffer={stagingSoundBuffer}
        stagingSoundName={stagingSoundName}
        yellow={tickTock}
        preview
      />
    </div>
  );
});
