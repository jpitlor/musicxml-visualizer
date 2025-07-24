import { useCallback, useEffect, useState } from "react";

export type AudioStatus = "uninitialized" | "success" | "error";

interface AudioResult {
  status: AudioStatus;
  playNote: (frequency: number, durationMs: number) => void;
  error?: string;
}

export default function useAudioPlayer(gain: number): AudioResult {
  const [status, setStatus] = useState<AudioStatus>("uninitialized");
  const [error, setError] = useState<string | undefined>();
  const [audioContext, setAudioContext] = useState<AudioContext | undefined>();
  const [gainNode, setGainNode] = useState<GainNode | undefined>();
  const makeOscillator = useCallback(
    (frequency: number) => {
      if (!audioContext || !gainNode) {
        return undefined;
      }

      const oscillator = audioContext.createOscillator();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      return oscillator;
    },
    [audioContext, gainNode],
  );

  useEffect(() => {
    if (status !== "uninitialized") {
      return;
    }

    if (!window.AudioContext) {
      setError("No AudioContext");
      setStatus("error");
      return;
    }

    const _audioContext = new window.AudioContext();
    const _gainNode = _audioContext.createGain();
    _gainNode.connect(_audioContext.destination);

    setAudioContext(_audioContext);
    setGainNode(_gainNode);
    setStatus("success");
  }, [status]);

  useEffect(() => {
    if (!gainNode) {
      return;
    }

    gainNode.gain.value = gain;
  }, [gain, gainNode]);

  function playNote(frequency: number, durationMs: number) {
    const oscillator = makeOscillator(frequency);
    if (!oscillator) {
      return;
    }

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, durationMs);
  }

  return { status, error, playNote };
}
