import React, { useState } from "react";
import { useDrop } from "react-dnd";

export const Droppable = (Component: any) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [{ canDrop, isOver }, dropRef] = useDrop(() => ({
      accept: "layer",
      hover: (item, monitor: any) => {console.log('is hovering')},
      drop: (item, monitor: any) => {console.log('is drop')}, // Component.layerDropped(item, monitor),
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
    }));
    return (
      <Component
        isOver={isOver}
        dropRef={dropRef}
        {...props}
      />
    );
  };
};