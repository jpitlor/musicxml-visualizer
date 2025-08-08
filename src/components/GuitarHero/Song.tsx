import { useContext, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import useAudioPlayer from "../../hooks/useAudioPlayer.ts";
import type { Part } from "../../types";
import SongContext from "../../context/SongContext.ts";
import ThreePart from "./Part.tsx";
import type { InstrumentName } from "soundfont-player";

interface SongProps {
  parts: Part[];
}

export default function Song({ parts: parts }: SongProps) {
  const { containerWidth, containerHeight } = useContext(SongContext);
  const { clock } = useThree();
  const { loadInstrument, playNote, status } = useAudioPlayer();

  const columnCount = Math.floor(Math.sqrt(parts?.length ?? 1));
  const rowCount = (parts?.length ?? 1) / columnCount;
  const tileWidth = containerWidth / columnCount;
  const tileHeight = containerHeight / rowCount;

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    Promise.all(
      parts
        .filter((p) => !!p.instrument)
        .map((p) => loadInstrument(p.instrument as InstrumentName)),
    ).then(() => {
      clock.start();
    });
  }, [clock, status, loadInstrument, parts]);

  return parts.map((part, i) => (
    <ThreePart
      key={part.id}
      x={containerWidth / -2 + tileWidth * (i % columnCount) + tileWidth / 2}
      y={
        containerHeight / -2 +
        tileHeight * Math.floor(i / columnCount) +
        tileHeight / 2
      }
      width={tileWidth}
      height={tileHeight}
      notes={part.notes}
      playNote={playNote}
    />
  ));
}
