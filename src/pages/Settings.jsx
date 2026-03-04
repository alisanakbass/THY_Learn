import { useState } from "react";
import { useProgress } from "../contexts/useProgress";
import { useTheme } from "../contexts/useTheme";

export default function Settings() {
  const { state, dispatch, exportProgress, importProgress } = useProgress();
  const { theme, toggleTheme } = useTheme();
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState("");

  const handleImport = () => {
    if (importProgress(importText)) {
      setImportStatus("✅ İlerleme başarıyla içe aktarıldı!");
      setImportText("");
    } else {
      setImportStatus("❌ Geçersiz dosya formatı.");
    }
    setTimeout(() => setImportStatus(""), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Tüm ilerlemeniz silinecek. Emin misiniz?")) {
      localStorage.removeItem("thy-progress");
      window.location.reload();
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Ayarlar ⚙️</h1>
        <p>Uygulama ayarlarınızı düzenleyin</p>
      </div>

      {/* Theme */}
      <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
        <h3 style={{ marginBottom: "var(--space-lg)" }}>🎨 Tema</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>
            {theme === "dark" ? "🌙 Karanlık Mod" : "☀️ Aydınlık Mod"}
          </span>
          <button className="btn btn-secondary" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Aydınlığa Geç" : "🌙 Karanlığa Geç"}
          </button>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
        <h3 style={{ marginBottom: "var(--space-lg)" }}>🎯 Günlük Hedefler</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label>Günlük Kelime Tekrarı</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
              }}
            >
              <input
                type="range"
                min="5"
                max="50"
                value={state.dailyGoals.wordsToReview}
                onChange={(e) =>
                  dispatch({
                    type: "LOAD_STATE",
                    payload: {
                      ...state,
                      dailyGoals: {
                        ...state.dailyGoals,
                        wordsToReview: parseInt(e.target.value),
                      },
                    },
                  })
                }
                style={{ width: "150px" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  minWidth: "30px",
                  textAlign: "center",
                }}
              >
                {state.dailyGoals.wordsToReview}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label>Günlük Ders Hedefi</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
              }}
            >
              <input
                type="range"
                min="1"
                max="5"
                value={state.dailyGoals.lessonsToComplete}
                onChange={(e) =>
                  dispatch({
                    type: "LOAD_STATE",
                    payload: {
                      ...state,
                      dailyGoals: {
                        ...state.dailyGoals,
                        lessonsToComplete: parseInt(e.target.value),
                      },
                    },
                  })
                }
                style={{ width: "150px" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  minWidth: "30px",
                  textAlign: "center",
                }}
              >
                {state.dailyGoals.lessonsToComplete}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label>Günlük Çalışma Süresi (dakika)</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
              }}
            >
              <input
                type="range"
                min="30"
                max="300"
                step="30"
                value={state.dailyGoals.minutesToStudy}
                onChange={(e) =>
                  dispatch({
                    type: "LOAD_STATE",
                    payload: {
                      ...state,
                      dailyGoals: {
                        ...state.dailyGoals,
                        minutesToStudy: parseInt(e.target.value),
                      },
                    },
                  })
                }
                style={{ width: "150px" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  minWidth: "30px",
                  textAlign: "center",
                }}
              >
                {state.dailyGoals.minutesToStudy}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Level */}
      <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
        <h3 style={{ marginBottom: "var(--space-lg)" }}>📊 Seviye</h3>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          {["A1", "A2", "B1", "B2"].map((level) => (
            <button
              key={level}
              className={`btn ${state.currentLevel === level ? "btn-primary" : "btn-secondary"}`}
              onClick={() => dispatch({ type: "SET_LEVEL", payload: level })}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
        <h3 style={{ marginBottom: "var(--space-lg)" }}>💾 Veri Yönetimi</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
          }}
        >
          <button className="btn btn-primary" onClick={exportProgress}>
            📤 İlerlemeyi Dışa Aktar (JSON)
          </button>
          <div>
            <p
              style={{
                fontSize: "var(--fs-sm)",
                color: "var(--text-muted)",
                marginBottom: "var(--space-sm)",
              }}
            >
              İlerlemeyi içe aktarmak için JSON yapıştırın:
            </p>
            <textarea
              className="input"
              rows="3"
              placeholder='{"currentLevel":"A1",...}'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              style={{ width: "100%", resize: "vertical" }}
            />
            <button
              className="btn btn-secondary"
              onClick={handleImport}
              style={{ marginTop: "var(--space-sm)" }}
            >
              📥 İçe Aktar
            </button>
            {importStatus && (
              <p style={{ marginTop: "var(--space-sm)", fontWeight: 600 }}>
                {importStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: "rgba(231, 76, 60, 0.3)" }}>
        <h3
          style={{
            marginBottom: "var(--space-lg)",
            color: "var(--accent-red-light)",
          }}
        >
          ⚠️ Tehlikeli Bölge
        </h3>
        <p
          style={{
            fontSize: "var(--fs-sm)",
            color: "var(--text-muted)",
            marginBottom: "var(--space-md)",
          }}
        >
          Bu işlem geri alınamaz. Tüm ilerlemeniz kalıcı olarak silinecektir.
        </p>
        <button className="btn btn-danger" onClick={handleReset}>
          🗑️ Tüm İlerlemeyi Sıfırla
        </button>
      </div>
    </div>
  );
}
