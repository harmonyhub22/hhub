import React, { useState } from "react";
import { useDrop } from "react-dnd";

export const Droppable = (Component: any) => {
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
        layer={layer}
        setLayer={setLayer}
        {...props}
      />
    );
  };
};
