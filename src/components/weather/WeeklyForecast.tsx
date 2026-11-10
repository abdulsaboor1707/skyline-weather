import {
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
  Moon,
  CloudFog,
  CloudSnow,
  CloudLightning,
} from "lucide-react";

import type { WeatherData } from "@/lib/weather";

type WeeklyForecastProps = {
  weather: WeatherData;
};

function getWeatherInfo(code: number, isDay: boolean) {
  if (code === 0) {
    return {
      condition: isDay ? "Sunny" : "Clear",
      icon: isDay ? Sun : Moon,
    };
  }

  if (code === 1) return { condition: "Mainly clear", icon: CloudSun };
  if (code === 2) return { condition: "Partly cloudy", icon: CloudSun };
  if (code === 3) return { condition: "Cloudy", icon: Cloud };
  if (code === 45 || code === 48) return { condition: "Foggy", icon: CloudFog };

  if (code >= 51 && code <= 67) {
    return { condition: "Rain", icon: CloudRain };
  }

  if (code >= 71 && code <= 77) {
    return { condition: "Snow", icon: CloudSnow };
  }

  if (code >= 80 && code <= 82) {
    return { condition: "Rain showers", icon: CloudRain };
  }

  if (code >= 85 && code <= 86) {
    return { condition: "Snow showers", icon: CloudSnow };
  }

  if (code >= 95) {
    return { condition: "Thunderstorm", icon: CloudLightning };
  }

  return { condition: "Cloudy", icon: Cloud };
}

function formatDay(date: string, index: number) {
  if (index === 0) return "Today";

  const [year, month, day] = date.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      timeZone: "UTC",
    },
  );
}

export default function WeeklyForecast({ weather }: WeeklyForecastProps) {
  const weeklyForecast = weather.daily.time.map((date, index) => {
    const weatherInfo = getWeatherInfo(weather.daily.weather_code[index], true);

    return {
      day: formatDay(date, index),
      icon: weatherInfo.icon,
      condition: weatherInfo.condition,
      high: Math.round(weather.daily.temperature_2m_max[index]),
      low: Math.round(weather.daily.temperature_2m_min[index]),
    };
  });

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-1 text-lg font-bold text-slate-900">7-Day Forecast</h2>

      <p className="mb-5 text-sm text-slate-500">
        Weather outlook for the coming days
      </p>

      <div className="space-y-2">
        {weeklyForecast.map((day) => {
          const Icon = day.icon;

          return (
            <div
              key={day.day}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-slate-50 sm:px-3"
            >
              <span className="text-sm font-medium text-slate-700">
                {day.day}
              </span>

              <div className="flex items-center gap-2">
                <Icon size={21} className="text-amber-500" />

                <span className="hidden text-xs text-slate-500 sm:inline">
                  {day.condition}
                </span>
              </div>

              <div className="flex justify-end gap-4 text-sm">
                <span className="font-semibold text-slate-900">
                  {day.high}°
                </span>

                <span className="text-slate-400">{day.low}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
