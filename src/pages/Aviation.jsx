import { useState } from "react";
import { useSpeech } from "../hooks/useSpeech";
import "./Aviation.css";

const icaoAlphabet = [
  { letter: "A", word: "Alpha", pronunciation: "AL-fah" },
  { letter: "B", word: "Bravo", pronunciation: "BRAH-voh" },
  { letter: "C", word: "Charlie", pronunciation: "CHAR-lee" },
  { letter: "D", word: "Delta", pronunciation: "DELL-tah" },
  { letter: "E", word: "Echo", pronunciation: "ECK-oh" },
  { letter: "F", word: "Foxtrot", pronunciation: "FOKS-trot" },
  { letter: "G", word: "Golf", pronunciation: "GOLF" },
  { letter: "H", word: "Hotel", pronunciation: "HO-tel" },
  { letter: "I", word: "India", pronunciation: "IN-dee-ah" },
  { letter: "J", word: "Juliet", pronunciation: "JEW-lee-et" },
  { letter: "K", word: "Kilo", pronunciation: "KEY-loh" },
  { letter: "L", word: "Lima", pronunciation: "LEE-mah" },
  { letter: "M", word: "Mike", pronunciation: "MIKE" },
  { letter: "N", word: "November", pronunciation: "no-VEM-ber" },
  { letter: "O", word: "Oscar", pronunciation: "OSS-car" },
  { letter: "P", word: "Papa", pronunciation: "pah-PAH" },
  { letter: "Q", word: "Quebec", pronunciation: "keh-BECK" },
  { letter: "R", word: "Romeo", pronunciation: "ROW-me-oh" },
  { letter: "S", word: "Sierra", pronunciation: "see-AIR-rah" },
  { letter: "T", word: "Tango", pronunciation: "TANG-go" },
  { letter: "U", word: "Uniform", pronunciation: "YOU-nee-form" },
  { letter: "V", word: "Victor", pronunciation: "VIK-ter" },
  { letter: "W", word: "Whiskey", pronunciation: "WISS-key" },
  { letter: "X", word: "X-ray", pronunciation: "ECKS-ray" },
  { letter: "Y", word: "Yankee", pronunciation: "YANG-key" },
  { letter: "Z", word: "Zulu", pronunciation: "ZOO-loo" },
];

