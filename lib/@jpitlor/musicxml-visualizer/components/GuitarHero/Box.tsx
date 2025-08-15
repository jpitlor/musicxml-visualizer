import React from "react";
import Line from "./Line";

interface BoxProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export default function Box({ startX, startY, endX, endY }: BoxProps) {
  return (
    <React.Fragment>
      <Line points={[startX, startY, endX, startY]} />
      <Line points={[startX, startY, startX, endY]} />
      <Line points={[endX, endY, startX, endY]} />
      <Line points={[endX, endY, endX, startY]} />
    </React.Fragment>
  );
}
