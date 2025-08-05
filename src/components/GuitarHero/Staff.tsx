import range from "lodash.range";
import { extend } from "@react-three/fiber";
import { Line2 as Line2Old } from "three/addons/lines/Line2.js";
import { LineMaterial as LineMaterialOld } from "three/addons/lines/LineMaterial.js";
import LineGeometry from "./LineGeometry.tsx";
import { RAD_OF_225_DEG } from "../../constants/canvas.ts";
import to2Places from "../../utils/to2Places.ts";

const Line2 = extend(Line2Old);
const LineMaterial = extend(LineMaterialOld);

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
  const radGap = Math.PI / (3 * (lineCount - 1));

  return range(0, lineCount).map((i) => {
    const leftOffset = Math.cos(RAD_OF_225_DEG + radGap * i);

    const startX = to2Places(middleX + (leftOffset * width) / 3);
    const startY = to2Places(middleY + height / 2);
    const endX = to2Places(middleX + (leftOffset * width * 7) / 8);
    const endY = to2Places(middleY + (height * -1) / 2);

    return (
      <Line2 key={`${startX}-${startY}-${endX}-${endY}`}>
        <LineMaterial linewidth={3} color="black" />
        <LineGeometry
          points={[
            [startX, startY, 0],
            [endX, endY, 0],
          ]}
        />
      </Line2>
    );
  });
}
