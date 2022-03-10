import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Temp } from "./temp";

const LAYERS = {
  id: 1,
  name: "dog",
};

export const TimeLineRow = () => {
  const [layer, setLayer] = useState();
  const [{ isOver }, dropRef] = useDrop({
    accept: "layer",
    drop: (item) => setLayer(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <React.Fragment>
      <tr>
        <div className="layers">
          <Temp draggable id={LAYERS.id} name={LAYERS.name} />
        </div>
        <div className="basket" ref={dropRef}>
          <Temp id={LAYERS.id} name={LAYERS.name} />
          {isOver && <div>Drop Here!</div>}
        </div>
      </tr>
    </React.Fragment>
  );
};
