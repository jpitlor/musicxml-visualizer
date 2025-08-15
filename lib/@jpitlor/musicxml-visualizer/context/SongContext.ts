import React from "react";
import { Tempo } from "../types";

interface SongContextType {
  containerWidth: number;
  containerHeight: number;
  tempos: Tempo[];
}

const SongContext = React.createContext<SongContextType>({
  containerWidth: 0,
  containerHeight: 0,
  tempos: [],
});

export default SongContext;
