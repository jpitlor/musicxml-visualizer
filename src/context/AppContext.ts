import React from "react";
import { View, type ViewType } from "../constants/view.ts";
import type { Note, Part } from "../types";

interface AppContextType {
  allNotes: Note[];
  setXml: (xml: string) => void;
  type: ViewType;
  setType: (type: ViewType) => void;
  parts: Part[];
  setPart: (part: Part) => void;
  addPart: () => void;
  removePart: (partId: string) => void;
}

const AppContext = React.createContext<AppContextType>({
  allNotes: [],
  setXml: () => {},
  type: View.GuitarHero,
  setType: () => {},
  parts: [],
  setPart: () => {},
  addPart: () => {},
  removePart: () => {},
});

export default AppContext;