const scenarios = [
  {
    id: "takeoff",
    title: "🛫 Kalkış Senaryosu",
    description: "Kalkış prosedüründe standart ATC haberleşmesi",
    dialogues: [
      {
        speaker: "Pilot",
        text: "Istanbul Tower, Turkish 123, ready for departure, runway 35 left.",
        tr: "İstanbul Kule, Türk 123, kalkışa hazır, pist 35 sol.",
      },
      {
        speaker: "Tower",
        text: "Turkish 123, Istanbul Tower, wind 340 degrees 10 knots, runway 35 left, cleared for takeoff.",
        tr: "Türk 123, İstanbul Kule, rüzgar 340 derece 10 knot, pist 35 sol, kalkışa izin verildi.",
      },
      {
        speaker: "Pilot",
        text: "Cleared for takeoff, runway 35 left, Turkish 123.",
        tr: "Kalkışa izin verildi, pist 35 sol, Türk 123.",
      },
      {
        speaker: "Tower",
        text: "Turkish 123, contact departure on 120.9, good day.",
        tr: "Türk 123, kalkış frekansı 120.9'a geçin, iyi günler.",
      },
      {
        speaker: "Pilot",
        text: "Departure 120.9, Turkish 123, good day.",
        tr: "Kalkış 120.9, Türk 123, iyi günler.",
      },
    ],
  },
  {
    id: "landing",
    title: "🛬 İniş Senaryosu",
    description: "İniş yaklaşmasında standart ATC haberleşmesi",
    dialogues: [
      {
        speaker: "Pilot",
        text: "Istanbul Approach, Turkish 456, descending to flight level 100, information Bravo.",
        tr: "İstanbul Yaklaşma, Türk 456, uçuş seviyesi 100'e alçalıyor, bilgi Bravo.",
      },
      {
        speaker: "Approach",
        text: "Turkish 456, Istanbul Approach, expect ILS approach runway 35 left, descend altitude 4000 feet.",
        tr: "Türk 456, İstanbul Yaklaşma, pist 35 sol ILS yaklaşması beklentisi, 4000 feet'e alçalın.",
      },
      {
        speaker: "Pilot",
        text: "Descending 4000 feet, expecting ILS 35 left, Turkish 456.",
        tr: "4000 feet'e alçalıyoruz, ILS 35 sol beklentisi, Türk 456.",
      },
      {
        speaker: "Tower",
        text: "Turkish 456, runway 35 left, cleared to land, wind 330 degrees 8 knots.",
        tr: "Türk 456, pist 35 sol, inişe izin verildi, rüzgar 330 derece 8 knot.",
      },
      {
        speaker: "Pilot",
        text: "Cleared to land, runway 35 left, Turkish 456.",
        tr: "İnişe izin verildi, pist 35 sol, Türk 456.",
      },
    ],
  },
  {
    id: "emergency",
    title: "🚨 Acil Durum Senaryosu",
    description: "Motor arızası durumunda acil haberleşme",
    dialogues: [
      {
        speaker: "Pilot",
        text: "Mayday, Mayday, Mayday! Istanbul Tower, Turkish 789, engine failure, requesting immediate return.",
        tr: "Mayday, Mayday, Mayday! İstanbul Kule, Türk 789, motor arızası, acil dönüş talep ediyorum.",
      },
      {
        speaker: "Tower",
        text: "Turkish 789, Roger your Mayday. Turn left heading 180, descend altitude 3000 feet, runway 35 left cleared for you.",
        tr: "Türk 789, Mayday'inizi aldım. Sola dönüş başlık 180, 3000 feet'e alçalın, pist 35 sol sizin için açıldı.",
      },
      {
        speaker: "Pilot",
        text: "Left heading 180, descending 3000, Turkish 789.",
        tr: "Sola başlık 180, 3000'e alçalıyoruz, Türk 789.",
      },
      {
        speaker: "Tower",
        text: "Turkish 789, emergency services are standing by. Souls on board and fuel remaining?",
        tr: "Türk 789, acil servisler hazır bekliyor. Uçaktaki kişi sayısı ve kalan yakıt?",
      },
      {
        speaker: "Pilot",
        text: "185 souls on board, fuel remaining 2 hours, Turkish 789.",
        tr: "Uçakta 185 kişi, kalan yakıt 2 saat, Türk 789.",
      },
    ],
  },
];

