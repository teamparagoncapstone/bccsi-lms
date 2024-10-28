"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TeamSwitcher from "@/app/(app)/grade-one-dashboard/_components/team-switcher";
import { UserNav } from "@/app/(app)/grade-one-dashboard/_components/user-nav";
import { SystemMenu } from "../_components/system-menu";
import { Separator } from "@/components/ui/separator";
import Loading from "../loading";

interface VoiceExercisesHistory {
  id: string;
  voice: string;
  voiceImage: string | null;
  voiceRecord: string | null;
  recognizedText: string;
  accuracyScore: string;
  pronunciationScore: string;
  fluencyScore: string;
  score: string;
  speedScore: string;
  phonemes: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 5; // Number of items per page

export default function VoiceHistory() {
  const { data: session } = useSession();
  const [voiceHistory, setVoiceHistory] = useState<VoiceExercisesHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVoiceHistory = async () => {
      if (!session) return;
      const studentId = session.user.studentId;

      try {
        const response = await fetch(
          `/api/get-voice-history?studentId=${studentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch voice history");
        }
        const data = await response.json();
        setVoiceHistory(data.history);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVoiceHistory();
  }, [session]);

  if (loading)
    return (
      <p className="text-center text-lg">
        <Loading />
      </p>
    );
  if (error) return <p className="text-red-500 text-center text-lg">{error}</p>;

  // Filter voice history based on search term (Voice Exercises)
  const filteredHistory = voiceHistory.filter((voice) =>
    voice.voice.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const displayedHistory = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full relative">
      {/* Navbar */}
      <div className="w-full h-auto md:h-16 shadow-lg">
        <div className="flex h-16 items-center px-4">
          <div className="hidden sm:block pr-2">
            <TeamSwitcher />
          </div>
          <div className="flex pl-2">
            <SystemMenu />
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <Separator />
      </div>

      {/* Main content with gradient background */}
      <div
        className="bg-gradient-to-r from-indigo-200 to-blue-200 min-h-screen p-4"
        style={{ backgroundImage: 'url("/images/student-history-voice1.png")' }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center text-indigo-800 drop-shadow-lg">
            Voice Exercises History
          </h1>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search by voice exercises..."
            className="mb-4 p-2 border rounded"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to the first page on search
            }}
          />

          {filteredHistory.length === 0 ? (
            <p className="text-center text-xl">No voice history available.</p>
          ) : (
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto max-h-[700px] overflow-y-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  <thead className="bg-indigo-500 text-white">
                    <tr className="text-left text-lg">
                      <th className="py-3 px-4">Voice Exercises</th>
                      <th className="py-3 px-4">Recognized Text</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 px-4">Pronunciation</th>
                      <th className="py-3 px-4">Fluency</th>
                      <th className="py-3 px-4">Speed</th>
                      <th className="py-3 px-4">Total Score</th>
                      {/* <th className="py-3 px-4">Phonemes</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {displayedHistory.map((voice: VoiceExercisesHistory) => (
                      <tr
                        key={voice.id}
                        className="hover:bg-blue-100 transition duration-300"
                      >
                        <td className="py-2 px-4">{voice.voice}</td>
                        <td className="py-2 px-4">{voice.recognizedText}</td>
                        <td className="py-2 px-4">{voice.accuracyScore}</td>
                        <td className="py-2 px-4">
                          {parseFloat(voice.pronunciationScore).toFixed(2)}
                        </td>
                        <td className="py-2 px-4">{voice.fluencyScore}</td>
                        <td className="py-2 px-4">{voice.speedScore}</td>
                        <td className="py-2 px-4">{voice.score}</td>
                        {/* <td className="py-2 px-4">{voice.phonemes}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
