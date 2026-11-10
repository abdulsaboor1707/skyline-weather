import {
  MapPin,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Droplets,
  Wind,
  Cloud,
  CloudSun,
  CloudRain,
  CloudFog,
  CloudSnow,
  CloudLightning,
} from "lucide-react";

import type { WeatherData } from "@/lib/weather";

type CurrentWeatherProps = {
  weather: WeatherData;
  city: string;
  country: string;
};

function getWeatherInfo(code: number, isDay: boolean) {
  if (code === 0) {
    return {
      description: isDay ? "Sunny" : "Clear",
      icon: isDay ? Sun : Moon,
    };
  }

  if (code === 1) {
    return {
      description: "Mainly clear",
      icon: isDay ? CloudSun : Cloud,
    };
  }

  if (code === 2) {
    return { description: "Partly cloudy", icon: CloudSun };
  }

  if (code === 3) {
    return { description: "Overcast", icon: Cloud };
  }

  if (code === 45 || code === 48) {
    return { description: "Foggy", icon: CloudFog };
  }

  if (code >= 51 && code <= 67) {
    return { description: "Drizzle / Rain", icon: CloudRain };
  }

  if (code >= 71 && code <= 77) {
    return { description: "Snow", icon: CloudSnow };
  }

  if (code >= 80 && code <= 82) {
    return { description: "Rain showers", icon: CloudRain };
  }

  if (code >= 85 && code <= 86) {
    return { description: "Snow showers", icon: CloudSnow };
  }

  if (code >= 95) {
    return { description: "Thunderstorm", icon: CloudLightning };
  }

  return { description: "Cloudy", icon: Cloud };
}

function formatTime(value: string) {
  const [hours, minutes] = value.slice(11, 16).split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    },
  );
}

export default function CurrentWeather({
  weather,
  city,
  country,
}: CurrentWeatherProps) {
  const current = weather.current;
  const today = weather.daily;

  const weatherInfo = getWeatherInfo(
    current.weather_code,
    current.is_day === 1,
  );

  const WeatherIcon = weatherInfo.icon;

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-6 text-white shadow-lg shadow-blue-200/50 sm:p-9">
      {/* Main weather information */}
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <div className="mb-5 flex items-center gap-2 text-blue-100">
            <MapPin size={17} />
            <span className="text-sm font-medium">
              {city}, {country}
            </span>
          </div>

          <p className="mb-2 text-sm text-blue-100">
            {formatDate(current.time)}
          </p>

          <h2 className="text-6xl font-semibold tracking-tight sm:text-7xl">
            {Math.round(current.temperature_2m)}°
          </h2>

          <p className="mt-3 text-xl font-medium">{weatherInfo.description}</p>

          <p className="mt-2 text-sm text-blue-100">
            Feels like {Math.round(current.apparent_temperature)}° · H:{" "}
            {Math.round(today.temperature_2m_max[0])}° L:{" "}
            {Math.round(today.temperature_2m_min[0])}°
          </p>
        </div>

        <div className="flex items-center justify-center md:pr-10">
          <WeatherIcon
            size={150}
            strokeWidth={1}
            className="text-yellow-200 drop-shadow-lg"
          />
        </div>
      </div>

      {/* Additional weather information */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 sm:grid-cols-4">
        <div>
          <p className="text-xs text-blue-100">Sunrise</p>

          <div className="mt-2 flex items-center gap-2">
            <Sunrise size={19} />
            <span className="font-semibold">
              {formatTime(today.sunrise[0])}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-blue-100">Sunset</p>

          <div className="mt-2 flex items-center gap-2">
            <Sunset size={19} />
            <span className="font-semibold">{formatTime(today.sunset[0])}</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-blue-100">Humidity</p>

          <div className="mt-2 flex items-center gap-2">
            <Droplets size={19} />
            <span className="font-semibold">
              {current.relative_humidity_2m}%
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-blue-100">Wind</p>

          <div className="mt-2 flex items-center gap-2">
            <Wind size={19} />
            <span className="font-semibold">
              {Math.round(current.wind_speed_10m)} km/h
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
