import { useMemo } from "react";
import { useProgress } from "../contexts/useProgress";

export default function Calendar() {
  const { state } = useProgress();

  const calendarData = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    // Empty slots for days before month start
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(null);
    }
    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const data = state.studyCalendar[dateStr];
      days.push({
        day: d,
        date: dateStr,
        data,
        isToday: d === today.getDate(),
      });
    }
    return {
      days,
      monthName: today.toLocaleDateString("tr-TR", {
        month: "long",
        year: "numeric",
      }),
    };
  }, [state.studyCalendar]);

  const totalMinutes = Object.values(state.studyCalendar).reduce(
    (sum, d) => sum + d.minutes,
    0,
  );
  const totalDays = Object.keys(state.studyCalendar).length;
  const totalXP = Object.values(state.studyCalendar).reduce(
    (sum, d) => sum + d.xpEarned,
    0,
  );

  const getIntensity = (minutes) => {
    if (!minutes) return 0;
    if (minutes < 15) return 1;
    if (minutes < 30) return 2;
    if (minutes < 60) return 3;
    return 4;
  };

  const badges = [
    {
      id: "first_word",
      icon: "📖",
      name: "İlk Kelime",
      desc: "İlk kelimeyi öğrendin",
      earned: state.badges.includes("first_word"),
    },
    {
      id: "streak_3",
      icon: "🔥",
      name: "3 Gün Seri",
      desc: "3 gün ard arda çalıştın",
      earned: state.badges.includes("streak_3"),
    },
    {
      id: "streak_7",
      icon: "🔥🔥",
      name: "7 Gün Seri",
      desc: "7 gün ard arda çalıştın",
      earned: state.badges.includes("streak_7"),
    },
    {
      id: "vocab_50",
      icon: "📚",
      name: "50 Kelime",
      desc: "50 kelime öğrendin",
      earned: state.badges.includes("vocab_50"),
    },
    {
      id: "vocab_100",
      icon: "📚📚",
      name: "100 Kelime",
      desc: "100 kelime öğrendin",
      earned: state.badges.includes("vocab_100"),
    },
    {
      id: "grammar_master",
      icon: "✏️",
      name: "Gramer Ustası",
      desc: "Tüm A1 gramer derslerini tamamladın",
      earned: state.badges.includes("grammar_master"),
    },
    {
      id: "listener",
      icon: "🎧",
      name: "İyi Dinleyici",
      desc: "Tüm dinleme alıştırmalarını tamamladın",
      earned: state.badges.includes("listener"),
    },
    {
      id: "xp_500",
      icon: "🌟",
      name: "500 XP",
      desc: "500 deneyim puanı kazandın",
      earned: state.badges.includes("xp_500"),
    },
    {
      id: "xp_1000",
      icon: "💫",
      name: "1000 XP",
      desc: "1000 deneyim puanı kazandın",
      earned: state.badges.includes("xp_1000"),
    },
    {
      id: "icao_master",
      icon: "✈️",
      name: "ICAO Uzmanı",
      desc: "ICAO alfabesini öğrendin",
      earned: state.badges.includes("icao_master"),
    },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Çalışma Takvimi 📅</h1>
        <p>İlerlemenizi ve başarımlarınızı takip edin</p>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: "var(--space-xl)" }}>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{totalDays}</div>
          <div className="stat-label">Çalışılan Gün</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{Math.round(totalMinutes / 60)}s</div>
          <div className="stat-label">Toplam Çalışma</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌟</div>
          <div className="stat-value">{totalXP}</div>
          <div className="stat-label">Kazanılan XP</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card" style={{ marginBottom: "var(--space-xl)" }}>
        <h2
          style={{
            marginBottom: "var(--space-lg)",
            textTransform: "capitalize",
          }}
        >
          {calendarData.monthName}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
            textAlign: "center",
          }}
        >
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
            <div
              key={d}
              style={{
                padding: "var(--space-sm)",
                fontWeight: 600,
                fontSize: "var(--fs-xs)",
                color: "var(--text-muted)",
              }}
            >
              {d}
            </div>
          ))}
          {calendarData.days.map((day, i) => (
            <div
              key={i}
              style={{
                padding: "var(--space-sm)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--fs-sm)",
                fontWeight: day?.isToday ? 700 : 400,
                background: day
                  ? [
                      "transparent",
                      "rgba(39, 174, 96, 0.15)",
                      "rgba(39, 174, 96, 0.3)",
                      "rgba(39, 174, 96, 0.5)",
                      "rgba(39, 174, 96, 0.7)",
                    ][getIntensity(day.data?.minutes)]
                  : "transparent",
                border: day?.isToday
                  ? "2px solid var(--accent-gold)"
                  : "1px solid transparent",
                color: day ? "var(--text-primary)" : "transparent",
                cursor: day?.data ? "pointer" : "default",
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title={
                day?.data
                  ? `${day.data.minutes} dk | ${day.data.xpEarned} XP`
                  : ""
              }
            >
              {day?.day || ""}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: "var(--space-sm)",
            alignItems: "center",
            marginTop: "var(--space-md)",
            justifyContent: "center",
          }}
        >
          <span
            style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}
          >
            Az
          </span>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "3px",
                background: [
                  "var(--bg-tertiary)",
                  "rgba(39,174,96,0.15)",
                  "rgba(39,174,96,0.3)",
                  "rgba(39,174,96,0.5)",
                  "rgba(39,174,96,0.7)",
                ][i],
              }}
            />
          ))}
          <span
            style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}
          >
            Çok
          </span>
        </div>
      </div>

      {/* Badges */}
      <h2 style={{ marginBottom: "var(--space-lg)" }}>🏆 Başarım Rozetleri</h2>
      <div className="grid-3" style={{ gap: "var(--space-md)" }}>
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="card"
            style={{
              textAlign: "center",
              opacity: badge.earned ? 1 : 0.4,
              padding: "var(--space-lg)",
              border: badge.earned
                ? "1px solid var(--accent-gold)"
                : "1px solid var(--border-color)",
            }}
          >
            <div
              style={{ fontSize: "2.5rem", marginBottom: "var(--space-sm)" }}
            >
              {badge.icon}
            </div>
            <h4 style={{ marginBottom: "var(--space-xs)" }}>{badge.name}</h4>
            <p style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)" }}>
              {badge.desc}
            </p>
            {badge.earned && (
              <span
                className="badge badge-gold"
                style={{ marginTop: "var(--space-sm)" }}
              >
                Kazanıldı!
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