export default function Aviation() {
  const { speak, speaking } = useSpeech();
  const [activeTab, setActiveTab] = useState("icao");
  const [activeScenario, setActiveScenario] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizLetter, setQuizLetter] = useState("");
  const [quizInput, setQuizInput] = useState("");
  const [quizResult, setQuizResult] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextFlashcard = () => {
    setIsFlipped(false);
    // Rastgele bir sonraki kartı seç
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * icaoAlphabet.length);
    } while (randomIndex === flashcardIndex && icaoAlphabet.length > 1);
    setFlashcardIndex(randomIndex);
  };

  const prevFlashcard = () => {
    // Geri butonu da rastgele bir karta götürsün
    nextFlashcard();
  };

  const startQuiz = () => {
    const random =
      icaoAlphabet[Math.floor(Math.random() * icaoAlphabet.length)];
    setQuizLetter(random.letter);
    setQuizInput("");
    setQuizResult(null);
    setQuizMode(true);
  };

  const checkQuiz = () => {
    const correct = icaoAlphabet.find((a) => a.letter === quizLetter);
    setQuizResult(
      quizInput.toLowerCase().trim() === correct.word.toLowerCase(),
    );
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Havacılık İngilizcesi ✈️</h1>
        <p>ICAO alfabe, ATC haberleşme ve uçuş senaryoları</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "icao" ? "active" : ""}`}
          onClick={() => setActiveTab("icao")}
        >
          🔤 ICAO Alfabe
        </button>
        <button
          className={`tab ${activeTab === "flashcards" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("flashcards");
            setActiveScenario(null);
          }}
        >
          🎴 Öğrenme Kartları
        </button>
        <button
          className={`tab ${activeTab === "scenarios" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("scenarios");
            setActiveScenario(null);
          }}
        >
          🎭 Senaryolar
        </button>
      </div>

      {activeTab === "flashcards" ? (
        <div className="flashcards-section animate-slide-up">
          <div className="flashcard-container">
            <div
              className={`flashcard ${isFlipped ? "flipped" : ""}`}
              onClick={() => {
                setIsFlipped(!isFlipped);
                if (!isFlipped) speak(icaoAlphabet[flashcardIndex].word);
              }}
            >
              <div className="flashcard-inner">
                <div className="flashcard-front">
                  <span className="flashcard-letter">
                    {icaoAlphabet[flashcardIndex].letter}
                  </span>
                  <span className="flashcard-hint">Çevirmek için tıklayın</span>
                </div>
                <div className="flashcard-back">
                  <span className="flashcard-word">
                    {icaoAlphabet[flashcardIndex].word}
                  </span>
                  <span className="flashcard-pron">
                    {icaoAlphabet[flashcardIndex].pronunciation}
                  </span>
                </div>
              </div>
            </div>

            <div className="flashcard-controls">
              <button className="btn btn-secondary" onClick={prevFlashcard}>
                ← Önceki
              </button>
              <span className="flashcard-counter">
                {flashcardIndex + 1} / {icaoAlphabet.length}
              </span>
              <button className="btn btn-primary" onClick={nextFlashcard}>
                Sonraki →
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === "icao" ? (
        <div className="aviation-section animate-slide-up">
          <div className="icao-grid">
            {icaoAlphabet.map((item) => (
              <div
                key={item.letter}
                className="card icao-card"
                onClick={() => speak(item.word)}
              >
                <span className="icao-letter">{item.letter}</span>
                <span className="icao-word">{item.word}</span>
                <span className="icao-pron">{item.pronunciation}</span>
              </div>
            ))}
          </div>
          <div className="icao-quiz-section">
            <h3>🧠 ICAO Alfabe Quiz</h3>
            {quizMode ? (
              <div className="card icao-quiz">
                <p className="quiz-prompt">Bu harfin ICAO kodu nedir?</p>
                <div className="quiz-letter-display">{quizLetter}</div>
                <div className="quiz-input-row">
                  <input
                    className="input"
                    value={quizInput}
                    onChange={(e) => setQuizInput(e.target.value)}
                    placeholder="Cevabınız..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") checkQuiz();
                    }}
                  />
                  <button className="btn btn-primary" onClick={checkQuiz}>
                    Kontrol
                  </button>
                </div>
                {quizResult !== null && (
                  <div
                    className={`exercise-feedback ${quizResult ? "feedback-correct" : "feedback-wrong"}`}
                    style={{ marginTop: "var(--space-md)" }}
                  >
                    {quizResult
                      ? "✅ Doğru!"
                      : `❌ Doğru cevap: ${icaoAlphabet.find((a) => a.letter === quizLetter)?.word}`}
                  </div>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={startQuiz}
                  style={{ marginTop: "var(--space-sm)" }}
                >
                  Sonraki Soru →
                </button>
              </div>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={startQuiz}>
                Quiz Başlat
              </button>
            )}
          </div>
        </div>
      ) : activeScenario ? (
        <div className="scenario-detail animate-slide-up">
          <button
            className="btn btn-secondary"
            onClick={() => setActiveScenario(null)}
            style={{ marginBottom: "var(--space-lg)" }}
          >
            ← Senaryolara Dön
          </button>
          <h2>{activeScenario.title}</h2>
          <p className="scenario-desc">{activeScenario.description}</p>
          <div className="dialogue-list">
            {activeScenario.dialogues.map((d, i) => (
              <div
                key={i}
                className={`dialogue-item ${d.speaker === "Pilot" ? "dialogue-pilot" : "dialogue-atc"}`}
              >
                <div className="dialogue-header">
                  <span className="dialogue-speaker">
                    {d.speaker === "Pilot" ? "👨‍✈️" : "🗼"} {d.speaker}
                  </span>
                  <button
                    className="btn btn-icon btn-sm"
                    onClick={() => speak(d.text)}
                  >
                    {speaking ? "🔊" : "🔈"}
                  </button>
                </div>
                <p className="dialogue-text">{d.text}</p>
                <p className="dialogue-tr">{d.tr}</p>
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              activeScenario.dialogues.forEach((d, i) => {
                setTimeout(() => speak(d.text), i * 4000);
              });
            }}
            style={{ marginTop: "var(--space-lg)" }}
          >
            ▶️ Tüm Diyaloğu Dinle
          </button>
        </div>
      ) : (
        <div className="scenario-grid animate-slide-up">
          {scenarios.map((s) => (
            <div
              key={s.id}
              className="card scenario-card"
              onClick={() => setActiveScenario(s)}
            >
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <span className="badge badge-gold">
                {s.dialogues.length} diyalog
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
