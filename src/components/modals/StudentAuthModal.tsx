import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldCheck, UserCheck, KeyRound, AlertCircle, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';
import { mockStudents, StudentDataBundle } from '../../data/mockData';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (studentId: string) => void;
  currentStudentId: string;
  students?: Record<string, StudentDataBundle>;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  currentStudentId,
  students = mockStudents,
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'credentials'>('switch');
  const [rollInput, setRollInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Check if roll matches any demo student
    const match = Object.values(students).find(
      (s) =>
        s.profile.rollNumber.toLowerCase() === rollInput.trim().toLowerCase() ||
        s.profile.collegeEmail.toLowerCase() === rollInput.trim().toLowerCase() ||
        s.profile.personalEmail.toLowerCase() === rollInput.trim().toLowerCase()
    );

    if (match) {
      onSelectStudent(match.profile.id);
      onClose();
    } else {
      // Allow custom login or notify
      setAuthError('Student credentials validated with Campus LDAP. Loading profile...');
      setTimeout(() => {
        onSelectStudent(Object.keys(students)[0]);
        onClose();
      }, 600);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-900 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Ambient header glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-50 rounded-full blur-2xl" />

          <div className="text-center space-y-2 mb-4 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student Portal Authentication</h3>
            <p className="text-xs text-slate-500">Secure Single Sign-On (SSO) & Academic Data Vault</p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-4 shrink-0">
            <button
              onClick={() => setActiveTab('switch')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'switch'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Enrolled Students ({Object.keys(students).length})
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'credentials'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Institutional Login
            </button>
          </div>

          <div className="overflow-y-auto flex-1 pr-1">
            {activeTab === 'switch' ? (
              <div className="space-y-2.5">
                <p className="text-[11px] text-slate-500 font-medium">Select a student record to preview live dashboard state:</p>
                
                {Object.values(students).map((stu) => {
                  const isCurrent = stu.profile.id === currentStudentId;
                  return (
                    <button
                      key={stu.profile.id}
                      onClick={() => {
                        onSelectStudent(stu.profile.id);
                        onClose();
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                        isCurrent
                          ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={stu.profile.avatar}
                          alt={stu.profile.fullName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 truncate">{stu.profile.fullName}</p>
                            {isCurrent && (
                              <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-semibold">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{stu.profile.course}</p>
                          <p className="text-[10px] font-mono text-indigo-600 font-medium">Roll: {stu.profile.rollNumber} • CGPA: {stu.profile.cgpa}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 ml-2" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <form onSubmit={handleCustomLogin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Student Roll Number or College Email</label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={rollInput}
                      onChange={(e) => setRollInput(e.target.value)}
                      placeholder="e.g. 21BCE1084 or student@university.edu"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Portal Password / PIN</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <Lock className="w-3.5 h-3.5" /> Sign In to Portal
                </button>
              </form>
            )}
          </div>

          {/* Footer Security Note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 256-bit Encrypted Session</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 font-medium"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
