





"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import FaceRecognition from "@/components/FaceRecognition";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import debounce from "lodash.debounce";

// Validation schema using Zod
const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  aadhaar: z
    .string()
    .trim()
    .length(12, "Aadhaar must be 12 digits")
    .regex(/^\d{12}$/, "Aadhaar must be numeric"),
});

export default function RegisterPage() {
  // Form state
  const [form, setForm] = useState({ name: "", aadhaar: "" });
  // Face descriptor state from FaceRecognition component
  const [descriptor, setDescriptor] = useState(null);
  // Validation errors
  const [errors, setErrors] = useState({});
  // User feedback message from server or validation
  const [msg, setMsg] = useState("");
  // Loading state for API calls and capture
  const [loading, setLoading] = useState(false);

  // Debounced input validation for better UX
  const validateField = useCallback(
    debounce((field, value) => {
      const updatedForm = { ...form, [field]: value };
      const result = registerSchema.safeParse(updatedForm);
      if (!result.success) {
        const issue = result.error.issues.find((issue) => issue.path[0] === field);
        setErrors((prev) => ({ ...prev, [field]: issue ? issue.message : "" }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    }, 400),
    [form]
  );

  // Handle input changes + trigger debounced validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Final form submission handler
  const handleRegister = async (e) => {
    e.preventDefault();

    // Require face descriptor for registration
    if (!descriptor) {
      setMsg("⚠️ Please capture face first.");
      return;
    }

    // Validate entire form synchronously before submitting
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      setMsg("");
      return;
    }

    setErrors({});
    setMsg("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/users/register",
        { ...result.data, faceDescriptor: descriptor },
        { headers: { "Content-Type": "application/json" } }
      );

      setMsg(`✅ Registered successfully! User ID: ${response.data._id}`);
      // Redirect or reset after short delay
      setTimeout(() => window.location.href = "/", 1500);
    } catch (error) {
      // Show server error message
      setMsg(
        `❌ Registration failed: ${
          error.response?.data?.error || error.message || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Register New User</h1>
        <Link href="/">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow">
            Back
          </button>
        </Link>
      </div>

      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={`w-full rounded-lg px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
              placeholder="Enter full name"
              aria-invalid={!!errors.name}
              aria-describedby="name-error"
            />
            {errors.name && (
              <p id="name-error" className="text-red-600 mt-1 text-sm">
                {errors.name}
              </p>
            )}
          </div>

          {/* Aadhaar Field */}
          <div>
            <label htmlFor="aadhaar" className="block text-gray-700 font-medium mb-1">
              Aadhaar <span className="text-red-500">*</span>
            </label>
            <input
              id="aadhaar"
              name="aadhaar"
              type="text"
              maxLength={12}
              value={form.aadhaar}
              onChange={handleChange}
              className={`w-full rounded-lg px-4 py-2 border ${
                errors.aadhaar ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 outline-none`}
              placeholder="Enter 12-digit Aadhaar number"
              aria-invalid={!!errors.aadhaar}
              aria-describedby="aadhaar-error"
            />
            {errors.aadhaar && (
              <p id="aadhaar-error" className="text-red-600 mt-1 text-sm">
                {errors.aadhaar}
              </p>
            )}
          </div>

          {/* FaceRecognition Capture */}
          <div className="flex justify-center">
            <FaceRecognition setDescriptor={setDescriptor} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg py-3 flex justify-center items-center gap-2 transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register"}
          </button>

          {/* Feedback Message */}
          {msg && (
            <p
              className={`mt-2 text-center font-semibold ${
                msg.startsWith("✅") ? "text-green-700" : "text-red-700"
              }`}
            >
              {msg}
            </p>
          )}
        </form>
      </motion.div>
    </motion.section>
  );
}
