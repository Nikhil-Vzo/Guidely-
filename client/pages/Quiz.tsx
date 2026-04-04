import * as React from "react";
import { useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabase";
import { idbSetAll, idbGetAll } from "@/lib/idb";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setQuestions,
  setLoading,
  setAnswer,
  setCurrentIdx,
  setSubmitting,
  setResult,
  resetQuiz,
  type Question,
  type StreamKey,
} from "@/store/slices/quizSlice";
import { setCachedAt } from "@/store/slices/offlineSlice";
import {
  ArrowRight, ArrowLeft, CheckCircle2, BookOpen,
  Lightbulb, Brain, Target, GraduationCap, Briefcase,
  Star, TrendingUp, RotateCcw, Zap, Award, ChevronRight, WifiOff,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type ScaleOption = { label: string; sublabel: string; value: number; color: string; activeClass: string };

/* ─────────────────────────────────────────────
   STATIC CONFIG
───────────────────────────────────────────── */
const SCALE: ScaleOption[] = [
  { label: "1", sublabel: "Strongly\nDisagree", value: -2, color: "#ef4444", activeClass: "border-red-500 bg-red-50 text-red-700" },
  { label: "2", sublabel: "Disagree",           value: -1, color: "#f97316", activeClass: "border-orange-400 bg-orange-50 text-orange-700" },
  { label: "3", sublabel: "Neutral",             value:  0, color: "#94a3b8", activeClass: "border-slate-400 bg-slate-100 text-slate-700" },
  { label: "4", sublabel: "Agree",               value:  1, color: "#22c55e", activeClass: "border-green-500 bg-green-50 text-green-700" },
  { label: "5", sublabel: "Strongly\nAgree",     value:  2, color: "#7c3aed", activeClass: "border-violet-600 bg-violet-50 text-violet-700" },
];

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; accent: string; pill: string }> = {
  aptitude:    { label: "Aptitude",    icon: <Brain className="w-4 h-4" />,    accent: "text-sky-700",    pill: "bg-sky-100 text-sky-700 border-sky-200"    },
  interest:    { label: "Interests",   icon: <Lightbulb className="w-4 h-4" />, accent: "text-amber-700",  pill: "bg-amber-100 text-amber-700 border-amber-200"  },
  personality: { label: "Personality", icon: <Star className="w-4 h-4" />,     accent: "text-violet-700", pill: "bg-violet-100 text-violet-700 border-violet-200" },
};

