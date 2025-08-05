import { useEffect, useState } from "react";
import type { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

export function useUniquePitches(osmd: OpenSheetMusicDisplay) {
  const [pitches, setPitches] = useState<number[] | undefined>();

  useEffect(() => {
    osmd.cursor.reset();

    const _pitches: number[] = [];
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
            _pitches.contains(note.halfTone)
          ) {
            continue;
          }

          _pitches.push(note.halfTone);
        }
      }
      osmd.cursor.iterator.moveToNext();
    }

    osmd.cursor.reset();
    _pitches.sort();
    setPitches(_pitches);
  }, [osmd.cursor]);

  return pitches;
}
