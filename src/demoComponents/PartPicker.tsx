import { useContext, useState } from "react";
import AppContext from "../context/AppContext.ts";
import AllOfSomeNotesPartEditor from "./AllOfSomeNotesPartEditor.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

export default function PartPicker() {
  const { parts, addPart, removePart } = useContext(AppContext);
  const [selected, setSelected] = useState<string[]>([]);

  function removeParts() {
    for (const partId of selected) {
      removePart(partId);
    }
    setSelected([]);
  }

  function toggleSelection(partId: string) {
    const i = selected.indexOf(partId);
    if (i === -1) {
      setSelected((_selected) => _selected.concat(partId));
    } else {
      setSelected((_selected) => {
        const s = [..._selected];
        s.splice(i, 1);
        return s;
      });
    }
  }

  if (parts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white mt-4 p-4 rounded shadow flex flex-col gap-4">
      <p>Please pick parts for people to play</p>
      <div className="flex gap-4">
        <button onClick={addPart}>
          <FontAwesomeIcon icon={faPlus} className="cursor-pointer" />
        </button>
        <button onClick={removeParts}>
          <FontAwesomeIcon
            icon={faMinus}
            className={
              selected.length > 0
                ? "cursor-pointer"
                : "cursor-not-allowed text-gray-400"
            }
          />
        </button>
      </div>
      {parts
        .filter((p) => p.source === "allOfSomeNotes")
        .map((part) => (
          <div
            className={classNames(
              {
                "border-sky-500": selected.contains(part.id),
                "border-white hover:border-sky-300": !selected.contains(
                  part.id,
                ),
              },
              "border-2 p-2 rounded cursor-pointer",
            )}
            onClick={() => toggleSelection(part.id)}
          >
            <AllOfSomeNotesPartEditor part={part} key={part.id} />
          </div>
        ))}
    </div>
  );
}
