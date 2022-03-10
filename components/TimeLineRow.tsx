import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Temp } from "./temp";

const LAYERS = [
  { id: 1, name: "dog" },
  { id: 2, name: "cat" },
  { id: 3, name: "fish" },
  { id: 4, name: "hamster" },
];

export const TimeLineRow = () => {
  const [basket, setBasket] = useState([]);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "layer",
    drop: (item) => addItemToBoard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addItemToBoard = (id) => {
    const itemList = LAYERS.filter((item) => id === item.id);
    setBasket([itemList[0]]);
  };

  return (
    <React.Fragment>
      <div className="layers">
        {LAYERS.map((layer) => {
          return <Temp id={layer.id} name={layer.name} />;
        })}
      </div>
      <div className="Basket" ref={drop}>
        {basket.map((layer) => {
          return <Temp id={layer.id} name={layer.name} />;
        })}
      </div>
    </React.Fragment>
  );
};
