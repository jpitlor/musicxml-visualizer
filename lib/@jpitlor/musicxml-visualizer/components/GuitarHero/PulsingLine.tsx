import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useContext, useRef } from "react";
import { findLast } from "lodash";
import SongContext from "../../context/SongContext";

interface PulsingLineProps {
  x: number;
  y: number;
  width: number;
  maxHeight: number;
  minHeight: number;
}
//
// {
//   uniforms: {
//     color1: {
//       value: new THREE.Color("red")
//     },
//     color2: {
//       value: new THREE.Color("purple")
//     },
//     bboxMin: {
//       value: geometry.boundingBox.min
//     },
//     bboxMax: {
//       value: geometry.boundingBox.max
//     }
//   },
//   vertexShader: `
//     uniform vec3 bboxMin;
//     uniform vec3 bboxMax;
//
//     varying vec2 vUv;
//
//     void main() {
//       vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
//     }
//   `,
//     fragmentShader: `
//     uniform vec3 color1;
//     uniform vec3 color2;
//
//     varying vec2 vUv;
//
//     void main() {
//
//       gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
//     }
//   `,
//   wireframe: true
// }

export default function PulsingLine({
  x,
  y,
  width,
  minHeight,
  maxHeight,
}: PulsingLineProps) {
  const { tempos } = useContext(SongContext);
  const ref = useRef<Mesh | null>(null);
  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }

    const tempo = findLast(tempos, (t) => t.time < clock.elapsedTime);
    if (!tempo) {
      return;
    }

    const newHeight =
      Math.pow(
        Math.cos((Math.PI * clock.elapsedTime) / tempo.secondsPerBeat),
        4,
      ) *
        (maxHeight - minHeight) +
      minHeight;
    ref.current.scale.y = newHeight / 2;
    ref.current.position.y = y + newHeight / 2;
  });

  return (
    <mesh position={[x, y, 0]} ref={ref}>
      <boxGeometry args={[width, minHeight]} />
      {/*<shaderMaterial  />*/}
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
