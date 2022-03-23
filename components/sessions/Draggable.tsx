/* eslint-disable react/display-name */
import React from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";

export const Draggable = (Component: any) => {
  return (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: "box",
        item: {
          id: props.id,
          left: props.left,
          top: props.top,
        },
        collect: (monitor: DragSourceMonitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [props.id, props.left, props.top]
    );

    return <Component isDragging={isDragging} drag={drag} preview={preview} {...props} />;
  };
};