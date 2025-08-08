import React from "react";
import { View, type ViewType } from "../constants/view.ts";
import type { Note, Part } from "../types";

interface AppContextType {
  allNotes: Note[];
  setXml: (xml: string) => void;
  type: ViewType;
  setType: (type: ViewType) => void;
  playerCount: number;
  setPlayerCount: (playerCount: number) => void;
  parts: Part[];
  setPart: (part: Part) => void;
}

const AppContext = React.createContext<AppContextType>({
  allNotes: [],
  setXml: () => {},
  type: View.GuitarHero,
  setType: () => {},
  playerCount: 1,
  setPlayerCount: () => {},
  parts: [],
  setPart: () => {},
});

export default AppContext;
