import type { InstrumentName } from "soundfont-player";

export interface Tempo {
  time: number;
  secondsPerBeat: number;
}

export interface Part {
  id: string;
  name: string;
  source: "allOfSomeNotes" | "fromScore";
  display: boolean;
  play: boolean;
  instrument: InstrumentName;
  notes: Note[];
}

export interface Note {
  id: string;
  name: string;
  note: number;
  time: number;
  length: number;
  visibleTime: number;
}
