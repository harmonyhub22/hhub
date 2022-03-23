import React, { useState } from "react";
import { useDrop } from "react-dnd";

export const Droppable = (Component: any) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const [layer, setLayer] = useState([]);
    const [{ isOver }, dropRef] = useDrop(() => ({
      accept: "layer",
      drop: (item) => setLayer([item]),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));
    return (
      <Component
        isOver={isOver}
        dropRef={dropRef}
        newLayer={layer}
        {...props}
      />
    );
  };
};