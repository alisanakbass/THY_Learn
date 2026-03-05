import React, { useState, useEffect } from "react";
import "./HRPeak.css";

const questionPool = [
  {
    q: "If the technician __________ the server earlier, we wouldn't have lost the data.",
    o: ["fixed", "had fixed", "fixes", "has fixed", "would fix"],
    a: "B",
  },
  {
    q: "By the time the passengers board the plane, the crew __________ the security check.",
    o: [
      "will complete",
      "completes",
      "will have completed",
      "is completing",
      "completed",
    ],
    a: "C",
  },
  {
    q: "If I __________ in your position, I would accept the job offer immediately.",
    o: ["am", "was", "were", "have been", "will be"],
    a: "C",
  },
  {
    q: "We __________ for three hours when the manager finally arrived.",
    o: ["have waited", "had been waiting", "are waiting", "wait", "will wait"],
    a: "B",
  },
  {
    q: "The flight __________ due to bad weather conditions yesterday.",
    o: [
      "is cancelled",
      "was cancelled",
      "cancels",
      "has cancelled",
      "will be cancelled",
    ],
    a: "B",
  },
  {
    q: "I wish I __________ more attention during the safety briefing.",
    o: ["paid", "had paid", "pay", "am paying", "will pay"],
    a: "B",
  },
  {
    q: "Unless it __________ raining, the outdoor event will be moved inside.",
    o: ["stops", "stopped", "will stop", "had stopped", "is stopping"],
    a: "A",
  },
  {
    q: "He __________ working for the company for ten years by next December.",
    o: ["will be", "has been", "will have been", "was", "is"],
    a: "C",
  },
  {
    q: "If they __________ the contract, they would be liable for the damages.",
    o: ["breach", "breached", "had breached", "will breach", "would breach"],
    a: "B",
  },
  {
    q: "The company decided to __________ the launch of the new product until next month.",
    o: ["call off", "put off", "take after", "bring up", "look after"],
    a: "B",
  },
  {
    q: "She is highly skilled __________ managing large-scale projects.",
    o: ["at", "on", "in", "with", "for"],
    a: "A",
  },
  {
    q: "The sudden __________ in oil prices affected the entire aviation industry.",
    o: ["decrease", "increase", "fluctuation", "stability", "demand"],
    a: "C",
  },
  {
    q: "Please __________ the form and return it to the HR department.",
    o: ["fill out", "give up", "break down", "set up", "turn down"],
    a: "A",
  },
  {
    q: "He is responsible __________ coordinating the schedules of the flight crew.",
    o: ["to", "for", "with", "about", "from"],
    a: "B",
  },
  {
    q: "We need to __________ a solution to the technical problem as soon as possible.",
    o: [
      "come up with",
      "get away with",
      "look forward to",
      "run out of",
      "keep up with",
    ],
    a: "A",
  },
  {
    q: "Not until he arrived home __________ he had lost his wallet.",
    o: [
      "did he realize",
      "he realized",
      "he had realized",
      "does he realize",
      "was realizing",
    ],
    a: "A",
  },
  {
    q: "Never __________ such a beautiful sunset in my life.",
    o: ["I have seen", "have I seen", "I saw", "did I saw", "I am seeing"],
    a: "B",
  },
  {
    q: "Had I known the truth, I __________ differently.",
    o: ["will act", "would act", "would have acted", "acted", "had acted"],
    a: "C",
  },
  {
    q: "The new law was designed to __________ crime in the city.",
    o: ["reduce", "increase", "encourage", "allow", "support"],
    a: "A",
  },
  {
    q: "She enjoyed __________ new recipes in her free time.",
    o: ["to try", "try", "trying", "tried", "tries"],
    a: "C",
  },
];

// Generate 150 questions
const questions = [];
for (let i = 0; i < 150; i++) {
  const template = questionPool[i % questionPool.length];
  questions.push({
    id: i + 1,
    text: template.q,
    options: template.o,
    answer: template.a,
  });
}

