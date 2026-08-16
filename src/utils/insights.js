import { getWeatherFromMood } from "./moodWeather";

const moodValues = {
  sunny: 5,
  "partly-sunny": 4,
  cloudy: 3,
  rainy: 2,
  stormy: 1,
};

const moodLabels = {
  sunny: "Sunny",
  "partly-sunny": "Partly Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  stormy: "Stormy",
};

export function calculateInsights(entries) {
  if (!entries || entries.length === 0) {
    return {
      average: 0,
      climate: "Waiting for your first check-in",
      strongestMood: null,
      trend: "neutral",
      insights: [],
    };
  }

  const values = entries
    .map((entry) => moodValues[entry.mood])
    .filter(Boolean);

  const average =
    values.reduce((sum, value) => sum + value, 0) /
    values.length;

  let climate = "Stormy";

  if (average >= 4.5) {
    climate = "Mostly Sunny";
  } else if (average >= 3.5) {
    climate = "Partly Sunny";
  } else if (average >= 2.5) {
    climate = "Cloudy";
  } else if (average >= 1.5) {
    climate = "Rainy";
  }

  // Count moods
  const moodCounts = {};

  entries.forEach((entry) => {
    moodCounts[entry.mood] =
      (moodCounts[entry.mood] || 0) + 1;
  });

  const strongestMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0];

  // Detect recent trend
  let trend = "neutral";

  if (values.length >= 3) {
    const recent = values.slice(-3);

    const first = recent[0];
    const last = recent[recent.length - 1];

    if (last > first) {
      trend = "improving";
    } else if (last < first) {
      trend = "declining";
    }
  }

  const insights = [];

  // Climate insight
  insights.push({
    icon: "🌤️",
    title: "Your overall climate",
    text: `Your recent check-ins have been ${climate.toLowerCase()}.`,
  });

  // Most common mood
  if (strongestMood) {
    const [mood, count] = strongestMood;

    insights.push({
      icon: getWeatherFromMood(mood).emoji,
      title: "Your most common weather",
      text: `${moodLabels[mood]} appeared ${count} ${
        count === 1 ? "time" : "times"
      } in your recent check-ins.`,
    });
  }

  // Trend insight
  if (trend === "improving") {
    insights.push({
      icon: "🌱",
      title: "The clouds may be clearing",
      text: "Your last few check-ins show an upward mood trend.",
    });
  }

  if (trend === "declining") {
    insights.push({
      icon: "🌧️",
      title: "A little more cloud cover",
      text: "Your recent check-ins have been trending lower. Be gentle with yourself.",
    });
  }

  if (trend === "neutral") {
    insights.push({
      icon: "🌥️",
      title: "Steady skies",
      text: "Your recent mood hasn't shifted dramatically.",
    });
  }

  return {
    average,
    climate,
    strongestMood,
    trend,
    insights,
  };
}