const STREAM_META: Record<StreamKey, {
  label: string; icon: string; color: string; bg: string; border: string; gradient: string; gradientFrom: string; gradientTo: string;
  degrees: string[]; careers: string[]; govtExams: string[]; skills: string[];
}> = {
  science: {
    label: "Science & Technology", icon: "⚗️",
    color: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200",
    gradient: "from-sky-500 to-blue-600", gradientFrom: "#0ea5e9", gradientTo: "#2563eb",
    degrees:    ["B.Sc — Physics, Chemistry, Maths, Biology, CS", "B.Tech / B.E. (Engineering)", "MBBS / BDS (Medicine)", "B.Pharm (Pharmacy)", "B.Sc Agriculture / Biotechnology"],
    careers:    ["Software Engineer", "Doctor / Surgeon", "Research Scientist", "Data Analyst", "Pharmacist", "Agricultural Officer"],
    govtExams:  ["JEE Mains & Advanced (Engineering)", "NEET-UG (Medical)", "GATE — MTech admissions", "ISRO / DRDO / BARC Scientist", "SSC JE — Junior Engineer"],
    skills:     ["Mathematical Reasoning", "Lab & Research Methods", "Logical Problem Solving", "Programming & Coding", "Data & Statistical Analysis"],
  },
  commerce: {
    label: "Commerce & Business", icon: "📈",
    color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200",
    gradient: "from-emerald-500 to-teal-600", gradientFrom: "#10b981", gradientTo: "#0d9488",
    degrees:    ["B.Com / B.Com (Hons.)", "BBA / BBM — Business Administration", "CA / CS / CMA — Professional", "B.Economics", "MBA — after graduation"],
    careers:    ["Chartered Accountant", "Business Analyst", "Bank Manager / PO", "Marketing Executive", "Financial Advisor", "Entrepreneur"],
    govtExams:  ["IBPS / SBI Bank PO & Clerk", "SSC CGL — Tax Inspector, Auditor", "UPSC — Commerce Optional", "RBI Grade B Officer", "CGPSC — Commerce & Finance"],
    skills:     ["Financial Literacy & Accounting", "Business Communication", "Data Interpretation", "Taxation & Law Basics", "Leadership & Management"],
  },
  arts: {
    label: "Arts, Humanities & Social Sciences", icon: "🏛️",
    color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200",
    gradient: "from-purple-500 to-pink-600", gradientFrom: "#9333ea", gradientTo: "#db2777",
    degrees:    ["B.A. — History, Pol. Sci., Sociology, Psychology", "LLB / B.A. LLB — Law", "B.Journalism & Mass Communication", "B.Ed — Education / Teaching", "B.SW — Social Work"],
    careers:    ["IAS / IPS Civil Servant", "Journalist / Editor", "Lawyer / Advocate", "Teacher / Professor", "NGO Leader", "Counsellor / Psychologist"],
    govtExams:  ["UPSC Civil Services — IAS / IPS / IFS", "CGPSC State Services", "SSC CGL — General Administration", "High Court / District Court Staff", "CTET / SET / NET — Teaching"],
    skills:     ["Critical & Analytical Thinking", "Written & Verbal Communication", "Research & Synthesis", "Empathy & Social Awareness", "Debate & Advocacy"],
  },
  vocational: {
    label: "Vocational & Skill-Based Trades", icon: "🔧",
    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200",
    gradient: "from-orange-500 to-red-500", gradientFrom: "#f97316", gradientTo: "#ef4444",
    degrees:    ["ITI — (10th pass onwards, 1–2 years)", "Polytechnic Diploma — 3 years", "B.Voc — Bachelor of Vocation", "NSDC / PMKVY Skill Certificate", "B.Sc Agriculture / Horticulture"],
    careers:    ["Electrician / Electronics Tech.", "Polytechnic Diploma Engineer", "Chef / Hotel Manager", "Graphic / UI Designer", "Agriculture Entrepreneur"],
    govtExams:  ["Railways Apprentice & Group D", "PSU Technician — BHEL, SAIL, NTPC", "State Agri. Dept. Field Officer", "Govt. ITI Instructor", "PMKVY Certification — Skill India"],
    skills:     ["Hands-on Technical Execution", "Practical Problem Solving", "Design & Visual Thinking", "Agriculture / Food Science", "Entrepreneurial Initiative"],
  },
};

/* ─────────────────────────────────────────────
   SCORE HELPERS
───────────────────────────────────────────── */
function computeScores(questions: Question[], answers: Record<string, number>): Record<StreamKey, number> {
  const s: Record<StreamKey, number> = { arts: 0, science: 0, commerce: 0, vocational: 0 };
  for (const q of questions) {
    const v = answers[q.id] ?? 0;
    for (const [stream, weight] of Object.entries(q.weight_map || {})) {
      s[stream as StreamKey] += v * weight;
    }
  }
  return s;
}

function rankStreams(scores: Record<StreamKey, number>) {
  return (Object.keys(scores) as StreamKey[])
    .map((k) => ({ key: k, score: scores[k] }))
    .sort((a, b) => b.score - a.score);
}

function toPercent(score: number, maxScore: number): number {
  return Math.round(Math.max(5, Math.min(99, ((score + maxScore) / (2 * maxScore)) * 100)));
}

