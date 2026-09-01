import React, { useState, useMemo } from 'react';
import {
  Clock,
  GraduationCap,
  Award,
  Calendar,
  Bell,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  ChevronRight,
  BookOpen,
  Sparkles,
  Zap,
  Coffee,
  Heart,
  Smile,
  Flame,
  Check,
  Compass,
  MapPin,
  MessageSquare,
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
import { StudentDataBundle } from '../../data/mockData';
import { EventDeadline, FacultyAnnouncement } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface OverviewProps {
  data: StudentDataBundle;
  privacyMode: boolean;
  onNavigate: (tabId: string) => void;
  onOpenIdCard: () => void;
  onToggleDeadlineStatus: (id: string) => void;
  onOpenAnnouncementDetail: (announcement: FacultyAnnouncement) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  data,
  privacyMode,
  onNavigate,
  onOpenIdCard,
  onToggleDeadlineStatus,
  onOpenAnnouncementDetail,
}) => {
  const { profile, attendance, monthlyAttendance, academicHistory, deadlines, announcements, achievements } = data;

  const currentSemester = academicHistory[0]; // Sem 6
  const pendingDeadlines = deadlines.filter((d) => d.status !== 'completed').slice(0, 3);
  const lowAttendanceSubjects = attendance.filter((s) => s.percentage < 80);

  // Dynamic Time of Day Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: '☀️', message: 'Ready to tackle your classes today?' };
    if (hour < 17) return { text: 'Good afternoon', icon: '🌤️', message: 'Keep the momentum going strong!' };
    return { text: 'Good evening', icon: '🌙', message: 'Winding down? Great work today!' };
  }, []);

  // Daily Vibe & Focus Check-in
  const [dailyMood, setDailyMood] = useState<'focused' | 'coffee' | 'calm' | 'exam'>('focused');
  const [completedToday, setCompletedToday] = useState(false);

  const moodDetails = {
    focused: {
      label: '⚡ High Energy & Focused',
      quote: "You're in peak flow! Deep Learning lab at 2:00 PM is your biggest milestone today.",
      color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    },
    coffee: {
      label: '☕ Fueling Up',
      quote: "Grab that coffee! You have a 1-hour study window before Dr. Evelyn's lecture.",
      color: 'bg-amber-50 border-amber-200 text-amber-800',
    },
    calm: {
      label: '🧘 Steady & Balanced',
      quote: 'Pacing yourself smoothly. 88% overall attendance keeps you well in the safety zone.',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    },
    exam: {
      label: '🎯 Target Review Mode',
      quote: 'Reviewing core algorithms? Check the GPA planner to simulate your target Sem 6 SGPA.',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
    },
  };

  // Chart data for semester SGPA trajectory
  const sgpaTrendData = [...academicHistory]
    .reverse()
    .map((sem) => ({
      semester: `Sem ${sem.semesterNumber}`,
      sgpa: sem.sgpa,
      credits: sem.creditsEarned,
    }));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Humanized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 lg:p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative group cursor-pointer" onClick={onOpenIdCard}>
              <img
                src={profile.avatar}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400/70 shadow-xl transition-transform group-hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md" title="Active Student">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{greeting.text}, {profile.fullName.split(' ')[0]}!</span>
                  <span className="text-lg">{greeting.icon}</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {profile.year} • Semester {profile.semester}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {profile.course} • <span className="font-mono text-indigo-200">{privacyMode ? 'Roll: ••••••••' : `Roll: ${profile.rollNumber}`}</span>
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Compass className="w-3 h-3 text-indigo-400" />
                  Mentor: <strong className="text-slate-200">{profile.mentorName}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {greeting.message}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenIdCard}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm group"
            >
              <CreditCard className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Digital ID Pass</span>
            </button>

            <button
              onClick={() => onNavigate('academics')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/25 group"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Academic Transcript</span>
            </button>
          </div>
        </div>
      </div>

      {/* Human Daily Mood / Focus Quick Check-in */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">How's your study vibe today?</span>
          </div>
          <span className="text-[11px] text-slate-500">Pick a focus mindset for personalized tips</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'focused', label: '⚡ Focused', icon: Zap },
            { id: 'coffee', label: '☕ Fueling Up', icon: Coffee },
            { id: 'calm', label: '🧘 Calm & Balanced', icon: Heart },
            { id: 'exam', label: '🎯 Review Mode', icon: Flame },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setDailyMood(item.id as any);
                if (!completedToday) {
                  triggerConfetti();
                  setCompletedToday(true);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                dailyMood === item.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${moodDetails[dailyMood].color}`}>
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">{moodDetails[dailyMood].label}:</span>{' '}
            <span className="opacity-90">{moodDetails[dailyMood].quote}</span>
          </div>
        </div>
      </div>

      {/* 4 Top Highlights Metric Cards - Humanized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div
          onClick={() => onNavigate('attendance')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Health</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {profile.overallAttendance}%
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                profile.overallAttendance >= 85
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : profile.overallAttendance >= 75
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {profile.overallAttendance >= 85 ? '🌟 Great Shape' : profile.overallAttendance >= 75 ? 'Safe (>75%)' : 'Needs Attention'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>6 Registered Subjects</span>
            <span className="text-indigo-600 font-semibold flex items-center gap-0.5 group-hover:underline">
              Bunk Planner <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CGPA Card */}
        <div
          onClick={() => onNavigate('academics')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Standing</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {privacyMode ? '•••' : profile.cgpa}{' '}
              <span className="text-xs font-normal text-slate-400">/ 10.0</span>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Rank #{profile.rankInBatch} (Top 8%)
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>Sem 6 SGPA: {currentSemester.sgpa}</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5 group-hover:underline">
              Gradebook <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Achievements Card */}
        <div
          onClick={() => onNavigate('achievements')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recognitions & Badges</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {achievements.length}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              2 Diamond Tiers
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>Hackathons & Papers</span>
            <span className="text-amber-700 font-semibold flex items-center gap-0.5 group-hover:underline">
              Trophy Case <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Deadlines Card */}
        <div
          onClick={() => onNavigate('schedule')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Tasks</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {deadlines.filter((d) => d.status === 'pending').length}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              2 Due This Week
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>Assignments & Quizzes</span>
            <span className="text-rose-700 font-semibold flex items-center gap-0.5 group-hover:underline">
              Checklist <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Low Attendance Warm Encouragement Bar if any */}
      {lowAttendanceSubjects.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-950">Friendly Reminder:</span>{' '}
              {lowAttendanceSubjects.map((s) => `${s.subjectTitle} (${s.percentage}%)`).join(', ')} is close to the 75% cutoff. Attending the next couple of classes will get you right back on track!
            </div>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0 shadow-xs"
          >
            Calculate Recovery
          </button>
        </div>
      )}

      {/* Main Grid: Charts & Urgent Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Attendance & Academic Trend */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Attendance Chart Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Attendance Rhythm This Semester
                </h3>
                <p className="text-xs text-slate-500">Your classroom presence consistency month by month</p>
              </div>
              <button
                onClick={() => onNavigate('attendance')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Subject-wise →
              </button>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyAttendance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                    fill="url(#attendanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick mini-summary */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-500">Overall Average</p>
                <p className="text-sm font-bold text-indigo-600">{profile.overallAttendance}%</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-500">Total Lectures</p>
                <p className="text-sm font-bold text-slate-800">214 Conducted</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-500">Attended</p>
                <p className="text-sm font-bold text-emerald-600">185 Sessions</p>
              </div>
            </div>
          </div>

          {/* Academic SGPA Progression Chart */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Your GPA Journey Across Semesters
                </h3>
                <p className="text-xs text-slate-500">Consistent upward climb from Semester 1 through Semester 6</p>
              </div>
              <button
                onClick={() => onNavigate('academics')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Full Gradebook →
              </button>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sgpaTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[7.0, 10.0]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(val: any) => [`${val} SGPA`, 'Grade Point']}
                  />
                  <Bar dataKey="sgpa" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Deadlines & Faculty Notices */}
        <div className="space-y-6">
          {/* Actionable Deadlines Widget */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">What's on Your Plate</h3>
                  <p className="text-[11px] text-slate-500">Upcoming tasks & assignments</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('schedule')}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                All ({deadlines.length})
              </button>
            </div>

            <div className="space-y-3">
              {pendingDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        dl.type === 'exam'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : dl.type === 'assignment'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {dl.type}
                    </span>
                    <span className="text-[10px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      📅 {dl.dueDate}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800 line-clamp-2">{dl.title}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[11px]">
                    <span className="text-slate-500 truncate max-w-[130px]">
                      {dl.subjectCode || dl.locationOrPlatform}
                    </span>
                    <button
                      onClick={() => {
                        onToggleDeadlineStatus(dl.id);
                        triggerConfetti();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Mark as Done</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Quick Feed */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Campus & Faculty Notices</h3>
                  <p className="text-[11px] text-slate-500">Updates from your professors</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                View Feed →
              </button>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => onOpenAnnouncementDetail(ann)}
                  className="pt-3 first:pt-0 cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                      {ann.department}
                    </span>
                    <span className="text-[10px] text-slate-400">{ann.timestamp}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {ann.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
