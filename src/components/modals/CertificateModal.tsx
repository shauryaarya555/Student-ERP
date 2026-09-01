import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, CheckCircle2, QrCode, Share2, Download, Calendar, Building, Sparkles } from 'lucide-react';
import { Achievement } from '../../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement | null;
  studentName: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  achievement,
  studentName,
}) => {
  if (!isOpen || !achievement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-900 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-200">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Credential Verification</h3>
                <p className="text-xs text-slate-500">Institutional Authenticated Certificate</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Certificate Body Container */}
          <div className="mt-5 p-6 rounded-2xl bg-slate-50 border-2 border-indigo-200 relative overflow-hidden shadow-xs">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-100/50 rounded-full blur-2xl" />
            
            <div className="text-center space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> {achievement.tier} Tier Recognition
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900">{achievement.title}</h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                This certifies that <span className="text-indigo-700 font-semibold">{studentName}</span> has successfully met all institutional standards and rigorous criteria to be conferred this distinction.
              </p>

              <div className="pt-3 pb-2 text-left bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <p>{achievement.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {achievement.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-mono border border-indigo-100 font-medium">
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-left">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5">
                    <Building className="w-3 h-3 text-indigo-600" /> Issued By
                  </div>
                  <p className="text-xs font-semibold text-slate-800 truncate">{achievement.issuedBy}</p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5">
                    <Calendar className="w-3 h-3 text-indigo-600" /> Date
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{achievement.issueDate}</p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 mb-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Status
                  </div>
                  <p className="text-xs font-mono font-bold text-emerald-700">Cryptographically Verified</p>
                </div>
              </div>

              {/* Credential ID and QR */}
              {achievement.credentialId && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-left">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Credential ID</p>
                    <p className="text-xs font-mono font-bold text-indigo-700">{achievement.credentialId}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
                    <QrCode className="w-4 h-4 text-indigo-600" /> UN-LEDGER-VERIFIED
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(`Verified Credential: ${achievement.title} - ID: ${achievement.credentialId}`);
                  alert('Credential link copied to clipboard!');
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Credential
            </button>

            <button
              onClick={() => {
                window.print();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF Certificate
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
