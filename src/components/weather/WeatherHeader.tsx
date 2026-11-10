import { CloudSun } from "lucide-react";
import CitySearch from "@/components/weather/CitySearch";

export default function WeatherHeader() {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Logo and title */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <CloudSun size={27} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Skyline Weather
          </h1>

          <p className="text-xs text-slate-500">Your daily weather companion</p>
        </div>
      </div>

      {/* City search */}
      <CitySearch />
    </header>
  );
}
