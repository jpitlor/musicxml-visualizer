import React from "react";
import {
  View,
  type ViewType,
} from "@jpitlor/musicxml-visualizer/constants/view";
import type { Note, Part } from "@jpitlor/musicxml-visualizer/types";

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
