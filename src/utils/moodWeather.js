export function getWeatherFromMood(mood) {
  const weatherMap = {
    sunny: {
      weather: "Sunny",
      emoji: "☀️",
    },

    "partly-sunny": {
      weather: "Partly Sunny",
      emoji: "🌤️",
    },

    cloudy: {
      weather: "Cloudy",
      emoji: "☁️",
    },

    rainy: {
      weather: "Rainy",
      emoji: "🌧️",
    },

    stormy: {
      weather: "Stormy",
      emoji: "⛈️",
    },
  };

  return weatherMap[mood] || weatherMap.cloudy;
}