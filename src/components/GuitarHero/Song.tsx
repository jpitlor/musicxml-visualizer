import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mesh } from "three";
import { v4 as uuidv4 } from "uuid";
import { useFrame, useThree } from "@react-three/fiber";
import uniqBy from "lodash.uniqby";
import { lerp } from "three/src/math/MathUtils";
import type { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import Staff from "./Staff.tsx";
import { HEIGHT, RAD_OF_225_DEG, WIDTH } from "../../constants/canvas.ts";
import useAudioPlayer from "../../hooks/useAudioPlayer.ts";

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
  const [pitches, setPitches] = useState<number[]>([]);
  const noteRefs = useRef<Map<string, Mesh>>(new Map());
  const [notes, setNotes] = useState<Note[]>([]);
  const { clock } = useThree();
  const radGap = Math.PI / (3 * (pitches.length - 1));
  const audioPlayer = useAudioPlayer(0.3);

  const setRef = useCallback(
    (mesh: Mesh) => {
      noteRefs.current.set((mesh.userData as Note).id, mesh);
      return () => noteRefs.current.delete((mesh.userData as Note).id);
    },
    [noteRefs],
  );

  useEffect(() => {
    osmd.cursor.reset();

    const newPitches: number[] = [];
    while (!osmd.cursor.iterator.EndReached) {
      const voices = osmd.cursor.iterator.CurrentVoiceEntries;
      for (let i = 0; i < voices.length; i++) {
        const notes = voices[i].Notes;
        for (let j = 0; j < notes.length; j++) {
          const note = notes[j];
          if (
            !note ||
            note.halfTone === 0 ||
            note.isRest() ||
            newPitches.contains(note.halfTone)
          ) {
            continue;
          }

          newPitches.push(note.halfTone);
        }
      }
      osmd.cursor.iterator.moveToNext();
    }

    newPitches.sort();
    setPitches(newPitches);
    osmd.cursor.reset();
    clock.start();
  }, [osmd, clock]);

  useEffect(() => {
    const newNotes: Note[] = [];
    const iterator = osmd.cursor.iterator;

    while (
      !iterator.EndReached && // there's more notes
      (newNotes.length === 0 ||
        notes.length === 0 ||
        newNotes.last().time - notes.last().time < 10) // and we haven't built a 10 second buffer
    ) {
      const voices = iterator.CurrentVoiceEntries;
      for (let i = 0; i < voices.length; i++) {
        const notes = voices[i].Notes;
        const beatsPerMinute = notes[0].SourceMeasure.TempoInBPM || 60;
        const secondsPerMeasure =
          (notes[0].SourceMeasure.ActiveTimeSignature.Numerator * 60) /
          beatsPerMinute;

        for (let j = 0; j < notes.length; j++) {
          const note = notes[j];
          if (!(note != null && note.halfTone != 0 && !note.isRest())) {
            continue;
          }

          newNotes.push({
            id: uuidv4(),
            note: note.halfTone,
            length: note.Length.RealValue * secondsPerMeasure,
            // The note should show up on screen when it should
            visibleTime:
              iterator.currentTimeStamp.RealValue * secondsPerMeasure,
            // But delay when it should actually play by one measure
            time: (iterator.currentTimeStamp.RealValue + 1) * secondsPerMeasure,
          });
        }
      }
      iterator.moveToNext();
    }

    if (newNotes.length > 0) {
      setNotes((x) => x.concat(newNotes));
    }
  }, [osmd, clock, notes]);

  useFrame(({ clock }) => {
    for (const circle of noteRefs.current.values()) {
      const note = circle.userData as Note;
      if (
        clock.elapsedTime >= note.visibleTime &&
        clock.elapsedTime < note.time
      ) {
        const notePath = pitches.indexOf(note.note);
        const a =
          (clock.elapsedTime - note.visibleTime) /
          (note.time - note.visibleTime);
        circle.position.x = lerp(
          0,
          Math.cos(RAD_OF_225_DEG + radGap * notePath) * WIDTH,
          a,
        );
        circle.position.y = lerp(HEIGHT * 2, HEIGHT * -1, a);
      }

      if (note.time - clock.elapsedTime < 0.1) {
        const frequency = Math.pow(2, (note.note - 48) / 12.0) * 440;
        audioPlayer.playNote(frequency, note.length * 1000);
        setNotes((n) => {
          const i = n.findIndex((x) => x.id === note.id);
          const newNotes = [...notes];
          newNotes.splice(i, 1);
          return newNotes;
        });
      }
    }
  });

  return (
    <React.Fragment>
      <Staff lineCount={pitches.length} />
      {notes.map((n) => (
        <mesh
          ref={setRef}
          position={[0, HEIGHT * 2, 0]}
          userData={n}
          key={n.id}
        >
          <meshStandardMaterial color="blue" />
          <circleGeometry args={[0.5]} />
        </mesh>
      ))}
    </React.Fragment>
  );
}
