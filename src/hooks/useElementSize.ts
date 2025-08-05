import { type Ref, useEffect, useRef, useState } from "react";

type ElementSize<T extends HTMLElement> = [
  { width: number; height: number },
  Ref<T>,
];

export default function useElementSize<
  T extends HTMLElement,
>(): ElementSize<T> {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      if (!ref.current) {
        return;
      }

      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return [size, ref];
}
