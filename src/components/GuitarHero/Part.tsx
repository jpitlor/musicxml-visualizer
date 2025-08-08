import React from "react";
import Staff from "./Staff.tsx";
import { RAD_OF_225_DEG } from "../../constants/canvas.ts";
import type { Note } from "../../types";
import ThreeNote from "./Note.tsx";
import to2Places from "../../utils/to2Places.ts";
import type { InstrumentName } from "soundfont-player";
import { uniq } from "lodash";

interface PartProps {
  x: number;
  y: number;
  width: number;
  height: number;
  notes: Note[];
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
  notes,
  playNote,
}: PartProps) {
  const uniqueNotes = uniq(notes.map((n) => n.note));
  const radGap = Math.PI / (3 * (uniqueNotes.length - 1));

  return (
    <React.Fragment>
      <Staff
        lineCount={uniqueNotes.length}
        middleX={x}
        middleY={y}
        width={width}
        height={height}
      />
      {notes.map((n) => {
        const staffLineIndex = uniqueNotes.indexOf(n.note);
        const leftOffset = Math.cos(RAD_OF_225_DEG + radGap * staffLineIndex);

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
            playNote={playNote}
          />
        );
      })}
    </React.Fragment>
  );
}
