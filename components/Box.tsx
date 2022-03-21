import { CSSProperties, FC, memo, useEffect, useState } from "react";
import TimeLineLayer from "./ui/TimelineLayer";

export interface BoxProps {
  yellow?: boolean;
  preview?: boolean;
  boxWidth: number;
}

export const Box: FC<BoxProps> = memo(function Box({ yellow, preview, boxWidth }) {
  const backgroundColor = yellow ? "yellow" : "white";

  const [styles, setStyles] = useState({
    border: "1px dashed gray",
    cursor: "move",
    display: "flex",
    height: "70px",
    flexFlow: "nowrap",
    verticalAlign: "middle",
    width: "400px",
    borderRadius: "22px",
    padding: "5px 16px 5px 8px",
  });

  useEffect(() => {
    setStyles({
      border: "1px dashed gray",
      cursor: "move",
      display: "flex",
      height: "70px",
      flexFlow: "nowrap",
      verticalAlign: "middle",
      borderRadius: "22px",
      padding: "5px 16px 5px 8px",
      width: (boxWidth * 58).toString() + "px",  // TODO: find a solid math formula for computing the width based on layer duration
    });
  }, []);

  return (
    <div
      style={styles}
      role={preview ? "BoxPreview" : "Box"}
    >
      <p>Drag me to the timeline!</p>
    </div>
  );
});
