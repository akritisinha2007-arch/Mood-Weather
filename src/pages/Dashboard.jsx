import { useEffect, useState } from "react";
import { getWeatherFromMood } from "../utils/moodWeather";
import { calculateInsights } from "../utils/insights";
import { generateForecast } from "../utils/forecast";
import {
  calculateStreak,
  calculateConsistency,
} from "../utils/streak";


function getDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}


function getLastSevenDays() {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - i);

    days.push({
      date,
      dateKey: getDateKey(date),
    });
  }

  return days;
}


function Dashboard({
  onNewCheckIn,
  demoMode,
  onExitDemo,
}) {
  const [entries, setEntries] = useState([]);

  /*
   * Load saved entries safely.
   * If localStorage contains corrupted data,
   * the dashboard will simply start with an empty list.
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("moodEntries");

      if (!saved) {
        setEntries([]);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setEntries(parsed);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error(
        "Could not load mood entries:",
        error
      );

      setEntries([]);
    }
  }, []);


  const latest = entries[entries.length - 1];

  const sevenDays = getLastSevenDays();


  /*
   * If multiple entries exist on the same day,
   * use the latest one.
   */
  const entriesByDate = {};

  entries.forEach((entry) => {
    if (entry.dateKey) {
      entriesByDate[entry.dateKey] = entry;
    }
  });


  const weeklyEntries = sevenDays
    .map((day) => entriesByDate[day.dateKey])
    .filter(Boolean);


  const completedDays = weeklyEntries.length;

  const insightsData =
    calculateInsights(weeklyEntries);

  const forecast =
    generateForecast(entries);

  const streak =
    calculateStreak(entries);

  const consistency =
    calculateConsistency(entries);


  /*
   * Calculate a simple emotional climate.
   */
  const moodValues = {
    sunny: 5,
    "partly-sunny": 4,
    cloudy: 3,
    rainy: 2,
    stormy: 1,
  };


  const averageMood =
    weeklyEntries.length > 0
      ? weeklyEntries.reduce(
          (sum, entry) =>
            sum + (moodValues[entry.mood] || 3),
          0
        ) / weeklyEntries.length
      : 0;


  let climate =
    "Waiting for your first check-in";


  if (averageMood >= 4.5) {
    climate = "Mostly sunny";
  } else if (averageMood >= 3.5) {
    climate = "Partly cloudy";
  } else if (averageMood >= 2.5) {
    climate = "Cloudy";
  } else if (averageMood >= 1.5) {
    climate = "A little rainy";
  } else if (averageMood > 0) {
    climate = "Stormy";
  }


  /*
   * EMPTY STATE
   *
   * Shown when the user has not made
   * their first check-in yet.
   */
  if (!latest) {
    return (
      <div className="weather-scene cloudy">

        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>


        <main
          id="main-content"
          className="dashboard-empty"
        >

          <div
            className="empty-weather"
            aria-hidden="true"
          >
            🌥️
          </div>


          <span className="eyebrow">
            YOUR WEATHER JOURNEY
          </span>


          <h1>
            Your sky is waiting.
          </h1>


          <p>
            Check in with how you're feeling today.
            Your first check-in will become the beginning
            of your emotional weather history.
          </p>


          <button
            type="button"
            className="primary-button"
            onClick={onNewCheckIn}
          >
            Check in today →
          </button>

        </main>

      </div>
    );
  }


  const weather =
    getWeatherFromMood(latest.mood);


  const moodMessages = {
    Sunny:
      "Looks like the sun is shining in your world today.",

    "Partly Sunny":
      "A little sunshine with some clouds — that's okay.",

    Cloudy:
      "Some days are simply cloudy. Give yourself some space.",

    Rainy:
      "It's okay to have rainy days. They don't last forever.",

    Stormy:
      "Storms pass. Be gentle with yourself today.",
  };


  return (
    <div
      className={`weather-scene ${latest.mood}`}
    >

      {/* Decorative weather visuals */}
      <div
        className="sky-glow"
        aria-hidden="true"
      />

      <div
        className="cloud cloud-one"
        aria-hidden="true"
      />

      <div
        className="cloud cloud-two"
        aria-hidden="true"
      />

      <div
        className="cloud cloud-three"
        aria-hidden="true"
      />


      <div
        className="rain-layer"
        aria-hidden="true"
      >
        {Array.from({ length: 35 }).map(
          (_, index) => (
            <span key={index} />
          )
        )}
      </div>


      <main
        id="main-content"
        className="dashboard-container"
      >

        {/* =====================================
            NAVBAR
        ===================================== */}

        <nav
          className="top-nav"
          aria-label="Main navigation"
        >

          <div className="brand">

            <div
              className="brand-icon"
              aria-hidden="true"
            >
              ☁️
            </div>

            <span>
              Mood Weather
            </span>

          </div>


          <div className="nav-actions">

            {demoMode && (
              <span
                className="demo-badge"
                aria-label="Demo mode is active"
              >
                ✨ Demo Mode
              </span>
            )}


            <button
              type="button"
              className="new-checkin"
              onClick={onNewCheckIn}
            >
              + New check-in
            </button>

          </div>

        </nav>


        {/* =====================================
            HERO
        ===================================== */}

        <section
          className="dashboard-hero"
          aria-labelledby="weather-heading"
        >

          <div className="eyebrow">
            YOUR EMOTIONAL WEATHER
          </div>


          <p className="today-label">
            Today,{" "}
            {new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
              }
            )}
          </p>


          <div className="main-weather">

            <div
              className="big-weather-icon"
              aria-hidden="true"
            >
              {weather.emoji}
            </div>


            <div>

              <h1 id="weather-heading">
                {weather.weather}
              </h1>


              <p>
                {moodMessages[weather.weather]}
              </p>

            </div>

          </div>


          {latest.note && (
            <div className="note-card">

              <div
                className="note-icon"
                aria-hidden="true"
              >
                ✦
              </div>


              <div>

                <span>
                  Your reflection
                </span>


                <p>
                  "{latest.note}"
                </p>

              </div>

            </div>
          )}

        </section>


        {/* =====================================
            STATS
        ===================================== */}

        <section
          className="stats-grid"
          aria-label="Your mood statistics"
        >

          <div className="stat-card">

            <div
              className="stat-icon"
              aria-hidden="true"
            >
              🔥
            </div>


            <div>

              <span>
                Current streak
              </span>


              <strong>
                {streak} day
                {streak !== 1 ? "s" : ""}
              </strong>


              <small>
                Keep checking in
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div
              className="stat-icon"
              aria-hidden="true"
            >
              📅
            </div>


            <div>

              <span>
                Weekly consistency
              </span>


              <strong>
                {consistency}%
              </strong>


              <small>
                Last 7 days
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div
              className="stat-icon"
              aria-hidden="true"
            >
              🌦️
            </div>


            <div>

              <span>
                Check-ins
              </span>


              <strong>
                {entries.length}
              </strong>


              <small>
                Total reflections
              </small>

            </div>

          </div>

        </section>


        {/* =====================================
            7 DAY WEATHER
        ===================================== */}

        <section
          className="history-card"
          aria-labelledby="history-heading"
        >

          <div className="section-header">

            <div>

              <div className="eyebrow">
                LAST 7 DAYS
              </div>


              <h2 id="history-heading">
                Your emotional weather
              </h2>

            </div>


            <span className="history-count">
              {completedDays}/7 days
            </span>

          </div>


          <div
            className="seven-day-weather"
            aria-label="Seven day emotional weather history"
          >

            {sevenDays.map((day) => {

              const entry =
                entriesByDate[day.dateKey];


              const isToday =
                day.dateKey ===
                getDateKey(new Date());


              /*
               * Empty day
               */

              if (!entry) {

                return (
                  <div
                    className={`weather-day empty-day ${
                      isToday ? "today" : ""
                    }`}
                    key={day.dateKey}
                  >

                    <span className="day-name">
                      {isToday
                        ? "Today"
                        : day.date.toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                            }
                          )}
                    </span>


                    <div
                      className="weather-day-icon"
                      aria-hidden="true"
                    >
                      —
                    </div>


                    <span className="day-status">
                      No check-in
                    </span>

                  </div>
                );
              }


              const entryWeather =
                getWeatherFromMood(entry.mood);


              return (
                <div
                  className={`weather-day ${
                    isToday ? "today" : ""
                  }`}
                  key={day.dateKey}
                  aria-label={`${
                    isToday
                      ? "Today"
                      : day.date.toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                          }
                        )
                  }: ${entryWeather.weather}`}
                >

                  <span className="day-name">
                    {isToday
                      ? "Today"
                      : day.date.toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                          }
                        )}
                  </span>


                  <div
                    className="weather-day-icon"
                    aria-hidden="true"
                  >
                    {entryWeather.emoji}
                  </div>


                  <span className="day-status">
                    {entryWeather.weather}
                  </span>

                </div>
              );

            })}

          </div>

        </section>


        {/* =====================================
            TRANSPARENT FORECAST
        ===================================== */}

        <section
          className="forecast-card"
          aria-labelledby="forecast-heading"
        >

          <div
            className="forecast-icon"
            aria-hidden="true"
          >
            {forecast.emoji}
          </div>


          <div className="forecast-content">

            <div className="eyebrow">
              YOUR PERSONAL FORECAST
            </div>


            <h2 id="forecast-heading">
              {forecast.title}
            </h2>


            <p>
              {forecast.description}
            </p>


            <span className="forecast-source">
              ✦ {forecast.confidence}
            </span>

          </div>

        </section>


        {/* =====================================
            PATTERN INSIGHTS
        ===================================== */}

        <section
          className="insights-section"
          aria-labelledby="insights-heading"
        >

          <div className="section-header">

            <div>

              <div className="eyebrow">
                PATTERN INSIGHTS
              </div>


              <h2 id="insights-heading">
                What your skies are showing
              </h2>

            </div>

          </div>


          <div className="insights-grid">

            {insightsData.insights.map(
              (insight, index) => (

                <div
                  className="insight-card"
                  key={index}
                >

                  <div
                    className="insight-icon"
                    aria-hidden="true"
                  >
                    {insight.icon}
                  </div>


                  <div>

                    <h3>
                      {insight.title}
                    </h3>


                    <p>
                      {insight.text}
                    </p>


                    <span className="insight-label">
                      Based on your check-ins
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* =====================================
            WEEKLY SUMMARY
        ===================================== */}

        <section
          className="weekly-summary"
          aria-labelledby="climate-heading"
        >

          <div
            className="summary-icon"
            aria-hidden="true"
          >
            🌤️
          </div>


          <div className="summary-content">

            <span className="eyebrow">
              YOUR WEEKLY CLIMATE
            </span>


            <h2 id="climate-heading">
              {climate}
            </h2>


            <p>
              You've checked in on{" "}
              <strong>
                {completedDays} of the last 7 days
              </strong>
              . Keep noticing your patterns —
              not judging them.
            </p>

          </div>


          <div
            className="completion-ring"
            aria-label={`${Math.round(
              (completedDays / 7) * 100
            )}% checked in`}
          >

            <span>
              {Math.round(
                (completedDays / 7) * 100
              )}%
            </span>


            <small>
              checked in
            </small>

          </div>

        </section>


        {/* =====================================
            DEMO MODE
        ===================================== */}

        {demoMode && (

          <div className="demo-exit">

            <p>
              You're exploring sample data.
            </p>


            <button
              type="button"
              onClick={onExitDemo}
            >
              Return to my weather
            </button>

          </div>

        )}


        {/* =====================================
            FOOTER
        ===================================== */}

        <footer className="dashboard-footer">

          <span aria-hidden="true">
            🌦️
          </span>

          Your emotional weather changes.
          That's human.

        </footer>


      </main>

    </div>
  );
}


export default Dashboard;