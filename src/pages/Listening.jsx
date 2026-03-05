import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProgress } from "../contexts/useProgress";
import { useSpeech } from "../hooks/useSpeech";
import WordDetailDrawer from "../components/WordDetailDrawer";
import "./Listening.css";

export default function Listening() {
  const location = useLocation();
  const { state, dispatch, findWord } = useProgress();
  const { speak, speakSlow, speaking, stop } = useSpeech();
  const [exercises, setExercises] = useState([]);
  const [activeExercise, setActiveExercise] = useState(null);
  const [, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [blankAnswers, setBlankAnswers] = useState({});
  const [mode, setMode] = useState("quiz"); // quiz, fillBlank
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/listening/a1-exercises.json").then((r) => r.json()),
      fetch("/data/listening/a2-exercises.json").then((r) => r.json()),
      fetch("/data/listening/b1-exercises.json").then((r) => r.json()),
    ])
      .then(([a1, a2, b1]) => {
        const allExercises = [...a1, ...a2, ...b1];
        setExercises(allExercises);

        if (location.state?.startLesson) {
          const target = allExercises.find(
            (ex) => ex.id === location.state.startLesson,
          );
          if (target) {
            setActiveExercise(target);
            setCurrentQ(0);
            setAnswers({});
            setShowResults(false);
            setShowTranscript(false);
            setBlankAnswers({});
          }
        }
      })
      .catch(console.error);
  }, [location.state]);

  const handlePlay = (text, slow = false) => {
    if (speaking) {
      stop();
      return;
    }
    slow ? speakSlow(text) : speak(text);
  };

  const handleAnswer = (qIndex, optIndex) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const checkAnswers = () => {
    setShowResults(true);
    const correct = activeExercise.questions.filter(
      (q, i) => answers[i] === q.answer,
    ).length;
    const score = Math.round((correct / activeExercise.questions.length) * 100);
    dispatch({
      type: "COMPLETE_LISTENING",
      payload: { exerciseId: activeExercise.id, score },
    });
    dispatch({ type: "UPDATE_STREAK" });
  };

  const handleWordClick = (word) => {
    const clean = word.replace(/[.,!?;:'"()\n]/g, "").toLowerCase();
    if (clean) {
      speak(clean);
      const found = findWord(clean);
      if (found) setSelectedWord(found);
      else
        setSelectedWord({
          en: clean,
          tr: "Bilinmeyen kelime",
          category: "Sözlük",
        });
    }
  };

  const handleBack = () => {
    setActiveExercise(null);
    setCurrentQ(0);
    setAnswers({});
    setShowResults(false);
    setShowTranscript(false);
    setBlankAnswers({});
    stop();
  };

  if (!activeExercise) {
    return (
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <h1>Dinleme Çalışması 🎧</h1>
          <p>Havacılık anonslarını dinleyin ve anlayın</p>
        </div>
        <div className="listening-grid">
          {exercises.map((ex, i) => {
            const done = state.listening[ex.id]?.completed;
            return (
              <div
                key={ex.id}
                className={`card listening-card ${done ? "listening-done" : ""}`}
                onClick={() => setActiveExercise(ex)}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  animation: "fadeIn 0.4s ease forwards",
                  opacity: 0,
                }}
              >
                <div className="listening-card-header">
                  <span className="listening-type">
                    {ex.type === "announcement"
                      ? "📢"
                      : ex.type === "pilot_announcement"
                        ? "✈️"
                        : "🛡️"}
                  </span>
                  {done && (
                    <span className="badge badge-green">
                      ✓ %{state.listening[ex.id]?.score}
                    </span>
                  )}
                </div>
                <h3>{ex.title}</h3>
                <div className="listening-card-footer">
                  <span className="badge badge-blue">{ex.level}</span>
                  <span>{ex.questions.length} soru</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`page-container animate-fade-in ${selectedWord ? "drawer-open" : ""}`}
    >
      <div className="vocab-content-wrapper">
        <div className="vocab-main-area">
          <button
            className="btn btn-secondary"
            onClick={handleBack}
            style={{ marginBottom: "var(--space-lg)" }}
          >
            ← Geri
          </button>

          <div className="listening-exercise">
            <h2>{activeExercise.title}</h2>

            <div className="audio-controls card">
              <p className="audio-instruction">
                Aşağıdaki butona tıklayarak metni dinleyin:
              </p>
              <div className="audio-buttons">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => handlePlay(activeExercise.text)}
                >
                  {speaking ? "⏹️ Durdur" : "▶️ Dinle"}
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => handlePlay(activeExercise.text, true)}
                >
                  🐌 Yavaş Dinle
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  {showTranscript ? "🙈 Gizle" : "👁️ Metin"}
                </button>
              </div>
              {showTranscript && (
                <div className="transcript">
                  <p className="transcript-en">
                    {activeExercise.text.split(" ").map((word, i) => (
                      <span
                        key={i}
                        className="clickable-word"
                        onClick={() => handleWordClick(word)}
                      >
                        {word}{" "}
                      </span>
                    ))}
                  </p>
                  <p className="transcript-tr">{activeExercise.textTr}</p>
                </div>
              )}
            </div>

            <div className="tabs" style={{ marginTop: "var(--space-lg)" }}>
              <button
                className={`tab ${mode === "quiz" ? "active" : ""}`}
                onClick={() => setMode("quiz")}
              >
                ❓ Sorular
              </button>
              <button
                className={`tab ${mode === "fillBlank" ? "active" : ""}`}
                onClick={() => setMode("fillBlank")}
              >
                📝 Boşluk Doldur
              </button>
            </div>

            {mode === "quiz" ? (
              <div className="listening-questions">
                {activeExercise.questions.map((q, qi) => (
                  <div key={qi} className="question-card card">
                    <p className="question-text">
                      {qi + 1}. {q.question}
                    </p>
                    <div className="question-options">
                      {q.options.map((opt, oi) => (
                        <button
                          key={oi}
                          className={`quiz-option ${answers[qi] === oi ? "selected" : ""} ${showResults ? (oi === q.answer ? "correct" : answers[qi] === oi ? "wrong" : "") : ""}`}
                          onClick={() => handleAnswer(qi, oi)}
                          disabled={showResults}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {!showResults &&
                  Object.keys(answers).length ===
                    activeExercise.questions.length && (
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={checkAnswers}
                      style={{ marginTop: "var(--space-lg)" }}
                    >
                      ✅ Kontrol Et
                    </button>
                  )}
              </div>
            ) : (
              <div className="fill-blank-section">
                {activeExercise.fillBlanks.map((fb, i) => (
                  <div key={i} className="fill-blank-item card">
                    <p className="fill-blank-text">
                      {fb.text.split("___").map((part, pi, arr) => (
                        <span key={pi}>
                          {part}
                          {pi < arr.length - 1 && (
                            <input
                              className="input fill-blank-input"
                              value={blankAnswers[i] || ""}
                              onChange={(e) =>
                                setBlankAnswers((prev) => ({
                                  ...prev,
                                  [i]: e.target.value,
                                }))
                              }
                              placeholder="..."
                              style={{
                                width: "120px",
                                display: "inline-block",
                                margin: "0 var(--space-xs)",
                              }}
                            />
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <WordDetailDrawer
          selectedWord={selectedWord}
          onClose={() => setSelectedWord(null)}
        />
      </div>
    </div>
  );
}
