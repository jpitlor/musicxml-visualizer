import type { Mesh } from "three";
import { useContext, useRef } from "react";
import { useFrame } from "@react-three/fiber";
// @ts-expect-error Not sure why TS doesn't like this
import { lerp } from "three/src/math/MathUtils";
import type { InstrumentName } from "soundfont-player";
import type { Note } from "../../types";
import SongContext from "../../context/SongContext.ts";

interface NoteProps {
  note: Note;
  instrument: InstrumentName;
  playNote?: (
    instrument: InstrumentName,
    pitch: number,
    duration: number,
  ) => void;
  removeNote: (noteId: string) => void;
  path: [number, number, number, number];
}

export default function Note({
  note,
  instrument,
  playNote,
  path,
  removeNote,
}: NoteProps) {
  const { containerHeight, containerWidth } = useContext(SongContext);
  const circle = useRef<Mesh | undefined>(undefined);
  const [startX, startY, endX, endY] = path;

  useFrame(({ clock }) => {
    if (
      circle.current &&
      clock.elapsedTime >= note.visibleTime &&
      clock.elapsedTime < note.time
    ) {
      const a =
        (clock.elapsedTime - note.visibleTime) / (note.time - note.visibleTime);
      // noinspection JSSuspiciousNameCombination
      circle.current.position.x = lerp(startX, endX, a);
      // noinspection JSSuspiciousNameCombination
      circle.current.position.y = lerp(startY, endY, a);
    }

    if (note.time - clock.elapsedTime < 0.1) {
      playNote?.(instrument, note.note, note.length);
      removeNote(note.id);
    }
  });

  return (
    <mesh ref={circle} position={[0, containerHeight, 0]} userData={note}>
      <meshStandardMaterial color="blue" />
      <circleGeometry args={[containerWidth / 50]} />
    </mesh>
  );
}
