import React from "react";
import { useDrag } from "react-dnd";

export const Draggable = (Component: any) => {
  return (props: any) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: "layer",
      item: { id: 1 },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    return <Component isDragging={isDragging} dragRef={dragRef} {...props} />;
  };
};
