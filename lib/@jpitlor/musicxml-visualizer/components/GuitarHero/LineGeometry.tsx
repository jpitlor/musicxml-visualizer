import { LineGeometry as LineGeometryOld } from "three/addons/lines/LineGeometry.js";
import type { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const LineGeometryEx = extend(LineGeometryOld);

interface LineGeometryProps {
  points: [number, number, number][];
}

export default function LineGeometry({ points }: LineGeometryProps) {
  const ref = useRef<LineSegmentsGeometry>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.setPositions(points.flat());
  }, [points]);

  return <LineGeometryEx attach="geometry" ref={ref} />;
}
