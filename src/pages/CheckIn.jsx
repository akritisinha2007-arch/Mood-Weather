import { useState } from "react";
import { moods } from "../data/moods";

function CheckIn({ onComplete, onDemo }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");

  const selectedMoodData = moods.find(
    (mood) => mood.id === selectedMood
  );

  const handleSubmit = () => {
    if (!selectedMood) return;

    // const entry = {
    //   id: Date.now(),
    //   mood: selectedMood,
    //   note,
    //   date: new Date().toISOString(),
    // };
    const now = new Date();

const dateKey = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
].join("-");

const entry = {
  id: Date.now(),
  mood: selectedMood,
  note,
  date: now.toISOString(),
  dateKey,
};

    const existingEntries =
      JSON.parse(localStorage.getItem("moodEntries")) || [];

    localStorage.setItem(
      "moodEntries",
      JSON.stringify([...existingEntries, entry])
    );

    onComplete();
  };

  return (
    <div
      className={`weather-scene ${
        selectedMood || "cloudy"
      }`}
    >
      {/* Atmospheric elements */}
      <div className="sky-glow" />

      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <div className="cloud cloud-three" />

      <div className="rain-layer">
        {Array.from({ length: 35 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="stars">
        {Array.from({ length: 25 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <main className="checkin-container">

        <div className="brand">
          <div className="brand-icon">☁️</div>
          <span>Mood Weather</span>
        </div>

        <div className="checkin-card">

          <div className="eyebrow">
            DAILY CHECK-IN
          </div>

          <h1>
            How's your
            <span> sky </span>
            today?
          </h1>

          <p className="subtitle">
            Take a moment to check in with yourself.
            <br />
            There are no right or wrong answers.
          </p>

          <div className="mood-grid">
            {moods.map((mood) => (
             <button
  type="button"
  className={`mood-option ${
    selectedMood === mood.id ? "selected" : ""
  }`}
  onClick={() => setSelectedMood(mood.id)}
  aria-label={`Feeling ${mood.label}`}
  aria-pressed={selectedMood === mood.id}
>
  <span
    className="mood-emoji"
    aria-hidden="true"
  >
    {mood.emoji}
  </span>

  <span className="mood-label">
    {mood.label}
  </span>
</button>
            ))}
          </div>

          {selectedMoodData && (
            <div className="selected-message">
              <span>{selectedMoodData.emoji}</span>
              <div>
                <strong>
                  {selectedMoodData.weather} skies
                </strong>
                <p>
                  {selectedMoodData.description}
                </p>
              </div>
            </div>
          )}

          <label
  htmlFor="reflection"
  className="sr-only"
>
  Optional reflection
</label>

<textarea
  id="reflection"
  name="reflection"
  value={note}
  onChange={(e) => setNote(e.target.value)}
  placeholder="Add a reflection if you'd like..."
  aria-describedby="reflection-help"
/>

<p
  id="reflection-help"
  className="input-help"
>
  Optional — you can check in without writing anything.
</p>

          <button
            className="primary-button"
            onClick={handleSubmit}
            disabled={!selectedMood}
          >
            <span>Save today's weather</span>
            <span className="button-arrow">→</span>
          </button>

          <p className="privacy-note">
            🔒 Your reflections stay on your device.
          </p>

          <div className="demo-divider">
  <span>or</span>
</div>

<button
  className="demo-button"
  onClick={onDemo}
>
  ✨ Explore a sample week
</button>

<p className="demo-description">
  See how Mood Weather works with a full week of sample data.
</p>

        </div>

      </main>
    </div>
  );
}

export default CheckIn;