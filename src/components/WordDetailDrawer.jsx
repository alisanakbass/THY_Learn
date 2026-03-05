import { useState, useEffect } from "react";
import { useProgress } from "../contexts/useProgress";
import { useSpeech } from "../hooks/useSpeech";
import "./WordDetailDrawer.css";

export default function WordDetailDrawer({ selectedWord, onClose }) {
  const { state, dispatch, getWordProgress, findWord } = useProgress();
  const { speak } = useSpeech();

  const [onlineData, setOnlineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLevel, setSaveLevel] = useState(state.currentLevel || "A1");

  const systemEquivalent = selectedWord?.en ? findWord(selectedWord.en) : null;

  useEffect(() => {
    if (!selectedWord?.en) {
      setOnlineData(null);
      return;
    }

    const fetchOnlineDetails = async () => {
      setLoading(true);
      try {
        const dictRes = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord.en}`,
        );
        const dictData = dictRes.ok ? await dictRes.json() : null;

        let trMeaning = selectedWord.tr;
        if (
          !trMeaning ||
          trMeaning === "Bilinmeyen kelime" ||
          trMeaning === "Sözlükte aranıyor..."
        ) {
          const transRes = await fetch(
            `https://api.mymemory.translated.net/get?q=${selectedWord.en}&langpair=en|tr`,
          );
          const transData = await transRes.json();
          trMeaning = transData.responseData.translatedText;
        }

        if (dictData && dictData.length > 0) {
          const entry = dictData[0];
          setOnlineData({
            en: entry.word,
            tr: trMeaning,
            phonetic: entry.phonetic || entry.phonetics?.[0]?.text || "",
            meanings: entry.meanings.map((m) => ({
              partOfSpeech: m.partOfSpeech,
              definition: m.definitions[0].definition,
              example: m.definitions[0].example,
            })),
          });
        } else {
          setOnlineData({
            en: selectedWord.en,
            tr: trMeaning,
            meanings: [],
          });
        }
      } catch (err) {
        console.error("Online sözlük hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineDetails();
  }, [selectedWord, findWord]);

  const handleSetStatus = (status) => {
    const dataToSave = onlineData || selectedWord;
    dispatch({
      type: "SET_WORD_STATUS",
      payload: {
        word: {
          en: dataToSave.en,
          tr: dataToSave.tr,
          level: saveLevel,
          category: selectedWord?.category || "Genel",
          pronunciation:
            dataToSave.phonetic || selectedWord?.pronunciation || "",
          example:
            dataToSave.meanings?.[0]?.example || selectedWord?.example || "",
          exampleTr: selectedWord?.exampleTr || "",
        },
        status: status,
      },
    });
  };

  if (!selectedWord) {
    return (
      <div className="vocab-side-drawer">
        <div className="drawer-empty">
          <div className="empty-icon">👈</div>
          <p>Detayları görmek için bir kelimeye tıklayın</p>
        </div>
      </div>
    );
  }

  const progress =
    getWordProgress(selectedWord.id) ||
    (systemEquivalent ? getWordProgress(systemEquivalent.id) : null);
  const displayData = onlineData || selectedWord;

  return (
    <div className={`vocab-side-drawer ${selectedWord ? "open" : ""}`}>
      <div className="drawer-inner">
        <button className="drawer-close-btn" onClick={onClose}>
          ✕ Kapat
        </button>

        {loading ? (
          <div className="drawer-loading">
            <div className="loader"></div>
            <p>Sözlükten getiriliyor...</p>
          </div>
        ) : (
          <>
            <div className="drawer-header">
              <span className="badge badge-purple">
                {selectedWord.category || "Genel"}
              </span>
              <h2 className="drawer-title">{displayData.en}</h2>
              <div className="drawer-subtitle">
                {displayData.phonetic || selectedWord.pronunciation}
                <button
                  className="btn btn-icon"
                  onClick={() => speak(displayData.en)}
                >
                  🔈
                </button>
              </div>
            </div>

            <div className="drawer-section">
              <h3>🇹🇷 Türkçe Karşılığı</h3>
              <p className="drawer-meaning">{displayData.tr}</p>
            </div>

            {/* SEVİYE SEÇİMİ VE DURUM BUTONLARI */}
            <div className="drawer-add-panel">
              <div className="level-selector">
                <span>Hedef Seviye:</span>
                {["A1", "A2", "B1"].map((lvl) => (
                  <button
                    key={lvl}
                    className={`lvl-btn ${saveLevel === lvl ? "active" : ""}`}
                    onClick={() => setSaveLevel(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <div className="drawer-status-actions">
                <button
                  className={`btn btn-secondary ${progress?.box === 1 ? "active-learning" : ""}`}
                  onClick={() => handleSetStatus("learning")}
                >
                  📝 Öğrenmeye Al
                </button>
                <button
                  className={`btn btn-primary ${progress?.learned ? "active-known" : ""}`}
                  onClick={() => handleSetStatus("known")}
                >
                  ✅ Biliyorum
                </button>
              </div>
              {progress && (
                <div className="drawer-current-status">
                  <span
                    className={`status-tag ${progress.learned ? "status-learned" : "status-review"}`}
                  >
                    {progress.learned
                      ? "✓ Öğrenildi (Box 5)"
                      : `Box ${progress.box} (Tekrar Ediliyor)`}
                  </span>
                </div>
              )}
            </div>

            {displayData.meanings?.length > 0 && (
              <div className="drawer-section">
                <h3>🔍 Tanımlar (İngilizce)</h3>
                <div className="drawer-meanings-list">
                  {displayData.meanings.slice(0, 3).map((m, i) => (
                    <div key={i} className="meaning-item">
                      <span className="pos-tag">{m.partOfSpeech}</span>
                      <p>{m.definition}</p>
                      {m.example && <p className="ex">"{m.example}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!displayData.meanings?.length && selectedWord.example && (
              <div className="drawer-section">
                <h3>📝 Örnek Cümle</h3>
                <div className="example-item">
                  <p className="en">"{selectedWord.example}"</p>
                  <p className="tr">{selectedWord.exampleTr}</p>
                </div>
              </div>
            )}

            {progress && (
              <div className="drawer-stats">
                <div className="stat">
                  <span className="label">Kutu</span>
                  <span className="value">{progress.box}</span>
                </div>
                <div className="stat">
                  <span className="label">Doğru</span>
                  <span className="value">{progress.timesCorrect}</span>
                </div>
                <div className="stat">
                  <span className="label">Yanlış</span>
                  <span className="value">{progress.timesWrong}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
