
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import api from "../utils/api";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

/**
 * FaceCompare component
 * Props:
 *   - fetchAttendance: function passed from HomePage to refresh attendance table
 */
const FaceCompare = ({ fetchAttendance }) => {
  const videoRef = useRef(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Start camera once
  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
        setMatchResult("⚠️ Could not access camera");
      }
    })();

    // cleanup camera on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // 🔹 Debounce utility (stable)
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const compareFace = async () => {
    if (loading) return;
    setLoading(true);
    setMatchResult(null);
    
    if (!videoRef.current) return;

    await new Promise((resolve) => setTimeout(resolve, 5));

    try {
      // 1️⃣ Detect face from live video
      const liveDetection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!liveDetection) {
        setMatchResult("⚠️ No face detected in live video");
        return;
      }

      // 2️⃣ Fetch registered users
      const { data: users } = await api.get("/api/users");
      if (!users?.length) {
        setMatchResult("❌ No registered users found");
        return;
      }

      // 3️⃣ Build labeled descriptors
      const labeledDescriptors = users
        .filter((u) => u.faceDescriptor?.length)
        .map(
          (u) =>
            new faceapi.LabeledFaceDescriptors(
              `${u.name} (${u.aadhaar})`,
              [new Float32Array(u.faceDescriptor)]
            )
        );

      if (!labeledDescriptors.length) {
        setMatchResult("❌ No valid descriptors in DB");
        return;
      }

      // 4️⃣ Match faces
      const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
      const bestMatch = faceMatcher.findBestMatch(liveDetection.descriptor);

      setMatchResult(bestMatch.toString());

      // 5️⃣ If recognized → mark attendance + refresh table
      if (bestMatch.label !== "unknown") {
        const aadhaar = bestMatch.label.match(/\((\d{12})\)/)?.[1];
        if (aadhaar) {
          await api.post(`/api/attendance/mark`, { aadhaar });
          if (fetchAttendance) fetchAttendance(); // 🔥 refresh parent table
        }
      }
    } catch (err) {
      console.error("❌ Comparison error:", err);
      setMatchResult("Error during face comparison");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Stable debounced function
  const debouncedCompareFace = useCallback(debounce(compareFace, 1500), []);

  // ✅ UI for result
  const renderResult = () => {
    if (!matchResult) return null;

    if (matchResult.includes("unknown"))
      return (
        <div className="flex items-center gap-2 text-red-600 bg-red-100 px-4 py-2 rounded-lg">
          <XCircle className="w-5 h-5" /> <span>{matchResult}</span>
        </div>
      );

    if (matchResult.includes("No face") || matchResult.includes("Error"))
      return (
        <div className="flex items-center gap-2 text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg">
          <AlertTriangle className="w-5 h-5" /> <span>{matchResult}</span>
        </div>
      );

    return (
      <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2 rounded-lg">
        <CheckCircle className="w-5 h-5" /> <span>{matchResult}</span>
      </div>
    );
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-base md:text-xl font-bold text-gray-800 mb-4">
          Face Verification
        </h2>

        <div className="relative rounded-xl overflow-hidden shadow-md">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            width="480"
            height="360"
            className="rounded-xl w-full h-64 object-cover"
          />
          {/* Scanner circle overlay */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-48 h-48 border-4 border-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <button
          onClick={debouncedCompareFace}
          disabled={loading}
          className="w-full mt-5 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
             Comparing...
            </>
          ) : (
            "Compare & Mark"
          )}
        </button>

        <div className="mt-4">{renderResult()}</div>
      </motion.div>
    </motion.div>
  );
};

export default FaceCompare;
