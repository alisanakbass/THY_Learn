import { NavLink } from "react-router-dom";
import { useTheme } from "../../contexts/useTheme";
import { useProgress } from "../../contexts/useProgress";
import { useState } from "react";
import "./Sidebar.css";

const menuItems = [
  { path: "/", icon: "🏠", label: "Ana Panel", id: "dashboard" },
  { path: "/vocabulary", icon: "📚", label: "Kelime", id: "vocabulary" },
  { path: "/grammar", icon: "✏️", label: "Gramer", id: "grammar" },
  { path: "/listening", icon: "🎧", label: "Dinleme", id: "listening" },
  { path: "/reading", icon: "📖", label: "Okuma", id: "reading" },
  { path: "/aviation", icon: "✈️", label: "Havacılık", id: "aviation" },
  {
    path: "/mock-exam",
    icon: "🎯",
    label: "Sınav Simülasyonu",
    id: "mock-exam",
  },
  { path: "/notes", icon: "📝", label: "Notlarım", id: "notes" },
  { path: "/calendar", icon: "📅", label: "Takvim", id: "calendar" },
  { path: "/settings", icon: "⚙️", label: "Ayarlar", id: "settings" },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { state } = useProgress();
  const [collapsed, setCollapsed] = useState(false);

  const levelColors = {
    A1: "#2ecc71",
    A2: "#3498db",
    B1: "#e67e22",
    B2: "#e74c3c",
  };

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">✈️</div>
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-title">THY English</span>
            <span className="logo-subtitle">Pilot Kursu</span>
          </div>
        )}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Genişlet" : "Daralt"}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Level Badge */}
      {!collapsed && (
        <div className="sidebar-level">
          <div
            className="level-indicator"
            style={{ borderColor: levelColors[state.currentLevel] }}
          >
            <span
              className="level-text"
              style={{ color: levelColors[state.currentLevel] }}
            >
              {state.currentLevel}
            </span>
          </div>
          <div className="level-info">
            <span className="xp-text">🌟 {state.totalXP} XP</span>
            <span className="streak-text">🔥 {state.streak.current} gün</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "nav-item-active" : ""}`
            }
            title={collapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title="Tema Değiştir"
        >
          <span className="nav-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          {!collapsed && (
            <span className="nav-label">
              {theme === "dark" ? "Aydınlık Mod" : "Karanlık Mod"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
