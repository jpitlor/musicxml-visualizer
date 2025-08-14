import { extend } from "@react-three/fiber";
import { Line2 as Line2Old } from "three/addons/lines/Line2.js";
import { LineMaterial as LineMaterialOld } from "three/addons/lines/LineMaterial.js";
import LineGeometry from "./LineGeometry";

const Line2 = extend(Line2Old);
const LineMaterial = extend(LineMaterialOld);

interface LineProps {
  points: [number, number, number, number];
  width?: number;
}

export default function Line({ points, width = 3 }: LineProps) {
  const [startX, startY, endX, endY] = points;

  return (
    <Line2>
      <LineMaterial linewidth={width} color="black" />
      <LineGeometry
        points={[
          [startX, startY, 0],
          [endX, endY, 0],
        ]}
      />
    </Line2>
  );
}
