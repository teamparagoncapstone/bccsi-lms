import React from "react";

interface Student {
  id: string;
  firstname: string;
  lastname: string;
}

interface ComprehensionTest {
  id: string;
  CorrectAnswer: string;
  VoiceExcercises: {
    voice: string;
  };
}
interface ComprehensionHistory {
  id: string;
  ComprehensionTest: ComprehensionTest;
  Student: Student;
  score: number;
  totalQuestions: number;
}

interface ComprehensionHistoryTableProps {
  comprehensionHistory: ComprehensionHistory[] | undefined;
}

const ComprehensionHistoryTable: React.FC<ComprehensionHistoryTableProps> = ({
  comprehensionHistory,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">
        Comprehension History
      </h2>
      <table className="min-w-full text-center bg-gray-50 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gray-200  text-gray-700">
            <th className="py-2 px-4">Student Name</th>
            <th className="py-2 px-4">Voice Exercises</th>
            <th className="py-2 px-4">Total Questions</th>
            <th className="py-2 px-4">Score</th>
          </tr>
        </thead>
        <tbody>
          {comprehensionHistory?.map((history, index) => (
            <tr
              key={index}
              className={`border-b ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white "
              }`}
            >
              <td className="px-4 py-2 ">
                {history.Student.firstname} {history.Student.lastname}
              </td>
              <td className="px-4 py-2 ">
                {history.ComprehensionTest.VoiceExcercises?.voice}
              </td>
              <td className="px-4 py-2 ">{history.totalQuestions}</td>
              <td className="px-4 py-2 ">{history.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComprehensionHistoryTable;
