"use client";
import { useState, useEffect } from "react";
import { dayNameToIndex } from "./utils";

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

  return (
    <div className="max-w-md w-full mx-auto bg-gradient-to-br from-[#181c2b] via-[#232a47] to-[#1a1f38] border border-[#232a47] shadow-2xl rounded-2xl p-8 mt-8 backdrop-blur-md relative overflow-hidden">
      {/* Futuristic glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-400 opacity-30 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 z-10 relative"
      >
        <label className="font-semibold text-gray-200">Day of the Week</label>
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
        <label className="font-semibold text-gray-200">Departure Airport</label>
        <select
          className="bg-[#232a47] border border-[#3b4261] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
        <label className="font-semibold text-gray-200">
          Destination Airport
        </label>
        <select
          className="bg-[#232a47] border border-[#3b4261] rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 text-white font-bold rounded-lg px-6 py-3 mt-4 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
              Predicting...
            </span>
          ) : (
            "Predict Delay"
          )}
        </button>
      </form>
      {result && (
        <div className="mt-8 text-center text-lg font-semibold text-cyan-300 drop-shadow-lg z-10 relative animate-fade-in">
          {result}
        </div>
      )}
      {error && (
        <div className="mt-8 text-center text-lg font-semibold text-pink-400 drop-shadow-lg z-10 relative animate-fade-in">
          Error: {error}
        </div>
      )}
    </div>
  );
}
