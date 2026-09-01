import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  Filter,
  Calculator,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { SubjectAttendance, MonthlyAttendanceData } from '../../types';

interface AttendanceViewProps {
  attendance: SubjectAttendance[];
  monthlyAttendance: MonthlyAttendanceData[];
  overallAttendance: number;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendance,
  monthlyAttendance,
  overallAttendance,
}) => {
  const [filterRisk, setFilterRisk] = useState<'all' | 'warning' | 'safe'>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(attendance[0]?.subjectId || '');
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'calculator' | 'trends'>('breakdown');
  const [selectedLogSubject, setSelectedLogSubject] = useState<SubjectAttendance | null>(null);

  // Filtered subjects
  const filteredSubjects = useMemo(() => {
    return attendance.filter((sub) => {
      if (filterRisk === 'warning') return sub.percentage < 80;
      if (filterRisk === 'safe') return sub.percentage >= 80;
      return true;
    });
  }, [attendance, filterRisk]);

  // Selected subject for simulator
  const activeSubject = useMemo(() => {
    return attendance.find((s) => s.subjectId === selectedSubjectId) || attendance[0];
  }, [attendance, selectedSubjectId]);

  // Bunk / Catchup Calculator Logic
  // Formula:
  // If current % > target:
  // (attended) / (total + x) >= target/100  =>  attended / (target/100) - total >= x  => x = floor(attended / (target/100) - total)
  // If current % < target:
  // (attended + y) / (total + y) >= target/100  =>  y*(1 - target/100) >= target/100*total - attended => y = ceil((target/100*total - attended) / (1 - target/100))
  const simulation = useMemo(() => {
    if (!activeSubject) return null;
    const { attendedClasses, totalClasses, percentage } = activeSubject;
    const target = targetPercentage / 100;

    if (percentage >= targetPercentage) {
      const maxBunks = Math.floor(attendedClasses / target - totalClasses);
      return {
        type: 'bunk' as const,
        count: Math.max(0, maxBunks),
        currentPercentage: percentage,
        targetPercentage,
      };
    } else {
      if (target >= 1) return { type: 'impossible' as const, count: 0, currentPercentage: percentage, targetPercentage };
      const classesNeeded = Math.ceil((target * totalClasses - attendedClasses) / (1 - target));
      return {
        type: 'attend' as const,
        count: Math.max(0, classesNeeded),
        currentPercentage: percentage,
        targetPercentage,
      };
    }
  }, [activeSubject, targetPercentage]);

  const totalClassesSum = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attendedClassesSum = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Quick Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" /> Attendance Records & Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time biometric & faculty attendance log sync across all registered courses.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'breakdown'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Subject Breakdown
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Bunk / Goal Planner
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'trends'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Trends
          </button>
        </div>
      </div>

      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Percentage Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Attendance</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">{overallAttendance}%</span>
              <span className="text-xs text-emerald-600 font-semibold">≥ 75% Mandate</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {attendedClassesSum} attended out of {totalClassesSum} held
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Clock className="w-7 h-7" />
          </div>
        </div>

        {/* Condonation Risk Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Examination Eligibility</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-600">Hall Ticket Clear</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {attendance.filter((s) => s.percentage < 75).length === 0
                ? 'All subjects exceed university threshold'
                : `${attendance.filter((s) => s.percentage < 75).length} subject requires condonation`}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        {/* Watchlist Subjects */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attention Watchlist</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-700">
                {attendance.filter((s) => s.percentage <= 78).length}
              </span>
              <span className="text-xs text-amber-600 font-semibold">Subjects &lt; 78%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">CS604 is currently at boundary (75.0%)</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'breakdown' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Subjects:</span>
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1 text-xs shadow-xs">
                <button
                  onClick={() => setFilterRisk('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    filterRisk === 'all'
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({attendance.length})
                </button>
                <button
                  onClick={() => setFilterRisk('warning')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    filterRisk === 'warning'
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Watchlist &lt; 80% ({attendance.filter((s) => s.percentage < 80).length})
                </button>
                <button
                  onClick={() => setFilterRisk('safe')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    filterRisk === 'safe'
                      ? 'bg-emerald-100 text-emerald-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Safe &gt; 80% ({attendance.filter((s) => s.percentage >= 80).length})
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('calculator')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors font-semibold"
            >
              <Calculator className="w-3.5 h-3.5" /> Open Attendance Calculator
            </button>
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((sub) => {
              const isWarning = sub.percentage < 80;
              const isCritical = sub.percentage < 75;

              return (
                <div
                  key={sub.subjectId}
                  className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  {/* Subject Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-indigo-700 font-mono text-[11px] font-bold border border-slate-200">
                        {sub.subjectCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isCritical
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isWarning
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isCritical ? 'Critical (<75%)' : isWarning ? 'Warning' : 'On Track'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">{sub.subjectName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{sub.professor}</p>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Attendance</span>
                      <span
                        className={`font-mono font-bold ${
                          isCritical ? 'text-rose-600' : isWarning ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {sub.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                      {/* 75% threshold guideline indicator */}
                      <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-rose-500 z-10" title="75% minimum" />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(100, sub.percentage)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{sub.attendedClasses} attended / {sub.totalClasses} total</span>
                      <span>Min 75% req</span>
                    </div>
                  </div>

                  {/* Schedule & Logs Trigger */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 truncate max-w-[130px]">{sub.room}</span>
                    <button
                      onClick={() => setSelectedLogSubject(sub)}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                    >
                      View Logs <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Simulator / Planner Tab */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Interactive Control Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attendance Goal & Bunk Planner</h3>
                <p className="text-xs text-slate-500">Calculate safe bunks or required recovery sessions</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Select Course / Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 text-xs"
                >
                  {attendance.map((s) => (
                    <option key={s.subjectId} value={s.subjectId}>
                      {s.subjectCode} - {s.subjectName} ({s.percentage}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-medium">Desired Target Attendance</label>
                  <span className="font-mono font-bold text-indigo-600">{targetPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="1"
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>60%</span>
                  <span>75% (Standard)</span>
                  <span>85% (Safe)</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Quick Target Buttons */}
              <div className="flex gap-2">
                {[75, 80, 85, 90].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTargetPercentage(t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      targetPercentage === t
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {t}% Target
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right 2 cols: Simulator Result & Calculation breakdown */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Planner Result for {activeSubject?.subjectCode}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{activeSubject?.subjectName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current Status: <strong className="text-slate-900">{activeSubject?.attendedClasses}</strong> / {activeSubject?.totalClasses} classes ({activeSubject?.percentage}%)
              </p>
            </div>

            {simulation?.type === 'bunk' ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Attendance Buffer Available</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  You can safely skip <span className="text-emerald-600">{simulation.count}</span> upcoming classes
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Even if you miss the next <strong>{simulation.count}</strong> lecture(s), your attendance will remain safely at or above your target of <strong>{targetPercentage}%</strong>.
                </p>
              </div>
            ) : simulation?.type === 'attend' ? (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-700">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Recovery Classes Required</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  Attend next <span className="text-amber-600">{simulation.count}</span> consecutive classes
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To boost your attendance from {simulation.currentPercentage}% to your target of <strong>{targetPercentage}%</strong>, you must not miss any of the upcoming <strong>{simulation.count}</strong> sessions.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                Adjust the target slider to calculate class requirements.
              </div>
            )}

            {/* Quick table of all subjects at target % */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-800 mb-2">Summary Across All 6 Courses at {targetPercentage}% Target:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {attendance.map((s) => {
                  const target = targetPercentage / 100;
                  const canBunk = s.percentage >= targetPercentage;
                  const diff = canBunk
                    ? Math.floor(s.attendedClasses / target - s.totalClasses)
                    : Math.ceil((target * s.totalClasses - s.attendedClasses) / (1 - target));

                  return (
                    <div key={s.subjectId} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <p className="font-mono font-bold text-slate-800">{s.subjectCode}</p>
                      <p className="text-[11px] text-slate-500">{s.percentage}% current</p>
                      <p className={`text-[11px] font-bold mt-1 ${canBunk ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {canBunk ? `Can skip: ${diff}` : `Need to attend: ${diff}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Comprehensive 6-Month Attendance Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Aggregated monthly attendance records across lecture, tutorial, and lab hours.
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendanceGradientDetailed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: any) => [`${value}%`, 'Attendance']}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendancePercentage"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#attendanceGradientDetailed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly breakdown table */}
            <div className="overflow-x-auto pt-4 border-t border-slate-100">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="pb-2 font-semibold">Month</th>
                    <th className="pb-2 font-semibold">Conducted Classes</th>
                    <th className="pb-2 font-semibold">Attended</th>
                    <th className="pb-2 font-semibold">Percentage</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyAttendance.map((m) => (
                    <tr key={m.month} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-900">{m.month}</td>
                      <td className="py-2.5 text-slate-600 font-mono">{m.total}</td>
                      <td className="py-2.5 text-emerald-600 font-mono">{m.attended}</td>
                      <td className="py-2.5 font-mono font-bold text-indigo-600">{m.attendancePercentage}%</td>
                      <td className="py-2.5">
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Compliant
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Class Log Drawer / Modal */}
      {selectedLogSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-indigo-600 font-bold">{selectedLogSubject.subjectCode}</span>
                <h3 className="text-sm font-bold text-slate-900">{selectedLogSubject.subjectName}</h3>
              </div>
              <button
                onClick={() => setSelectedLogSubject(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              <p className="text-[11px] text-slate-500 font-medium">Recent Class-by-Class Attendance Logs:</p>
              {selectedLogSubject.recentLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{log.topic}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{log.date}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      log.status === 'present'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : log.status === 'absent'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLogSubject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-xl text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
