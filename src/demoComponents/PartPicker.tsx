import { useContext } from "react";
import AppContext from "../context/AppContext.ts";
import AllOfSomeNotesPartEditor from "./AllOfSomeNotesPartEditor.tsx";

export default function PartPicker() {
  const { parts } = useContext(AppContext);

  if (parts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white mt-4 p-4 rounded shadow flex flex-col gap-4">
      Please pick parts for people to play
      {parts
        .filter((p) => p.source === "allOfSomeNotes")
        .map((part) => (
          <AllOfSomeNotesPartEditor part={part} key={part.id} />
        ))}
    </div>
  );
}
