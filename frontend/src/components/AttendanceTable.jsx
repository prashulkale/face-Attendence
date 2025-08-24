






"use client";
import { useState } from "react";

export default function AttendanceTable({ records }) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; // ✅ You can adjust this

  // Pagination calculations
  const totalPages = Math.ceil(records.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = records.slice(startIndex, startIndex + recordsPerPage);

  return (
    <div>
      <h2 className="text-lg font-bold mt-8 mb-2">Attendance Records</h2>

      <table className="w-full bg-white text-black border rounded shadow">
        <thead className="bg-blue-600 text-white text-sm md:text-base">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody className="text-center text-xs md:text-sm">
          {currentRecords.map((r) => (
            <tr key={r._id}>
              <td className="p-2">{r.userId?.name || "Unknown"}</td>
              <td className="p-2">{new Date(r.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

