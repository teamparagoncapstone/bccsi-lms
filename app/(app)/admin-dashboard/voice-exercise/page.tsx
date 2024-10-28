'use client';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Define types for the report
interface VoiceExerciseScore {
  name: string;
  score: number;
}

interface VoiceExercisesReport {
  totalExercises: number;
  totalScores: number;
  averageScore: number;
  exercises: VoiceExerciseScore[];
}

export default function VoiceExercisesReport() {
  const [report, setReport] = useState<VoiceExercisesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('/api/voice-performance'); // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReport(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!report) {
    return <div>No report available</div>;
  }

  // Prepare chart data
  const chartData = {
    labels: report.exercises.map(exercise => exercise.name),
    datasets: [
      {
        label: 'Scores',
        data: report.exercises.map(exercise => exercise.score),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Enforcing the literal type
      },
      title: {
        display: true,
        text: 'Voice Exercises Scores',
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Voice Exercises Report</h1>
      <div className="mb-6">
        <h2 className="text-xl">Overview</h2>
        <p>Total Exercises: {report.totalExercises}</p>
        <p>Average Score: {report.averageScore.toFixed(2)}%</p>
        <p>Total Scores: {report.totalScores}</p>
      </div>

      <h2 className="text-xl mb-4">Student Performance</h2>
      <Bar data={chartData} options={chartOptions} />
      
      <table className="min-w-full bg-white border border-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Student Name</th>
            <th className="py-2 px-4 border-b">Score</th>
          </tr>
        </thead>
        <tbody>
          {report.exercises.map((exercise, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{exercise.name}</td>
              <td className="py-2 px-4 border-b">{exercise.score}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}