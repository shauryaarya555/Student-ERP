import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Layers,
  BookOpen,
  MapPin,
  Tag,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { EventDeadline, EventType, PriorityLevel } from '../../types';
import { triggerConfetti } from '../../utils/confetti';

interface EventsScheduleViewProps {
  deadlines: EventDeadline[];
  onToggleStatus: (id: string) => void;
  onOpenAddModal: () => void;
}

export const EventsScheduleView: React.FC<EventsScheduleViewProps> = ({
  deadlines,
  onToggleStatus,
  onOpenAddModal,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  // Filtered list
  const filtered = useMemo(() => {
    return deadlines.filter((dl) => {
      if (selectedType !== 'all' && dl.type !== selectedType) return false;
      if (selectedPriority !== 'all' && dl.priority !== selectedPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = dl.title.toLowerCase().includes(q);
        const matchesSubject = dl.subjectName ? dl.subjectName.toLowerCase().includes(q) : false;
        const matchesLocation = dl.locationOrPlatform.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubject && !matchesLocation) return false;
      }
      return true;
    });
  }, [deadlines, selectedType, selectedPriority, searchQuery]);

  const pendingCount = deadlines.filter((d) => d.status === 'pending').length;
  const completedCount = deadlines.filter((d) => d.status === 'submitted' || d.status === 'completed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" /> Academic Schedule, Exams & Deliverables
          </h2>
          <p className="text-xs text-slate-500">
            Track upcoming assignment submissions, lab evaluations, seminar dates & university fests.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calendar View
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" /> Add Event / Task
          </button>
        </div>
      </div>

      {/* 3 Metric Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Deliverables</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{pendingCount} Active Items</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed / Submitted</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{completedCount} Completed</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgent Exams / Quizzes</p>
            <p className="text-2xl font-black text-rose-600 mt-1">
              {deadlines.filter((d) => d.type === 'exam' && d.status === 'pending').length} Upcoming
            </p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, subject, or location..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Type & Priority Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Categories</option>
            <option value="assignment">Assignments & Labs</option>
            <option value="exam">Exams & Tests</option>
            <option value="workshop">Workshops & Seminars</option>
            <option value="event">Campus Events</option>
            <option value="holiday">Holidays</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Normal</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'timeline' ? (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-xs shadow-xs">
              No upcoming events match your filter criteria.
            </div>
          ) : (
            filtered.map((item) => {
              const isCompleted = item.status === 'submitted' || item.status === 'completed';

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
                    isCompleted
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  {/* Left: Checkbox + Primary Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => {
                        onToggleStatus(item.id);
                        if (!isCompleted) triggerConfetti();
                      }}
                      className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'border-slate-300 bg-slate-50 hover:border-indigo-400 text-transparent'
                      }`}
                      title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            item.type === 'exam'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : item.type === 'assignment'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.type}
                        </span>

                        {item.priority === 'urgent' && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                            Urgent
                          </span>
                        )}

                        {item.weightage && (
                          <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            {item.weightage}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-bold text-slate-900 leading-snug ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                        {item.subjectName && (
                          <span className="flex items-center gap-1 text-slate-700 font-medium">
                            <BookOpen className="w-3 h-3 text-indigo-600" />
                            {item.subjectName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.locationOrPlatform}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Due Date & Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 shrink-0 gap-1 text-right">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-mono font-bold text-indigo-700">{item.dueDate}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.dueTime}</p>
                    </div>

                    <button
                      onClick={() => {
                        onToggleStatus(item.id);
                        if (!isCompleted) triggerConfetti();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all mt-1 ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isCompleted ? 'Submitted ✓' : 'Submit / Done'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Calendar Month Grid View */
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-600" /> September 2026 Academic Calendar
            </h3>
            <span className="text-xs font-mono text-indigo-600 font-semibold">Term 1 Exam Month</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const dateStr = `2026-09-${day.toString().padStart(2, '0')}`;
              const dayDeadlines = deadlines.filter((d) => d.dueDate === dateStr);

              return (
                <div
                  key={day}
                  className={`min-h-[80px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-colors ${
                    dayDeadlines.length > 0
                      ? 'bg-indigo-50/50 border-indigo-300 hover:border-indigo-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 font-mono">{day}</span>
                    {dayDeadlines.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>

                  <div className="space-y-1 mt-1">
                    {dayDeadlines.map((dl) => (
                      <div
                        key={dl.id}
                        onClick={() => onToggleStatus(dl.id)}
                        className="text-[9px] p-1 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 truncate cursor-pointer hover:bg-indigo-200 font-medium"
                        title={dl.title}
                      >
                        {dl.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
