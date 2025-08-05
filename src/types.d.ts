import type { InstrumentName } from "soundfont-player";

export interface Part {
  display: boolean;
  instrument?: InstrumentName;
  notes: number[];
}

export interface Note {
  id: string;
  note: number;
  time: number;
  length: number;
  visibleTime: number;
}
