import React from "react";
import Staff from "./Staff.tsx";
import { RAD_OF_225_DEG } from "../../constants/canvas.ts";
import type { Note } from "../../types";
import ThreeNote from "./Note.tsx";
import to2Places from "../../utils/to2Places.ts";
import type { InstrumentName } from "soundfont-player";

interface PartProps {
  x: number;
  y: number;
  width: number;
  height: number;
  notesInPart: number[];
  notesToPlay: Note[];
  removeNote: (noteId: string) => void;
  playNote: (
    instrument: InstrumentName,
    pitch: number,
    duration: number,
  ) => void;
}

export default function Part({
  x,
  y,
  width,
  height,
  notesInPart,
  notesToPlay,
  removeNote,
  playNote,
}: PartProps) {
  const radGap = Math.PI / (3 * (notesInPart.length - 1));

  return (
    <React.Fragment>
      <Staff
        lineCount={notesInPart.length}
        middleX={x}
        middleY={y}
        width={width}
        height={height}
      />
      {notesToPlay.map((n) => {
        const staffLineIndex = notesInPart.indexOf(n.note);
        const leftOffset = Math.cos(RAD_OF_225_DEG + radGap * staffLineIndex);

        function afterPlay() {
          removeNote(n.id);
        }

        return (
          <ThreeNote
            key={n.id}
            note={n}
            path={[
              to2Places(x + (leftOffset * width) / 3),
              to2Places(y + height / 2),
              to2Places(x + (leftOffset * width * 7) / 8),
              to2Places(y + height / -2),
            ]}
            afterPlay={afterPlay}
            playNote={playNote}
          />
        );
      })}
    </React.Fragment>
  );
}