function getPersonalityTag(ranked: { key: StreamKey }[]): string {
  const combo = `${ranked[0].key}-${ranked[1].key}`;
  const tags: Record<string, string> = {
    "science-commerce": "Analytical Strategist", "science-arts": "Curious Explorer",
    "science-vocational": "Technical Innovator", "commerce-science": "Business Technologist",
    "commerce-arts": "Creative Leader", "commerce-vocational": "Entrepreneurial Builder",
    "arts-science": "Thoughtful Researcher", "arts-commerce": "Communicative Manager",
    "arts-vocational": "Creative Craftsperson", "vocational-science": "Practical Technologist",
    "vocational-commerce": "Skilled Entrepreneur", "vocational-arts": "Creative Maker",
  };
  return tags[combo] || "Versatile Thinker";
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Quiz() {
  const navigate    = useNavigate();
  const dispatch    = useAppDispatch();
  const { questions, answers, currentIdx, status, cachedFromOffline } = useAppSelector((s) => s.quiz);
  const { isOnline } = useAppSelector((s) => s.offline);

  const alreadyTaken = !!localStorage.getItem("guidely:quiz:scores");

  // ── Fetch questions (network first → IndexedDB fallback) ──────────────────
  useEffect(() => {
    async function loadQuestions() {
      dispatch(setLoading());

      // Try network first
      const supabase = getSupabase();
      if (supabase && isOnline) {
        try {
          const { data, error } = await supabase
            .from("quiz_questions")
            .select("id, text, category, weight_map")
            .eq("active", true)
            .order("order_index", { ascending: true });

          if (!error && data && data.length > 0) {
            dispatch(setQuestions({ questions: data, fromCache: false }));
            // Save to IndexedDB for offline use
            await idbSetAll("quiz_questions", data);
            dispatch(setCachedAt(new Date().toISOString()));
            return;
          }
        } catch (err) {
          console.warn("Network fetch failed, trying IndexedDB cache…", err);
        }
      }

      // Fallback: IndexedDB cache
      try {
        const cached = await idbGetAll<Question>("quiz_questions");
        if (cached.length > 0) {
          dispatch(setQuestions({ questions: cached, fromCache: true }));
          return;
        }
      } catch (err) {
        console.error("IndexedDB read failed:", err);
      }

      // Nothing available
      dispatch(setQuestions({ questions: [], fromCache: false }));
    }

    loadQuestions();

    // Reset answers when re-mounting
    return () => {
      /* intentionally do NOT resetQuiz() here — user might navigate away mid-quiz */
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scores   = useMemo(() => computeScores(questions, answers), [questions, answers]);
  const ranked   = useMemo(() => rankStreams(scores), [scores]);
  const maxScore = useMemo(() => Math.max(1, ...ranked.map((r) => Math.abs(r.score))), [ranked]);

  const total      = questions.length;
  const answered   = Object.keys(answers).length;
  const progress   = total > 0 ? (answered / total) * 100 : 0;
  const currentQ   = questions[currentIdx];
  const catMeta    = currentQ ? (CATEGORY_META[currentQ.category] ?? CATEGORY_META.aptitude) : null;
  const isAnswered = answers[currentQ?.id] !== undefined;
  const isLast     = currentIdx === total - 1;
  const minAnswers = Math.min(15, total);

  async function handleSubmit() {
    const supabase = getSupabase();
    dispatch(setSubmitting());
    const top = ranked[0].key;
    const payload = {
      session_id: `session_${Date.now()}`,
      scores,
      top_stream: top,
      answers,
      career_report: {
        personalityTag: getPersonalityTag(ranked),
        ranked: ranked.map((r) => ({ key: r.key, score: r.score, pct: toPercent(r.score, maxScore) })),
      },
      saved_at: new Date().toISOString(),
    };

    // Save to Supabase if online
    if (supabase && isOnline) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("quiz_results").insert({ ...payload, user_id: user?.id ?? null });
      } catch (_) { /* offline or auth error — result still saved locally */ }
    }

    // Dispatch to Redux (also auto-saves to localStorage via slice)
    dispatch(setResult(payload));

    // Also persist to IndexedDB
    try {
      const { idbPut } = await import("@/lib/idb");
      await idbPut("quiz_result", payload, "latest");
    } catch (_) {}

    navigate("/career-map");
  }

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
          <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-muted-foreground font-medium">Loading your quiz…</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container py-20 text-center space-y-3">
        <Brain className="w-10 h-10 text-muted-foreground mx-auto" />
        <p className="font-semibold">No quiz questions found</p>
        <p className="text-sm text-muted-foreground">Admin needs to add questions in the dashboard.</p>
      </div>
    );
  }

  /* ══ QUIZ SCREEN ══ */
  const selectedVal    = answers[currentQ?.id];
  const hasSelection   = selectedVal !== undefined;
  const canSubmitFinal = isLast && hasSelection && answered >= minAnswers;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f8fafc 0%, #f3f0ff 60%, #fdf2f8 100%)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* ── Offline cache notice ── */}
        {cachedFromOffline && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            <span>Showing offline-cached questions. Your answers will save locally.</span>
          </div>
        )}

        {/* ── Top bar ── */}
        <div className="bg-white rounded-3xl px-6 py-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">Career Aptitude Quiz</p>
                <p className="text-xs text-muted-foreground mt-0.5">{answered} of {total} answered</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-violet-600">{currentIdx + 1}</p>
              <p className="text-xs text-muted-foreground leading-none">/ {total}</p>
            </div>
          </div>
          {/* Segmented progress */}
          <div className="flex gap-1">
            {questions.map((q, i) => (
              <div
                key={q.id}
                onClick={() => dispatch(setCurrentIdx(i))}
                className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                  answers[q.id] !== undefined
                    ? "bg-violet-500"
                    : i === currentIdx
                    ? "bg-violet-200"
                    : "bg-slate-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Category pill ── */}
        {catMeta && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${catMeta.pill}`}>
            {catMeta.icon}
            {catMeta.label}
          </span>
        )}

        {/* ── Question card ── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-800">
            {currentQ?.text}
          </p>

          {/* ── Likert scale ── */}
          <div className="mt-6">
            {/* Labels row */}
            <div className="flex justify-between text-xs text-muted-foreground mb-3 px-1">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>

            {/* Scale buttons */}
            <div className="grid grid-cols-5 gap-2">
              {SCALE.map((opt) => {
                const active = selectedVal === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => dispatch(setAnswer({ questionId: currentQ.id, value: opt.value }))}
                    className={`
                      relative flex flex-col items-center justify-center gap-1.5
                      rounded-2xl border-2 p-3 sm:p-4 transition-all duration-150 select-none
                      hover:scale-[1.04] active:scale-[0.97]
                      ${active ? opt.activeClass + " shadow-md scale-[1.05]" : "border-slate-100 bg-white hover:border-slate-200"}
                    `}
                  >
                    {/* Number */}
                    <span
                      className={`text-lg font-black leading-none transition-colors ${active ? "" : "text-slate-300"}`}
                      style={active ? { color: opt.color } : {}}
                    >
                      {opt.label}
                    </span>
                    {/* Dot indicator */}
                    <div
                      className={`w-2 h-2 rounded-full transition-all ${active ? "opacity-100 scale-110" : "opacity-20 scale-75"}`}
                      style={{ backgroundColor: opt.color }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Selected label display */}
            <div className="mt-4 text-center h-5">
              {hasSelection && (
                <span className="text-xs font-semibold text-slate-500">
                  {SCALE.find((o) => o.value === selectedVal)?.sublabel.replace("\n", " ")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="rounded-2xl h-12 px-5 gap-2 border-2"
            onClick={() => dispatch(setCurrentIdx(Math.max(0, currentIdx - 1)))}
            disabled={currentIdx === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {isLast ? (
            <Button
              className="rounded-2xl h-12 px-7 gap-2 font-bold text-white shadow-lg transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
              onClick={handleSubmit}
              disabled={!canSubmitFinal || status === "submitting"}
            >
              {status === "submitting" ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Generating Report…
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  See My Career Report
                </>
              )}
            </Button>
          ) : (
            <Button
              className="rounded-2xl h-12 px-7 gap-2 font-semibold"
              style={hasSelection ? { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white" } : {}}
              onClick={() => dispatch(setCurrentIdx(currentIdx + 1))}
              disabled={!hasSelection}
              variant={hasSelection ? "default" : "outline"}
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* ── Hint messages ── */}
        {!hasSelection && (
          <p className="text-center text-xs text-muted-foreground">
            Rate how much this statement applies to you
          </p>
        )}
        {isLast && hasSelection && answered < minAnswers && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-amber-700 font-medium">
              Answer at least {minAnswers} questions to generate your report.
              <br />
              <span className="font-bold">{answered} answered</span> — {minAnswers - answered} more to go.
            </p>
          </div>
        )}

        <div className="text-center pb-4">
          <Link to="/" className="text-xs text-muted-foreground hover:text-slate-600 hover:underline underline-offset-4 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Helper Components ── */
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="font-bold text-base">{title}</h2>
    </div>
  );
}