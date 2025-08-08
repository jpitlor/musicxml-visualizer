import type { Part } from "../types";
import { Instruments } from "../constants/instruments.ts";
import { type ChangeEvent, useContext } from "react";
import AppContext from "../context/AppContext.ts";
import type { InstrumentName } from "soundfont-player";

interface FromScorePartEditorProps {
  part: Part;
}

export default function FromScorePartEditor({
  part,
}: FromScorePartEditorProps) {
  const { setPart } = useContext(AppContext);

  function onShowPartChanged() {
    setPart({
      ...part,
      display: !part.display,
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

  return (
    <div className="rounded border-2 border-gray-500 p-2 flex flex-row gap-4 items-center">
      <span className="text-xl font-bold w-36 text-center">{part.name}</span>
      <div className="flex flex-col gap-4">
        <label>
          <input
            type="checkbox"
            checked={part.display}
            onChange={onShowPartChanged}
            className="mr-2"
          />
          Show Part
        </label>
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
          <label className={part.play ? "" : "invisible"}>
            Instrument
            <select
              value={part.instrument}
              onChange={onInstrumentChanged}
              className="ml-2 border-2 border-gray-300 p-1 rounded"
            >
              <option value="">Select an Instrument</option>
              {Object.entries(Instruments).map(
                ([instrumentName, humanName]) => (
                  <option value={instrumentName} key={instrumentName}>
                    {humanName}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
