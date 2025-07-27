import { useCallback, useEffect, useRef, useState } from "react";
import { instrument } from "soundfont-player";
import type { InstrumentName, Player } from "soundfont-player";

export type AudioStatus = "uninitialized" | "success" | "error";

interface AudioResult {
  loadInstrument: (instrument: InstrumentName) => Promise<void>;
  playNote: (
    instrument: InstrumentName,
    frequency: number,
    durationMs: number,
  ) => void;
  status: AudioStatus;
  error?: string;
}

export default function useAudioPlayer(): AudioResult {
  const [audioContext, setAudioContext] = useState<AudioContext | undefined>();
  const [status, setStatus] = useState<AudioStatus>("uninitialized");
  const [error, setError] = useState<string | undefined>();
  const instruments = useRef<Map<InstrumentName, Player>>(
    new Map<InstrumentName, Player>(),
  );

  const loadInstrument = useCallback(
    async (instrumentName: InstrumentName) => {
      if (!audioContext) {
        return;
      }

      const player = await instrument(audioContext, instrumentName);
      instruments.current.set(instrumentName, player);
    },
    [audioContext],
  );

  const playNote = useCallback(
    (instrument: InstrumentName, noteNumber: number, duration: number) => {
      if (!audioContext) {
        return;
      }

      const player = instruments.current.get(instrument);
      if (!player) {
        return;
      }

      player.play(noteNumber.toString(), audioContext.currentTime, {
        duration,
      });
    },
    [audioContext],
  );

  useEffect(() => {
    if (!window.AudioContext) {
      setError("No AudioContext");
      setStatus("error");
      return;
    }

    setAudioContext(new window.AudioContext());
    setStatus("success");
  }, []);

  return { loadInstrument, playNote, status, error };
}
