import axios from "axios";

export const checkRainfall = async (lat, lng) => {
  try {
    // We use Open-Meteo free API to fetch current weather and today's precipitation
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lng,
        daily: "precipitation_sum",
        current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
        timezone: "auto",
        forecast_days: 1
      },
    });

    const precipitations = response.data.daily?.precipitation_sum;
    const currentData = response.data.current;

    const todayPrecipitation = (precipitations && precipitations.length > 0) ? precipitations[0] : 0;
    
    // Define heavy rainfall as > 10mm in a day
    return {
      heavyRainfall: todayPrecipitation > 10,
      precipitation: todayPrecipitation,
      current: currentData || { temperature_2m: 0, relative_humidity_2m: 0, wind_speed_10m: 0 }
    };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw new Error("Could not fetch weather data");
  }
};
