import { CSSProperties, FC, memo, useEffect } from "react";
import TimeLineLayer from "./TimeLineLayer";

const styles: CSSProperties = {
  border: "1px dashed gray",
  cursor: "move",
  display: "flex",
  maxHeight: "60px",
  flexFlow: "nowrap",
  verticalAlign: "middle",
  minWidth: "400px",
  borderRadius: "22px",
  padding: "5px 16px 5px 8px",
};

export interface BoxProps {
  yellow?: boolean;
  preview?: boolean;
  stagingSoundName: string | null;
  stagingSoundBuffer: AudioBuffer | null;
}

export const Box: FC<BoxProps> = memo(function Box({ yellow, preview, stagingSoundName, stagingSoundBuffer }) {
  const backgroundColor = yellow ? "yellow" : "white";

  return (
    <div
      style={{ ...styles, backgroundColor }}
      role={preview ? "BoxPreview" : "Box"}
    >
      <TimeLineLayer
        stagingSoundBuffer={stagingSoundBuffer}
        stagingSoundName={stagingSoundName}
      />
    </div>
  );
});
