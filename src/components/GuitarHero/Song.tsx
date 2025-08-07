import { useContext, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import useAudioPlayer from "../../hooks/useAudioPlayer.ts";
import type { Part } from "../../types";
import { useUniquePitches } from "../../hooks/useUniquePitches.ts";
import useRollingNoteRange from "../../hooks/useRollingNoteRange.ts";
import SongContext from "../../context/SongContext.ts";
import ThreePart from "./Part.tsx";

interface SongProps {
  osmd: OpenSheetMusicDisplay;
  parts?: Part[];
}

export default function Song({ osmd, parts: _parts }: SongProps) {
  const { containerWidth, containerHeight } = useContext(SongContext);
  const pitches = useUniquePitches(osmd);
  const parts =
    _parts ??
    ([
      {
        display: true,
        notes: pitches,
      },
    ] as Part[]);
  const { notes, removeNote } = useRollingNoteRange(osmd, !!pitches);
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

    loadInstrument("acoustic_grand_piano").then(() => {
      clock.start();
    });
  }, [osmd, clock, status, loadInstrument]);

  if (!pitches) {
    return null;
  }

  return parts.map((part, i) => (
    <ThreePart
      key={part.notes.join(",")}
      x={containerWidth / -2 + tileWidth * (i % columnCount) + tileWidth / 2}
      y={
        containerHeight / -2 +
        tileHeight * Math.floor(i / columnCount) +
        tileHeight / 2
      }
      width={tileWidth}
      height={tileHeight}
      notesToPlay={notes.filter((n) => part.notes.contains(n.note))}
      notesInPart={part.notes}
      removeNote={removeNote}
      playNote={playNote}
    />
  ));
}
