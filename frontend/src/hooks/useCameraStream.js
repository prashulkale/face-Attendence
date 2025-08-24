// hooks/useCameraStream.js
import { useState, useEffect, useRef } from "react";

export function useCameraStream() {
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setCameraError(error);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { videoRef, cameraError };
}
