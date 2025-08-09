import { useContext, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import useAudioPlayer from "../../hooks/useAudioPlayer.ts";
import type { Part } from "../../types";
import SongContext from "../../context/SongContext.ts";
import ThreePart from "./Part.tsx";
import React from "react";

interface SongProps {
  parts: Part[];
}

export default function Song({ parts: parts }: SongProps) {
  const { containerWidth, containerHeight } = useContext(SongContext);
  const { clock } = useThree();
  const { loadInstrument, playNote, status } = useAudioPlayer();

  const displayedParts = parts.filter((p) => p.display);
  const justPlayedParts = parts.filter((p) => p.play && !p.display);
  const columnCount = Math.floor(Math.sqrt(displayedParts.length));
  const rowCount = displayedParts.length / columnCount;
  const tileWidth = containerWidth / columnCount;
  const tileHeight = containerHeight / rowCount;

  useEffect(() => {
    clock.stop();
    if (status !== "success") {
      return;
    }

    Promise.all(
      parts.filter((p) => p.play).map((p) => loadInstrument(p.instrument)),
    ).then(() => {
      clock.start();
    });
  }, [clock, status, loadInstrument, parts]);

  return (
    <React.Fragment>
      {displayedParts.map((part, i) => (
        <ThreePart
          key={part.id}
          x={
            containerWidth / -2 + tileWidth * (i % columnCount) + tileWidth / 2
          }
          y={
            containerHeight / -2 +
            tileHeight * Math.floor(i / columnCount) +
            tileHeight / 2
          }
          width={tileWidth}
          height={tileHeight}
          notes={part.notes}
          instrument={part.instrument}
          playNote={part.play ? playNote : undefined}
        />
      ))}
      {justPlayedParts.map((part) => (
        <ThreePart
          key={part.id}
          x={containerWidth * 2}
          y={containerHeight * 2}
          width={tileWidth}
          height={tileHeight}
          notes={part.notes}
          instrument={part.instrument}
          playNote={playNote}
        />
      ))}
    </React.Fragment>
  );
}
