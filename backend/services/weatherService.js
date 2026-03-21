import axios from "axios";

export const checkRainfall = async (lat, lng) => {
  try {
    // We use Open-Meteo free API to fetch current weather and today's precipitation
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lng,
        daily: "precipitation_sum",
        timezone: "auto",
        forecast_days: 1
      },
    });

    const precipitations = response.data.daily?.precipitation_sum;
    if (!precipitations || precipitations.length === 0) {
      return { heavyRainfall: false, precipitation: 0 };
    }

    const todayPrecipitation = precipitations[0]; // mm of rain
    // Define heavy rainfall as > 10mm in a day
    return {
      heavyRainfall: todayPrecipitation > 10,
      precipitation: todayPrecipitation
    };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw new Error("Could not fetch weather data");
  }
};
