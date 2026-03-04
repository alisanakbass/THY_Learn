import { useState, useEffect, useCallback, useRef } from "react";
import { useProgress } from "../contexts/useProgress";
import "./MockExam.css";

const SECTION_LABELS = {
  grammar: { icon: "✏️", name: "Grammar", color: "#9b59b6" },
  vocabulary: { icon: "📚", name: "Vocabulary", color: "#3498db" },
  reading: { icon: "📖", name: "Reading", color: "#2ecc71" },
  listening: { icon: "🎧", name: "Listening", color: "#f39c12" },
};

const EXAM_DURATION = 40 * 60; // 40 dakika (saniye)

export default function MockExam() {
  const { dispatch, state } = useProgress();
  const [examData, setExamData] = useState(null);
  const [phase, setPhase] = useState("intro"); // intro | active | results
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [showConfirm, setShowConfirm] = useState(false);
  const [results, setResults] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlays, setAudioPlays] = useState({});
  const timerRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Veriyi yükle
  useEffect(() => {
    fetch("/data/exam/thy-exam-questions.json")
      .then((r) => r.json())
      .then((data) => setExamData(data))
      .catch(console.error);
  }, []);

  // Geri sayım
  useEffect(() => {
    if (phase !== "active") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const questions = examData?.questions || [];
  const currentQuestion = questions[currentIndex];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 60) return "danger";
    if (timeLeft <= 300) return "warning";
    return "";
  };

  const getTimerBarColor = () => {
    const pct = (timeLeft / EXAM_DURATION) * 100;
    if (pct <= 10) return "var(--danger, #e74c3c)";
    if (pct <= 25) return "var(--warning, #f39c12)";
    return "var(--primary)";
  };

  const startExam = () => {
    setPhase("active");
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeLeft(EXAM_DURATION);
    setResults(null);
    setAudioPlays({});
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const toggleFlag = (questionId) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const goToQuestion = (idx) => setCurrentIndex(idx);
  const goNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  // TTS ile ses çalma
  const playAudio = useCallback(
    (text, questionId) => {
      if (isPlaying) {
        synthRef.current.cancel();
        setIsPlaying(false);
        return;
      }

      const currentPlays = audioPlays[questionId] || 0;
      if (currentPlays >= 2) return; // Maksimum 2 dinleme

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setAudioPlays((prev) => ({
          ...prev,
          [questionId]: (prev[questionId] || 0) + 1,
        }));
      };
      utterance.onerror = () => setIsPlaying(false);

      synthRef.current.speak(utterance);
    },
    [isPlaying, audioPlays],
  );

  const finishExam = useCallback(() => {
    clearInterval(timerRef.current);
    synthRef.current.cancel();

    // Hesaplamalar
    let correct = 0;
    const sectionScores = {};
    const wrongAnswers = [];

    for (const cat of Object.keys(SECTION_LABELS)) {
      sectionScores[cat] = { correct: 0, total: 0 };
    }

    questions.forEach((q) => {
      sectionScores[q.category].total++;
      if (answers[q.id] === q.answer) {
        correct++;
        sectionScores[q.category].correct++;
      } else {
        wrongAnswers.push({
          ...q,
          givenAnswer: answers[q.id] || "(Boş)",
        });
      }
    });

    const totalPct = Math.round((correct / questions.length) * 100);
    const passed = totalPct >= 60;
    const timeUsed = EXAM_DURATION - timeLeft;

    const resultData = {
      correct,
      total: questions.length,
      percentage: totalPct,
      passed,
      sectionScores,
      wrongAnswers,
      timeUsed,
      date: new Date().toISOString(),
    };

    setResults(resultData);
    setPhase("results");

    // ProgressContext'e kaydet
    dispatch({
      type: "COMPLETE_MOCK_EXAM",
      payload: resultData,
    });
    dispatch({ type: "UPDATE_STREAK" });
  }, [answers, questions, timeLeft, dispatch]);

  // Sınav geçmişini al
  const examHistory = state.mockExam?.history || [];

  // LOADING
  if (!examData) {
    return (
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <h1>Yükleniyor...</h1>
        </div>
      </div>
    );
  }

  // ===== INTRO SCREEN =====
  if (phase === "intro") {
    return (
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <h1>🎯 Sınav Simülasyonu</h1>
          <p>THY HRPeak İngilizce Online Sınavını simüle edin</p>
        </div>

        <div className="exam-intro card">
          <div className="exam-intro-icon">✈️</div>
          <h2>{examData.examInfo.title}</h2>
          <p className="exam-intro-desc">{examData.examInfo.description}</p>

          <div className="exam-info-grid">
            <div className="exam-info-item">
              <span className="exam-info-icon">📝</span>
              <span className="exam-info-label">Toplam Soru</span>
              <span className="exam-info-value">
                {examData.examInfo.totalQuestions}
              </span>
            </div>
            <div className="exam-info-item">
              <span className="exam-info-icon">⏱️</span>
              <span className="exam-info-label">Süre</span>
              <span className="exam-info-value">
                {examData.examInfo.durationMinutes} dk
              </span>
            </div>
            <div className="exam-info-item">
              <span className="exam-info-icon">📊</span>
              <span className="exam-info-label">Bölüm Sayısı</span>
              <span className="exam-info-value">
                {examData.examInfo.sections.length}
              </span>
            </div>
            <div className="exam-info-item">
              <span className="exam-info-icon">✅</span>
              <span className="exam-info-label">Geçme Notu</span>
              <span className="exam-info-value">%60</span>
            </div>
          </div>

          <div className="exam-rules">
            <h3>📋 Sınav Kuralları</h3>
            <ul>
              <li>
                Sınav 4 bölümden oluşur: Grammar, Vocabulary, Reading, Listening
              </li>
              <li>Her bölümde 8 çoktan seçmeli soru bulunur</li>
              <li>
                Toplam süre 40 dakikadır, süre bitince sınav otomatik biter
              </li>
              <li>Sorular arasında ileri-geri geçiş yapabilirsiniz</li>
              <li>
                İşaretlediğiniz soruları daha sonra tekrar inceleyebilirsiniz
              </li>
              <li>Listening sorularını en fazla 2 kez dinleyebilirsiniz</li>
              <li>Geçme notu %60 ve üzeridir</li>
            </ul>
          </div>

          <button
            className="btn btn-primary"
            onClick={startExam}
            style={{
              fontSize: "1.1rem",
              padding: "var(--space-md) var(--space-xl)",
            }}
          >
            🚀 Sınava Başla
          </button>

          {examHistory.length > 0 && (
            <div className="exam-history">
              <h3>📈 Geçmiş Sınavlarım</h3>
              <div className="exam-history-list">
                {examHistory
                  .slice(-5)
                  .reverse()
                  .map((h, i) => (
                    <div key={i} className="exam-history-item">
                      <span className="history-date">
                        {new Date(h.date).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span
                        className={`history-score ${h.passed ? "pass" : "fail"}`}
                      >
                        %{h.percentage} — {h.passed ? "GEÇTİ ✅" : "KALDI ❌"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== RESULTS SCREEN =====
  if (phase === "results" && results) {
    return (
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <h1>📊 Sınav Sonuçları</h1>
        </div>

        <div className="exam-results">
          <div className="exam-results-header card">
            <div className="exam-results-icon">
              {results.passed ? "🎉" : "💪"}
            </div>
            <h2>
              {results.passed
                ? "Tebrikler! Sınavı Geçtiniz!"
                : "Maalesef Bu Seferde Olmadı"}
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              {results.passed
                ? "Başarılı! Bu performansla gerçek sınavda da başarılı olabilirsiniz."
                : "Hataları inceleyerek eksik konularda çalışmanızı öneririz."}
            </p>

            <div className="exam-results-score">
              <div
                className={`score-circle ${results.passed ? "pass" : "fail"}`}
              >
                <span className="score-percentage">%{results.percentage}</span>
                <span className="score-label">Başarı</span>
              </div>
              <div className="score-details">
                <div className="score-detail-item">
                  <span className="score-detail-icon">✅</span>
                  <span>
                    Doğru: {results.correct}/{results.total}
                  </span>
                </div>
                <div className="score-detail-item">
                  <span className="score-detail-icon">❌</span>
                  <span>
                    Yanlış: {results.total - results.correct}/{results.total}
                  </span>
                </div>
                <div className="score-detail-item">
                  <span className="score-detail-icon">⏱️</span>
                  <span>
                    Süre: {Math.floor(results.timeUsed / 60)} dk{" "}
                    {results.timeUsed % 60} sn
                  </span>
                </div>
                <div className="score-detail-item">
                  <span className="score-detail-icon">
                    {results.passed ? "🟢" : "🔴"}
                  </span>
                  <span>{results.passed ? "BAŞARILI" : "BAŞARISIZ"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="exam-section-scores">
            {Object.entries(results.sectionScores).map(([cat, sc]) => {
              const info = SECTION_LABELS[cat];
              const pct =
                sc.total > 0 ? Math.round((sc.correct / sc.total) * 100) : 0;
              return (
                <div key={cat} className="section-score-card card">
                  <div className="section-score-icon">{info.icon}</div>
                  <div className="section-score-name">{info.name}</div>
                  <div
                    className="section-score-value"
                    style={{ color: info.color }}
                  >
                    {sc.correct}/{sc.total}
                  </div>
                  <div className="section-score-bar">
                    <div
                      className="section-score-fill"
                      style={{
                        width: `${pct}%`,
                        background: info.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {results.wrongAnswers.length > 0 && (
            <div className="exam-review">
              <h3>❌ Yanlış Yapılan Sorular ({results.wrongAnswers.length})</h3>
              {results.wrongAnswers.map((q, i) => {
                const info = SECTION_LABELS[q.category];
                return (
                  <div key={i} className="review-item card">
                    <div className="review-item-header">
                      <span className={`exam-question-badge ${q.category}`}>
                        {info.icon} {info.name}
                      </span>
                    </div>
                    <div className="review-question">{q.question}</div>
                    <div className="review-answers">
                      <span className="review-your-answer">
                        ❌ Sizin cevabınız: {q.givenAnswer}
                      </span>
                      <span className="review-correct-answer">
                        ✅ Doğru cevap: {q.answer}
                      </span>
                    </div>
                    {q.explanation && (
                      <div className="review-explanation">
                        💡 {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="exam-results-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setPhase("intro")}
            >
              📋 Sınav Ekranına Dön
            </button>
            <button className="btn btn-primary" onClick={startExam}>
              🔄 Tekrar Sınava Gir
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== ACTIVE EXAM SCREEN =====
  const answeredCount = Object.keys(answers).length;
  const sections = ["grammar", "vocabulary", "reading", "listening"];

  return (
    <div className="page-container animate-fade-in">
      {/* Confirm Dialog */}
      {showConfirm && (
        <div
          className="exam-confirm-overlay"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="exam-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>⚠️ Sınavı Bitir</h3>
            <p>
              {questions.length - answeredCount} soru cevaplanmadı. Sınavı
              bitirmek istediğinize emin misiniz?
            </p>
            <div className="exam-confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirm(false)}
              >
                Devam Et
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowConfirm(false);
                  finishExam();
                }}
              >
                Sınavı Bitir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="exam-container">
        {/* Sidebar: Timer + Question Map */}
        <div className="exam-sidebar">
          <div className="exam-timer-card">
            <div className="exam-timer-label">Kalan Süre</div>
            <div className={`exam-timer ${getTimerClass()}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="exam-timer-bar">
              <div
                className="exam-timer-fill"
                style={{
                  width: `${(timeLeft / EXAM_DURATION) * 100}%`,
                  background: getTimerBarColor(),
                }}
              />
            </div>
          </div>

          <div className="exam-question-map">
            <div className="exam-map-title">
              Sorular ({answeredCount}/{questions.length})
            </div>
            {sections.map((section) => {
              const info = SECTION_LABELS[section];
              const sectionQs = questions
                .map((q, idx) => ({ ...q, idx }))
                .filter((q) => q.category === section);
              return (
                <div key={section} className="exam-map-section">
                  <div className="exam-map-section-label">
                    {info.icon} {info.name}
                  </div>
                  <div className="exam-map-grid">
                    {sectionQs.map((q) => (
                      <button
                        key={q.idx}
                        className={`exam-map-btn ${q.idx === currentIndex ? "active" : ""} ${answers[q.id] ? "answered" : ""} ${flagged.has(q.id) ? "flagged" : ""}`}
                        onClick={() => goToQuestion(q.idx)}
                        title={`Soru ${q.idx + 1}${answers[q.id] ? " (Cevaplandı)" : ""}${flagged.has(q.id) ? " (İşaretli)" : ""}`}
                      >
                        {q.idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="exam-main">
          {currentQuestion && (
            <>
              <div className="exam-question-card">
                <div className="exam-question-header">
                  <span
                    className={`exam-question-badge ${currentQuestion.category}`}
                  >
                    {SECTION_LABELS[currentQuestion.category].icon}{" "}
                    {SECTION_LABELS[currentQuestion.category].name}
                  </span>
                  <span className="exam-question-number">
                    Soru {currentIndex + 1} / {questions.length}
                  </span>
                </div>

                {/* Reading Passage */}
                {currentQuestion.passage && (
                  <div className="exam-passage">{currentQuestion.passage}</div>
                )}

                {/* Listening Audio */}
                {currentQuestion.audioText && (
                  <div className="exam-audio-section">
                    <button
                      className={`exam-audio-btn ${isPlaying ? "playing" : ""}`}
                      onClick={() =>
                        playAudio(currentQuestion.audioText, currentQuestion.id)
                      }
                      disabled={
                        (audioPlays[currentQuestion.id] || 0) >= 2 && !isPlaying
                      }
                      title={isPlaying ? "Durdur" : "Dinle"}
                    >
                      {isPlaying ? "⏸" : "▶"}
                    </button>
                    <div className="exam-audio-info">
                      <div className="exam-audio-title">
                        {isPlaying ? "Dinleniyor..." : "Ses Kaydını Dinle"}
                      </div>
                      <div className="exam-audio-hint">
                        Soruyu cevaplamadan önce metni dinleyin
                      </div>
                    </div>
                    <div className="exam-audio-plays">
                      {audioPlays[currentQuestion.id] || 0}/2 dinleme
                    </div>
                  </div>
                )}

                <div className="exam-question-text">
                  {currentQuestion.question}
                </div>

                <div className="exam-options">
                  {currentQuestion.options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i); // A, B, C, D
                    const isSelected = answers[currentQuestion.id] === opt;
                    return (
                      <button
                        key={i}
                        className={`exam-option ${isSelected ? "selected" : ""}`}
                        onClick={() => handleAnswer(currentQuestion.id, opt)}
                      >
                        <span className="exam-option-letter">{letter}</span>
                        <span className="exam-option-text">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="exam-nav">
                <div className="exam-nav-left">
                  <button
                    className="btn btn-secondary"
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                  >
                    ← Önceki
                  </button>
                  <button
                    className={`btn btn-secondary exam-flag-btn ${flagged.has(currentQuestion.id) ? "flagged" : ""}`}
                    onClick={() => toggleFlag(currentQuestion.id)}
                  >
                    🚩{" "}
                    {flagged.has(currentQuestion.id)
                      ? "İşareti Kaldır"
                      : "İşaretle"}
                  </button>
                </div>
                <div className="exam-nav-right">
                  {currentIndex < questions.length - 1 ? (
                    <button className="btn btn-primary" onClick={goNext}>
                      Sonraki →
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (answeredCount < questions.length) {
                          setShowConfirm(true);
                        } else {
                          finishExam();
                        }
                      }}
                    >
                      ✅ Sınavı Bitir
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
