import React from "react";

interface SongContextType {
  containerWidth: number;
  containerHeight: number;
}

const SongContext = React.createContext<SongContextType>({
  containerWidth: 0,
  containerHeight: 0,
});

export default SongContext;
