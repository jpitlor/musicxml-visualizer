import { useMemo } from "react";
import type { Part } from "../types";
import makeParts from "../utils/makeParts.ts";

const parts = useMemo(() => {
  if (!xml) {
    return [] as Part[];
  }

  const _parts = makeParts(xml, playerCount);
  if (!_parts) {
    return [] as Part[];
  }

  return _parts.map(
    (part) =>
      ({
        display: true,
        // instrument: "acoustic_grand_piano",
        notes: part,
      }) as Part,
  );
}, [xml, playerCount]);

export default function PartPicker() {}
