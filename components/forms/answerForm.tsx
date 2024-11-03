"use client";
import React, { useState } from "react";
import Image from "next/image";

interface AnswerFormProps {
  questions: {
    id: string;
    question: string;
    options: {
      Option1: string;
      Option2: string;
      Option3: string;
    };
    correctAnswer: string;
    image?: string;
  }[];
  onSubmit: (answers: { [key: string]: string }) => void;
  disabled: boolean;
  errorMessage?: string | null;
}

export function AnswerForm({
  questions,
  onSubmit,
  disabled,
  errorMessage,
}: AnswerFormProps) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleChange = (questionId: string, value: string) => {
    if (!disabled) {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <p className="text-red-600 font-bold text-lg">{errorMessage}</p>
      )}
      <div className="max-h-[500px] overflow-y-auto space-y-4 border p-4 rounded-lg bg-gray-50 shadow-md scrollbar-thin">
        {questions.map((question) => (
          <div
            key={question.id}
            className="flex items-start space-x-4 border-b pb-4"
          >
            <div className="flex-1">
              <p className="font-extrabold text-xl pb-4 text-blue-600">
                {question.question}
              </p>
              <div className="flex flex-col space-y-2">
                {Object.values(question.options).map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleChange(question.id, option)}
                      className="form-radio h-6 w-6 text-blue-600"
                      disabled={disabled}
                    />
                    <span className="text-lg text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            {question.image && (
              <Image
                src={question.image}
                alt="Question related"
                className="w-64 h-64 object-cover rounded-lg shadow-lg"
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className={`px-6 py-3 rounded-lg text-xl transition duration-300 ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        disabled={disabled}
      >
        {disabled ? "Submitted!" : "Submit Your Answer!"}
      </button>
    </form>
  );
}
