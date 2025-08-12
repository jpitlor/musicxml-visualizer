import classNames from "classnames";
import SheetMusic from "./SheetMusic";
import GuitarHero from "./GuitarHero";
import type { Part } from "../types";

interface SheetMusicMusicXmlProps {
  xml: string;
  view: "SheetMusic";
  className?: string;
}

interface GuitarHeroMusicXmlProps {
  view: "GuitarHero";
  className?: string;
  parts: Part[];
}

type MusicXmlProps = SheetMusicMusicXmlProps | GuitarHeroMusicXmlProps;

export default function MusicXml(props: MusicXmlProps) {
  const { view, className } = props;

  if (view === "SheetMusic") {
    const { xml } = props;
    return <SheetMusic xml={xml} className={className} />;
  }

  if (view === "GuitarHero") {
    const { parts } = props;
    return <GuitarHero className={className} parts={parts} />;
  }

  return (
    <div
      className={classNames(
        "text-red-500",
        "display-flex",
        "items-center",
        "content-center",
        className,
      )}
    >
      Unsupported View Type "{view}"
    </div>
  );
}
