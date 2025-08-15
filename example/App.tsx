import MusicXml from "@jpitlor/musicxml-visualizer/components/MusicXml";
import type { Note, Part } from "@jpitlor/musicxml-visualizer/types";
import { useEffect, useState } from "react";
import { uniq } from "lodash";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import {
  View,
  type ViewType,
} from "../lib/@jpitlor/musicxml-visualizer/constants/view";
import AppContext from "./context/AppContext";
import PiecePicker from "./components/PiecePicker";
import PartPicker from "./components/PartPicker";
import BackgroundTrackToggler from "./components/BackgroundTrackToggler";
import { HiddenDivId } from "./constants/osmd";
import useScore from "./hooks/useScore";

function App() {
  const [play, setPlay] = useState(false);
  const [xml, setXml] = useState("");
  const [allNotes, setAllNotes] = useState([] as Note[]);
  const { parts: scoreParts, tempos } = useScore(xml);
  const [type, setType] = useState<ViewType>(View.GuitarHero);
  const [parts, setParts] = useState([] as Part[]);

  useEffect(() => {
    setAllNotes(uniq(scoreParts.flatMap((p) => p.notes)));
    setParts([...scoreParts]);
  }, [scoreParts]);

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

  function addPart() {
    setParts((_parts) =>
      _parts.concat({
        id: uuidv4(),
        play: false,
        display: true,
        source: "allOfSomeNotes",
        notes: [],
        instrument: "acoustic_grand_piano",
        name: "New Part",
      } as Part),
    );
  }

  function removePart(partId: string) {
    const i = parts.findIndex((p) => p.id === partId);
    if (i === -1) {
      console.warn("Tried to set nonexistent part " + partId);
      return;
    }

    setParts((p) => {
      const _parts = [...p];
      _parts.splice(i, 1);
      return _parts;
    });
  }

  return (
    <AppContext
      value={{
        allNotes,
        type,
        parts,
        setXml,
        setType,
        setPart,
        addPart,
        removePart,
      }}
    >
      <div className="bg-gray-100 p-4 w-screen h-screen">
        <div id={HiddenDivId} className="hidden" />
        {!play && (
          <React.Fragment>
            <PiecePicker />
            {type === "GuitarHero" && xml && <BackgroundTrackToggler />}
            {type === "GuitarHero" && xml && <PartPicker />}
            <button
              className="cursor-pointer mt-4 py-1 px-2 bg-blue-500 shadow rounded text-white"
              onClick={() => setPlay(true)}
            >
              Play
            </button>
          </React.Fragment>
        )}
        {play && (
          <div className="bg-white p-4 rounded shadow h-full">
            <MusicXml parts={parts} xml={xml} view={type} tempos={tempos} />
          </div>
        )}
      </div>
    </AppContext>
  );
}

export default App;
