import React, { useState } from "react";
import { useDrop } from "react-dnd";

export const Droppable = (Component: any) => {
  return (props: any) => {
    const [basket, setBasket] = useState({});
    const [{ isOver }, dropRef] = useDrop(() => ({
      accept: "layer",
      drop: (item) => setBasket({ id: item.id }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    return <Component isOver={isOver} dropRef={dropRef} basket={basket} setBasket={setBasket} {...props} />;
  };
};