import { useState } from "react";
import { useProgress } from "../contexts/useProgress";

export default function Notes() {
  const { state, dispatch } = useProgress();
  const [activeTab, setActiveTab] = useState("notes");
  const [newNote, setNewNote] = useState("");
  const [noteWord, setNoteWord] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    dispatch({
      type: "ADD_NOTE",
      payload: { text: newNote, wordId: noteWord || null },
    });
    setNewNote("");
    setNoteWord("");
  };

  const filteredNotes = state.notes
    .filter(
      (n) =>
        !searchTerm || n.text.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .reverse();

  const filteredErrors = state.errorLog
    .filter(
      (e) =>
        !searchTerm ||
        (e.word || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .reverse();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Notlarım 📝</h1>
        <p>Notlar, favoriler ve hata defterinizi yönetin</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          📝 Notlar ({state.notes.length})
        </button>
        <button
          className={`tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          ⭐ Favoriler ({state.favorites.length})
        </button>
        <button
          className={`tab ${activeTab === "errors" ? "active" : ""}`}
          onClick={() => setActiveTab("errors")}
        >
          ❌ Hata Defteri ({state.errorLog.length})
        </button>
      </div>

      <input
        className="input"
        placeholder="🔍 Ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "var(--space-lg)", maxWidth: "400px" }}
      />

      {activeTab === "notes" && (
        <div>
          <div
            className="card"
            style={{
              marginBottom: "var(--space-lg)",
              display: "flex",
              gap: "var(--space-md)",
              flexWrap: "wrap",
            }}
          >
            <input
              className="input"
              placeholder="Yeni not yazın..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              style={{ flex: 1, minWidth: "200px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddNote();
              }}
            />
            <input
              className="input"
              placeholder="İlgili kelime (opsiyonel)"
              value={noteWord}
              onChange={(e) => setNoteWord(e.target.value)}
              style={{ width: "200px" }}
            />
            <button className="btn btn-primary" onClick={handleAddNote}>
              + Ekle
            </button>
          </div>
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>Henüz not eklenmemiş</h3>
              <p style={{ color: "var(--text-muted)" }}>
                Yeni bir not ekleyerek başlayın.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
              }}
            >
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--space-md) var(--space-lg)",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 500 }}>{note.text}</p>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-sm)",
                        marginTop: "var(--space-xs)",
                      }}
                    >
                      {note.wordId && (
                        <span className="badge badge-blue">{note.wordId}</span>
                      )}
                      <span
                        style={{
                          fontSize: "var(--fs-xs)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(note.date).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-icon btn-sm"
                    onClick={() =>
                      dispatch({ type: "DELETE_NOTE", payload: note.id })
                    }
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div>
          {state.favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <h3>Henüz favori eklenmemiş</h3>
              <p style={{ color: "var(--text-muted)" }}>
                Kelime çalışırken kelimeleri favorilere ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-sm)",
              }}
            >
              {state.favorites.map((fav) => (
                <div
                  key={fav}
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-md)",
                    padding: "var(--space-md)",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{fav}</span>
                  <button
                    className="btn btn-icon btn-sm"
                    onClick={() =>
                      dispatch({ type: "TOGGLE_FAVORITE", payload: fav })
                    }
                  >
                    ⭐
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "errors" && (
        <div>
          {filteredErrors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <h3>Hata yok!</h3>
              <p style={{ color: "var(--text-muted)" }}>
                Tebrikler, henüz kayıtlı hata yok.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
              }}
            >
              {filteredErrors.map((err) => (
                <div
                  key={err.id}
                  className="card"
                  style={{
                    padding: "var(--space-md) var(--space-lg)",
                    borderLeft: "4px solid var(--accent-red)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700 }}>
                        {err.word || err.question || "Bilinmeyen"}
                      </span>
                      {err.meaning && (
                        <span
                          style={{
                            color: "var(--text-muted)",
                            marginLeft: "var(--space-md)",
                          }}
                        >
                          → {err.meaning}
                        </span>
                      )}
                      {err.correctAnswer && (
                        <span
                          style={{
                            color: "var(--accent-green-light)",
                            marginLeft: "var(--space-md)",
                            fontSize: "var(--fs-sm)",
                          }}
                        >
                          Doğru: {err.correctAnswer}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-sm)",
                        alignItems: "center",
                      }}
                    >
                      <span className="badge badge-red">{err.type}</span>
                      <span
                        style={{
                          fontSize: "var(--fs-xs)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(err.date).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
