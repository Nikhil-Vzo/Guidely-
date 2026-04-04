import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StreamKey = "arts" | "science" | "commerce" | "vocational";

export interface Question {
  id: string;
  text: string;
  category: string;
  weight_map: Record<StreamKey, number>;
  order_index?: number;
}

export interface StreamResult {
  key: StreamKey;
  score: number;
  pct: number;
}

export interface QuizResult {
  session_id: string;
  scores: Record<StreamKey, number>;
  top_stream: StreamKey;
  answers: Record<string, number>;
  career_report: {
    personalityTag: string;
    ranked: StreamResult[];
  };
  saved_at?: string;
}

export type QuizStatus = "idle" | "loading" | "active" | "submitting" | "done";

interface QuizState {
  questions: Question[];
  answers: Record<string, number>;
  currentIdx: number;
  status: QuizStatus;
  result: QuizResult | null;
  cachedFromOffline: boolean;
}

// ── Hydrate from localStorage on first load ──────────────────────────────────
function loadResultFromStorage(): QuizResult | null {
  try {
    const raw = localStorage.getItem("guidely:quiz:result");
    return raw ? (JSON.parse(raw) as QuizResult) : null;
  } catch {
    return null;
  }
}

const initialState: QuizState = {
  questions: [],
  answers: {},
  currentIdx: 0,
  status: "idle",
  result: loadResultFromStorage(),
  cachedFromOffline: false,
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuestions(state, action: PayloadAction<{ questions: Question[]; fromCache: boolean }>) {
      state.questions = action.payload.questions;
      state.cachedFromOffline = action.payload.fromCache;
      state.status = action.payload.questions.length > 0 ? "active" : "idle";
    },
    setLoading(state) {
      state.status = "loading";
    },
    setAnswer(state, action: PayloadAction<{ questionId: string; value: number }>) {
      state.answers[action.payload.questionId] = action.payload.value;
    },
    setCurrentIdx(state, action: PayloadAction<number>) {
      state.currentIdx = action.payload;
    },
    setSubmitting(state) {
      state.status = "submitting";
    },
    setResult(state, action: PayloadAction<QuizResult>) {
      state.result = action.payload;
      state.status = "done";
      // Also persist to localStorage for legacy reads (e.g. CareerMap)
      try {
        localStorage.setItem("guidely:quiz:scores", JSON.stringify(action.payload.scores));
        localStorage.setItem("guidely:quiz:result", JSON.stringify(action.payload));
      } catch {}
    },
    resetQuiz(state) {
      state.questions = [];
      state.answers = {};
      state.currentIdx = 0;
      state.status = "idle";
      state.cachedFromOffline = false;
      // Note: we intentionally keep `result` so CareerMap can still read it
    },
  },
});

export const {
  setQuestions,
  setLoading,
  setAnswer,
  setCurrentIdx,
  setSubmitting,
  setResult,
  resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
