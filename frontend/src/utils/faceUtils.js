// utils/faceUtils.js
import * as faceapi from "face-api.js";

export async function getFaceDescriptor(videoElement) {
  if (!videoElement) return null;
  const detection = await faceapi
    .detectSingleFace(videoElement)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) return null;
  return detection.descriptor;
}
