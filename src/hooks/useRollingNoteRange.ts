import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import type { Note } from "../types";

interface RollingNoteRange {
  notes: Note[];
  removeNote: (noteId: string) => void;
}

export default function useRollingNoteRange(
  osmd: OpenSheetMusicDisplay,
  doIfTrue: boolean,
): RollingNoteRange {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!doIfTrue) {
      return;
    }

    const _notes: Note[] = [];
    const iterator = osmd.cursor.iterator;

    while (
      !iterator.EndReached && // there's more notes
      (_notes.length === 0 ||
        notes.length === 0 ||
        _notes.last().time - notes.last().time < 10) // and we haven't built a 10-second buffer
    ) {
      const voices = iterator.CurrentVoiceEntries;
      for (let i = 0; i < voices.length; i++) {
        const notes = voices[i].Notes;
        const beatsPerMinute =
          notes[0].SourceMeasure.TempoInBPM ||
          osmd.Sheet.getExpressionsStartTempoInBPM() ||
          60;
        const secondsPerMeasure =
          (notes[0].SourceMeasure.ActiveTimeSignature.Numerator * 60) /
          beatsPerMinute;

        for (let j = 0; j < notes.length; j++) {
          const note = notes[j];
          if (!(note != null && note.halfTone != 0 && !note.isRest())) {
            continue;
          }

          _notes.push({
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

    if (_notes.length > 0) {
      setNotes((x) => x.concat(_notes));
    }
  }, [osmd, notes, doIfTrue]);

  function removeNote(noteId: string) {
    setNotes((n) => {
      const i = n.findIndex((x) => x.id === noteId);
      const _notes = [...notes];
      _notes.splice(i, 1);
      return _notes;
    });
  }

  return { notes, removeNote };
}
