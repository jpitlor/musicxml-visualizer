import range from "lodash.range";
import { extend } from "@react-three/fiber";
import { Line2 as Line2Old } from "three/addons/lines/Line2.js";
import { LineMaterial as LineMaterialOld } from "three/addons/lines/LineMaterial.js";
import LineGeometry from "./LineGeometry.tsx";
import { HEIGHT, RAD_OF_225_DEG, WIDTH } from "../../constants/canvas.ts";

const Line2 = extend(Line2Old);
const LineMaterial = extend(LineMaterialOld);

interface StaffProps {
  lineCount: number;
}

export default function Staff({ lineCount }: StaffProps) {
  const radGap = Math.PI / (3 * (lineCount - 1));

  return range(0, lineCount).map((i) => (
    <Line2 key={i}>
      <LineMaterial linewidth={3} color="black" />
      <LineGeometry
        points={[
          [0, HEIGHT * 2, 0],
          [
            Math.cos(RAD_OF_225_DEG + radGap * i) * ((WIDTH * 2) / 3),
            HEIGHT * -1,
            0,
          ],
        ]}
      />
    </Line2>
  ));
}
