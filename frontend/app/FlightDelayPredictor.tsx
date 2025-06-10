"use client";
import { useState, useEffect } from "react";
import { dayNameToIndex } from "./utils";
import ResultCard from "./ResultCard";

export default function FlightDelayPredictor() {
  const [day, setDay] = useState("");
  const [departureAirport, setDepartureAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [airports, setAirports] = useState<any[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/airports")
      .then((res) => res.json())
      .then((data) => setAirports(data.airports || []))
      .catch(() => setAirports([]));
  }, []);

  // Automatically trigger prediction when all fields are selected
  useEffect(() => {
    // Only trigger if all fields are filled and not loading
    if (
      day &&
      departureAirport &&
      destinationAirport &&
      !loading
    ) {
      // Avoid duplicate requests if the same values are selected again
      setLoading(true);
      setError(null);
      setResult(null);
      fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day_of_week: dayNameToIndex(day),
          departure_airport_id: Number(departureAirport),
          destination_airport_id: Number(destinationAirport),
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("API error");
          return res.json();
        })
        .then((data) => {
          setResult(
            `Probability of delay: ${(data.delay_probability * 100).toFixed(1)}%`
          );
        })
        .catch((err: any) => {
          setError(err.message || "Unknown error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, departureAirport, destinationAirport]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day_of_week: dayNameToIndex(day),
          departure_airport_id: Number(departureAirport),
          destination_airport_id: Number(destinationAirport),
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(
        `Probability of delay: ${(data.delay_probability * 100).toFixed(1)}%`
      );
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Find airport names for display in result card
  const departureAirportObj = airports.find(
    (a) => String(a.airport_id) === departureAirport
  );
  const destinationAirportObj = airports.find(
    (a) => String(a.airport_id) === destinationAirport
  );

  return (
    <div className="relative z-10">
      <div className="max-w-2xl w-full mx-auto bg-gradient-to-br from-[#181c2b] via-[#232a47] to-[#1a1f38] border border-[#232a47] shadow-2xl rounded-2xl p-10 mt-8 backdrop-blur-md overflow-hidden">
        {/* Futuristic glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-400 opacity-30 rounded-full blur-2xl z-0 animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 z-10 relative"
        >
          <div className="flex items-center gap-2">
            {/* Airplane icon for day of week */}
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 12.5L3 21l18-9-18-9 7.5 8.5z"
              />
            </svg>
            <label className="font-semibold text-gray-200">
              Day of the Week
            </label>
          </div>
          <select
            className="bg-[#232a47] border border-[#3b4261] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          >
            <option value="">Select a day</option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            {/* Airplane takeoff icon for departure */}
            <svg
              className="w-6 h-6 text-cyan-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 19.5l19.5-7.5-7.5-2.5-2.5-7.5-2.5 7.5-7.5 2.5 19.5 7.5z"
              />
            </svg>
            <label className="font-semibold text-gray-200">
              Departure Airport
            </label>
          </div>
          <div className="relative">
            {/* Airplane takeoff icon in select */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 19.5l19.5-7.5-7.5-2.5-2.5-7.5-2.5 7.5-7.5 2.5 19.5 7.5z"
              />
            </svg>
            <select
              className="pl-10 bg-[#232a47] border border-[#3b4261] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full"
              value={departureAirport}
              onChange={(e) => setDepartureAirport(e.target.value)}
              required
            >
              <option value="">Select departure airport</option>
              {airports.map((a) => (
                <option key={a.airport_id} value={a.airport_id}>
                  {a.airport_name
                    ? `${a.airport_name}${a.iata ? ` (${a.iata})` : ""}`
                    : a.airport_id}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            {/* Airplane landing icon for destination */}
            <svg
              className="w-6 h-6 text-purple-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21H3m18-3l-7.5-2.5-2.5-7.5-2.5 7.5L3 18l18 3z"
              />
            </svg>
            <label className="font-semibold text-gray-200">
              Destination Airport
            </label>
          </div>
          <div className="relative">
            {/* Airplane landing icon in select */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21H3m18-3l-7.5-2.5-2.5-7.5-2.5 7.5L3 18l18 3z"
              />
            </svg>
            <select
              className="pl-10 bg-[#232a47] border border-[#3b4261] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full"
              value={destinationAirport}
              onChange={(e) => setDestinationAirport(e.target.value)}
              required
            >
              <option value="">Select destination airport</option>
              {airports.map((a) => (
                <option key={a.airport_id} value={a.airport_id}>
                  {a.airport_name
                    ? `${a.airport_name}${a.iata ? ` (${a.iata})` : ""}`
                    : a.airport_id}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
      <ResultCard
        result={result}
        error={error}
        departureAirportName={
          departureAirportObj
            ? `${departureAirportObj.airport_name}${
                departureAirportObj.iata ? ` (${departureAirportObj.iata})` : ""
              }`
            : undefined
        }
        destinationAirportName={
          destinationAirportObj
            ? `${destinationAirportObj.airport_name}${
                destinationAirportObj.iata
                  ? ` (${destinationAirportObj.iata})`
                  : ""
              }`
            : undefined
        }
        day={day}
      />
    </div>
  );
}
