function getDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function createDemoWeek() {
  const demoMoods = [
    {
      mood: "sunny",
      note: "Started the week feeling motivated and got a lot done.",
    },
    {
      mood: "partly-sunny",
      note: "Pretty good day, although I felt a little tired.",
    },
    {
      mood: "cloudy",
      note: "Lots of work today. My energy was lower than usual.",
    },
    {
      mood: "rainy",
      note: "Everything felt a little overwhelming today.",
    },
    {
      mood: "cloudy",
      note: "Still a busy day, but I managed to slow down a little.",
    },
    {
      mood: "partly-sunny",
      note: "Spent some time doing things I enjoy. Feeling better.",
    },
    {
      mood: "sunny",
      note: "Feeling refreshed and proud of how the week turned out.",
    },
  ];

  const today = new Date();

  return demoMoods.map((item, index) => {
    const date = new Date(today);

    date.setHours(12, 0, 0, 0);
    date.setDate(today.getDate() - (6 - index));

    return {
      id: `demo-${index}`,
      mood: item.mood,
      note: item.note,
      date: date.toISOString(),
      dateKey: getDateKey(date),
      isDemo: true,
    };
  });
}