export default function HRPeak() {
  const [screen, setScreen] = useState("intro"); // intro, exam, result
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(150).fill(null));
  const [timeLeft, setTimeLeft] = useState(75 * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    let timer;
    if (screen === "exam" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [screen, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setScreen("exam");
  };

  const handleSelectOption = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < 149) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJump = (index) => {
    setCurrentIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinish = () => {
    setScreen("result");
    setShowConfirmModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateResult = () => {
    let correct = 0;
    let wrong = 0;
    const analytics = [];

    questions.forEach((q, idx) => {
      const userChoice = answers[idx];
      const isCorrect = userChoice === q.answer;
      if (isCorrect) correct++;
      else {
        wrong++;
        analytics.push({
          id: q.id,
          text: q.text,
          userAnswer: userChoice || "Boş Bırakıldı",
          correctAnswer: q.answer,
        });
      }
    });

    return {
      correct,
      wrong,
      percentage: Math.round((correct / 150) * 100),
      analytics,
    };
  };

  if (screen === "intro") {
    return (
      <div className="hrpeak-page animate-fade-in">
        <div className="hrpeak-card-glass p-8 md:p-12 text-center max-w-3xl mx-auto mt-10">
          <div className="hrpeak-icon-box mx-auto mb-8">
            <span style={{ fontSize: "3rem" }}>✈️</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">
            HRPeak Professional <br />
            <span className="text-accent-gold">English Assessment</span>
          </h1>
          <p className="text-lg text-secondary mb-10">
            THY, TGS ve kurumsal havayolları mülakat süreçleri için optimize
            edilmiş 150 soruluk profesyonel simülasyon.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="hrpeak-stat-box">
              <span className="block text-xs uppercase tracking-widest opacity-60">
                Soru Sayısı
              </span>
              <span className="text-xl font-bold">150 Soru</span>
            </div>
            <div className="hrpeak-stat-box">
              <span className="block text-xs uppercase tracking-widest opacity-60">
                Süre
              </span>
              <span className="text-xl font-bold">75 Dakika</span>
            </div>
            <div className="hrpeak-stat-box">
              <span className="block text-xs uppercase tracking-widest opacity-60">
                Seviye
              </span>
              <span className="text-xl font-bold">B1/B2/C1</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="btn btn-primary btn-lg w-full md:w-auto"
          >
            Sınavı Başlat
          </button>

          <p className="mt-8 text-sm opacity-60">
            ⚠️ Sınav sırasında sayfa yenilenirse ilerlemeniz sıfırlanacaktır.
          </p>
        </div>
      </div>
    );
  }

  if (screen === "exam") {
    const q = questions[currentIndex];
    const progress = ((currentIndex + 1) / 150) * 100;

    return (
      <div className="hrpeak-page animate-fade-in">
        <div className="hrpeak-grid">
          <div className="exam-main">
            {/* Header */}
            <div className="hrpeak-card-glass p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[200px]">
                <span className="text-xs font-bold uppercase tracking-widest block mb-2 opacity-60">
                  İlerleme Durumu
                </span>
                <div className="flex items-center gap-4">
                  <div className="progress-bar flex-1">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="font-mono font-bold text-accent-gold">
                    {currentIndex + 1}/150
                  </span>
                </div>
              </div>
              <div
                className={`timer-box ${timeLeft <= 300 ? "timer-warning" : ""}`}
              >
                <span>⏱️ {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Question Component */}
            <div className="hrpeak-card-glass p-8 md:p-12 min-h-[400px] flex flex-col justify-between">
              <div>
                <span className="badge badge-gold mb-6">Question {q.id}</span>
                <h2 className="text-2xl font-semibold mb-8">{q.text}</h2>
                <div className="options-container space-y-4">
                  {["A", "B", "C", "D", "E"].map((label, idx) => (
                    <div
                      key={label}
                      className={`option-card ${answers[currentIndex] === label ? "selected" : ""}`}
                      onClick={() => handleSelectOption(label)}
                    >
                      <div className="option-label">{label}</div>
                      <div className="option-text">{q.options[idx]}</div>
                      {answers[currentIndex] === label && (
                        <div className="selected-icon">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-12 pt-8 border-t border-color">
                <button
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="btn btn-secondary"
                >
                  ◀ Geri
                </button>
                <button
                  onClick={handleNext}
                  className={`btn ${currentIndex === 149 ? "btn-success" : "btn-primary"}`}
                >
                  {currentIndex === 149 ? "Bitir" : "İleri ▶"}
                </button>
              </div>
            </div>
          </div>

          <aside className="exam-sidebar">
            <div className="hrpeak-card-glass p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-6">Soru Navigasyonu</h3>
              <div className="question-grid">
                {questions.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`grid-item ${currentIndex === idx ? "active" : ""} ${answers[idx] ? "answered" : ""}`}
                    onClick={() => handleJump(idx)}
                  >
                    {item.id}
                  </button>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-color text-center">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="btn btn-danger w-full"
                >
                  Sınavı Tamamla
                </button>
              </div>
            </div>
          </aside>
        </div>

        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal max-w-md">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold mb-4">Emin misiniz?</h3>
                <p className="opacity-70 mb-8">
                  Bitirdiğinizde yanıtlarınız değerlendirilecek ve geri
                  dönemeyeceksiniz.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Geri Dön
                  </button>
                  <button
                    onClick={handleFinish}
                    className="btn btn-danger flex-1"
                  >
                    Sınavı Bitir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (screen === "result") {
    const results = calculateResult();
    return (
      <div className="hrpeak-page animate-fade-in">
        <div className="hrpeak-card-glass p-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold">Sınav Tamamlandı!</h1>
            <p className="opacity-60">
              Performans analizinizi aşağıda inceleyebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="stat-card">
              <span className="stat-label">Puanlama</span>
              <div className="stat-value">%{results.percentage}</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Doğru</span>
              <div className="stat-value text-success">{results.correct}</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Yanlış</span>
              <div className="stat-value text-danger">{results.wrong}</div>
            </div>
          </div>

          <div className="review-section">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              📝 Hatalı Soruların Analizi
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              {results.analytics.map((item) => (
                <div
                  key={item.id}
                  className="review-card p-6 rounded-xl bg-card"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold opacity-50 uppercase">
                      Question {item.id}
                    </span>
                    <span className="badge badge-red">Yanlış</span>
                  </div>
                  <p className="font-medium mb-4">{item.text}</p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="opacity-50">Senin Cevabın: </span>
                      <span className="font-bold text-accent-red">
                        {item.userAnswer}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-50">Doğru Cevap: </span>
                      <span className="font-bold text-accent-green">
                        {item.correctAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {results.analytics.length === 0 && (
                <div className="text-center p-10 opacity-50">
                  Harika! Hiç yanlışın yok.
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-color text-center">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-lg"
            >
              Yeniden Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
