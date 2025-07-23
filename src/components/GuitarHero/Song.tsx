import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mesh } from "three";
import { v4 as uuidv4 } from "uuid";
import { useFrame, useThree } from "@react-three/fiber";
import uniqBy from "lodash.uniqby";
import { lerp } from "three/src/math/MathUtils";
import type { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import Staff from "./Staff.tsx";
import { HEIGHT, RAD_OF_225_DEG, WIDTH } from "../../constants/canvas.ts";

interface Note {
  id: string;
  note: number;
  time: number;
  length: number;
  visibleTime: number;
}

interface SongProps {
  osmd: OpenSheetMusicDisplay;
}

export default function Song({ osmd }: SongProps) {
  const noteRefs = useRef<Map<string, Mesh>>(new Map());
  const [notes, setNotes] = useState<Note[]>([]);
  const { clock } = useThree();
  const notePaths = uniqBy(notes, "note").map((n) => n.note);
  const radGap = Math.PI / (3 * (notePaths.length - 1));

  const setRef = useCallback(
    (mesh: Mesh) => {
      noteRefs.current.set((mesh.userData as Note).id, mesh);
      return () => noteRefs.current.delete(mesh.name);
    },
    [noteRefs],
  );

  useEffect(() => {
    const allNotes = [];
    osmd.cursor.reset();
    const iterator = osmd.cursor.iterator;

    while (!iterator.EndReached) {
      const voices = iterator.CurrentVoiceEntries;
      for (let i = 0; i < voices.length; i++) {
        const v = voices[i];
        const notes = v.Notes;
        const bpm = notes[0].SourceMeasure.TempoInBPM;
        for (let j = 0; j < notes.length; j++) {
          const note = notes[j];
          if (note != null && note.halfTone != 0 && !note.isRest()) {
            allNotes.push({
              id: uuidv4(),
              note: note.halfTone,
              length: (note.Length.RealValue * 4 * 60) / bpm,
              time: (iterator.currentTimeStamp.RealValue * 4 * 60) / bpm,
              visibleTime:
                ((iterator.currentTimeStamp.RealValue - 4) * 4 * 60) / bpm,
            });
          }
        }
      }
      iterator.moveToNext();
    }

    setNotes(allNotes);
    clock.start();
  }, [osmd, clock]);

  useFrame(({ clock }) => {
    for (const circle of noteRefs.current.values()) {
      const note = circle.userData as Note;
      if (
        clock.elapsedTime >= note.visibleTime &&
        clock.elapsedTime < note.time
      ) {
        const notePath = notePaths.indexOf(note.note);
        const a =
          (clock.elapsedTime - note.visibleTime) /
          (note.time - note.visibleTime);
        circle.position.x = lerp(
          0,
          Math.cos(RAD_OF_225_DEG + radGap * notePath) * ((WIDTH * 2) / 3),
          a,
        );
        circle.position.y = lerp(HEIGHT * 2, HEIGHT * -1, a);
      }
    }
  });

  return (
    <React.Fragment>
      <Staff lineCount={notePaths.length} />
      {notes.map((n) => (
        <mesh
          ref={setRef}
          position={[0, HEIGHT * 2, 0]}
          userData={n}
          key={n.id}
        >
          <circleGeometry />
        </mesh>
      ))}
    </React.Fragment>
  );
}
