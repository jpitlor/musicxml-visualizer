import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface SheetMusicProps {
  xml: string;
  className?: string;
}

const containerId = uuidv4();

export default function SheetMusic({ xml, className }: SheetMusicProps) {
  const [osmd, setOsmd] = useState<OpenSheetMusicDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setOsmd(
      new OpenSheetMusicDisplay(containerId, {
        autoResize: true,
        backend: "svg",
        drawTitle: false,
      }),
    );
  }, []);

  useEffect(() => {
    if (!osmd) return;

    setIsLoading(true);
    osmd.load(xml).then(() => {
      osmd.render();
      setIsLoading(false);
    });
  }, [xml, osmd]);

  return (
    <div>
      {isLoading && (
        <div className="flex items-center content-center p-4">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      )}
      <div id={containerId} className={className} />
    </div>
  );
}
