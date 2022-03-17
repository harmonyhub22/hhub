import React from "react";
import { useDrag } from "react-dnd";

export const Draggable = (Component: any) => {
  return (props: any) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: "box",
      item: {
        id: props.id,
      },  // access props, the item is the metadata of the layer
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      [props.id, props.left, props.top]
    );

    return <Component isDragging={isDragging} drag={drag} preview={preview} {...props} />;
  };
};
