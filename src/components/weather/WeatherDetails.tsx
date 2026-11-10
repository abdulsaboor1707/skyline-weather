import { Droplets, Eye, Gauge, Wind } from "lucide-react";

import type { WeatherData } from "@/lib/weather";

type WeatherDetailsProps = {
  weather: WeatherData;
};

export default function WeatherDetails({ weather }: WeatherDetailsProps) {
  const current = weather.current;

  const weatherDetails = [
    {
      label: "Humidity",
      value: `${current.relative_humidity_2m}%`,
      icon: Droplets,
      description: "Relative humidity",
    },
    {
      label: "Wind speed",
      value: `${Math.round(current.wind_speed_10m)} km/h`,
      icon: Wind,
      description: "Current wind speed",
    },
    {
      label: "Visibility",
      value: `${Math.round(
        weather.hourly.visibility[
          weather.hourly.time.findIndex(
            (time) => time.slice(0, 13) === current.time.slice(0, 13),
          )
        ] / 1000,
      )} km`,
      icon: Eye,
      description: "Horizontal visibility",
    },
    {
      label: "Pressure",
      value: `${Math.round(current.surface_pressure)} hPa`,
      icon: Gauge,
      description: "Atmospheric pressure",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-1 text-lg font-bold text-slate-900">Weather Details</h2>

      <p className="mb-6 text-sm text-slate-500">
        More information about today&apos;s weather
      </p>

      <div className="grid grid-cols-2 gap-4">
        {weatherDetails.map((detail) => {
          const Icon = detail.icon;

          return (
            <div key={detail.label} className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-4 flex items-center gap-2 text-slate-500">
                <Icon size={19} className="text-blue-600" />
                <span className="text-xs font-medium">{detail.label}</span>
              </div>

              <p className="text-xl font-bold text-slate-900">{detail.value}</p>

              <p className="mt-1 text-xs text-slate-500">
                {detail.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
