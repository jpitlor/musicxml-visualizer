import React from "react";
import { View, type ViewType } from "../constants/view.ts";
import type { Part } from "../types";

interface AppContextType {
  xml: string | undefined;
  setXml: (xml: string) => void;
  type: ViewType;
  setType: (type: ViewType) => void;
  playerCount: number;
  setPlayerCount: (playerCount: number) => void;
  parts: Part[];
  setParts: (parts: Part[]) => void;
}

const AppContext = React.createContext<AppContextType>({
  xml: "",
  setXml: () => {},
  type: View.GuitarHero,
  setType: () => {},
  playerCount: 1,
  setPlayerCount: () => {},
  parts: [],
  setParts: () => {},
});

export default AppContext;
