import MusicXml from "./components/MusicXml.tsx";
import { View, type ViewType } from "./constants/view.ts";
import { useCallback, useEffect, useState } from "react";
import { range, uniq } from "lodash";
import { v4 as uuidv4 } from "uuid";
import type { Note, Part } from "./types";
import AppContext from "./context/AppContext.ts";
import PiecePicker from "./demoComponents/PiecePicker.tsx";
import PartPicker from "./demoComponents/PartPicker.tsx";
import BackgroundTrackToggler from "./demoComponents/BackgroundTrackToggler.tsx";
import { HiddenDivId } from "./constants/osmd.ts";
import useScoreParts from "./hooks/useScoreParts.ts";

function App() {
  const [xml, setXml] = useState("");
  const [allNotes, setAllNotes] = useState([] as Note[]);
  const scoreParts = useScoreParts(xml);
  const [type, setType] = useState<ViewType>(View.GuitarHero);
  const [playerCount, _setPlayerCount] = useState(1);
  const [parts, setParts] = useState([] as Part[]);
  const resetParts = useCallback(
    (newScoreParts: Part[], newPlayerCount: number) => {
      setAllNotes(uniq(newScoreParts.flatMap((p) => p.notes)));
      setParts([
        ...newScoreParts,
        ...range(newPlayerCount).map(
          (i) =>
            ({
              id: uuidv4(),
              play: false,
              display: true,
              source: "allOfSomeNotes",
              name: `Part ${i}`,
              notes: [],
            }) as Part,
        ),
      ]);
    },
    [],
  );

  useEffect(() => {
    resetParts(scoreParts, playerCount);
  }, [resetParts, playerCount, scoreParts]);

  function setPart(part: Part) {
    const i = parts.findIndex((p) => p.id === part.id);
    if (i === -1) {
      console.warn("Tried to set nonexistent part " + part.id);
      return;
    }

    setParts((p) => {
      const _parts = [...p];
      _parts.splice(i, 1, part);
      return _parts;
    });
  }

  function setPlayerCount(newPlayerCount: number) {
    _setPlayerCount(newPlayerCount);
    resetParts(scoreParts, newPlayerCount);
  }

  return (
    <AppContext
      value={{
        allNotes,
        type,
        playerCount,
        parts,
        setXml,
        setType,
        setPlayerCount,
        setPart,
      }}
    >
      <div className="bg-gray-100 p-4 w-screen h-screen">
        <div id={HiddenDivId} className="hidden" />
        <PiecePicker />
        {type === "GuitarHero" && xml && <BackgroundTrackToggler />}
        {type === "GuitarHero" && xml && <PartPicker />}
        {/*{((type === View.GuitarHero && parts.length > playerCount) ||*/}
        {/*  (type == View.SheetMusic && !!xml)) && (*/}
        {/*  <div className="bg-white mt-4 p-4 rounded shadow">*/}
        {/*    <MusicXml parts={parts} xml={xml} view={type} />*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </AppContext>
  );
}

export default App;
