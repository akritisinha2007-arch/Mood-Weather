import { useState } from "react";
import CheckIn from "./pages/CheckIn";
import Dashboard from "./pages/Dashboard";
import { createDemoWeek } from "./utils/demoData";
import "./index.css";

function App() {
  const [page, setPage] = useState("checkin");
  const [demoMode, setDemoMode] = useState(false);

  const startDemo = () => {
    const demoEntries = createDemoWeek();

    localStorage.setItem(
      "moodEntries",
      JSON.stringify(demoEntries)
    );

    setDemoMode(true);
    setPage("dashboard");
  };

  const exitDemo = () => {
    localStorage.removeItem("moodEntries");

    setDemoMode(false);
    setPage("checkin");
  };

  return (
    <div className="app">

      {page === "checkin" && (
        <CheckIn
          onComplete={() => setPage("dashboard")}
          onDemo={startDemo}
        />
      )}

      {page === "dashboard" && (
        <Dashboard
          onNewCheckIn={() => setPage("checkin")}
          demoMode={demoMode}
          onExitDemo={exitDemo}
        />
      )}

    </div>
  );
}

export default App;