import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Vocabulary from "./pages/Vocabulary";
import Grammar from "./pages/Grammar";
import Listening from "./pages/Listening";
import Reading from "./pages/Reading";
import Aviation from "./pages/Aviation";
import MockExam from "./pages/MockExam";
import Notes from "./pages/Notes";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import HRPeak from "./pages/HRPeak";
import "./index.css";

export default function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/grammar" element={<Grammar />} />
                <Route path="/listening" element={<Listening />} />
                <Route path="/reading" element={<Reading />} />
                <Route path="/aviation" element={<Aviation />} />
                <Route path="/mock-exam" element={<MockExam />} />
                <Route path="/hrpeak" element={<HRPeak />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ProgressProvider>
    </ThemeProvider>
  );
}
