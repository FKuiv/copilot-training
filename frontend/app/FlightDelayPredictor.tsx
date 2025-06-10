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
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Flight Delay Predictor
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-semibold">Day of the Week</label>
        <select
          className="border rounded px-3 py-2"
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
        <label className="font-semibold">Departure Airport</label>
        <select
          className="border rounded px-3 py-2"
          value={departureAirport}
          onChange={(e) => setDepartureAirport(e.target.value)}
          required
        >
          <option value="">Select departure airport</option>
          {airports.map((a) => (
            <option key={a.AirportID} value={a.AirportID}>
              {a.AirportName || a.IATA || a.AirportID}
            </option>
          ))}
        </select>
        <label className="font-semibold">Destination Airport</label>
        <select
          className="border rounded px-3 py-2"
          value={destinationAirport}
          onChange={(e) => setDestinationAirport(e.target.value)}
          required
        >
          <option value="">Select destination airport</option>
          {airports.map((a) => (
            <option key={a.AirportID} value={a.AirportID}>
              {a.AirportName || a.IATA || a.AirportID}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 mt-4 hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict Delay"}
        </button>
      </form>
      {result && (
        <div className="mt-6 text-center text-lg font-semibold text-green-600">
          {result}
        </div>
      )}
      {error && (
        <div className="mt-6 text-center text-lg font-semibold text-red-600">
          Error: {error}
        </div>
      )}
    </div>
  );
}
