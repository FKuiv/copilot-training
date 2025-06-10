import React from "react";

type ResultCardProps = {
  result: string | null;
  error?: string | null;
};

export default function ResultCard({ result, error }: ResultCardProps) {
  if (!result && !error) return null;
  return (
    <div className="max-w-2xl w-full mx-auto mt-6">
      <div
        className={`rounded-xl shadow-lg p-6 text-center transition-all
        ${
          result
            ? "bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 border border-cyan-600"
            : ""
        }
        ${
          error
            ? "bg-gradient-to-r from-pink-900 via-red-900 to-purple-900 border border-pink-600"
            : ""
        }
      `}
      >
        {result && (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-10 h-10 text-cyan-300 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.5 19.5l19-7-19-7v6l15 1-15 1v6z"
              />
            </svg>
            <span className="text-lg font-semibold text-cyan-300 drop-shadow-lg animate-fade-in">
              {result}
            </span>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-10 h-10 text-pink-400 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="text-lg font-semibold text-pink-400 drop-shadow-lg animate-fade-in">
              Error: {error}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
