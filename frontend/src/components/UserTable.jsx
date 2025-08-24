
"use client";
import { useState } from "react";

export default function UserTable({ users }) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // ✅ Change as needed

  // Pagination calculations
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div>
      <h2 className="text-lg font-bold mt-8 mb-2">Registered Users</h2>

      <table className="w-full bg-white text-black border rounded shadow">
        <thead className="bg-blue-600 text-white text-sm md:text-base">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Aadhaar</th>
            <th className="p-2 hidden md:block">User ID</th>
          </tr>
        </thead>
        <tbody className="text-center text-xs md:text-sm">
          {currentUsers.map((u) => (
            <tr key={u._id}>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.aadhaar}</td>
              <td className="p-2 hidden md:block">{u._id}</td>
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
