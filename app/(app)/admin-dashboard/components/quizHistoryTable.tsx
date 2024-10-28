import React from "react";

interface StudentQuizHistory {
  student: string;
  moduleTitle: string;
  totalQuestions: number;
  score: number;
}

interface Props {
  quizHistory: StudentQuizHistory[];
}

const QuizHistoryTable: React.FC<Props> = ({ quizHistory }) => {
  if (!quizHistory || quizHistory.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Quiz History
        </h2>
        <p className="text-center py-4 text-gray-500">
          No quiz history available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Quiz History</h2>
      <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4">Student Name</th>
            <th className="py-2 px-4">Module Title</th>
            <th className="py-2 px-4">Total Questions</th>
            <th className="py-2 px-4">Quiz Score</th>
          </tr>
        </thead>
        <tbody>
          {quizHistory.map((history, index) => (
            <tr key={index} className="border-b text-center bg-gray-50">
              <td className="py-2 px-4">{history.student}</td>
              <td className="py-2 px-4">{history.moduleTitle}</td>
              <td className="py-2 px-4 text-center">
                {history.totalQuestions}
              </td>
              <td className="py-2 px-4 text-center">{history.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizHistoryTable;
