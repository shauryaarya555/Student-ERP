import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, BookOpen, Calendar, Award, Bell, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { StudentDataBundle } from '../../data/mockData';

interface SearchCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StudentDataBundle;
  onNavigate: (tabId: string) => void;
}

export const SearchCommandModal: React.FC<SearchCommandModalProps> = ({
  isOpen,
  onClose,
  data,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'Attendance & Subject' | 'Academic Grade' | 'Deadline & Exam' | 'Notice' | 'Achievement';
      tabId: string;
    }> = [];

    // Search Subjects & Attendance
    data.attendance.forEach((sub) => {
      if (
        sub.subjectName.toLowerCase().includes(q) ||
        sub.subjectCode.toLowerCase().includes(q) ||
        sub.professor.toLowerCase().includes(q)
      ) {
        items.push({
          id: `sub-${sub.subjectId}`,
          title: `${sub.subjectCode}: ${sub.subjectName}`,
          subtitle: `Attendance: ${sub.percentage}% • Prof: ${sub.professor}`,
          category: 'Attendance & Subject',
          tabId: 'attendance',
        });
      }
    });

    // Search Grades
    data.academicHistory.forEach((sem) => {
      sem.subjects.forEach((grade) => {
        if (
          grade.name.toLowerCase().includes(q) ||
          grade.code.toLowerCase().includes(q) ||
          sem.semesterName.toLowerCase().includes(q)
        ) {
          items.push({
            id: `grade-${grade.code}-${sem.semesterNumber}`,
            title: `${grade.code}: ${grade.name}`,
            subtitle: `${sem.semesterName} • Grade ${grade.gradeLetter} (${grade.totalMarks}/100)`,
            category: 'Academic Grade',
            tabId: 'academics',
          });
        }
      });
    });

    // Search Deadlines
    data.deadlines.forEach((dl) => {
      if (
        dl.title.toLowerCase().includes(q) ||
        (dl.subjectName && dl.subjectName.toLowerCase().includes(q)) ||
        dl.description.toLowerCase().includes(q)
      ) {
        items.push({
          id: `dl-${dl.id}`,
          title: dl.title,
          subtitle: `Due: ${dl.dueDate} (${dl.dueTime}) • Priority: ${dl.priority}`,
          category: 'Deadline & Exam',
          tabId: 'schedule',
        });
      }
    });

    // Search Announcements
    data.announcements.forEach((ann) => {
      if (
        ann.title.toLowerCase().includes(q) ||
        ann.content.toLowerCase().includes(q) ||
        ann.senderName.toLowerCase().includes(q)
      ) {
        items.push({
          id: `ann-${ann.id}`,
          title: ann.title,
          subtitle: `From: ${ann.senderName} (${ann.department})`,
          category: 'Notice',
          tabId: 'announcements',
        });
      }
    });

    // Search Achievements
    data.achievements.forEach((ach) => {
      if (
        ach.title.toLowerCase().includes(q) ||
        ach.issuedBy.toLowerCase().includes(q) ||
        ach.skills.some((s) => s.toLowerCase().includes(q))
      ) {
        items.push({
          id: `ach-${ach.id}`,
          title: ach.title,
          subtitle: `Issued by: ${ach.issuedBy} • ${ach.tier} Tier`,
          category: 'Achievement',
          tabId: 'achievements',
        });
      }
    });

    if ('register student new enroll add admissions'.includes(q) || q.includes('reg') || q.includes('enroll') || q.includes('add')) {
      items.push({
        id: 'action-register',
        title: 'Register New Student',
        subtitle: 'Admit new student record, configure academic branch and course profile',
        category: 'Notice',
        tabId: 'register',
      });
    }

    return items.slice(0, 8);
  }, [query, data]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
            <Search className="w-5 h-5 text-indigo-600 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subjects, assignments, grades, notices, or achievements..."
              className="w-full bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
            {query.trim() === '' ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <p className="font-semibold text-slate-800 mb-1">Quick Portal Navigation</p>
                <p>Type to immediately search across subjects, deadlines, grades, awards and circulars.</p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {['Distributed Systems', 'Mid-Term Exam', 'Algorithms', 'Placement Notice', 'Dean Roll'].map(
                    (example) => (
                      <button
                        key={example}
                        onClick={() => setQuery(example)}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 text-indigo-700 text-[11px] border border-slate-200 hover:border-indigo-200 transition-colors font-medium"
                      >
                        {example}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No matching records found for <span className="text-slate-900 font-semibold">"{query}"</span>
              </div>
            ) : (
              results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.tabId);
                    onClose();
                  }}
                  className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-indigo-600 group-hover:text-white group-hover:bg-indigo-600 transition-colors shrink-0">
                      {item.category === 'Attendance & Subject' && <BookOpen className="w-4 h-4" />}
                      {item.category === 'Academic Grade' && <CheckCircle2 className="w-4 h-4" />}
                      {item.category === 'Deadline & Exam' && <Calendar className="w-4 h-4" />}
                      {item.category === 'Notice' && <Bell className="w-4 h-4" />}
                      {item.category === 'Achievement' && <Award className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-indigo-600">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
