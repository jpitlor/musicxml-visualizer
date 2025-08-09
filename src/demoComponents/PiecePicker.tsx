import { type ChangeEvent, useContext } from "react";
import { View, type ViewType } from "../constants/view.ts";
import AppContext from "../context/AppContext.ts";

export default function PiecePicker() {
  const { setXml, type, setType, playerCount, setPlayerCount } =
    useContext(AppContext);

  function onXmlChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.item(0);
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      if (!evt.target?.result) {
        return;
      }

      if (typeof evt.target.result === "string") {
        setXml(evt.target.result);
      } else {
        const decoder = new TextDecoder("utf-8");
        setXml(decoder.decode(evt.target.result));
      }
    };
  }

  function onTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    const i = e.target.selectedIndex;
    const item = e.target.options.item(i);
    if (!item) {
      return;
    }

    setType(item.value as ViewType);
  }

  function onPlayerCountChange(e: ChangeEvent<HTMLInputElement>) {
    setPlayerCount(+e.target.value);
  }

  return (
    <form className="bg-white p-4 rounded shadow">
      <div className="flex flex-row items-center">
        <label htmlFor="file">
          <strong>MusicXML File</strong>
        </label>
        <input
          id="file"
          type="file"
          name="file"
          onChange={onXmlChange}
          multiple={false}
          accept="application/vnd.recordare.musicxml+xml"
          className="border-2 border-black px-2 py-1 rounded shadow ml-4 cursor-pointer"
        />
      </div>
      <div className="flex flex-row items-center mt-2">
        <label htmlFor="type">
          <strong>Display Type</strong>
        </label>
        <select
          name="type"
          id="type"
          onChange={onTypeChange}
          className="ml-4 border-2 border-black py-1 px-2 rounded shadow"
          value={type}
        >
          <option value={View.SheetMusic}>Sheet Music</option>
          <option value={View.GuitarHero}>Guitar Hero</option>
        </select>
      </div>
      <div className="flex flex-row items-center mt-2">
        <label htmlFor="playerCount">
          <strong>Number of Players</strong>
        </label>
        <input
          name="playerCount"
          id="playerCount"
          type="number"
          min="0"
          max="9"
          step="1"
          onChange={onPlayerCountChange}
          className="ml-4 border-2 border-black py-1 px-2 rounded shadow"
          value={playerCount}
        />
      </div>
    </form>
  );
}
