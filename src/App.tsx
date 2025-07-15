import MusicXml from "./components/MusicXml.tsx";
import { View, type ViewType } from "./constants/view.ts";
import { type ChangeEvent, useState } from "react";

function App() {
  const [xml, setXml] = useState("");
  const [type, setType] = useState<ViewType>(View.GuitarHero);

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
        const result = decoder.decode(evt.target.result);
        setXml(result);
      }
    };
  }

  function onTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    const i = e.target.selectedIndex;
    const item = e.target.options.item(i);
    if (!item) {
      return;
    }

    setType(item.value);
  }

  return (
    <div className="bg-gray-100 p-4 w-screen h-screen">
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
      </form>
      <div className="bg-white mt-4 p-4 rounded shadow">
        {/*{xml ? (*/}
        <MusicXml xml={xml} view={type} />
        {/*) : (*/}
        {/*  "Select a file to display the sheet music"*/}
        {/*)}*/}
      </div>
    </div>
  );
}

export default App;
