import { useContext } from "react";
import AppContext from "../context/AppContext.ts";
import FromScorePartEditor from "./FromScorePartEditor.tsx";

export default function BackgroundTrackToggler() {
  const { parts } = useContext(AppContext);

  if (parts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white mt-4 p-4 rounded shadow">
      <p>
        Please check the parts in this score that you want to play in the
        background, and select an instrument for them.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {parts
          .filter((p) => p.source === "fromScore")
          .map((part) => (
            <FromScorePartEditor part={part} key={part.id} />
          ))}
      </div>
    </div>
  );
}
