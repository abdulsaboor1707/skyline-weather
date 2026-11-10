"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LoaderCircle, MapPin } from "lucide-react";

type City = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
};

type GeocodingResponse = {
  results?: City[];
};

export default function CitySearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleQueryChange(value: string) {
    setQuery(value);

    if (value.trim().length < 2) {
      setCities([]);
      setError("");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          name: query.trim(),
          count: "5",
          language: "en",
          format: "json",
        });

        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?${params}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to search for cities.");
        }

        const data: GeocodingResponse = await response.json();

        setCities(data.results ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Unable to search. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function selectCity(city: City) {
    const params = new URLSearchParams({
      latitude: city.latitude.toString(),
      longitude: city.longitude.toString(),
      city: city.name,
      country: city.country,
    });

    router.push(`/?${params.toString()}`);

    setQuery("");
    setCities([]);
  }

  return (
    <div className="relative w-full sm:max-w-sm">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        {loading ? (
          <LoaderCircle
            size={19}
            className="shrink-0 animate-spin text-blue-500"
          />
        ) : (
          <Search size={19} className="shrink-0 text-slate-400" />
        )}

        <input
          type="text"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="Search for a city..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      {query.trim().length >= 2 && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {loading && (
            <p className="px-4 py-3 text-sm text-slate-500">
              Searching cities...
            </p>
          )}

          {!loading && error && (
            <p className="px-4 py-3 text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && cities.length === 0 && (
            <p className="px-4 py-3 text-sm text-slate-500">No cities found.</p>
          )}

          {!loading &&
            cities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => selectCity(city)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50"
              >
                <MapPin size={18} className="shrink-0 text-blue-500" />

                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    {city.name}
                  </span>

                  <span className="block text-xs text-slate-500">
                    {[city.admin1, city.country].filter(Boolean).join(", ")}
                  </span>
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
