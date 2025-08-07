import MusicXml from "./components/MusicXml.tsx";
import { View, type ViewType } from "./constants/view.ts";
import { useState } from "react";
import type { Part } from "./types";
import AppContext from "./context/AppContext.ts";
import PiecePicker from "./demoComponents/PiecePicker.tsx";

function App() {
  const [xml, setXml] = useState<string | undefined>();
  const [type, setType] = useState<ViewType>(View.GuitarHero);
  const [playerCount, setPlayerCount] = useState(1);
  const [parts, setParts] = useState([] as Part[]);

  return (
    <AppContext
      value={{
        xml,
        type,
        playerCount,
        parts,
        setXml,
        setType,
        setPlayerCount,
        setParts,
      }}
    >
      <div className="bg-gray-100 p-4 w-screen h-screen">
        <PiecePicker />
        <PartPicker />
        <div className="bg-white mt-4 p-4 rounded shadow">
          {parts.length > 0 && !!xml ? (
            <MusicXml parts={parts} xml={xml} view={type} />
          ) : (
            "Select a file to display the sheet music"
          )}
        </div>
      </div>
    </AppContext>
  );
}

export default App;
