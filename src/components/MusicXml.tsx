import { View, type ViewType } from "../constants/view";
import classNames from "classnames";
import SheetMusic from "./SheetMusic";
import GuitarHero from "./GuitarHero";

interface MusicXmlProps {
  xml: string;
  view: ViewType;
  className?: string;
}

export default function MusicXml({ xml, view, className }: MusicXmlProps) {
  if (view === View.SheetMusic) {
    return <SheetMusic xml={xml} className={className} />;
  }

  if (view === View.GuitarHero) {
    return <GuitarHero xml={xml} className={className} />;
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
