import { useState, useEffect, useMemo } from "react";
import { useProgress } from "../contexts/useProgress";
import { useStudyTimer } from "../hooks/useStudyTimer";
import LearningPath from "../components/LearningPath";
import "./Dashboard.css";

export default function Dashboard() {
  const { state, getDailyGoalProgress } = useProgress();
  const { isActive, start, pause, formatTime } = useStudyTimer();
  const cachedWordOfDay =
    state.wordOfDay?.date === new Date().toISOString().split("T")[0]
      ? state.wordOfDay.word
      : null;
  const [wordOfDay, setWordOfDay] = useState(cachedWordOfDay);

  // Load word of the day
  useEffect(() => {
    if (wordOfDay) return;
    Promise.all([
      fetch("/data/vocabulary/a1-general.json").then((r) => r.json()),
      fetch("/data/vocabulary/a2-general.json").then((r) => r.json()),
      fetch("/data/vocabulary/b1-general.json").then((r) => r.json()),
    ])
      .then(([g1, g2, gb1]) => {
        const words = [...g1, ...g2, ...gb1];
        const dayIndex = new Date().getDate() % words.length;
        setWordOfDay(words[dayIndex]);
      })
      .catch(() => {});
  }, [wordOfDay]);

  const dailyProgress = getDailyGoalProgress();

  const stats = useMemo(() => {
    const vocabEntries = Object.values(state.vocabulary);
    const learnedWords = vocabEntries.filter((v) => v.learned).length;
    const totalReviews = vocabEntries.reduce(
      (sum, v) => sum + v.timesCorrect + v.timesWrong,
      0,
    );
    const grammarDone = Object.values(state.grammar).filter(
      (g) => g.completed,
    ).length;
    return {
      learnedWords,
      totalReviews,
      grammarDone,
      badges: state.badges.length,
    };
  }, [state.vocabulary, state.grammar, state.badges]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Hoş Geldiniz, Kaptan! ✈️</h1>
        <p>Bugün İngilizce öğrenmeye devam edelim</p>
      </div>

      {/* Stats Row */}
      <div className="grid-4 dashboard-stats">
        <div
          className="stat-card animate-slide-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="stat-icon">🌟</div>
          <div className="stat-value">{state.totalXP}</div>
          <div className="stat-label">Toplam XP</div>
        </div>
        <div
          className="stat-card animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{state.streak.current}</div>
          <div className="stat-label">Günlük Seri</div>
        </div>
        <div
          className="stat-card animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="stat-icon">📚</div>
          <div className="stat-value">{stats.learnedWords}</div>
          <div className="stat-label">Öğrenilen Kelime</div>
        </div>
        <div
          className="stat-card animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{stats.badges}</div>
          <div className="stat-label">Rozet</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Daily Goals */}
        <div
          className="card dashboard-goals animate-slide-up"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="card-header">
            <h2>🎯 Günlük Hedefler</h2>
            <span className="badge badge-gold">
              {Math.round(dailyProgress.overall)}%
            </span>
          </div>
          <div className="goal-list">
            <div className="goal-item">
              <div className="goal-info">
                <span>📚 Kelime Tekrarı</span>
                <span className="goal-count">
                  {state.dailyGoals.todayWords}/{state.dailyGoals.wordsToReview}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${dailyProgress.wordPct}%` }}
                ></div>
              </div>
            </div>
            <div className="goal-item">
              <div className="goal-info">
                <span>✏️ Ders Tamamlama</span>
                <span className="goal-count">
                  {state.dailyGoals.todayLessons}/
                  {state.dailyGoals.lessonsToComplete}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${dailyProgress.lessonPct}%` }}
                ></div>
              </div>
            </div>
            <div className="goal-item">
              <div className="goal-info">
                <span>⏱️ Çalışma Süresi</span>
                <span className="goal-count">
                  {state.dailyGoals.todayMinutes}/
                  {state.dailyGoals.minutesToStudy} dk
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${dailyProgress.minutePct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Timer */}
        <div
          className="card dashboard-timer animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="card-header">
            <h2>⏱️ Çalışma Zamanlayıcı</h2>
          </div>
          <div className="timer-display">
            <span className="timer-time">{formatTime()}</span>
          </div>
          <div className="timer-controls">
            {!isActive ? (
              <button className="btn btn-primary btn-lg" onClick={start}>
                ▶ Başla
              </button>
            ) : (
              <button className="btn btn-secondary btn-lg" onClick={pause}>
                ⏸ Duraklat
              </button>
            )}
          </div>
        </div>

        {/* Word of the Day */}
        {wordOfDay && (
          <div
            className="card dashboard-wod animate-slide-up"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="card-header">
              <h2>💡 Günün Kelimesi</h2>
              <span className="badge badge-blue">{state.currentLevel}</span>
            </div>
            <div className="wod-content">
              <div className="wod-word">{wordOfDay.en}</div>
              <div className="wod-pronunciation">{wordOfDay.pronunciation}</div>
              <div className="wod-meaning">{wordOfDay.tr}</div>
              <div className="wod-example">
                <p className="wod-example-en">"{wordOfDay.example}"</p>
                <p className="wod-example-tr">{wordOfDay.exampleTr}</p>
              </div>
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div
          className="card dashboard-level animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="card-header">
            <h2>📊 Seviye İlerlemesi</h2>
          </div>
          <div className="level-progress-container">
            {["A1", "A2", "B1", "B2"].map((level, i) => {
              const isActive = state.currentLevel === level;
              const isPast =
                ["A1", "A2", "B1", "B2"].indexOf(state.currentLevel) > i;
              return (
                <div
                  key={level}
                  className={`level-step ${isActive ? "level-step-active" : ""} ${isPast ? "level-step-done" : ""}`}
                >
                  <div className={`level-dot level-${level.toLowerCase()}`}>
                    {isPast ? "✓" : level}
                  </div>
                  <span className="level-step-label">{level}</span>
                </div>
              );
            })}
            <div className="level-line"></div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <LearningPath />
    </div>
  );
}
