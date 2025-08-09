import { v4 as uuidv4 } from "uuid";
import type { Part } from "../types";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { HiddenDivId } from "../constants/osmd.ts";
import { useEffect, useState } from "react";

export default function useScoreParts(xml: string): Part[] {
  const [osmd, setOsmd] = useState<OpenSheetMusicDisplay | undefined>();
  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {
    if (!xml) {
      return;
    }

    const osmd = new OpenSheetMusicDisplay(HiddenDivId);
    osmd.load(xml).then(() => setOsmd(osmd));
  }, [xml]);

  useEffect(() => {
    if (!osmd) {
      return;
    }

    const _parts = osmd.Sheet.Parts.map(
      (p) =>
        ({
          id: uuidv4(),
          name: p.Name,
          notes: [],
          display: false,
          play: false,
          source: "fromScore",
          instrument: "acoustic_grand_piano",
        }) as Part,
    );
    osmd.cursor.reset();
    const iterator = osmd.cursor.iterator;
    while (!iterator.EndReached) {
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

          const part = _parts.find(
            (p) => p.name === voices[i].ParentVoice.Parent.Name,
          );
          if (!part) {
            continue;
          }

          part.notes.push({
            id: uuidv4(),
            name: note.Pitch.ToStringShort(),
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

    setParts(_parts);
  }, [osmd]);

  return parts;
}
