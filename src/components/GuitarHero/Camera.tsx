import { useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "three";

interface CameraProps {
  width: number;
  height: number;
}

export default function Camera({ width, height }: CameraProps) {
  useFrame(({ camera }) => {
    const orthographicCamera = camera as OrthographicCamera;
    orthographicCamera.left = width / -2;
    orthographicCamera.top = height / 2;
    orthographicCamera.right = width / 2;
    orthographicCamera.bottom = height / -2;
  });

  return null;
}
