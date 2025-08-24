
import { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

export function useFaceApiModels() {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    async function loadModels() {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    }
    loadModels();
  }, []);

  return modelsLoaded;
}
