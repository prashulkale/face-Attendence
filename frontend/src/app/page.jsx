


"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import UserTable from "../components/UserTable";
import AttendanceTable from "../components/AttendanceTable";
import api from "../utils/api";
import * as faceapi from "face-api.js";
import FaceCompare from "@/components/FaceCompare";
import FaceRecognition from "@/components/FaceRecognition";
import FaceSkelaton from "@/components/FaceSkelaton";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [aadhaar, setAadhaar] = useState("");
  const [msg, setMsg] = useState("");

  // ✅ Reusable function for attendance fetching
  const fetchAttendance = async () => {
    try {
      const attendanceResponse = await api.get("/api/attendance");
      setAttendance(attendanceResponse.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // Fetch initial data
  useEffect(() => {

    const fetchData = async () => {
      try {
        const usersResponse = await api.get("/api/users");
        setUsers(usersResponse.data);

        await fetchAttendance(); // also fetch attendance
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Manual attendance
  const handleManualAttendance = async () => {
    try {
      await api.post("/api/attendance/mark", { aadhaar });
      setMsg("✅ Attendance marked successfully");
      setAadhaar("");
      await fetchAttendance(); // 🔥 refresh table
    } catch (error) {
      setMsg("❌ Failed to mark attendance");
      console.error(error);
    }
  };

  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("✅ All models loaded");
      } catch (error) {
        console.error("Failed to load models:", error);
      }
    };

    loadModels();
  }, []);


  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      {/* Page Heading */}
      <div className=" flex justify-evenly items-center">
        <h1 className="text-xl md:text-3xl font-bold mb-8 text-start text-gray-800">
          Face Recognition <br /> & Attendance
        </h1>

        {/* Register User Button */}
        <div className="flex justify-center mb-8">
          <Link href="/register">
            <button className="bg-blue-700 text-sm md:text-base cursor-pointer hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-xl shadow">
              Create User
            </button>
          </Link>
        </div>
      </div>

      {/* Face Recognition + Manual Attendance */}
      <div className="flex flex-col items-center gap-6 mb-10 w-full max-w-2xl mx-auto">
        <div className="w-full bg-white rounded-2xl shadow-lg p-6">
          {modelsLoaded ? (
            // ✅ pass fetchAttendance so FaceCompare can refresh too
            <FaceCompare fetchAttendance={fetchAttendance} />
          ) : (
            <FaceSkelaton/>
          )}
        </div>

        {/* Manual Attendance Section */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">
            No face detected? Mark manually:
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              placeholder="Enter Aadhaar Number"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleManualAttendance}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow w-full sm:w-auto"
            >
              Mark Attendance
            </button>
          </div>
          {msg && <span className="block mt-3 text-red-600 font-bold">{msg}</span>}
        </div>
      </div>

      {/* User & Attendance Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <UserTable users={users} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <AttendanceTable records={attendance} />
        </div>
      </div>
    </section>
  );
}
