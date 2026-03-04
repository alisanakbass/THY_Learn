import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProgress } from "../contexts/useProgress";
import { useSpeech } from "../hooks/useSpeech";
import "./Listening.css";

export default function Listening() {
  const location = useLocation();
  const { state, dispatch } = useProgress();
  const { speak, speakSlow, speaking, stop } = useSpeech();
  const [exercises, setExercises] = useState([]);
  const [activeExercise, setActiveExercise] = useState(null);
  const [, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [blankAnswers, setBlankAnswers] = useState({});
  const [blankResults, setBlankResults] = useState({});
  const [mode, setMode] = useState("quiz"); // quiz, fillBlank

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
            setBlankResults({});
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

  const checkBlanks = () => {
    const results = {};
    activeExercise.fillBlanks.forEach((fb, i) => {
      results[i] =
        (blankAnswers[i] || "").toLowerCase().trim() ===
        fb.answer.toLowerCase();
    });
    setBlankResults(results);
  };

  const handleBack = () => {
    setActiveExercise(null);
    setCurrentQ(0);
    setAnswers({});
    setShowResults(false);
    setShowTranscript(false);
    setBlankAnswers({});
    setBlankResults({});
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
    <div className="page-container animate-fade-in">
      <button
        className="btn btn-secondary"
        onClick={handleBack}
        style={{ marginBottom: "var(--space-lg)" }}
      >
        ← Geri
      </button>

      <div className="listening-exercise">
        <h2>{activeExercise.title}</h2>

        {/* Audio Controls */}
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
              {showTranscript ? "🙈 Metni Gizle" : "👁️ Metni Göster"}
            </button>
          </div>
          {showTranscript && (
            <div className="transcript">
              <p className="transcript-en">{activeExercise.text}</p>
              <p className="transcript-tr">{activeExercise.textTr}</p>
            </div>
          )}
        </div>

        {/* Mode Tabs */}
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
                  ✅ Cevapları Kontrol Et
                </button>
              )}
            {showResults && (
              <div className="listening-result card">
                <h3>🎉 Sonuçlar</h3>
                <p>
                  {
                    activeExercise.questions.filter(
                      (q, i) => answers[i] === q.answer,
                    ).length
                  }
                  /{activeExercise.questions.length} doğru
                </p>
              </div>
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
                {blankResults[i] !== undefined && (
                  <span
                    className={
                      blankResults[i] ? "feedback-correct" : "feedback-wrong"
                    }
                    style={{
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: "var(--fs-sm)",
                    }}
                  >
                    {blankResults[i]
                      ? "✅ Doğru!"
                      : `❌ Doğru cevap: ${fb.answer}`}
                  </span>
                )}
              </div>
            ))}
            <button
              className="btn btn-primary"
              onClick={checkBlanks}
              style={{ marginTop: "var(--space-md)" }}
            >
              ✅ Kontrol Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
