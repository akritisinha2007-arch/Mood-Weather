function getDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function calculateStreak(entries) {
  if (!entries || entries.length === 0) {
    return 0;
  }

  const dateKeys = new Set(
    entries
      .map((entry) => entry.dateKey)
      .filter(Boolean)
  );

  let streak = 0;

  const currentDate = new Date();
  currentDate.setHours(12, 0, 0, 0);

  /*
   * If there isn't a check-in today,
   * start counting from yesterday.
   */
  const todayKey = getDateKey(currentDate);

  if (!dateKeys.has(todayKey)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (dateKeys.has(getDateKey(currentDate))) {
    streak++;

    currentDate.setDate(
      currentDate.getDate() - 1
    );
  }

  return streak;
}

export function calculateConsistency(entries) {
  if (!entries || entries.length === 0) {
    return 0;
  }

  const uniqueDays = new Set(
    entries
      .map((entry) => entry.dateKey)
      .filter(Boolean)
  );

  return Math.min(
    100,
    Math.round((uniqueDays.size / 7) * 100)
  );
}