import React, { useState } from 'react';
import { UserProfile, StudyMode } from '../../types';
import { generateStudyAssistant } from '../../services/gemini';
import {
  BookOpen,
  Calculator,
  HelpCircle,
  Award,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  AlertCircle,
  GraduationCap,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface StudyAssistantProps {
  currentUser: UserProfile;
  onQuotaUpdate?: (remaining: number) => void;
  initialPrompt?: string;
}

export const StudyAssistant: React.FC<StudyAssistantProps> = ({
  currentUser,
  onQuotaUpdate,
  initialPrompt = '',
}) => {
  const [mode, setMode] = useState<StudyMode>('step_by_step');
  const [topic, setTopic] = useState('Physics: Newton\'s Laws of Motion');
  const [gradeLevel, setGradeLevel] = useState('Matric / O-Levels');
  const [question, setQuestion] = useState(initialPrompt);
  const [studyResult, setStudyResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const modes: { id: StudyMode; label: string; desc: string; icon: any }[] = [
    {
      id: 'step_by_step',
      label: 'Step-by-Step Solver',
      desc: 'Line-by-line derivation and formula breakdown for math and physics.',
      icon: Calculator,
    },
    {
      id: 'concept_explainer',
      label: 'Concept Explainer',
      desc: 'Intuitive analogies and real-world examples for complex concepts.',
      icon: Lightbulb,
    },
    {
      id: 'quiz_mcq',
      label: 'Interactive MCQ Quiz',
      desc: 'Multiple-choice test with 4 options and hidden explanations.',
      icon: Award,
    },
    {
      id: 'chapter_summary',
      label: 'Revision Notes & Summary',
      desc: 'Condensed exam prep flashcards, definitions, and formulas.',
      icon: FileText,
    },
    {
      id: 'exam_prep',
      label: 'Exam Practice & Tips',
      desc: 'High-yield past paper style questions and answering strategy.',
      icon: GraduationCap,
    },
  ];

  const handleStudy = async () => {
    if (!topic.trim() || loading) return;
    setError(null);
    setLoading(true);

    try {
      const response = await generateStudyAssistant({
        mode,
        topic,
        gradeLevel,
        question: question.trim() || `Comprehensive ${mode} for: ${topic}`,
        userId: currentUser.id,
        plan: currentUser.plan,
      });

      setStudyResult(response.result);
      if (onQuotaUpdate && typeof response.remainingQuota === 'number') {
        onQuotaUpdate(response.remainingQuota);
      }
    } catch (err: any) {
      setError(err?.message || 'Study Assistant error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(studyResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>AI Academic Study Assistant</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pedagogical tutor designed to explain underlying principles rather than dumping simple answers.
          </p>
        </div>
      </div>

      {/* Modes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id);
                setError(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                  : 'bg-[#101629] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">{m.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Inputs & Output Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Academic Topic or Chapter
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Organic Chemistry: Hydrocarbons, Calculus Limits, World History"
                className="w-full px-3 py-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Grade / Standard</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Middle School (Grade 6–8)">Middle School (Grade 6–8)</option>
                  <option value="Matric / O-Levels (Grade 9–10)">Matric / O-Levels (Grade 9–10)</option>
                  <option value="FSc / A-Levels (Grade 11–12)">FSc / A-Levels (Grade 11–12)</option>
                  <option value="Undergraduate University">Undergraduate University</option>
                  <option value="General Self-Learner">General Self-Learner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Learning Mode</label>
                <div className="p-2.5 text-xs text-emerald-400 bg-[#080B14] border border-white/10 rounded-xl font-medium truncate">
                  {modes.find((m) => m.id === mode)?.label}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Specific Question or Exercise (Optional)
              </label>
              <textarea
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Paste an exact homework problem, chemical equation, or topic question..."
                className="w-full p-3 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleStudy}
              disabled={loading || !topic.trim()}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all disabled:opacity-40 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing & Deriving...' : 'Start Study Session'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right: Output Pane */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 flex-1 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Interactive Lesson & Explanation</span>
              </div>

              {studyResult && (
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 min-h-[360px] overflow-y-auto">
              {studyResult ? (
                <div className="p-4 rounded-xl bg-[#080B14] border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {studyResult}
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3 border border-dashed border-white/10 rounded-xl">
                  <Calculator className="w-8 h-8 text-slate-600" />
                  <p className="text-xs max-w-sm leading-relaxed">
                    Enter a study topic or specific question to generate step-by-step solutions, analogies, or custom quiz questions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
