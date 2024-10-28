import React from "react";

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  backgroundColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  backgroundColor = "bg-light-blue-300",
}) => {
  return (
    <div
      className={`transition-transform duration-300 hover:scale-105 hover:shadow-lg ${backgroundColor} shadow-md rounded-lg p-6 text-center relative overflow-hidden`}
    >
      {icon && (
        <div className="absolute top-4 left-4 text-blue-400 text-5xl">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-700 mt-8">{title}</h3>

      <p className="text-5xl font-bold text-gray-900 mt-4 mb-2">{value}</p>

      <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-r from-blue-300 to-blue-500"></div>
    </div>
  );
};

export default SummaryCard;
