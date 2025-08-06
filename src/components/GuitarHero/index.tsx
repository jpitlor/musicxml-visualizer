import { Canvas } from "@react-three/fiber";
import Song from "./Song.tsx";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import type { Part } from "../../types";
import useElementSize from "../../hooks/useElementSize.ts";
import SongContext from "../../context/SongContext.ts";

interface GuitarHeroProps {
  xml: string;
  className?: string;
  showReset?: boolean;
  parts?: Part[];
}

const containerId = "osmd";

export default function GuitarHero({
  xml,
  className,
  showReset = true,
  parts,
}: GuitarHeroProps) {
  const [containerSize, containerRef] = useElementSize<HTMLCanvasElement>();
  const [key, setKey] = useState(0);
  const [osmd, setOsmd] = useState<OpenSheetMusicDisplay | null>(null);

  function handleReset() {
    setKey((k) => k + 1);
  }

  useEffect(() => {
    if (!xml) {
      return;
    }

    const newOsmd = new OpenSheetMusicDisplay(containerId, {
      autoResize: true,
      backend: "svg",
      drawTitle: false,
    });
    newOsmd.load(xml).then(() => setOsmd(newOsmd));
  }, [xml]);

  return (
    <SongContext
      value={{
        containerWidth: containerSize.width,
        containerHeight: containerSize.height,
      }}
    >
      <div className="h-96 flex flex-col gap-4">
        <div id={containerId} className="hidden" />
        {showReset && (
          <button
            className="cursor-pointer py-1 px-2 bg-blue-500 shadow rounded text-white"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
        <Canvas
          className={classNames("flex-1", className)}
          ref={containerRef}
          orthographic={true}
          camera={{
            left: containerSize.width / -2,
            top: containerSize.height / 2,
            right: containerSize.width / 2,
            bottom: containerSize.height / -2,
          }}
        >
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
          {osmd && <Song osmd={osmd} key={key} parts={parts} />}
        </Canvas>
      </div>
    </SongContext>
  );
}
