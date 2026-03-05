import { useReducer, useEffect, useState, useCallback } from "react";
import { ProgressContext } from "./useProgress";

const initialState = {
  currentLevel: "A1",
  xp: 0,
  totalXP: 0,
  streak: { current: 0, best: 0, lastDate: null },
  dailyGoals: {
    wordsToReview: 20,
    lessonsToComplete: 1,
    minutesToStudy: 180,
    todayWords: 0,
    todayLessons: 0,
    todayMinutes: 0,
    lastReset: null,
  },
  studyCalendar: {},
  vocabulary: {},
  grammar: {},
  listening: {},
  reading: {},
  favorites: [],
  notes: [],
  errorLog: [],
  badges: [],
  userWords: [], // Kullanıcının eklediği kelimeler
  mockExam: { history: [], bestScore: 0 },
  wordOfDay: { word: null, date: null },
  settings: {
    theme: "dark",
    speechRate: 1.0,
    speechVoice: "en-US",
    dailyWordGoal: 20,
    dailyLessonGoal: 1,
    notificationsEnabled: true,
  },
};

function progressReducer(state, action) {
  switch (action.type) {
    case "LOAD_STATE":
      return { ...initialState, ...action.payload };

    case "UPDATE_VOCABULARY": {
      const { wordId, correct } = action.payload;
      const current = state.vocabulary[wordId] || {
        box: 1,
        timesCorrect: 0,
        timesWrong: 0,
        lastReview: null,
        nextReview: null,
        learned: false,
      };

      const now = new Date().toISOString().split("T")[0];
      const boxIntervals = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };

      // Yanlış bilinirse her zaman Box 1'e döner
      let newBox = correct ? Math.min(current.box + 1, 5) : 1;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + boxIntervals[newBox]);

      const updatedVocab = {
        ...state.vocabulary,
        [wordId]: {
          ...current,
          box: newBox,
          lastReview: now,
          nextReview: nextDate.toISOString().split("T")[0],
          timesCorrect: current.timesCorrect + (correct ? 1 : 0),
          timesWrong: current.timesWrong + (correct ? 0 : 1),
          learned: newBox >= 5,
        },
      };

      return {
        ...state,
        vocabulary: updatedVocab,
        xp: state.xp + (correct ? 10 : 2),
        totalXP: state.totalXP + (correct ? 10 : 2),
        dailyGoals: {
          ...state.dailyGoals,
          todayWords: state.dailyGoals.todayWords + 1,
        },
      };
    }

    case "COMPLETE_GRAMMAR": {
      const { lessonId, score } = action.payload;
      return {
        ...state,
        grammar: {
          ...state.grammar,
          [lessonId]: {
            completed: true,
            score,
            completedAt: new Date().toISOString(),
          },
        },
        xp: state.xp + 50,
        totalXP: state.totalXP + 50,
        dailyGoals: {
          ...state.dailyGoals,
          todayLessons: state.dailyGoals.todayLessons + 1,
        },
      };
    }

    case "COMPLETE_LISTENING": {
      const { exerciseId, score } = action.payload;
      return {
        ...state,
        listening: {
          ...state.listening,
          [exerciseId]: {
            completed: true,
            score,
            completedAt: new Date().toISOString(),
          },
        },
        xp: state.xp + 30,
        totalXP: state.totalXP + 30,
      };
    }

    case "COMPLETE_READING": {
      const { passageId, score } = action.payload;
      return {
        ...state,
        reading: {
          ...state.reading,
          [passageId]: {
            completed: true,
            score,
            completedAt: new Date().toISOString(),
          },
        },
        xp: state.xp + 40,
        totalXP: state.totalXP + 40,
      };
    }

    case "UPDATE_STREAK": {
      const today = new Date().toISOString().split("T")[0];
      if (state.streak.lastDate === today) return state;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const newCurrent =
        state.streak.lastDate === yesterdayStr ? state.streak.current + 1 : 1;
      return {
        ...state,
        streak: {
          current: newCurrent,
          best: Math.max(state.streak.best, newCurrent),
          lastDate: today,
        },
      };
    }

    case "LOG_STUDY_TIME": {
      const today = new Date().toISOString().split("T")[0];
      const current = state.studyCalendar[today] || { minutes: 0, xpEarned: 0 };
      return {
        ...state,
        studyCalendar: {
          ...state.studyCalendar,
          [today]: {
            minutes: current.minutes + action.payload.minutes,
            xpEarned: current.xpEarned + action.payload.xp,
          },
        },
        dailyGoals: {
          ...state.dailyGoals,
          todayMinutes: state.dailyGoals.todayMinutes + action.payload.minutes,
        },
      };
    }

    case "TOGGLE_FAVORITE": {
      const id = action.payload;
      const exists = state.favorites.includes(id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((f) => f !== id)
          : [...state.favorites, id],
      };
    }

    case "ADD_NOTE": {
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            id: Date.now(),
            ...action.payload,
            date: new Date().toISOString(),
          },
        ],
      };
    }

    case "DELETE_NOTE": {
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
      };
    }

    case "LOG_ERROR": {
      return {
        ...state,
        errorLog: [
          ...state.errorLog,
          {
            ...action.payload,
            date: new Date().toISOString(),
            id: Date.now(),
          },
        ],
      };
    }

    case "EARN_BADGE": {
      if (state.badges.includes(action.payload)) return state;
      return {
        ...state,
        badges: [...state.badges, action.payload],
        xp: state.xp + 100,
        totalXP: state.totalXP + 100,
      };
    }

    case "ADD_USER_WORD": {
      const newWord = {
        id: `user_${Date.now()}`,
        ...action.payload,
        isUserAdded: true,
      };
      return {
        ...state,
        userWords: [...state.userWords, newWord],
        vocabulary: {
          ...state.vocabulary,
          [newWord.id]: {
            box: 1,
            timesCorrect: 0,
            timesWrong: 0,
            lastReview: null,
            nextReview: null,
            learned: false,
          },
        },
      };
    }

    case "SET_WORD_STATUS": {
      const { word, status } = action.payload; // status: 'learning' | 'known'
      const isKnown = status === "known";
      const wordId = word.id || `user_${Date.now()}`;

      const existingInUser = state.userWords.find(
        (w) => w.en.toLowerCase() === word.en.toLowerCase(),
      );
      const newUserWords = existingInUser
        ? state.userWords
        : [...state.userWords, { ...word, id: wordId, isUserAdded: true }];
      const finalId = existingInUser ? existingInUser.id : wordId;

      return {
        ...state,
        userWords: newUserWords,
        vocabulary: {
          ...state.vocabulary,
          [finalId]: {
            box: isKnown ? 5 : 1,
            timesCorrect: isKnown ? 1 : 0,
            timesWrong: 0,
            lastReview: new Date().toISOString().split("T")[0],
            nextReview: isKnown
              ? "2099-12-31"
              : new Date().toISOString().split("T")[0],
            learned: isKnown,
          },
        },
      };
    }

    case "BULK_ADD_WORDS": {
      const { words, level } = action.payload; // words: [{en, tr}, ...]
      let newAddedCount = 0;
      const newUserWords = [...state.userWords];
      const newVocabulary = { ...state.vocabulary };

      words.forEach((w) => {
        const enLower = w.en.toLowerCase().trim();
        // Mükerrer Kontrolü: Hem kullanıcı listesinde hem sistem listesinde ara
        const isDuplicateUser = state.userWords.some(
          (uw) => uw.en.toLowerCase() === enLower,
        );
        const isDuplicateSystem = state.systemWords?.some(
          (sw) => sw.en.toLowerCase() === enLower,
        );

        if (!isDuplicateUser && !isDuplicateSystem) {
          const wordId = `user_bulk_${Date.now()}_${newAddedCount}`;
          newUserWords.push({
            id: wordId,
            en: w.en.trim(),
            tr: w.tr.trim(),
            level: level || state.currentLevel,
            category: "Toplu Ekleme",
            isUserAdded: true,
          });
          newVocabulary[wordId] = {
            box: 1,
            timesCorrect: 0,
            timesWrong: 0,
            lastReview: new Date().toISOString().split("T")[0],
            nextReview: new Date().toISOString().split("T")[0],
            learned: false,
          };
          newAddedCount++;
        }
      });

      return {
        ...state,
        userWords: newUserWords,
        vocabulary: newVocabulary,
      };
    }

    case "SET_LEVEL": {
      return { ...state, currentLevel: action.payload };
    }

    case "COMPLETE_MOCK_EXAM": {
      const examResult = action.payload;
      const newHistory = [...(state.mockExam?.history || []), examResult];
      const newBest = Math.max(
        state.mockExam?.bestScore || 0,
        examResult.percentage,
      );
      return {
        ...state,
        mockExam: {
          history: newHistory,
          bestScore: newBest,
        },
        xp: state.xp + (examResult.passed ? 100 : 25),
        totalXP: state.totalXP + (examResult.passed ? 100 : 25),
        dailyGoals: {
          ...state.dailyGoals,
          todayLessons: state.dailyGoals.todayLessons + 1,
        },
      };
    }

    case "UPDATE_SETTINGS": {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    }

    case "RESET_DAILY_GOALS": {
      const today = new Date().toISOString().split("T")[0];
      if (state.dailyGoals.lastReset === today) return state;
      return {
        ...state,
        dailyGoals: {
          ...state.dailyGoals,
          todayWords: 0,
          todayLessons: 0,
          todayMinutes: 0,
          lastReset: today,
        },
      };
    }

    case "SET_WORD_OF_DAY": {
      return { ...state, wordOfDay: action.payload };
    }

    default:
      return state;
  }
}

