import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useProgress } from "../contexts/useProgress";
import { useSpeech } from "../hooks/useSpeech";
import WordDetailDrawer from "../components/WordDetailDrawer";
import "./Vocabulary.css";

const MODES = {
  FLASHCARD: "flashcard",
  QUIZ: "quiz",
  LIST: "list",
  GAME: "game",
};

export default function Vocabulary() {
  const location = useLocation();
  const { state, dispatch, isWordDueForReview, isFavorite, getWordProgress } =
    useProgress();
  const { speak, speaking } = useSpeech();
  const [words, setWords] = useState([]);
  const [mode, setMode] = useState(MODES.FLASHCARD);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filter, setFilter] = useState(location.state?.filter || "all"); // all, due, learned, new, favorite, path
  const limit = location.state?.limit || 0;
  const startIndex = location.state?.startIndex || 0;
  const [search, setSearch] = useState("");
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 });
  const [gameCards, setGameCards] = useState([]);
  const [gameFlipped, setGameFlipped] = useState([]);
  const [gameMatched, setGameMatched] = useState([]);
  const [gameFirst, setGameFirst] = useState(null);

  // Yeni Özellikler için State'ler
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);

  const handleBulkAdd = () => {
    // Kelimeleri farklı ayırıcılara göre böl (Satır başı, virgül, tire)
    const lines = bulkText.split(/\n/);
    const parsedWords = lines
      .map((line) => {
        // "en - tr" veya "en: tr" veya "en, tr" formatlarını yakala
        const parts = line.split(/[-:,]/);
        if (parts.length >= 2) {
          return { en: parts[0].trim(), tr: parts[1].trim() };
        }
        return null;
      })
      .filter((w) => w && w.en && w.tr);

    if (parsedWords.length === 0) {
      alert("Lütfen geçerli bir format girin! Örn: apple - elma");
      return;
    }

    dispatch({
      type: "BULK_ADD_WORDS",
      payload: {
        words: parsedWords,
        level: state.currentLevel,
      },
    });

    alert(
      `${parsedWords.length} kelime işlendi! Sadece yeni olanlar eklendi. 🚀`,
    );
    setShowBulkModal(false);
    setBulkText("");
  };

  useEffect(() => {
    Promise.all([
      fetch("/data/vocabulary/a1-general.json").then((r) => r.json()),
      fetch("/data/vocabulary/a1-aviation.json").then((r) => r.json()),
      fetch("/data/vocabulary/a2-general.json").then((r) => r.json()),
      fetch("/data/vocabulary/a2-aviation.json").then((r) => r.json()),
      fetch("/data/vocabulary/b1-general.json").then((r) => r.json()),
      fetch("/data/vocabulary/b1-aviation.json").then((r) => r.json()),
    ])
      .then(([g1, a1, g2, a2, gb1, ab1]) => {
        setWords([...g1, ...a1, ...g2, ...a2, ...gb1, ...ab1]);
      })
      .catch(console.error);
  }, []);

  // Sistem ve Kullanıcı Kelimelerini Birleştir
  const allWords = useMemo(() => {
    return [...words, ...(state.userWords || [])];
  }, [words, state.userWords]);

  const filteredWords = useMemo(() => {
    let result = allWords;

    // Öğrenilmiş kelimeleri (Box 5) öğrenme modlarında hariç tut
    const excludeLearned = (w) => !getWordProgress(w.id)?.learned;

    if (filter === "path" && limit > 0) {
      result = result.slice(startIndex, startIndex + limit);
    } else if (filter === "due") {
      result = result.filter(
        (w) => isWordDueForReview(w.id) && excludeLearned(w),
      );
    } else if (filter === "learned") {
      result = result.filter((w) => getWordProgress(w.id)?.learned);
    } else if (filter === "new") {
      result = result.filter((w) => !getWordProgress(w.id));
    } else if (filter === "favorite") {
      result = result.filter((w) => isFavorite(w.id));
    } else if (filter === "all") {
      result = result.filter(excludeLearned); // "Tümü" listesi öğrenilenleri içermesin
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) => w.en.toLowerCase().includes(q) || w.tr.toLowerCase().includes(q),
      );
    }
    return result;
  }, [
    allWords,
    filter,
    search,
    isWordDueForReview,
    isFavorite,
    getWordProgress,
    startIndex,
    limit,
  ]);

  const currentWord = filteredWords[currentIndex] || null;

  const generateQuizOptions = useCallback(
    (word) => {
      if (!word || allWords.length < 4) return;
      const others = allWords.filter((w) => w.id !== word.id);
      const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffled.map((w) => w.tr), word.tr].sort(
        () => Math.random() - 0.5,
      );
      setQuizOptions(options);
      setQuizAnswer(null);
      setShowResult(false);
    },
    [allWords],
  );

  useEffect(() => {
    if (mode === MODES.QUIZ && currentWord) {
      // Use a timeout to move the state update out of the render cycle
      const timer = setTimeout(() => generateQuizOptions(currentWord), 0);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mode, currentWord, generateQuizOptions]);

  const handleNext = () => {
    setFlipped(false);
    setShowResult(false);
    setQuizAnswer(null);
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredWords.length));
  };

  const handlePrev = () => {
    setFlipped(false);
    setShowResult(false);
    setQuizAnswer(null);
    setCurrentIndex(
      (prev) =>
        (prev - 1 + filteredWords.length) % Math.max(1, filteredWords.length),
    );
  };

  const handleAnswer = (correct) => {
    if (!currentWord) return;
    dispatch({
      type: "UPDATE_VOCABULARY",
      payload: { wordId: currentWord.id, correct },
    });
    dispatch({ type: "UPDATE_STREAK" });
    if (!correct) {
      dispatch({
        type: "LOG_ERROR",
        payload: {
          wordId: currentWord.id,
          type: "vocabulary",
          word: currentWord.en,
          meaning: currentWord.tr,
        },
      });
    }
    setSessionStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
    }));

    // KRİTİK: Önce kartı kapatıyoruz (unflip)
    setFlipped(false);

    // Kartın kapanma animasyonu (0.4s) sürerken,
    // yani 250ms civarında kelimeyi değiştiriyoruz ki arkası gözükmesin
    setTimeout(() => {
      handleNext();
    }, 250);
  };

  const handleQuizSelect = (option) => {
    if (showResult) return;
    setQuizAnswer(option);
    setShowResult(true);
    const correct = option === currentWord.tr;
    dispatch({
      type: "UPDATE_VOCABULARY",
      payload: { wordId: currentWord.id, correct },
    });
    dispatch({ type: "UPDATE_STREAK" });
    if (!correct) {
      dispatch({
        type: "LOG_ERROR",
        payload: {
          wordId: currentWord.id,
          type: "vocabulary",
          word: currentWord.en,
          meaning: currentWord.tr,
        },
      });
    }
    setSessionStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
    }));
    setTimeout(handleNext, 1200);
  };

  // Memory game
  const initGame = useCallback(() => {
    const gameWords = [...filteredWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    const cards = gameWords
      .flatMap((w) => [
        { id: `${w.id}_en`, pairId: w.id, text: w.en, type: "en" },
        { id: `${w.id}_tr`, pairId: w.id, text: w.tr, type: "tr" },
      ])
      .sort(() => Math.random() - 0.5);
    setGameCards(cards);
    setGameFlipped([]);
    setGameMatched([]);
    setGameFirst(null);
  }, [filteredWords]);

  useEffect(() => {
    if (mode === MODES.GAME && filteredWords.length >= 6) {
      const timer = setTimeout(() => initGame(), 0);
      return () => clearTimeout(timer);
    }
  }, [mode, initGame, filteredWords.length]);

  const handleGameClick = (index) => {
    if (gameFlipped.includes(index) || gameMatched.includes(index)) return;
    const newFlipped = [...gameFlipped, index];
    setGameFlipped(newFlipped);
    if (gameFirst === null) {
      setGameFirst(index);
    } else {
      const first = gameCards[gameFirst];
      const second = gameCards[index];
      if (first.pairId === second.pairId && first.type !== second.type) {
        setGameMatched((prev) => [...prev, gameFirst, index]);
        dispatch({
          type: "UPDATE_VOCABULARY",
          payload: { wordId: first.pairId, correct: true },
        });
        setSessionStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setTimeout(
          () =>
            setGameFlipped((prev) =>
              prev.filter((i) => i !== gameFirst && i !== index),
            ),
          800,
        );
      }
      setGameFirst(null);
    }
  };

  const getBoxColor = (wordId) => {
    const wp = getWordProgress(wordId);
    if (!wp) return "var(--text-muted)";
    const colors = {
      1: "#e74c3c",
      2: "#e67e22",
      3: "#f1c40f",
      4: "#3498db",
      5: "#2ecc71",
    };
    return colors[wp.box] || "var(--text-muted)";
  };

  if (allWords.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>Yükleniyor...</h3>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`page-container animate-fade-in vocab-page ${selectedWord ? "drawer-open" : ""}`}
    >
      <div className="vocab-content-wrapper">
        {/* ANA İÇERİK ALANI */}
        <div className="vocab-main-area">
          <div className="page-header">
            <div className="header-flex">
              <div>
                <h1>Kelime Çalışma 📚</h1>
                <p>
                  Spaced Repetition sistemi ile kelimeleri kalıcı olarak öğrenin
                </p>
              </div>
            </div>
          </div>

          {/* Session Stats */}
          <div className="vocab-session-stats">
            <span className="session-stat correct">
              ✓ {sessionStats.correct}
            </span>
            <span className="session-stat wrong">✗ {sessionStats.wrong}</span>
            <span className="session-stat total">
              Toplam: {filteredWords.length} kelime
            </span>
          </div>

          {/* Mode Tabs */}
          <div className="tabs">
            {Object.entries({
              [MODES.FLASHCARD]: "🃏 Kart",
              [MODES.QUIZ]: "❓ Quiz",
              [MODES.LIST]: "📋 Liste",
              [MODES.GAME]: "🎮 Eşleştirme",
            }).map(([key, label]) => (
              <button
                key={key}
                className={`tab ${mode === key ? "active" : ""}`}
                onClick={() => {
                  setMode(key);
                  setCurrentIndex(0);
                  setFlipped(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="vocab-filters">
            <div className="filter-group">
              {[
                ["all", "📋 Tümü"],
                ["due", "🔄 Tekrar"],
                ["new", "🆕 Yeni"],
                ["learned", "✅ Öğrenildi"],
                ["favorite", "⭐ Favori"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`btn btn-sm ${filter === key ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => {
                    setFilter(key);
                    setCurrentIndex(0);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              className="input vocab-search"
              placeholder="🔍 Kelime ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-accent btn-sm"
              onClick={() => setShowBulkModal(true)}
              style={{ marginLeft: "10px" }}
            >
              🚀 Toplu Ekle
            </button>
          </div>

          {filteredWords.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>Bu filtreye uygun kelime bulunamadı</h3>
            </div>
          ) : mode === MODES.FLASHCARD ? (
            /* FLASHCARD MODE */
            <div className="flashcard-container">
              <div
                className={`flashcard ${flipped ? "flashcard-flipped" : ""}`}
                onClick={(e) => {
                  // Eğer butonlara tıklanmadıysa çevir
                  if (!e.target.closest(".btn-icon")) setFlipped(!flipped);
                }}
              >
                <div className="flashcard-front">
                  <div className="flashcard-category">
                    <div>
                      <span className="badge badge-blue">
                        {currentWord?.category}
                      </span>
                      {currentWord?.isUserAdded && (
                        <span
                          className="badge badge-gold"
                          style={{ marginLeft: "5px" }}
                        >
                          ✨ Kendi Kelimem
                        </span>
                      )}
                      {(getWordProgress(currentWord?.id)?.timesWrong || 0) >
                        0 && (
                        <span
                          className="badge badge-danger"
                          style={{ marginLeft: "5px" }}
                        >
                          ⚠️ Tekrar Gerekli
                        </span>
                      )}
                    </div>
                    <div className="flashcard-actions">
                      <button
                        className="btn btn-icon"
                        title="Detayları Gör"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWord(currentWord);
                        }}
                      >
                        ℹ️
                      </button>
                      <button
                        className="btn btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({
                            type: "TOGGLE_FAVORITE",
                            payload: currentWord?.id,
                          });
                        }}
                      >
                        {isFavorite(currentWord?.id) ? "⭐" : "☆"}
                      </button>
                    </div>
                  </div>
                  <div className="flashcard-word">{currentWord?.en}</div>
                  <div className="flashcard-pronunciation">
                    {currentWord?.pronunciation}
                  </div>
                  <button
                    className="btn btn-sm btn-secondary flashcard-speak"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentWord?.en);
                    }}
                  >
                    {speaking ? "🔊" : "🔈"} Dinle
                  </button>
                  <div className="flashcard-hint">Çevirmek için tıklayın</div>
                  <div
                    className="flashcard-box-indicator"
                    style={{ background: getBoxColor(currentWord?.id) }}
                  >
                    Kutu {getWordProgress(currentWord?.id)?.box || "Yeni"}
                  </div>
                </div>
                <div className="flashcard-back">
                  <div className="flashcard-meaning">{currentWord?.tr}</div>
                  <div className="flashcard-example">
                    <p>"{currentWord?.example}"</p>
                    <p className="example-tr">{currentWord?.exampleTr}</p>
                  </div>
                  {currentWord?.family &&
                    Object.keys(currentWord.family).length > 0 && (
                      <div className="flashcard-family">
                        <span className="family-title">Kelime Ailesi:</span>
                        {Object.entries(currentWord.family).map(
                          ([type, word]) => (
                            <span key={type} className="badge badge-purple">
                              {type}: {word}
                            </span>
                          ),
                        )}
                      </div>
                    )}
                </div>
              </div>
              <div className="flashcard-controls">
                <button className="btn btn-secondary" onClick={handlePrev}>
                  ← Önceki
                </button>
                <span className="flashcard-counter">
                  {currentIndex + 1} / {filteredWords.length}
                </span>
                <button className="btn btn-secondary" onClick={handleNext}>
                  Sonraki →
                </button>
              </div>
              {flipped && (
                <div className="flashcard-answer-btns">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleAnswer(false)}
                  >
                    ✗ Bilmedim
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleAnswer(true)}
                  >
                    ✓ Bildim
                  </button>
                </div>
              )}
            </div>
          ) : mode === MODES.QUIZ ? (
            /* QUIZ MODE */
            <div className="quiz-container">
              <div className="quiz-card card">
                <div className="quiz-word">{currentWord?.en}</div>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => speak(currentWord?.en)}
                  style={{ marginBottom: "var(--space-lg)" }}
                >
                  {speaking ? "🔊" : "🔈"} Dinle
                </button>
                <div className="quiz-options">
                  {quizOptions.map((opt, i) => (
                    <button
                      key={i}
                      className={`quiz-option ${showResult ? (opt === currentWord?.tr ? "correct" : opt === quizAnswer ? "wrong" : "") : ""}`}
                      onClick={() => handleQuizSelect(opt)}
                      disabled={showResult}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flashcard-counter">
                  {currentIndex + 1} / {filteredWords.length}
                </div>
              </div>
            </div>
          ) : mode === MODES.GAME ? (
            /* MEMORY GAME */
            <div className="memory-game">
              <div className="memory-grid">
                {gameCards.map((card, i) => (
                  <div
                    key={card.id}
                    className={`memory-card ${gameFlipped.includes(i) || gameMatched.includes(i) ? "memory-flipped" : ""} ${gameMatched.includes(i) ? "memory-matched" : ""}`}
                    onClick={() => handleGameClick(i)}
                  >
                    <div className="memory-card-inner">
                      <div className="memory-card-front">❓</div>
                      <div className="memory-card-back">{card.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              {gameMatched.length === gameCards.length &&
                gameCards.length > 0 && (
                  <div className="game-complete">
                    <h3>🎉 Tebrikler!</h3>
                    <p>Tüm eşleşmeleri buldunuz!</p>
                    <button className="btn btn-primary" onClick={initGame}>
                      🔄 Tekrar Oyna
                    </button>
                  </div>
                )}
            </div>
          ) : (
            /* LIST MODE */
            <div className="vocab-list">
              {filteredWords.map((word) => {
                const wp = getWordProgress(word.id);
                return (
                  <div
                    key={word.id}
                    className={`vocab-list-item card ${selectedWord?.id === word.id ? "active-item" : ""}`}
                    onClick={() => setSelectedWord(word)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="vocab-list-main">
                      <div className="vocab-list-word">
                        <span className="word-en">{word.en}</span>
                        <span className="word-pron">{word.pronunciation}</span>
                      </div>
                      <div className="vocab-list-meaning">{word.tr}</div>
                    </div>
                    <div className="vocab-list-meta">
                      <span
                        className="badge"
                        style={{
                          background: getBoxColor(word.id),
                          color: "white",
                        }}
                      >
                        {wp ? `Kutu ${wp.box}` : "Yeni"}
                      </span>
                      <button
                        className="btn btn-icon btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(word.en);
                        }}
                      >
                        🔈
                      </button>
                      <button
                        className="btn btn-icon btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({
                            type: "TOGGLE_FAVORITE",
                            payload: word.id,
                          });
                        }}
                      >
                        {isFavorite(word.id) ? "⭐" : "☆"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PAYLAŞIMLI SAĞ ÇEKMECE */}
        <WordDetailDrawer
          selectedWord={selectedWord}
          onClose={() => setSelectedWord(null)}
        />
      </div>

      {/* TOPLU EKLEME MODALI */}
      {showBulkModal && (
        <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🚀 Toplu Kelime Ekle</h2>
              <button
                className="btn btn-icon"
                onClick={() => setShowBulkModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-form">
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginBottom: "10px",
                }}
              >
                Format: <b>İngilizce - Türkçe</b> (Her satıra bir tane). <br />
                Örnek: <br />
                apple - elma <br />
                book - kitap
              </p>
              <textarea
                className="input"
                rows="10"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Buraya yapıştırın..."
                style={{
                  width: "100%",
                  fontFamily: "monospace",
                  marginBottom: "15px",
                }}
              />
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowBulkModal(false)}
                >
                  Kapat
                </button>
                <button className="btn btn-primary" onClick={handleBulkAdd}>
                  Hemen Ekle 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
