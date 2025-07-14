import React, { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import Staff from "./Staff.tsx";

export default function Song() {
  const ref = useRef<Mesh | null>(null);
  useFrame(() => {
    if (!ref.current) {
      return;
    }

    ref.current.position.y += 0.1;
  });

  return (
    <React.Fragment>
      <Staff lineCount={5} />
      <mesh ref={ref}>
        <circleGeometry />
      </mesh>
    </React.Fragment>
  );
}
