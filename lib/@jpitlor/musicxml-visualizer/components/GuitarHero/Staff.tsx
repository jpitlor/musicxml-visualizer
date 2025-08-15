import { range } from "lodash";
import { RAD_OF_225_DEG } from "../../constants/canvas";
import to2Places from "../../utils/to2Places";
import Line from "./Line";

interface StaffProps {
  lineCount: number;
  middleX: number;
  middleY: number;
  width: number;
  height: number;
}

export default function Staff({
  lineCount,
  middleY,
  middleX,
  height,
  width,
}: StaffProps) {
  const radGap = lineCount === 1 ? 0 : Math.PI / (3 * (lineCount - 1));

  return range(0, lineCount).map((i) => {
    const leftOffset = Math.cos(RAD_OF_225_DEG + radGap * i);

    const startX = to2Places(middleX + (leftOffset * width) / 3);
    const startY = to2Places(middleY + height / 2);
    const endX = to2Places(middleX + (leftOffset * width * 7) / 8);
    const endY = to2Places(middleY + (height * -1) / 2);

    return (
      <Line
        points={[startX, startY, endX, endY]}
        key={`${startX}-${endX}-${startY}-${endY}`}
      />
    );
  });
}
