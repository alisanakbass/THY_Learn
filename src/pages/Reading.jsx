import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProgress } from "../contexts/useProgress";
import { useSpeech } from "../hooks/useSpeech";
import "./Reading.css";

export default function Reading() {
  const location = useLocation();
  const { state, dispatch } = useProgress();
  const { speak, speaking, stop } = useSpeech();
  const [passages, setPassages] = useState([]);
  const [activePassage, setActivePassage] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/reading/a1-passages.json").then((r) => r.json()),
      fetch("/data/reading/a2-passages.json").then((r) => r.json()),
      fetch("/data/reading/b1-passages.json").then((r) => r.json()),
    ])
      .then(([a1, a2, b1]) => {
        const allPassages = [...a1, ...a2, ...b1];
        setPassages(allPassages);

        if (location.state?.startLesson) {
          const target = allPassages.find(
            (p) => p.id === location.state.startLesson,
          );
          if (target) {
            setActivePassage(target);
            setAnswers({});
            setShowResults(false);
            setShowTranslation(false);
          }
        }
      })
      .catch(console.error);
  }, [location.state]);

  const handleAnswer = (qi, oi) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
  };

  const checkAnswers = () => {
    setShowResults(true);
    const correct = activePassage.questions.filter(
      (q, i) => answers[i] === q.answer,
    ).length;
    const score = Math.round((correct / activePassage.questions.length) * 100);
    dispatch({
      type: "COMPLETE_READING",
      payload: { passageId: activePassage.id, score },
    });
    dispatch({ type: "UPDATE_STREAK" });
  };

  const handleWordClick = (word) => {
    const clean = word.replace(/[.,!?;:'"()\n]/g, "").toLowerCase();
    if (clean) {
      setHighlightedWord(clean);
      speak(clean);
    }
  };

  if (!activePassage) {
    return (
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <h1>Okuma Çalışması 📖</h1>
          <p>Metinleri okuyun, anlayın ve kelimeleri öğrenin</p>
        </div>
        <div className="reading-grid">
          {passages.map((p, i) => {
            const done = state.reading[p.id]?.completed;
            return (
              <div
                key={p.id}
                className={`card reading-card ${done ? "reading-done" : ""}`}
                onClick={() => {
                  setActivePassage(p);
                  setAnswers({});
                  setShowResults(false);
                  setShowTranslation(false);
                }}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  animation: "fadeIn 0.4s ease forwards",
                  opacity: 0,
                }}
              >
                <div className="reading-card-icon">
                  {p.category === "aviation" ? "✈️" : "📄"}
                </div>
                <h3>{p.title}</h3>
                <p className="reading-preview">{p.text.substring(0, 100)}...</p>
                <div className="reading-card-footer">
                  <span className="badge badge-blue">{p.level}</span>
                  {done && (
                    <span className="badge badge-green">
                      ✓ %{state.reading[p.id]?.score}
                    </span>
                  )}
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
        onClick={() => {
          setActivePassage(null);
          stop();
        }}
        style={{ marginBottom: "var(--space-lg)" }}
      >
        ← Geri
      </button>

      <div className="reading-content">
        <div className="reading-passage-section">
          <div className="card reading-passage">
            <div className="reading-passage-header">
              <h2>{activePassage.title}</h2>
              <div className="reading-tools">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => speak(activePassage.text)}
                >
                  {speaking ? "⏹️ Durdur" : "🔊 Sesli Oku"}
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  {showTranslation ? "🙈 Çeviriyi Gizle" : "🌍 Çeviriyi Göster"}
                </button>
              </div>
            </div>
            <div className="reading-text">
              {activePassage.text.split("\n\n").map((paragraph, pi) => (
                <p key={pi} className="reading-paragraph">
                  {paragraph.split(" ").map((word, wi) => (
                    <span
                      key={wi}
                      className={`reading-word ${highlightedWord === word.replace(/[.,!?;:'"()]/g, "").toLowerCase() ? "highlighted" : ""} ${activePassage.vocabulary?.includes(word.replace(/[.,!?;:'"()]/g, "").toLowerCase()) ? "vocab-word" : ""}`}
                      onClick={() => handleWordClick(word)}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </p>
              ))}
            </div>
            {showTranslation && (
              <div className="reading-translation">
                <h4>🌍 Türkçe Çeviri:</h4>
                {activePassage.textTr.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {activePassage.vocabulary && (
              <div className="reading-vocab-list">
                <h4>📚 Önemli Kelimeler:</h4>
                <div className="reading-vocab-tags">
                  {activePassage.vocabulary.map((word) => (
                    <span
                      key={word}
                      className="badge badge-gold reading-vocab-tag"
                      onClick={() => {
                        speak(word);
                        setHighlightedWord(word);
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="reading-questions-section">
          <h3>📝 Anlama Soruları</h3>
          {activePassage.questions.map((q, qi) => (
            <div key={qi} className="card question-card">
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
            Object.keys(answers).length === activePassage.questions.length && (
              <button className="btn btn-primary btn-lg" onClick={checkAnswers}>
                ✅ Cevapları Kontrol Et
              </button>
            )}
          {showResults && (
            <div className="card reading-result">
              <h3>
                {
                  activePassage.questions.filter(
                    (q, i) => answers[i] === q.answer,
                  ).length
                }
                /{activePassage.questions.length} Doğru 🎉
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
