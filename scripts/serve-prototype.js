const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

loadLocalEnv();

const { identifyPlant } = require("./plant-id-provider");

const root = path.resolve(__dirname, "..", "prototype");
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"]
]);

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, `http://${host}:${port}`);

    if (request.method === "GET" && requestUrl.pathname === "/api/status") {
      writeJson(response, 200, {
        plantIdProvider: process.env.PLANT_ID_PROVIDER || "demo",
        hasPlantNetKey: Boolean(process.env.PLANTNET_API_KEY)
      });
      return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/weather") {
      const result = await weatherForZip(requestUrl.searchParams.get("zip"));
      writeJson(response, 200, result);
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/identify") {
      const body = await readJsonBody(request);
      const result = await identifyPlant(body);
      writeJson(response, 200, result);
      return;
    }

    const requestPath = requestUrl.pathname === "/" ? "/index.html" : decodeURIComponent(requestUrl.pathname);
    const filePath = path.normalize(path.join(root, requestPath));

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const body = await fs.readFile(filePath);
    response.writeHead(200, {
      "content-type": mimeTypes.get(path.extname(filePath)) || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(body);
  } catch (error) {
    if (request.url?.startsWith("/api/")) {
      writeJson(response, error.statusCode || 500, {
        error: error.message || "Request failed."
      });
      return;
    }

    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  const displayHost = host === "0.0.0.0" ? "127.0.0.1" : host;
  console.log(`GardenSnap prototype: http://${displayHost}:${port}`);
  console.log(`Plant ID provider: ${process.env.PLANT_ID_PROVIDER || "demo"}`);
});

async function weatherForZip(zipInput) {
  const zip = String(zipInput || "").trim();
  if (!/^\d{5}$/.test(zip)) {
    throw Object.assign(new Error("Enter a 5-digit ZIP code."), { statusCode: 400 });
  }

  const geocodeUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geocodeUrl.searchParams.set("name", zip);
  geocodeUrl.searchParams.set("count", "1");
  geocodeUrl.searchParams.set("countryCode", "US");
  geocodeUrl.searchParams.set("language", "en");
  geocodeUrl.searchParams.set("format", "json");

  const geocode = await fetchJson(geocodeUrl);
  const place = geocode.results?.[0];
  if (!place) {
    throw Object.assign(new Error("Weather location was not found for that ZIP."), { statusCode: 404 });
  }

  const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
  forecastUrl.searchParams.set("latitude", String(place.latitude));
  forecastUrl.searchParams.set("longitude", String(place.longitude));
  forecastUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code");
  forecastUrl.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max");
  forecastUrl.searchParams.set("temperature_unit", "fahrenheit");
  forecastUrl.searchParams.set("wind_speed_unit", "mph");
  forecastUrl.searchParams.set("precipitation_unit", "inch");
  forecastUrl.searchParams.set("timezone", "auto");
  forecastUrl.searchParams.set("forecast_days", "7");

  const weather = await fetchJson(forecastUrl);
  const daily = weather.daily || {};
  const days = (daily.time || []).map((date, index) => ({
    date,
    highFahrenheit: Number(daily.temperature_2m_max?.[index] || 0),
    lowFahrenheit: Number(daily.temperature_2m_min?.[index] || 0),
    precipitationInches: Number(daily.precipitation_sum?.[index] || 0),
    precipitationProbability: Number(daily.precipitation_probability_max?.[index] || 0) / 100,
    humidity: Number(weather.current?.relative_humidity_2m || 55) / 100,
    windMph: Number(weather.current?.wind_speed_10m || 0),
    condition: weatherCodeLabel(daily.weather_code?.[index])
  }));

  return {
    source: "Open-Meteo",
    zip,
    place: [place.name, place.admin1].filter(Boolean).join(", "),
    current: {
      temperatureF: Number(weather.current?.temperature_2m || days[0]?.highFahrenheit || 0),
      humidity: Number(weather.current?.relative_humidity_2m || 55) / 100,
      windMph: Number(weather.current?.wind_speed_10m || 0),
      condition: weatherCodeLabel(weather.current?.weather_code)
    },
    forecast: days
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "floraos prototype weather lookup"
    }
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw Object.assign(new Error(body.reason || body.error || "Weather provider failed."), {
      statusCode: response.status
    });
  }

  return body;
}

function weatherCodeLabel(codeInput) {
  const code = Number(codeInput);
  if ([0].includes(code)) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Partly cloudy";
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 8_000_000) {
        reject(Object.assign(new Error("Image payload is too large."), { statusCode: 413 }));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON."), { statusCode: 400 }));
      }
    });

    request.on("error", reject);
  });
}

function writeJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(body));
}

function loadLocalEnv() {
  const envPath = path.resolve(__dirname, "..", ".env");

  try {
    const contents = require("node:fs").readFileSync(envPath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // Local env file is optional.
  }
}
