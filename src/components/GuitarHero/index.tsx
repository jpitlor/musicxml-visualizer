import { Canvas } from "@react-three/fiber";
import classNames from "classnames";
import { useState } from "react";
import Song from "./Song.tsx";
import type { Part } from "../../types";
import SongContext from "../../context/SongContext.ts";
import { useMeasure } from "@uidotdev/usehooks";
import Camera from "./Camera.tsx";

interface GuitarHeroProps {
  className?: string;
  showReset?: boolean;
  parts: Part[];
}

const containerId = "osmd";

export default function GuitarHero({
  className,
  showReset = true,
  parts,
}: GuitarHeroProps) {
  const [key, setKey] = useState(0);
  const [containerRef, containerSize] = useMeasure();

  function handleReset() {
    setKey((k) => k + 1);
  }

  return (
    <SongContext
      value={{
        containerWidth: containerSize.width ?? 0,
        containerHeight: containerSize.height ?? 0,
      }}
    >
      <div className="h-96 flex flex-col gap-4">
        <div id={containerId} className="hidden" />
        {showReset && (
          <button
            className="cursor-pointer py-1 px-2 bg-blue-500 shadow rounded text-white"
            onClick={handleReset}
          >
            {key === 0 ? "Play" : "Reset"}
          </button>
        )}
        {key > 0 && (
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
            <Song key={key} parts={parts} />
          </Canvas>
        )}
      </div>
    </SongContext>
  );
}
