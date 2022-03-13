import React, { useState } from "react";
import { useDrop } from "react-dnd";

interface TimeLineRowProps {
  isOver: boolean,
  dropRef: any,
};

class TimeLineRow extends React.Component<TimeLineRowProps> {

export const TimeLineRow = () => {

  const addItemToBoard = (id) => {
    const itemList = LAYERS.filter((item) => id === item.id);
    setBasket([itemList[0]]);
  };


  constructor(props:TimeLineRowProps) {
    super(props);
    
  }

  render() {

  }

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
