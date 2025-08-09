import type { Part } from "../types";
import { Instruments } from "../constants/instruments.ts";
import { type ChangeEvent, useContext, useMemo } from "react";
import type { InstrumentName } from "soundfont-player";
import AppContext from "../context/AppContext.ts";
import { uniq } from "lodash";

interface PartEditorProps {
  part: Part;
}

export default function AllOfSomeNotesPartEditor({ part }: PartEditorProps) {
  const { setPart, allNotes } = useContext(AppContext);
  const uniquePitches = useMemo(
    () => uniq(allNotes.map((n) => n.name)),
    [allNotes],
  );
  const pitchesInPart = uniq(part.notes.map((n) => n.name));

  function onPartNameChanged(e: ChangeEvent<HTMLInputElement>) {
    setPart({
      ...part,
      name: e.target.value,
    });
  }

  function onPlayPartChanged() {
    setPart({
      ...part,
      play: !part.play,
    });
  }

  function onInstrumentChanged(e: ChangeEvent<HTMLSelectElement>) {
    setPart({
      ...part,
      instrument: e.target.item(e.target.selectedIndex)
        ?.value as InstrumentName,
    });
  }

  function onNoteSelectedChanged(e: ChangeEvent<HTMLInputElement>) {
    const pitch = e.target.name;
    if (!pitchesInPart.contains(pitch)) {
      setPart({
        ...part,
        notes: part.notes.concat(allNotes.filter((n) => n.name === pitch)),
      });
    } else {
      setPart({
        ...part,
        notes: part.notes.filter((n) => n.name !== pitch),
      });
    }
  }

  return (
    <div className="rounded border-2 border-gray-500 p-2 flex flex-row gap-4 items-center">
      <input
        className="text-xl font-bold w-36 text-center p-[2px] rounded hover:border-2 hover:border-gray-300 hover:p-0"
        onChange={onPartNameChanged}
        value={part.name}
      />
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label className="my-1">
            <input
              type="checkbox"
              checked={part.play}
              onChange={onPlayPartChanged}
              className="mr-2"
            />
            Play Part
          </label>
          {part.play && (
            <label>
              Instrument
              <select
                value={part.instrument}
                onChange={onInstrumentChanged}
                className="ml-2 border-2 border-gray-300 p-1 rounded"
              >
                {Object.entries(Instruments).map(
                  ([instrumentName, humanName]) => (
                    <option value={instrumentName} key={instrumentName}>
                      {humanName}
                    </option>
                  ),
                )}
              </select>
            </label>
          )}
        </div>
        <div>
          <label>Select Notes</label>
          <div className="flex flex-row flex-wrap gap-4">
            {uniquePitches.map((n) => (
              <label key={n}>
                <input
                  name={n}
                  type="checkbox"
                  checked={pitchesInPart.contains(n)}
                  onChange={onNoteSelectedChanged}
                  className="mr-2"
                />
                {n}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
