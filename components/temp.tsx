import React from "react";
import { useDrag } from "react-dnd";

export const Temp = ({ id, name }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "layer",
    item: { id, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div className="layer-card" ref={dragRef}>
      {name}
      {isDragging && "😱"}
    </div>
  );
};

export default Temp;
