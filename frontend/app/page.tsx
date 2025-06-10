import FlightDelayPredictor from "./FlightDelayPredictor";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradients and blurs */}
      <div className="absolute inset-0 bg-[#060818] overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 opacity-20 blur-[100px]" />
        <div className="absolute top-[30%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-600 opacity-20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-cyan-400 opacity-15 blur-[100px]" />

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjAzNDVCIiBzdHJva2Utd2lkdGg9IjAuNSIgLz4KPC9wYXR0ZXJuPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgo8L3N2Zz4=')] opacity-10" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 sm:p-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-center gradient-text drop-shadow-lg z-10 relative animate-gradient-smooth">
          Flight Delay Predictor
        </h1>
        <p className="text-gray-300 mb-10 text-center max-w-xl opacity-80">
          Predict your flight delays with our advanced AI model powered by
          machine learning technology
        </p>
        <FlightDelayPredictor />
      </div>
    </div>
  );
}
