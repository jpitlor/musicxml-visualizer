import { Canvas } from "@react-three/fiber";
import classNames from "classnames";
import Song from "./Song";
import type { Part } from "../../types";
import SongContext from "../../context/SongContext";
import { useMeasure } from "@uidotdev/usehooks";
import Camera from "./Camera";
import Line from "./Line";

interface GuitarHeroProps {
  className?: string;
  parts: Part[];
}

const containerId = "osmd";

export default function GuitarHero({ className, parts }: GuitarHeroProps) {
  const [containerRef, containerSize] = useMeasure();
  const containerWidth = containerSize.width ?? 0;
  const containerHeight = containerSize.height ?? 0;

  return (
    <SongContext value={{ containerWidth, containerHeight }}>
      <div className="h-96 flex flex-col gap-4">
        <div id={containerId} className="hidden" />
        <Canvas
          className={classNames("flex-1", className)}
          ref={containerRef}
          orthographic={true}
        >
          <Camera
            width={containerSize.width ?? 0}
            height={containerSize.height ?? 0}
          />
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <Line
            points={[
              containerWidth / -2,
              containerHeight / -2,
              containerWidth / 2,
              containerHeight / -2,
            ]}
            width={6}
          />
          <Line
            points={[
              containerWidth / -2,
              containerHeight / -2,
              containerWidth / -2,
              containerHeight / 2,
            ]}
            width={6}
          />
          <Line
            points={[
              containerWidth / 2,
              containerHeight / 2,
              containerWidth / 2,
              containerHeight / -2,
            ]}
            width={6}
          />
          <Line
            points={[
              containerWidth / 2,
              containerHeight / 2,
              containerWidth / -2,
              containerHeight / 2,
            ]}
            width={6}
          />
          <Song parts={parts} />
        </Canvas>
      </div>
    </SongContext>
  );
}
