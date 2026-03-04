import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProgress } from "../contexts/useProgress";
import "./Grammar.css";

export default function Grammar() {
  const location = useLocation();
  const { dispatch, isGrammarCompleted, getGrammarScore } = useProgress();
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [showLesson, setShowLesson] = useState(true);
  const [buildSentence, setBuildSentence] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/data/grammar/a1-lessons.json").then((r) => r.json()),
      fetch("/data/grammar/a2-lessons.json").then((r) => r.json()),
      fetch("/data/grammar/b1-lessons.json").then((r) => r.json()),
    ])
      .then(([a1, a2, b1]) => {
        const allLessons = [...a1, ...a2, ...b1];
        setLessons(allLessons);

        // Check if we navigated directly to a lesson
        if (location.state?.startLesson) {
          const targetLesson = allLessons.find(
            (l) => l.id === location.state.startLesson,
          );
          if (targetLesson) {
            setActiveLesson(targetLesson);
            setExerciseIndex(0);
            setShowLesson(true);
            setScore(0);
            setTotalAnswered(0);
          }
        }
      })
      .catch(console.error);
  }, [location.state]);

  const currentExercise = activeLesson?.exercises?.[exerciseIndex];

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    setExerciseIndex(0);
    setShowLesson(true);
    setScore(0);
    setTotalAnswered(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setBuildSentence([]);
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    setTotalAnswered((prev) => prev + 1);

    if (answer === currentExercise.answer) {
      setScore((prev) => prev + 1);
    } else {
      dispatch({
        type: "LOG_ERROR",
        payload: {
          type: "grammar",
          lessonId: activeLesson.id,
          question: currentExercise.question,
          correctAnswer: currentExercise.answer,
          givenAnswer: answer,
        },
      });
    }
  };

  const handleNext = () => {
    if (exerciseIndex + 1 < activeLesson.exercises.length) {
      setExerciseIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setBuildSentence([]);
    } else {
      const finalScore = Math.round(
        (score / activeLesson.exercises.length) * 100,
      );
      dispatch({
        type: "COMPLETE_GRAMMAR",
        payload: { lessonId: activeLesson.id, score: finalScore },
      });
      dispatch({ type: "UPDATE_STREAK" });
    }
  };

  const handleSentenceBuild = (word) => {
    setBuildSentence((prev) => [...prev, word]);
  };

  const handleRemoveWord = (index) => {
    setBuildSentence((prev) => prev.filter((_, i) => i !== index));
  };

  const remainingWords =
    currentExercise?.type === "sentenceBuild"
      ? currentExercise.words.filter((w) => {
          const usedCount = buildSentence.filter((bw) => bw === w).length;
          const totalCount = currentExercise.words.filter(
            (ow) => ow === w,
          ).length;
          return usedCount < totalCount;
        })
      : [];

  const isLessonComplete =
    activeLesson && totalAnswered >= activeLesson.exercises?.length;

  if (!activeLesson) {
    return (
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <h1>Gramer Dersleri ✏️</h1>
          <p>Havacılık bağlamlı İngilizce gramer öğrenin</p>
        </div>
        <div className="grammar-lessons-grid">
          {lessons.map((lesson, i) => {
            const completed = isGrammarCompleted(lesson.id);
            const sc = getGrammarScore(lesson.id);
            return (
              <div
                key={lesson.id}
                className={`card grammar-lesson-card ${completed ? "lesson-completed" : ""}`}
                onClick={() => handleSelectLesson(lesson)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="lesson-card-header">
                  <span className="lesson-number">Ders {i + 1}</span>
                  {completed && (
                    <span className="badge badge-green">✓ %{sc}</span>
                  )}
                </div>
                <h3>{lesson.title}</h3>
                <p className="lesson-desc">{lesson.description}</p>
                <div className="lesson-card-footer">
                  <span className="badge badge-blue">{lesson.level}</span>
                  <span className="lesson-exercise-count">
                    {lesson.exercises?.length} alıştırma
                  </span>
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
        className="btn btn-secondary grammar-back"
        onClick={() => setActiveLesson(null)}
      >
        ← Derslere Dön
      </button>

      {showLesson && !isLessonComplete ? (
        /* LESSON CONTENT */
        <div className="grammar-lesson-content card">
          <div className="lesson-content-header">
            <h2>{activeLesson.title}</h2>
            <span className="badge badge-blue">{activeLesson.level}</span>
          </div>
          <div
            className="lesson-explanation"
            dangerouslySetInnerHTML={{
              __html: activeLesson.explanation
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n/g, "<br/>"),
            }}
          />
          {activeLesson.aviationContext && (
            <div className="aviation-context">
              <span className="aviation-label">✈️ Havacılık Bağlamı:</span>
              <p>{activeLesson.aviationContext}</p>
            </div>
          )}
          <button
            className="btn btn-primary"
            onClick={() => setShowLesson(false)}
            style={{ marginTop: "var(--space-lg)" }}
          >
            📝 Alıştırmalara Geç
          </button>
        </div>
      ) : isLessonComplete ? (
        /* RESULTS */
        <div className="grammar-results card">
          <div className="results-icon">
            {score >= activeLesson.exercises.length * 0.7 ? "🎉" : "💪"}
          </div>
          <h2>Ders Tamamlandı!</h2>
          <div className="results-score">
            <span className="score-number">
              {Math.round((score / activeLesson.exercises.length) * 100)}%
            </span>
            <span className="score-text">
              {score}/{activeLesson.exercises.length} doğru
            </span>
          </div>
          <div className="results-actions">
            <button
              className="btn btn-secondary"
              onClick={() => handleSelectLesson(activeLesson)}
            >
              🔄 Tekrar Et
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setActiveLesson(null)}
            >
              📚 Diğer Dersler
            </button>
          </div>
        </div>
      ) : (
        /* EXERCISE */
        <div className="grammar-exercise card">
          <div className="exercise-header">
            <span className="exercise-type">
              {currentExercise?.type === "fillBlank"
                ? "📝 Boşluk Doldur"
                : currentExercise?.type === "translate"
                  ? "🌍 Çeviri"
                  : currentExercise?.type === "correctError"
                    ? "🔍 Hatayı Bul"
                    : "🧩 Cümle Kur"}
            </span>
            <span className="exercise-progress">
              {exerciseIndex + 1}/{activeLesson.exercises.length}
            </span>
          </div>

          <div className="exercise-question">
            <p>{currentExercise?.question}</p>
          </div>

          {currentExercise?.type === "sentenceBuild" ? (
            <div className="sentence-build">
              <div className="sentence-result">
                {buildSentence.length === 0 ? (
                  <span className="sentence-placeholder">
                    Kelimeleri sırayla tıklayın...
                  </span>
                ) : (
                  buildSentence.map((word, i) => (
                    <span
                      key={i}
                      className="sentence-word"
                      onClick={() => handleRemoveWord(i)}
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>
              <div className="sentence-words">
                {remainingWords.map((word, i) => (
                  <button
                    key={i}
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleSentenceBuild(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
              {!showResult && buildSentence.length > 0 && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleAnswer(buildSentence.join(" "))}
                >
                  Kontrol Et
                </button>
              )}
            </div>
          ) : currentExercise?.options ? (
            <div className="exercise-options">
              {currentExercise.options.map((opt, i) => (
                <button
                  key={i}
                  className={`exercise-option ${showResult ? (opt === currentExercise.answer ? "correct" : opt === selectedAnswer ? "wrong" : "") : ""}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={showResult}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="exercise-input-group">
              <input
                className="input exercise-input"
                placeholder="Cevabınızı yazın..."
                value={selectedAnswer || ""}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showResult}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && selectedAnswer)
                    handleAnswer(selectedAnswer);
                }}
              />
              {!showResult && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleAnswer(selectedAnswer)}
                >
                  Kontrol Et
                </button>
              )}
            </div>
          )}

          {showResult && (
            <div
              className={`exercise-feedback ${selectedAnswer === currentExercise?.answer ? "feedback-correct" : "feedback-wrong"}`}
            >
              <span>
                {selectedAnswer === currentExercise?.answer
                  ? "✅ Doğru!"
                  : `❌ Yanlış! Doğru cevap: ${currentExercise?.answer}`}
              </span>
              <button className="btn btn-primary btn-sm" onClick={handleNext}>
                {exerciseIndex + 1 < activeLesson.exercises.length
                  ? "Sonraki →"
                  : "Sonuçları Gör"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
