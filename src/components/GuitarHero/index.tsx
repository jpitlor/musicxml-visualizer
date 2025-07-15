import { Canvas } from "@react-three/fiber";
import Song from "./Song.tsx";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

interface GuitarHeroProps {
  xml: string;
  className?: string;
}

const containerId = "osmd";

export default function GuitarHero({ xml, className }: GuitarHeroProps) {
  const [osmd, setOsmd] = useState<OpenSheetMusicDisplay | null>(null);

  useEffect(() => {
    if (!xml) {
      return;
    }

    const newOsmd = new OpenSheetMusicDisplay(containerId, {
      autoResize: true,
      backend: "svg",
      drawTitle: false,
    });
    // noinspection JSIgnoredPromiseFromCall
    newOsmd.load(xml);
    setOsmd(newOsmd);
  }, [xml]);

  return (
    <React.Fragment>
      <div id={containerId} className="hidden" />
      <Canvas className={classNames("w-full h-full", className)}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {osmd && <Song osmd={osmd} />}
      </Canvas>
    </React.Fragment>
  );
}
