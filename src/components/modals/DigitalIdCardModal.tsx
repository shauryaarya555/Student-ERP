import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, ShieldCheck, RefreshCw, Sparkles, Building2, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '../../types';

interface DigitalIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  privacyMode: boolean;
}

export const DigitalIdCardModal: React.FC<DigitalIdCardModalProps> = ({
  isOpen,
  onClose,
  profile,
  privacyMode,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-900 overflow-hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Digital Student Identity Card</h3>
                <p className="text-xs text-slate-500">University Smart Identity Verification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ID Card 3D Flip Container */}
          <div className="relative mx-auto w-full max-w-sm min-h-[420px] cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 25 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full h-full rounded-2xl shadow-xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 flex flex-col justify-between overflow-hidden text-white"
            >
              {/* Background ambient glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              {!isFlipped ? (
                /* FRONT OF CARD */
                <div className="flex flex-col justify-between h-full relative z-10 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                        UN
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold tracking-widest text-indigo-200 uppercase">Tech University</p>
                        <p className="text-[9px] text-indigo-300/80 uppercase tracking-wider">Official Student Pass</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </div>

                  {/* Photo & Primary Info */}
                  <div className="flex items-center gap-4 my-2">
                    <div className="relative">
                      <img
                        src={profile.avatar}
                        alt={profile.fullName}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-xl object-cover border-2 border-indigo-400/40 shadow-lg"
                      />
                      <div className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 text-white rounded-full p-1 shadow">
                        <Sparkles className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <h4 className="text-base font-bold text-white leading-tight">{profile.fullName}</h4>
                      <p className="text-xs text-indigo-300 font-medium">{profile.course}</p>
                      <div className="pt-1 space-y-0.5">
                        <p className="text-[10px] text-slate-300">
                          Roll No: <span className="font-mono font-bold text-white">{privacyMode ? '••••••••' : profile.rollNumber}</span>
                        </p>
                        <p className="text-[10px] text-slate-300">
                          PRN: <span className="font-mono text-indigo-200">{privacyMode ? '••••••••••••' : profile.prnNumber}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Meta */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-indigo-500/20 text-center">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase">Year / Sem</p>
                      <p className="text-xs font-bold text-white">{profile.year} • S{profile.semester}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase">Blood Group</p>
                      <p className="text-xs font-bold text-rose-300">{profile.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase">Batch</p>
                      <p className="text-xs font-bold text-white">{profile.batch}</p>
                    </div>
                  </div>

                  {/* Barcode & Security Hologram */}
                  <div className="pt-1 flex items-center justify-between border-t border-indigo-500/20 text-[10px] text-slate-400">
                    <div className="font-mono text-xs tracking-widest text-indigo-200">
                      ||| | |||| | || |||| || | ||
                    </div>
                    <span className="text-[9px] text-indigo-300">Tap card to flip</span>
                  </div>
                </div>
              ) : (
                /* BACK OF CARD */
                <div
                  className="flex flex-col justify-between h-full relative z-10 space-y-3"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="border-b border-indigo-500/20 pb-2 flex items-center justify-between">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Campus Access & Verification</p>
                    <QrCode className="w-4 h-4 text-indigo-300" />
                  </div>

                  <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-inner my-1 w-32 h-32 mx-auto">
                    {/* Simulated Clean QR */}
                    <div className="w-full h-full border-2 border-dashed border-slate-900/40 rounded flex flex-col items-center justify-center text-slate-900 text-center p-1">
                      <QrCode className="w-16 h-16 text-slate-900" />
                      <span className="text-[8px] font-mono font-bold mt-1 text-slate-700">AUTH: {profile.id}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] bg-slate-950/50 p-2.5 rounded-xl border border-indigo-500/20">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                      <span className="truncate">{profile.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Mail className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                      <span className="truncate">{profile.collegeEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Phone className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                      <span>Mentor: {profile.mentorName}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-center text-slate-400 leading-tight">
                    Property of University Administration. If found, please return to Student Affairs Center.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Flip Card View
            </button>

            <button
              onClick={() => {
                window.print();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
            >
              Download / Print Pass
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
