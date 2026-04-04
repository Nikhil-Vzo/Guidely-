import * as React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap, Target, BookOpen, TrendingUp,
  ChevronRight, Zap,
  Microscope, LineChart, Landmark, Hammer, Sparkles, Building2,
  Award, RotateCcw, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store";
import type { QuizResult, StreamKey as QuizStreamKey } from "@/store/slices/quizSlice";

/* ─────────────────────────────────────────────
   DATA LAYER
───────────────────────────────────────────── */
type StreamKey = "science" | "commerce" | "arts" | "vocational";

const STREAMS: Record<StreamKey, {
  label: string; tagline: string; icon: React.ReactNode; shortDesc: string;
  theme: { base: string; accent: string; text: string; bg: string };
  degrees: { name: string; duration: string; type: string }[];
  careers: { role: string; sector: string; salaryRange: string; growth: number }[];
  govtExams: { name: string; level: string; posts: string }[];
  higherStudies: string[];
  entrepreneurship: { idea: string; desc: string }[];
  keyFact: string;
}> = {
  science: {
    label: "Science & Technology", tagline: "Build the future — from code to cures", shortDesc: "Tech · Health · Research",
    icon: <Microscope className="w-5 h-5" />,
    theme: { base: "bg-blue-100", accent: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50/50" },
    degrees: [
      { name: "B.Tech / B.E.", duration: "4 years", type: "Engineering" },
      { name: "MBBS", duration: "5.5 years", type: "Medical" },
      { name: "B.Sc (PCM/CS)", duration: "3 years", type: "Pure Science" },
      { name: "B.Pharm", duration: "4 years", type: "Pharmacy" },
      { name: "B.Sc Agriculture", duration: "4 years", type: "Agriculture" },
      { name: "BDS (Dental)", duration: "5 years", type: "Medical" },
    ],
    careers: [
      { role: "Software Engineer", sector: "IT / Tech", salaryRange: "₹4L – ₹25L+", growth: 4 },
      { role: "Doctor / Surgeon", sector: "Healthcare", salaryRange: "₹8L – ₹40L+", growth: 4 },
      { role: "Data Scientist", sector: "Analytics", salaryRange: "₹6L – ₹30L+", growth: 4 },
      { role: "Mechanical Eng.", sector: "Manufacturing", salaryRange: "₹3.5L – ₹15L", growth: 2 },
      { role: "Research Scientist", sector: "R&D", salaryRange: "₹4L – ₹18L", growth: 3 },
      { role: "Pharmacist", sector: "Retail", salaryRange: "₹2.5L – ₹8L", growth: 2 },
    ],
    govtExams: [
      { name: "JEE Mains & Adv", level: "National", posts: "IIT / NIT / Engineering" },
      { name: "NEET-UG", level: "National", posts: "Govt Medical Colleges" },
      { name: "GATE", level: "National", posts: "M.Tech + PSU jobs" },
      { name: "ISRO Scientist", level: "National", posts: "Space Research Grade SD" },
      { name: "SSC JE", level: "National", posts: "Junior Engineer" },
    ],
    higherStudies: ["M.Tech / MS", "MD / MS", "M.Sc + Ph.D", "MBA (Tech)", "Data Science & AI"],
    entrepreneurship: [
      { idea: "Tech Startup", desc: "Build SaaS products, apps or digital tools" },
      { idea: "Health Clinic", desc: "Private practice or rural health center" },
      { idea: "Agri-Tech Venture", desc: "Smart farming & organic produce brand" },
    ],
    keyFact: "Science students have the highest flexibility to pivot into tech, management, or design degrees later.",
  },
  commerce: {
    label: "Commerce & Business", tagline: "Lead organisations, build wealth, shape markets", shortDesc: "Business · Finance · Law",
    icon: <LineChart className="w-5 h-5" />,
    theme: { base: "bg-emerald-100", accent: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50/50" },
    degrees: [
      { name: "B.Com", duration: "3 years", type: "Commerce" },
      { name: "BBA / BBM", duration: "3 years", type: "Management" },
      { name: "CA", duration: "4–5 years", type: "Professional" },
      { name: "CS", duration: "3–4 years", type: "Professional" },
      { name: "B.Economics", duration: "3 years", type: "Economics" },
      { name: "BMS", duration: "3 years", type: "Management" },
    ],
    careers: [
      { role: "Chartered Accountant", sector: "Audit", salaryRange: "₹7L – ₹35L+", growth: 4 },
      { role: "Bank PO / Manager", sector: "Banking", salaryRange: "₹5L – ₹18L", growth: 3 },
      { role: "Business Analyst", sector: "Consulting", salaryRange: "₹5L – ₹22L", growth: 4 },
      { role: "Marketing Manager", sector: "FMCG", salaryRange: "₹4L – ₹20L", growth: 3 },
      { role: "Financial Analyst", sector: "Investments", salaryRange: "₹5L – ₹25L", growth: 4 },
      { role: "HR Manager", sector: "Corporate", salaryRange: "₹3.5L – ₹15L", growth: 2 },
    ],
    govtExams: [
      { name: "IBPS / SBI PO", level: "National", posts: "Probationary Officer" },
      { name: "SSC CGL", level: "National", posts: "Tax Inspector, Auditor" },
      { name: "UPSC CSE Combo", level: "National", posts: "IAS, IRS Officers" },
      { name: "RBI Grade B", level: "National", posts: "Reserve Bank Officer" },
      { name: "LIC / Ins AAO", level: "National", posts: "Admin Officer" },
    ],
    higherStudies: ["MBA", "M.Com", "CMA / ICWA", "CFA", "LLB (Corporate Law)"],
    entrepreneurship: [
      { idea: "Trading Business", desc: "GST-registered wholesale distribution" },
      { idea: "Financial Advisory", desc: "Tax filing & audit consultancy" },
      { idea: "D2C E-Commerce", desc: "Build & scale a digital native brand" },
    ],
    keyFact: "CA professionals in India hold the signature authority on balance sheets, giving absolute monopoly.",
  },
  arts: {
    label: "Arts & Humanities", tagline: "Shape society, serve citizens, tell stories", shortDesc: "Public · Media · Law",
    icon: <Landmark className="w-5 h-5" />,
    theme: { base: "bg-purple-100", accent: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50/50" },
    degrees: [
      { name: "B.A. (History/PolSci)", duration: "3 years", type: "Humanities" },
      { name: "B.A. Psychology", duration: "3 years", type: "Social Science" },
      { name: "LLB / B.A. LLB", duration: "5 years", type: "Legal" },
      { name: "B.Journalism", duration: "3 years", type: "Media" },
      { name: "B.Ed", duration: "2 years", type: "Education" },
      { name: "B.SW", duration: "3 years", type: "Social Service" },
    ],
    careers: [
      { role: "IAS / IPS Officer", sector: "Govt", salaryRange: "₹7.5L – ₹25L", growth: 4 },
      { role: "Lawyer / Advocate", sector: "Legal", salaryRange: "₹3L – ₹30L+", growth: 3 },
      { role: "Journalist", sector: "Media", salaryRange: "₹3L – ₹20L+", growth: 2 },
      { role: "College Professor", sector: "Education", salaryRange: "₹3L – ₹15L", growth: 2 },
      { role: "Psychologist", sector: "Health", salaryRange: "₹3L – ₹15L", growth: 3 },
      { role: "Policy Maker", sector: "Dev", salaryRange: "₹3L – ₹12L", growth: 2 },
    ],
    govtExams: [
      { name: "UPSC Civil Services", level: "National", posts: "IAS / IPS / IFS" },
      { name: "CGPSC State Services", level: "State", posts: "Deputy Collector" },
      { name: "SSC CGL General", level: "National", posts: "Inspector, Assistant" },
      { name: "High Court Staff", level: "State", posts: "Clerk, Stenographer" },
      { name: "CTET / SET / NET", level: "Nat/State", posts: "Teaching posts" },
    ],
    higherStudies: ["M.A. (Humanities)", "LLM (Masters in Law)", "MBA", "Ph.D in Social Sciences", "PG in Journalism"],
    entrepreneurship: [
      { idea: "Content Studio", desc: "Podcast network or indie news media" },
      { idea: "Coaching Institute", desc: "UPSC / School subject tutoring" },
      { idea: "Social Enterprise", desc: "Non-profit community welfare org" },
    ],
    keyFact: "Over 60% of India's top civil servants and policy makers have an Arts & Humanities foundation.",
  },
  vocational: {
    label: "Vocational & Skills", tagline: "Master a practical trade. Earn sooner.", shortDesc: "Skills · Trades · Design",
    icon: <Hammer className="w-5 h-5" />,
    theme: { base: "bg-orange-100", accent: "bg-orange-500", text: "text-orange-600", bg: "bg-orange-50/50" },
    degrees: [
      { name: "ITI", duration: "1–2 years", type: "Trade" },
      { name: "Polytechnic Diploma", duration: "3 years", type: "Diploma" },
      { name: "B.Voc", duration: "3 years", type: "Skill Degree" },
      { name: "PMKVY Certificate", duration: "3–6 months", type: "Certification" },
      { name: "Hotel Mgmt", duration: "1–3 years", type: "Hospitality" },
      { name: "B.Sc Agriculture", duration: "4 years", type: "Agriculture" },
    ],
    careers: [
      { role: "Jr. Engineer", sector: "Factories", salaryRange: "₹2L – ₹8L", growth: 2 },
      { role: "Electrician", sector: "Infra", salaryRange: "₹2.5L – ₹7L", growth: 2 },
      { role: "Chef", sector: "Hospitality", salaryRange: "₹2.5L – ₹12L+", growth: 3 },
      { role: "UI/UX Designer", sector: "Digital", salaryRange: "₹2.5L – ₹15L", growth: 4 },
      { role: "Agri Entrepreneur", sector: "Farming", salaryRange: "₹1.5L – ₹10L+", growth: 2 },
      { role: "AC / HVAC Tech", sector: "Services", salaryRange: "₹2L – ₹6L", growth: 2 },
    ],
    govtExams: [
      { name: "Railways Group D", level: "National", posts: "Technician, Helper" },
      { name: "PSU Technician", level: "National", posts: "Apprentice / Trainee" },
      { name: "Agri Field Officer", level: "State", posts: "Extension Officer" },
      { name: "ITI Instructor", level: "State", posts: "Teaching at Govt ITI" },
      { name: "Tradesman", level: "National", posts: "Paramilitary technical" },
    ],
    higherStudies: ["B.E. via Lateral Entry", "M.Voc (Skill Masters)", "Design School (NID)", "Agri-Business MBA"],
    entrepreneurship: [
      { idea: "Repair & Services", desc: "AC, motor & electrical workshop" },
      { idea: "Cloud Kitchen", desc: "Modern food delivery brand" },
      { idea: "Freelance Agency", desc: "Logo, branding & design for businesses" },
    ],
    keyFact: "Vocational graduates often start earning 2-3 years earlier than their university-bound peers.",
  },
};

/* ─────────────────────────────────────────────
   CAREER REPORT CARD  (shown when quiz result exists)
───────────────────────────────────────────── */
const STREAM_COLORS: Record<string, { bar: string; pill: string; label: string }> = {
  science:    { bar: "bg-sky-500",    pill: "bg-sky-50 text-sky-700 border-sky-200",         label: "Science" },
  commerce:   { bar: "bg-emerald-500",pill: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Commerce" },
  arts:       { bar: "bg-purple-500", pill: "bg-purple-50 text-purple-700 border-purple-200", label: "Arts" },
  vocational: { bar: "bg-orange-500", pill: "bg-orange-50 text-orange-700 border-orange-200", label: "Vocational" },
};

function CareerReportCard({ result }: { result: QuizResult }) {
  const [expanded, setExpanded] = React.useState(true);
  const { ranked, personalityTag } = result.career_report;
  const topStream = ranked[0];
  const topColor  = STREAM_COLORS[topStream.key];

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white shadow-lg backdrop-blur-xl"
      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.92) 0%, rgba(109,40,217,0.88) 50%, rgba(219,39,119,0.85) 100%)" }}
    >
      {/* Decorative blob */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 bg-white pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-10 bg-white pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-xl bg-white/20">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Your Career Report</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {personalityTag}
            </h2>
            <p className="text-white/70 text-sm font-medium mt-1">
              Best-fit stream: <span className="text-white font-bold">{STREAMS[topStream.key as StreamKey]?.label ?? topStream.key}</span>
            </p>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex-shrink-0 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Animated stream score bars */}
        {expanded && (
          <div className="space-y-3 mb-6">
            {ranked.map((r, i) => {
              const col = STREAM_COLORS[r.key];
              return (
                <div key={r.key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-white/90 text-sm font-semibold">
                      {i === 0 && <span className="mr-1.5">🏆</span>}
                      {STREAMS[r.key as StreamKey]?.label ?? r.key}
                    </span>
                    <span className="text-white font-black text-sm">{r.pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${col.bar} transition-all duration-700`}
                      style={{ width: `${r.pct}%`, opacity: i === 0 ? 1 : 0.65 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Link
            to="/quiz"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
          </Link>
          <a
            href="#explore"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-violet-700 text-xs font-bold hover:bg-white/90 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Explore {STREAMS[topStream.key as StreamKey]?.label.split(" ")[0]} Careers
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function CareerMap() {
  const [active, setActive] = React.useState<StreamKey>("science");

  // Pick up quiz result from Redux store (single source of truth)
  const quizResult = useAppSelector((s) => s.quiz.result);

  React.useEffect(() => {
    if (quizResult?.top_stream && STREAMS[quizResult.top_stream as StreamKey]) {
      setActive(quizResult.top_stream as StreamKey);
    }
  }, [quizResult]);

  const S = STREAMS[active];

  return (
    <div className="min-h-screen bg-guidely-gradient selection:bg-primary/30 selection:text-primary-foreground pb-24">
      {/* Soft overlay to calm the gradient down slightly */}
      <div className="fixed inset-0 pointer-events-none bg-white/40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 relative z-10 space-y-10 border-white/50">

        {/* ── CAREER REPORT (only when quiz has been taken) ── */}
        {quizResult && <CareerReportCard result={quizResult} />}

        {/* Header */}
        <div id="explore" className="text-center space-y-4 max-w-3xl mx-auto scroll-mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-white/50 text-xs font-semibold text-primary uppercase tracking-widest mx-auto">
            <Sparkles className="w-3.5 h-3.5" /> Course & Career map 
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            {quizResult ? "Your recommended path" : "Find your path."}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
            {quizResult
              ? "Based on your quiz, here's your top-fit stream. Explore degrees, careers, and exams below."
              : "Discover exactly what each stream unlocks—from professional degrees and government roles to high-growth industries."}
          </p>
        </div>

        {/* Soft Glassmorphic Stream Selector */}
        <div className="relative max-w-4xl mx-auto">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none gap-3 snap-x">
            {(Object.entries(STREAMS) as [StreamKey, typeof S][]).map(([key, data]) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`snap-center isolate relative flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all duration-300 sm:w-56 w-[240px] shadow-sm backdrop-blur-md
                    ${isActive 
                      ? "bg-white/90 border border-white text-foreground ring-4 ring-primary/20 scale-[1.02]" 
                      : "bg-white/50 border border-white/40 text-muted-foreground hover:bg-white/70"
                    }
                  `}
                >
                  <div className={`p-2.5 rounded-[1rem] transition-colors duration-300 ${isActive ? data.theme.text + ' ' + data.theme.base : 'bg-white text-slate-400'}`}>
                    {data.icon}
                  </div>
                  <div className="text-left">
                    <p className={`text-[15px] font-bold tracking-tight ${isActive ? "text-foreground" : "inherit"}`}>{data.label.split(' ')[0]}</p>
                    <p className={`text-xs mt-0.5 font-semibold ${isActive ? data.theme.text : "inherit"}`}>{data.shortDesc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Soft Glassmorphic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Main Info Box */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Dynamic Banner */}
            <div className={`p-6 sm:p-8 rounded-[2rem] border border-white shadow-sm bg-white/70 backdrop-blur-xl relative overflow-hidden`}>
              <div className={`absolute -top-24 -right-24 w-64 h-64 blur-3xl opacity-20 -z-10 rounded-full transition-colors duration-700 ${S.theme.accent}`} />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-2 flex items-center gap-3">
                {S.label}
              </h2>
              <p className="text-muted-foreground font-semibold text-base sm:text-lg leading-snug max-w-md mb-6">{S.tagline}</p>
              
              <div className={`inline-flex items-start gap-3 p-4 rounded-2xl w-full border border-white/50 shadow-sm bg-white/60`}>
                <Zap className={`w-5 h-5 flex-shrink-0 mt-0.5 ${S.theme.text}`} />
                <p className="text-sm font-medium text-foreground leading-relaxed"><span className="font-bold">Did you know?</span> {S.keyFact}</p>
              </div>
            </div>

            {/* Careers Box */}
            <GlassBox icon={<Building2 />} title="Careers & Compensation">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {S.careers.map((c) => (
                  <div key={c.role} className="group p-4 rounded-[1.25rem] border border-white/60 bg-white/50 hover:bg-white/80 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sm text-foreground">{c.role}</p>
                      <div className="flex gap-1 mt-1.5">
                        {[1, 2, 3, 4].map(bar => (
                          <div key={bar} className={`w-1.5 h-1.5 rounded-full ${bar <= c.growth ? S.theme.accent : 'bg-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs font-semibold">
                      <span className="text-muted-foreground">{c.sector}</span>
                      <span className={`${S.theme.text} ${S.theme.bg} px-2 py-1 rounded-md`}>{c.salaryRange}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassBox>

            {/* Bottom Row inside Left Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassBox icon={<TrendingUp />} title="Entrepreneurship">
                <div className="space-y-3 mt-4">
                  {S.entrepreneurship.map((ent) => (
                    <div key={ent.idea} className="p-4 rounded-2xl bg-white/60 border border-white/60 shadow-sm">
                      <p className="text-sm font-bold text-foreground">{ent.idea}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-1 leading-relaxed">{ent.desc}</p>
                    </div>
                  ))}
                </div>
              </GlassBox>

              <GlassBox icon={<BookOpen />} title="Higher Studies">
                <div className="flex flex-col gap-2 mt-4">
                  {S.higherStudies.map((h) => (
                    <div key={h} className="flex items-center gap-3 p-3 rounded-2xl border border-white/60 bg-white/50 shadow-sm hover:bg-white/80 transition-colors">
                      <div className={`p-1 rounded-full ${S.theme.bg}`}>
                        <ChevronRight className={`w-3.5 h-3.5 ${S.theme.text}`} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </GlassBox>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Degrees Bento */}
            <GlassBox icon={<GraduationCap />} title="Top Degrees" highlight>
              <div className="space-y-3 mt-4">
                {S.degrees.map((d) => (
                  <div key={d.name} className="flex justify-between items-center group cursor-default p-2 rounded-xl hover:bg-black/5 transition-colors">
                    <div>
                      <p className="text-[15px] font-bold text-primary-foreground group-hover:text-white transition-colors">{d.name}</p>
                      <p className="text-xs text-primary-foreground/70 mt-0.5">{d.type}</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest">{d.duration}</span>
                  </div>
                ))}
              </div>
            </GlassBox>

            {/* Govt Exams Bento */}
            <GlassBox icon={<Target />} title="Govt. Exams">
              <div className="space-y-4 mt-4">
                {S.govtExams.map((e) => (
                  <div key={e.name} className="relative pl-5 border-l-2 border-white/80 pb-1">
                    <div className={`absolute w-2 h-2 rounded-full -left-[5px] top-1.5 ${S.theme.accent}`} />
                    <p className="text-sm font-bold text-foreground leading-none">{e.name}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-snug font-medium">{e.posts}</p>
                  </div>
                ))}
              </div>
            </GlassBox>

          </div>
        </div>

        {/* Soft Call to action */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 isolate">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-80" />
          <div className="z-10 text-center md:text-left space-y-2 max-w-sm">
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Need a suggestion?</h3>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed">Not sure which path suits you best? Take our intelligent aptitude test.</p>
          </div>
          <div className="z-10 flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <Button asChild variant="outline" className="h-12 rounded-xl border-white bg-white/50 text-foreground hover:bg-white shadow-sm px-6">
              <Link to="/colleges"><GraduationCap className="w-4 h-4 mr-2" /> Browse Colleges</Link>
            </Button>
            <Button asChild className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 shadow-sm font-semibold">
              <Link to="/quiz"><Sparkles className="w-4 h-4 mr-2" /> Start the Quiz</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GLASS BOX COMPONENT
───────────────────────────────────────────── */
function GlassBox({
  icon, title, children, highlight
}: {
  icon: React.ReactNode; title: string; children: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`p-6 sm:p-7 rounded-[2rem] shadow-sm backdrop-blur-xl transition-colors
      ${highlight 
        ? "bg-primary border-primary text-primary-foreground" 
        : "bg-white/70 border border-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center 
          ${highlight ? "bg-white/20 text-white" : "bg-white shadow-sm text-primary"}
        `}>
          {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
        </div>
        <h3 className={`font-extrabold text-sm tracking-wide ${highlight ? "text-primary-foreground" : "text-foreground"}`}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
