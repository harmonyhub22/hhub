/* eslint-disable react/display-name */
import React from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";

export const PaletteDraggable = (Component: any) => {
  return (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: "layer",
        item: {
          id: props.id,
          left: props.left,
          top: props.top,
          stagingSoundName: props.stagingSoundName,
          stagingSoundBufferDate: props.stagingSoundBufferDate,
          stagingSoundBufferDuration: props.stagingSoundBufferDuration,
          stagingSoundBuffer: props.stagingSoundBuffer,
        },
        collect: (monitor: DragSourceMonitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [props.left, props.top]
    );

    return <Component drag={drag} preview={preview} {...props} />;
  };
};