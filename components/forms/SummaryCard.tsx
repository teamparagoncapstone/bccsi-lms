import React from "react";

interface SummaryCardProps {
  title: string;
  value: number | string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
};

export default SummaryCard;