const ALL_VOCAB_FILES = [
  "/data/vocabulary/a1-general.json",
  "/data/vocabulary/a1-aviation.json",
  "/data/vocabulary/a2-general.json",
  "/data/vocabulary/a2-aviation.json",
  "/data/vocabulary/b1-general.json",
  "/data/vocabulary/b1-aviation.json",
];

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(progressReducer, initialState);
  const [systemWords, setSystemWords] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("thy-progress");
      if (saved) {
        dispatch({ type: "LOAD_STATE", payload: JSON.parse(saved) });
      }
    } catch (e) {
      console.error("İlerleme yüklenemedi:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("thy-progress", JSON.stringify(state));
    } catch (e) {
      console.error("İlerleme kaydedilemedi:", e);
    }
  }, [state]);

  // SİSTEM KELİMELERİNİ BİR KEZ YÜKLE
  useEffect(() => {
    const loadAllWords = async () => {
      try {
        const results = await Promise.all(
          ALL_VOCAB_FILES.map((url) =>
            fetch(url).then((res) => (res.ok ? res.json() : [])),
          ),
        );
        setSystemWords(results.flat());
      } catch (err) {
        console.error("Sözlük yüklenirken hata:", err);
      }
    };
    loadAllWords();
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET_DAILY_GOALS" });
    const interval = setInterval(() => {
      dispatch({ type: "RESET_DAILY_GOALS" });
    }, 60000);

    // Rozet Kontrolü - Yan etkiler için bir başka timer veya state değişikliği izlenebilir
    const badgeTimer = setInterval(() => {
      // XP Rozetleri
      if (state.totalXP >= 500 && !state.badges.includes("xp_500"))
        dispatch({ type: "EARN_BADGE", payload: "xp_500" });
      if (state.totalXP >= 1000 && !state.badges.includes("xp_1000"))
        dispatch({ type: "EARN_BADGE", payload: "xp_1000" });

      // Kelime Rozetleri
      const learnedCount = Object.values(state.vocabulary).filter(
        (v) => v.learned,
      ).length;
      if (learnedCount >= 1 && !state.badges.includes("first_word"))
        dispatch({ type: "EARN_BADGE", payload: "first_word" });
      if (learnedCount >= 50 && !state.badges.includes("vocab_50"))
        dispatch({ type: "EARN_BADGE", payload: "vocab_50" });
      if (learnedCount >= 100 && !state.badges.includes("vocab_100"))
        dispatch({ type: "EARN_BADGE", payload: "vocab_100" });
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(badgeTimer);
    };
  }, [state.totalXP, state.vocabulary, state.badges]);

  const getWordProgress = (wordId) => state.vocabulary[wordId] || null;
  const isWordDueForReview = (wordId) => {
    const wp = state.vocabulary[wordId];
    if (!wp) return true;
    const today = new Date().toISOString().split("T")[0];
    return wp.nextReview <= today;
  };
  const isWordLearned = (wordId) => {
    const wp = state.vocabulary[wordId];
    return wp && wp.learned;
  };
  const isFavorite = (id) => state.favorites.includes(id);
  const isGrammarCompleted = (lessonId) =>
    state.grammar[lessonId]?.completed || false;
  const getGrammarScore = (lessonId) => state.grammar[lessonId]?.score || 0;
  const getMockExamHistory = () => state.mockExam?.history || [];

  const findWord = useCallback(
    (enOrTr) => {
      const clean = enOrTr
        .replace(/[.,!?;:'"()\n]/g, "")
        .toLowerCase()
        .trim();
      if (!clean) return null;

      // Önce kullanıcı kelimelerinde ara
      const userFound = state.userWords.find(
        (w) => w.en.toLowerCase() === clean || w.tr.toLowerCase() === clean,
      );
      if (userFound) return userFound;

      // Sonra sistem kelimelerinde ara
      return systemWords.find(
        (w) => w.en.toLowerCase() === clean || w.tr.toLowerCase() === clean,
      );
    },
    [systemWords, state.userWords],
  );

  const getLevelProgress = () => {
    const levels = { A1: 0, A2: 1, B1: 2, B2: 3 };
    return levels[state.currentLevel] || 0;
  };

  const getDailyGoalProgress = () => {
    const {
      todayWords,
      wordsToReview,
      todayLessons,
      lessonsToComplete,
      todayMinutes,
      minutesToStudy,
    } = state.dailyGoals;
    const wordPct = Math.min((todayWords / wordsToReview) * 100, 100);
    const lessonPct = Math.min((todayLessons / lessonsToComplete) * 100, 100);
    const minutePct = Math.min((todayMinutes / minutesToStudy) * 100, 100);
    return {
      wordPct,
      lessonPct,
      minutePct,
      overall: (wordPct + lessonPct + minutePct) / 3,
    };
  };

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thy-english-progress-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProgress = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      dispatch({ type: "LOAD_STATE", payload: data });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        state,
        dispatch,
        getWordProgress,
        isWordDueForReview,
        isWordLearned,
        isFavorite,
        isGrammarCompleted,
        getGrammarScore,
        getLevelProgress,
        getDailyGoalProgress,
        exportProgress,
        importProgress,
        getMockExamHistory,
        findWord,
        systemWords,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
