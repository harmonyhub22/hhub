import { CSSProperties, FC, useEffect, useState } from 'react';
import { Container } from "./Container";
import { CustomDragLayer } from "./CustomDragLayer";

interface TimelineRowProps {
  maxWidth: number,
}

export const TimelineRow: FC<TimelineRowProps> = ({ maxWidth }) => {
  const [widthNeeded, setWidthNeeded] = useState(maxWidth);

  return (
    <tr>
      <td>
        <Container snapToGrid={true} maxWidth={widthNeeded} />
        <CustomDragLayer snapToGrid={true} />
      </td>
    </tr>
  )
}

