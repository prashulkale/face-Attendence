
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
 import { Loader2 } from "lucide-react"; // ✅ spinner icon
import FaceSkeleton from "./FaceSkelaton";


const FaceRecognition = ({ setDescriptor }) => {
  const videoRef = useRef(null);
  const [msg, setMsg] = useState("");
   const [loading, setLoading] = useState(false);
     const [isFaceAligned, setIsFaceAligned] = useState(false);
       const [modelsLoaded, setModelsLoaded] = useState(false);
     
  

  useEffect(() => {
    // Load models
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      setModelsLoaded(true);
      console.log("✅ Face models loaded");

      // Start camera
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Camera error:", err));
    };

    loadModels();
  }, []);

  const captureFace = async () => {
    setLoading(true); // start loader
    setMsg("");
    console.log("Capturing face...");

    if (!videoRef.current) return;
     
  await new Promise((resolve) => setTimeout(resolve, 50));


    const detection = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setMsg("⚠️ No face detected, try again.");
       setIsFaceAligned(false); 
       setLoading(false);
      return;
    }
     setIsFaceAligned(true);
    const descriptorArray = Array.from(detection.descriptor);

    console.log("✅ Face descriptor captured:", descriptorArray);
    setDescriptor(descriptorArray); // ✅ update parent state
    setMsg("✅ Face captured successfully!");
     setLoading(false);
  };


   if(!modelsLoaded) {
    return <div className="app-loading w-full max-w-md">
      <FaceSkeleton />
    </div>;
  }



  return (
    <div className="bg-white shadow-xl justify-center rounded-2xl p-6 w-full max-w-md text-center">
      <div className="relative rounded-xl overflow-hidden shadow-md">

      <video
        ref={videoRef}
        autoPlay
        muted
        width="480"
        height="360"
            className="rounded-xl w-full h-64 object-cover"

      />
       <div className="absolute inset-0 flex justify-center items-center">
            <div  className={`w-48 h-48 border-4 rounded-full animate-pulse ${
              isFaceAligned ? "border-green-500" : "border-blue-500"
            }`}></div>
          </div>


    </div>
          <button
        type="button"
        onClick={captureFace}
        disabled={loading}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
        {loading ? (
          <>
          Capturing...
          </>
        ) : (
          "Capture Face"
        )}
      </button>

      <p className="text-sm mt-1">{msg}</p>
</div>
       
  );
};

export default FaceRecognition;







