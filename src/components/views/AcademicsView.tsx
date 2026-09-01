import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  Download,
  Printer,
  Sparkles,
  Calculator,
  ChevronRight,
  CheckCircle2,
  FileText,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { SemesterRecord, StudentProfile } from '../../types';

interface AcademicsViewProps {
  academicHistory: SemesterRecord[];
  profile: StudentProfile;
  privacyMode: boolean;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  academicHistory,
  profile,
  privacyMode,
}) => {
  const [selectedSemesterIndex, setSelectedSemesterIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'gradebook' | 'planner' | 'analytics'>('gradebook');

  // Simulator state
  const [targetGraduatingCgpa, setTargetGraduatingCgpa] = useState<number>(9.3);
  const [remainingCredits, setRemainingCredits] = useState<number>(40); // e.g. Sem 7 (20) + Sem 8 (20)

  const activeSemester = academicHistory[selectedSemesterIndex] || academicHistory[0];

  // SGPA Progression data
  const progressionData = useMemo(() => {
    return [...academicHistory].reverse().map((sem) => ({
      semester: `Sem ${sem.semesterNumber}`,
      sgpa: sem.sgpa,
      credits: sem.creditsEarned,
      cgpaProgressive: 0, // calculate cumulative
    }));
  }, [academicHistory]);

  // Grade Letter distribution for current semester
  const gradeDistribution = useMemo(() => {
    const counts: Record<string, number> = { O: 0, 'A+': 0, A: 0, 'B+': 0, B: 0, C: 0 };
    activeSemester.subjects.forEach((sub) => {
      if (counts[sub.gradeLetter] !== undefined) {
        counts[sub.gradeLetter]++;
      }
    });
    return Object.entries(counts).map(([grade, count]) => ({ grade, count }));
  }, [activeSemester]);

  // Target SGPA calculation for remaining semesters
  // currentTotalPoints = profile.cgpa * profile.totalCreditsEarned
  // targetTotalPoints = targetGraduatingCgpa * (profile.totalCreditsEarned + remainingCredits)
  // requiredPoints = targetTotalPoints - currentTotalPoints
  // requiredSGPA = requiredPoints / remainingCredits
  const targetRequiredSgpa = useMemo(() => {
    const currentPoints = profile.cgpa * profile.totalCreditsEarned;
    const totalCredits = profile.totalCreditsEarned + remainingCredits;
    const targetPoints = targetGraduatingCgpa * totalCredits;
    const neededPoints = targetPoints - currentPoints;
    const reqSgpa = neededPoints / remainingCredits;
    return Number(reqSgpa.toFixed(2));
  }, [profile.cgpa, profile.totalCreditsEarned, targetGraduatingCgpa, remainingCredits]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" /> Academic Performance & Gradebook
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive semester-wise transcripts, credit tallies, and GPA trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Sub Navigation */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveTab('gradebook')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'gradebook' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gradebook
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'planner' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" /> Target Simulator
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Analytics
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Print Academic Summary"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Academic Highlights Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* CGPA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cumulative CGPA</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900">{privacyMode ? '•••' : profile.cgpa}</span>
            <span className="text-xs text-slate-400 font-mono">/ 10.0</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">First Class with Distinction</p>
        </div>

        {/* Current SGPA */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{activeSemester.semesterName}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-indigo-600">{privacyMode ? '•••' : activeSemester.sgpa}</span>
            <span className="text-xs text-slate-400 font-mono">SGPA</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{activeSemester.creditsEarned} Credits Earned</p>
        </div>

        {/* Total Earned Credits */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Degree Credits</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900">{profile.totalCreditsEarned}</span>
            <span className="text-xs text-slate-400 font-mono">/ 175 Total</span>
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">75.4% Degree Completed</p>
        </div>

        {/* Batch Standing */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department Rank</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-700">#{profile.rankInBatch}</span>
            <span className="text-xs text-slate-400">/ {profile.totalStudentsInBatch}</span>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Top 5% Percentile</p>
        </div>
      </div>

      {/* Main Tab: Gradebook View */}
      {activeTab === 'gradebook' && (
        <div className="space-y-6">
          {/* Semester Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {academicHistory.map((sem, idx) => (
              <button
                key={sem.semesterNumber}
                onClick={() => setSelectedSemesterIndex(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedSemesterIndex === idx
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
                }`}
              >
                Semester {sem.semesterNumber}{' '}
                <span className="font-mono text-[10px] ml-1 opacity-80">({sem.sgpa} SGPA)</span>
              </button>
            ))}
          </div>

          {/* Detailed Course Grade Table */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  {activeSemester.semesterName} • {activeSemester.academicYear}
                </h3>
                <p className="text-xs text-slate-500">
                  Total Courses: {activeSemester.subjects.length} • Registered Credits: {activeSemester.totalCredits}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-slate-500">Semester SGPA:</span>
                <span className="font-mono font-black text-indigo-700 text-sm">
                  {privacyMode ? '•••' : activeSemester.sgpa} / 10.0
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-semibold">Course Code</th>
                    <th className="pb-3 font-semibold">Course Title</th>
                    <th className="pb-3 font-semibold text-center">Credits</th>
                    <th className="pb-3 font-semibold text-center">Internal (30/40)</th>
                    <th className="pb-3 font-semibold text-center">External (70/60)</th>
                    <th className="pb-3 font-semibold text-center">Total (100)</th>
                    <th className="pb-3 font-semibold text-center">Grade</th>
                    <th className="pb-3 font-semibold text-center">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeSemester.subjects.map((sub) => (
                    <tr key={sub.code} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono font-bold text-indigo-700">{sub.code}</td>
                      <td className="py-3 font-semibold text-slate-800">{sub.name}</td>
                      <td className="py-3 text-center font-mono text-slate-600">{sub.credits}</td>
                      <td className="py-3 text-center font-mono text-slate-600">
                        {privacyMode ? '••' : `${sub.internalMarks}/${sub.internalMax}`}
                      </td>
                      <td className="py-3 text-center font-mono text-slate-600">
                        {privacyMode ? '••' : `${sub.externalMarks}/${sub.externalMax}`}
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-slate-900">
                        {privacyMode ? '••' : sub.totalMarks}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-black font-mono border ${
                            sub.gradeLetter === 'O'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : sub.gradeLetter === 'A+'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {privacyMode ? '•' : sub.gradeLetter}
                        </span>
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-slate-700">
                        {privacyMode ? '••' : sub.gradePoint}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grading Scale Legend */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
              <span className="font-semibold text-slate-700">Grading System:</span>
              <span>O: Outstanding (10)</span>
              <span>A+: Excellent (9)</span>
              <span>A: Very Good (8)</span>
              <span>B+: Good (7)</span>
              <span>B: Above Average (6)</span>
            </div>
          </div>
        </div>
      )}

      {/* Target Simulator Tab */}
      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Target CGPA Simulator</h3>
                <p className="text-xs text-slate-500">Predict required future semester performance</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Current Cumulative CGPA</label>
                <input
                  type="text"
                  disabled
                  value={`${profile.cgpa} (${profile.totalCreditsEarned} Credits Earned)`}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-medium">Desired Graduating CGPA</label>
                  <span className="font-mono font-bold text-indigo-600 text-sm">{targetGraduatingCgpa}</span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="9.8"
                  step="0.05"
                  value={targetGraduatingCgpa}
                  onChange={(e) => setTargetGraduatingCgpa(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>8.0</span>
                  <span>9.0 (Gold Medal)</span>
                  <span>9.5</span>
                  <span>9.8</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Remaining Credits to Complete</label>
                <select
                  value={remainingCredits}
                  onChange={(e) => setRemainingCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 text-xs"
                >
                  <option value={40}>40 Credits (Sem 7: 20cr + Sem 8: 20cr)</option>
                  <option value={20}>20 Credits (1 Semester remaining)</option>
                  <option value={60}>60 Credits (3 Semesters remaining)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simulator Outcome Card */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Graduation Trajectory Forecast
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Targeting {targetGraduatingCgpa} Graduating CGPA</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current baseline: {profile.cgpa} CGPA across {profile.totalCreditsEarned} credits.
              </p>
            </div>

            {targetRequiredSgpa <= 10.0 && targetRequiredSgpa >= 0 ? (
              <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Feasible Academic Roadmap</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  You need an average SGPA of <span className="text-indigo-600">{targetRequiredSgpa}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  By securing an average of <strong>{targetRequiredSgpa} SGPA</strong> in your remaining {remainingCredits} credits, your final graduating CGPA will reach <strong>{targetGraduatingCgpa}</strong>.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-xs text-rose-700">
                <p className="font-bold text-rose-800">Mathematically Out of Range</p>
                <p>
                  To reach {targetGraduatingCgpa} with only {remainingCredits} credits left, a required SGPA would exceed the 10.0 scale ({targetRequiredSgpa}). Consider adjusting the target.
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-500">Target Grade Tier</p>
                <p className="text-xs font-bold text-emerald-700">Mostly O / A+ Grades</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-500">Minimum Marks Avg</p>
                <p className="text-xs font-bold text-indigo-700">≥ 88 / 100</p>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-500">Honors Eligibility</p>
                <p className="text-xs font-bold text-amber-700">Qualified</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progression Graph */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Semester-Wise SGPA Progression
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[8.0, 10.0]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      color: '#0f172a',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line type="monotone" dataKey="sgpa" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Current Semester Grade Distribution
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="grade" stroke="#94a3b8" fontSize={11} />
                  <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      color: '#0f172a',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
