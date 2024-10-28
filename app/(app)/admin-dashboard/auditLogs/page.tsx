"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { FiDownload } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import { Sidebar } from "../components/sidebar";
import { Toaster } from "react-hot-toast";
import { UserNav } from "../components/user-nav";
import TeamSwitcher from "../components/team-switcher";
import { Separator } from "@/components/ui/separator";
import { lists } from "../data/lists";
import Loading from "@/components/loading";
interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityId: string;
  timestamp: string;
  details: string | null;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
  const [actionFilter, setActionFilter] = useState("");
  const [jumpToPage, setJumpToPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AuditLog;
    direction: "ascending" | "descending";
  }>({ key: "timestamp", direction: "descending" });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/audit-logs");
        if (!response.ok) {
          console.error("Failed to fetch logs");
          return;
        }
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (loading) return;
    const lowerCaseSearch = search.toLowerCase();
    const filtered = logs.filter((log) => {
      const matchesSearch =
        log.userId?.toLowerCase().includes(lowerCaseSearch) ||
        log.action.toLowerCase().includes(lowerCaseSearch) ||
        log.entityId.toLowerCase().includes(lowerCaseSearch);
      const matchesDateRange =
        (!startDate || new Date(log.timestamp) >= new Date(startDate)) &&
        (!endDate || new Date(log.timestamp) <= new Date(endDate));
      const matchesAction =
        !actionFilter ||
        log.action.toLowerCase() === actionFilter.toLowerCase();
      return matchesSearch && matchesDateRange && matchesAction;
    });

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setFilteredLogs(sorted);
    setCurrentPage(1);
  }, [search, startDate, endDate, logs, actionFilter, sortConfig]);

  const startIdx = (currentPage - 1) * logsPerPage;
  const currentLogs = filteredLogs.slice(startIdx, startIdx + logsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const exportLogs = () => {
    const csvContent = [
      ["User ID", "Action", "Timestamp", "Details"],
      ...filteredLogs.map((log) => [
        log.userId || "",
        log.action,
        format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
        log.details || "",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_logs.csv";
    a.click();
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="w-full h-16 bg-white shadow-md flex items-center px-4 relative">
        <div className="flex items-center pr-2">
          <button
            className="md:hidden p-2 hover:bg-gray-200 rounded transition duration-300 flex items-center justify-center"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6 md:hidden"
            >
              {sidebarOpen ? (
                <>
                  <path d="M6 18L18 6" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
          <TeamSwitcher />
        </div>
        <div className="flex-1 flex items-center pl-2">
          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-blue-300 p-4 drop-shadow-lg">
          <Sidebar className="w-full" lists={lists} />
        </aside>

        {/* Sidebar Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-blue-300 p-4 drop-shadow-lg md:hidden transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar className="w-full" lists={lists} />
          <button
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <IoCloseCircle className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Audit Logs
          </h1>
          <section className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Log Controls
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                <label htmlFor="search" className="sr-only">
                  Search Logs
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by User ID, Action, or Entity ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p-3 border rounded-lg w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear Search"
                  >
                    <IoCloseCircle size={22} />
                  </button>
                )}
              </div>
              <button
                onClick={exportLogs}
                className="bg-blue-600 text-white flex items-center px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Export Logs as CSV"
              >
                <FiDownload className="mr-2" />
                Export as CSV
              </button>
            </div>
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mb-4">
              <div className="mb-4 md:mb-0">
                <label
                  htmlFor="start-date"
                  className="block text-gray-600 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="bg-gray-300 px-1 py-1 text-sm rounded-lg hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 h-8 mt-8 md:mt-8"
              >
                Clear Dates
              </button>
            </div>
          </section>
          <section className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Logs Table
            </h2>
            <div className="overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-gray-600 border-b">
                      User ID
                    </th>
                    <th className="p-3 font-semibold text-gray-600 border-b">
                      Action
                    </th>
                    <th className="p-3 font-semibold text-gray-600 border-b">
                      Timestamp
                    </th>
                    <th className="p-3 font-semibold text-gray-600 border-b">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.length > 0 ? (
                    currentLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className="p-3 border-b">
                          {highlightText(log.userId || "", search)}
                        </td>
                        <td className="p-3 border-b">
                          {highlightText(log.action, search)}
                        </td>
                        <td className="p-3 border-b">
                          {format(
                            new Date(log.timestamp),
                            "yyyy-MM-dd HH:mm:ss"
                          )}
                        </td>
                        <td className="p-3 border-b">
                          {highlightText(log.details || "", search)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-gray-500">
                        No logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row justify-between mt-4">
              <div className="flex items-center mb-4 md:mb-0">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Next
                </button>
              </div>
              <div className="flex items-center">
                <label htmlFor="jump-to-page" className="mr-2 text-gray-600">
                  Jump to page:
                </label>
                <input
                  type="number"
                  id="jump-to-page"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(Number(e.target.value))}
                  min={1}
                  max={totalPages}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-16"
                />
                <button
                  onClick={() => {
                    if (jumpToPage >= 1 && jumpToPage <= totalPages) {
                      setCurrentPage(jumpToPage);
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Go
                </button>
              </div>
            </div>
          </section>
          {selectedLog && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-300">
                <h3 className="text-lg font-semibold mb-4">Log Details</h3>
                <div className="mb-4">
                  <strong>User ID:</strong> {selectedLog.userId}
                </div>
                <div className="mb-4">
                  <strong>Action:</strong> {selectedLog.action}
                </div>
                <div className="mb-4">
                  <strong>Entity ID:</strong> {selectedLog.entityId}
                </div>
                <div className="mb-4">
                  <strong>Timestamp:</strong>{" "}
                  {format(
                    new Date(selectedLog.timestamp),
                    "yyyy-MM-dd HH:mm:ss"
                  )}
                </div>
                <div className="mb-4">
                  <strong>Details:</strong> {selectedLog.details || "N/A"}
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function highlightText(text: string, search: string) {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${search})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <span key={index} className="bg-yellow-200">
        {part}
      </span>
    ) : (
      part
    )
  );
}
