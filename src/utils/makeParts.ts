import { asserts, MusicXML } from "@stringsync/musicxml";
import {
  type CuedGraceNote,
  type CuedNote,
  MeasurePartwise,
  PartPartwise,
  Pitch,
  Rest,
  ScorePartwise,
  type TiedGraceNote,
  type TiedNote,
  Unpitched,
} from "@stringsync/musicxml/dist/generated/elements";
import { chunk, uniq } from "lodash";

export default function makeParts(
  xml: string,
  numberOfPlayers: number,
): string[] | undefined {
  const piece = MusicXML.parse(xml);
  const root = piece.getRoot();
  if (!asserts.isScorePartwise(root)) {
    return undefined;
  }

  const noteSemitones = root
    .getParts()
    .flatMap((part) => part.getMeasures())
    .flatMap((m) => m.contents)
    .filter((c) => asserts.isNote(c))
    .map((n) => getPitch(n.getVariation()))
    .filter((p) => p != null);
  const uniqueNotes = uniq(noteSemitones);

  // TODO: Partition based on note frequency too
  return chunk(uniqueNotes, uniqueNotes.length / numberOfPlayers)
    .map((slice) => filterScoreForNotes(root, slice))
    .map((score) => score.serialize());
}

function getPitch(
  note: TiedNote | CuedNote | TiedGraceNote | CuedGraceNote,
): number | null {
  let pitch: Pitch | Unpitched | Rest;
  if (asserts.isTiedNote(note)) {
    pitch = note[1];
  } else if (asserts.isCuedNote(note) || asserts.isTiedGraceNote(note)) {
    pitch = note[2];
  } else {
    pitch = note[3];
  }

  if (asserts.isUnpitched(pitch) || asserts.isRest(pitch)) {
    return null;
  }

  return pitchToSemitone(pitch);
}

function pitchToSemitone(pitch: Pitch): number {
  const modifier = pitch.getAlter()?.getSemitones() ?? 0;
  const scaleOffset = [
    "A",
    "",
    "B",
    "C",
    "",
    "D",
    "",
    "E",
    "F",
    "",
    "G",
  ].indexOf(pitch.getStep().getStep());
  const octaveOffset = pitch.getOctave().getOctave() * 12;

  return octaveOffset + scaleOffset + modifier;
}

function filterScoreForNotes(
  score: ScorePartwise,
  notes: number[],
): MusicXML<ScorePartwise> {
  const filteredScore = MusicXML.createPartwise();
  const parts = score.getParts().map(
    (part) =>
      new PartPartwise({
        contents: [
          part.getMeasures().map(
            (measure) =>
              new MeasurePartwise({
                contents: [
                  measure.getValues().filter((c) => {
                    if (!asserts.isNote(c)) {
                      return true;
                    }

                    const semitone = getPitch(c.getVariation());
                    return semitone == null || notes.contains(semitone);
                  }),
                ],
              }),
          ),
        ],
      }),
  );
  filteredScore.getRoot().setParts(parts);

  return filteredScore;
}
