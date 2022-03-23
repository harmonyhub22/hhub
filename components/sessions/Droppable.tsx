import React, { useState } from "react";
import { useDrop } from "react-dnd";

export const Droppable = (Component: any) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [{ isOver }, dropRef] = useDrop(() => ({
      accept: "layer",
      drop: (item, monitor: any) => Component.layerDropped(item, monitor),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
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