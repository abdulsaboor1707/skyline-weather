export type WeatherData = {
  timezone: string;

  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    visibility: number[];
  };

  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
};

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),

    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "surface_pressure",
    ].join(","),

    hourly: ["temperature_2m", "weather_code", "visibility"].join(","),

    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
    ].join(","),

    timezone: "auto",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    forecast_days: "7",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    {
      next: { revalidate: 900 },
    },
  );

  if (!response.ok) {
    throw new Error("Unable to fetch weather data.");
  }

  return response.json();
}
