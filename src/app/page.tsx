import CurrentWeather from "@/components/weather/CurrentWeather";
import HourlyForecast from "@/components/weather/HourlyForecast";
import WeatherDetails from "@/components/weather/WeatherDetails";
import WeatherFooter from "@/components/weather/WeatherFooter";
import WeatherHeader from "@/components/weather/WeatherHeader";
import WeeklyForecast from "@/components/weather/WeeklyForecast";
import { getWeather } from "@/lib/weather";

type HomeProps = {
  searchParams: Promise<{
    latitude?: string;
    longitude?: string;
    city?: string;
    country?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  // Default location: Karachi
  const city = params.city || "Karachi";
  const country = params.country || "Pakistan";
  const defaultLatitude = 24.8607;
  const defaultLongitude = 67.0011;

  // Read selected city coordinates from the URL
  const requestedLatitude = Number(params.latitude);
  const requestedLongitude = Number(params.longitude);

  const latitude =
    params.latitude &&
    Number.isFinite(requestedLatitude) &&
    requestedLatitude >= -90 &&
    requestedLatitude <= 90
      ? requestedLatitude
      : defaultLatitude;

  const longitude =
    params.longitude &&
    Number.isFinite(requestedLongitude) &&
    requestedLongitude >= -180 &&
    requestedLongitude <= 180
      ? requestedLongitude
      : defaultLongitude;

  // Fetch weather for the selected location
  const weather = await getWeather(latitude, longitude);

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <WeatherHeader />

        <CurrentWeather weather={weather} city={city} country={country} />

        <HourlyForecast weather={weather} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeatherDetails weather={weather} />
          <WeeklyForecast weather={weather} />
        </div>

        <WeatherFooter />
      </div>
    </main>
  );
}
