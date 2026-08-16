const moodValues = {
  sunny: 5,
  "partly-sunny": 4,
  cloudy: 3,
  rainy: 2,
  stormy: 1,
};

export function generateForecast(entries) {
  if (!entries || entries.length === 0) {
    return {
      weather: "cloudy",
      emoji: "☁️",
      title: "Your forecast is waiting",
      description:
        "Check in a few times and we'll look for patterns in your emotional weather.",
      confidence: "Not enough data yet",
    };
  }

  const recentEntries = entries.slice(-3);

  const values = recentEntries
    .map((entry) => moodValues[entry.mood])
    .filter(Boolean);

  const average =
    values.reduce((sum, value) => sum + value, 0) /
    values.length;

  let weather;
  let emoji;
  let title;
  let description;

  if (average >= 4.5) {
    weather = "sunny";
    emoji = "☀️";
    title = "Sunny outlook";
    description =
      "Your recent skies have been bright. Keep doing what seems to be working for you.";
  } else if (average >= 3.5) {
    weather = "partly-sunny";
    emoji = "🌤️";
    title = "Partly sunny outlook";
    description =
      "Your recent weather looks fairly positive, with a few clouds mixed in.";
  } else if (average >= 2.5) {
    weather = "cloudy";
    emoji = "☁️";
    title = "Cloudy outlook";
    description =
      "Your recent check-ins have been fairly neutral. Give yourself room to notice what changes.";
  } else if (average >= 1.5) {
    weather = "rainy";
    emoji = "🌧️";
    title = "Rainy outlook";
    description =
      "Your recent skies have been heavier. Consider slowing down and giving yourself some extra care.";
  } else {
    weather = "stormy";
    emoji = "⛈️";
    title = "Stormy outlook";
    description =
      "Your recent check-ins have been difficult. Remember that today's weather isn't a permanent forecast.";
  }

  return {
    weather,
    emoji,
    title,
    description,
    confidence:
      recentEntries.length >= 3
        ? "Based on your last 3 check-ins"
        : `Based on your last ${recentEntries.length} check-in${
            recentEntries.length === 1 ? "" : "s"
          }`,
  };
}