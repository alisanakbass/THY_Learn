import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProgress } from "../contexts/useProgress";
import "./LearningPath.css";

export default function LearningPath() {
  const { state, isGrammarCompleted } = useProgress();
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([]);
  const [userVisibleCount, setUserVisibleCount] = useState(10);

  // Verileri çekip yolu oluşturalım
  useEffect(() => {
    const level = (state.currentLevel || "A1").toLowerCase();

    Promise.all([
      fetch(`/data/grammar/${level}-lessons.json`)
        .then((r) => r.json())
        .catch(() => []),
      fetch(`/data/reading/${level}-passages.json`)
        .then((r) => r.json())
        .catch(() => []),
      fetch(`/data/listening/${level}-exercises.json`)
        .then((r) => r.json())
        .catch(() => []),
      fetch(`/data/vocabulary/${level}-general.json`)
        .then((r) => r.json())
        .catch(() => []),
    ]).then(([grammar, reading, listening, vocab]) => {
      // Doğrusal bir akış oluşturalım.
      // Sıra: Kelime Çalış -> Gramer 1 -> Okuma 1 -> Dinleme 1 -> Kelime Çalış -> Gramer 2...
      const path = [];
      const maxLength = Math.max(
        grammar.length,
        reading.length,
        listening.length,
      );

      for (let i = 0; i < maxLength; i++) {
        // Her döngüde bir miktar kelime pratiği ekleyelim
        const chunk = vocab ? vocab.slice(i * 10, i * 10 + 10) : [];
        if (chunk.length > 0) {
          path.push({
            id: `vocab_practice_${i}`,
            type: "vocabulary",
            title: `Kelimeler (Adım ${i + 1})`,
            icon: "📚",
            path: "/vocabulary",
            wordIds: chunk.map((w) => w.id),
            state: { filter: "path", startIndex: i * 10, limit: 10 },
          });
        }

        if (grammar[i]) {
          path.push({
            id: grammar[i].id,
            type: "grammar",
            title: grammar[i].title,
            icon: "✏️",
            path: "/grammar",
            state: { startLesson: grammar[i].id },
          });
        }

        if (reading[i]) {
          path.push({
            id: reading[i].id,
            type: "reading",
            title: reading[i].title,
            icon: "📖",
            path: "/reading",
            state: { startLesson: reading[i].id },
          });
        }

        if (listening[i]) {
          path.push({
            id: listening[i].id,
            type: "listening",
            title: listening[i].title,
            icon: "🎧",
            path: "/listening",
            state: { startLesson: listening[i].id },
          });
        }
      }
      setNodes(path);
    });
  }, [state.currentLevel]);

  // Hangi düğümler tamamlandı hangileri açık?
  const getNodeStatus = (node) => {
    if (node.type === "grammar") {
      return isGrammarCompleted(node.id) ? "completed" : "locked";
    }
    if (node.type === "reading") {
      return state.reading[node.id]?.completed ? "completed" : "locked";
    }
    if (node.type === "listening") {
      return state.listening[node.id]?.completed ? "completed" : "locked";
    }
    if (node.type === "vocabulary" && node.wordIds) {
      let practicedCount = 0;
      node.wordIds.forEach((id) => {
        if (state.vocabulary[id]) practicedCount++;
      });
      // En az 1 kelime bile sorulmuşsa istasyonu tamamlanmış say (kullanıcıyı engellememek için)
      return practicedCount > 0 ? "completed" : "locked";
    }
    return "locked";
  };

  const processedNodes = [];
  let activeFound = false;

  nodes.forEach((n, i) => {
    let status = getNodeStatus(n);

    // Eğer locked olarak dönmüşse ama önceki her şey completed ise, active yapalım
    if (status === "locked" && !activeFound) {
      let allPreviousCompleted = true;
      for (let j = 0; j < i; j++) {
        if (getNodeStatus(nodes[j]) !== "completed") {
          allPreviousCompleted = false;
          break;
        }
      }
      if (allPreviousCompleted) {
        status = "active";
      }
    }

    // Eğer bir active veya locked bulduysak diğer lockedleri açık bırakmayalım
    if (status === "active" && !activeFound) {
      activeFound = true;
    } else if (status === "active" && activeFound) {
      // Sadece 1 tane active olabilir, sonrakiler locked olmalı. Vocab hariç.
      if (n.type !== "vocabulary") status = "locked";
    }

    processedNodes.push({ ...n, status });
  });

  const activeIndex = processedNodes.findIndex((n) => n.status === "active");
  const requiredCount =
    activeIndex >= 0 ? Math.ceil((activeIndex + 1) / 10) * 10 : 10;
  const currentVisibleCount = Math.max(userVisibleCount, requiredCount);

  return (
    <div className="learning-path-container">
      <div className="learning-path-header">
        <h2>Öğrenme Yolu ({state.currentLevel || "A1"})</h2>
        <p>Adım adım ilerleyerek İngilizcenizi geliştirin.</p>
      </div>

      <div className="learning-path-timeline">
        {processedNodes.slice(0, currentVisibleCount).map((node, i) => {
          const isCompleted = node.status === "completed";
          const isActive = node.status === "active";
          const isLocked = node.status === "locked";

          return (
            <div key={`${node.id}-${i}`} className={`path-node ${node.status}`}>
              <div className="node-connector" />

              <div
                className="node-circle"
                onClick={() => {
                  if (!isLocked) navigate(node.path, { state: node.state });
                }}
              >
                <span className="node-icon">{isLocked ? "🔒" : node.icon}</span>
              </div>

              <div className="node-content card">
                <h4>{node.title}</h4>
                <div className="node-footer">
                  <span
                    className={`badge ${isCompleted ? "badge-green" : isActive ? "badge-gold" : "badge-gray"}`}
                  >
                    {isCompleted
                      ? "Tamamlandı"
                      : isActive
                        ? "Şimdi Başla!"
                        : "Kilitli"}
                  </span>
                  {!isLocked && (
                    <button
                      className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => navigate(node.path, { state: node.state })}
                    >
                      {isActive ? "Başla ▶" : "Tekrar Et 🔄"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {currentVisibleCount < processedNodes.length && (
        <button
          className="btn btn-secondary btn-lg"
          onClick={() => setUserVisibleCount((prev) => prev + 10)}
          style={{ marginTop: "var(--space-2xl)", zIndex: 2 }}
        >
          Daha Fazla Göster ↓
        </button>
      )}
    </div>
  );
}
