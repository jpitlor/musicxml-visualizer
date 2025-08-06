import React, { useContext, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import Staff from "./Staff.tsx";
import useAudioPlayer from "../../hooks/useAudioPlayer.ts";
import type { Part } from "../../types";
import { useUniquePitches } from "../../hooks/useUniquePitches.ts";
import useRollingNoteRange from "../../hooks/useRollingNoteRange.ts";
import Note from "./Note.tsx";
import SongContext from "../../context/SongContext.ts";
import { RAD_OF_225_DEG } from "../../constants/canvas.ts";
import to2Places from "../../utils/to2Places.ts";

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

  return parts.map((part, i) => {
    const middleX =
      containerWidth / -2 + tileWidth * (i % columnCount) + tileWidth / 2;
    const middleY =
      containerHeight / -2 +
      tileHeight * Math.floor(i / columnCount) +
      tileHeight / 2;
    console.log("Rendering part notes " + part.notes.join(", "));
    console.log("All notes: " + notes.map((n) => n.note).join(", "));
    console.log(
      "Filtered notes: " +
        notes
          .filter((n) => part.notes.contains(n.note))
          .map((n) => n.note)
          .join(", "),
    );
    return (
      <React.Fragment key={`[${part.notes.join(",")}]`}>
        <Staff
          lineCount={part.notes.length}
          middleY={middleY}
          middleX={middleX}
          width={tileWidth}
          height={tileHeight}
        />
        {notes
          .filter((n) => part.notes.contains(n.note))
          .map((n) => {
            const radGap = Math.PI / (3 * (part.notes.length - 1));
            const staffLineIndex = part.notes.indexOf(n.note);
            const leftOffset = Math.cos(
              RAD_OF_225_DEG + radGap * staffLineIndex,
            );

            function afterPlay() {
              console.log("Removing note " + staffLineIndex);
              removeNote(n.id);
            }

            return (
              <Note
                key={`[${part.notes.join(",")}]-${n.id}`}
                note={n}
                path={[
                  to2Places(middleX + (leftOffset * tileWidth) / 3),
                  to2Places(middleY + tileHeight / 2),
                  to2Places(middleX + (leftOffset * tileWidth * 7) / 8),
                  to2Places(middleY + tileHeight / -2),
                ]}
                afterPlay={afterPlay}
                playNote={playNote}
              />
            );
          })}
      </React.Fragment>
    );
  });
}
