import { Canvas } from "@react-three/fiber";
import Song from "./Song.tsx";

interface GuitarHeroProps {
  xml: string;
  className?: string;
}

export default function GuitarHero({ xml, className }: GuitarHeroProps) {
  return (
    <Canvas className="w-full h-full">
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Song />
    </Canvas>
  );
}
