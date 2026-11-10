import {
  Sun,
  Moon,
  CloudSun,
  Cloud,
  CloudRain,
  CloudFog,
  CloudSnow,
  CloudLightning,
} from "lucide-react";

import type { WeatherData } from "@/lib/weather";

type HourlyForecastProps = {
  weather: WeatherData;
};

function getWeatherIcon(code: number, isDay: boolean) {
  if (code === 0) return isDay ? Sun : Moon;
  if (code === 1 || code === 2) return CloudSun;
  if (code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return CloudSnow;
  if (code >= 80 && code <= 82) return CloudRain;
  if (code >= 85 && code <= 86) return CloudSnow;
  if (code >= 95) return CloudLightning;

  return Cloud;
}

function formatHour(value: string) {
  const hour = Number(value.slice(11, 13));
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour} ${period}`;
}

export default function HourlyForecast({ weather }: HourlyForecastProps) {
  const currentHour = weather.current.time.slice(0, 13);

  const startIndex = Math.max(
    0,
    weather.hourly.time.findIndex((time) => time.slice(0, 13) === currentHour),
  );

  const hourlyForecast = weather.hourly.time
    .slice(startIndex, startIndex + 8)
    .map((time, index) => {
      const dataIndex = startIndex + index;

      return {
        time: index === 0 ? "Now" : formatHour(time),
        temp: Math.round(weather.hourly.temperature_2m[dataIndex]),
        code: weather.hourly.weather_code[dataIndex],
      };
    });

  const isDay = weather.current.is_day === 1;

  return (
    <section className="mb-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Card heading */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Today&apos;s Forecast
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Temperature throughout the day
          </p>
        </div>

        <span className="text-sm font-medium text-blue-600">Hourly</span>
      </div>

      {/* Hourly weather items */}
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
        {hourlyForecast.map((hour) => {
          const Icon = getWeatherIcon(hour.code, isDay);

          return (
            <div
              key={hour.time}
              className={`flex flex-col items-center gap-3 rounded-2xl px-2 py-4 ${
                hour.time === "Now"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600"
              }`}
            >
              <span className="text-xs font-medium">{hour.time}</span>

              <Icon size={27} className="text-amber-500" />

              <span className="text-lg font-bold">{hour.temp}°</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
