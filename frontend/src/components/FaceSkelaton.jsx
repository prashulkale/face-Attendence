"use client";
import { motion } from "framer-motion";

export default function FaceSkeleton() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Title skeleton */}
        {/* <div className="h-7 w-40 mx-auto mb-4 rounded-md bg-gray-200 animate-pulse"></div> */}

        {/* Video placeholder skeleton */}
        <div className="relative rounded-xl overflow-hidden shadow-md">
          <div className="rounded-xl w-full h-64 bg-gray-200 animate-pulse"></div>
          {/* Scanner circle overlay placeholder */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-48 h-48 border-4 border-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="w-full mt-5 h-12 rounded-xl bg-gray-200 animate-pulse"></div>

      </motion.div>
    </motion.div>
  );
}
