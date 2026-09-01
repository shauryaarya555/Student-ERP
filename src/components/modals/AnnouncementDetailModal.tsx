import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Pin, FileText, Download, Building, Calendar, Share2 } from 'lucide-react';
import { FacultyAnnouncement } from '../../types';

interface AnnouncementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: FacultyAnnouncement | null;
}

export const AnnouncementDetailModal: React.FC<AnnouncementDetailModalProps> = ({
  isOpen,
  onClose,
  announcement,
}) => {
  if (!isOpen || !announcement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-900 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={announcement.senderAvatar}
                alt={announcement.senderName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{announcement.senderName}</h4>
                  <span className="text-[10px] text-indigo-600 font-semibold">({announcement.senderRole})</span>
                </div>
                <p className="text-[10px] text-slate-500">{announcement.department}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Announcement Body */}
          <div className="mt-4 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  announcement.category === 'urgent'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                {announcement.category} Notice
              </span>
              <span className="text-[11px] text-slate-500 font-mono">{announcement.timestamp}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">{announcement.title}</h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed text-xs space-y-2">
              <p>{announcement.content}</p>
            </div>

            {/* Attachments if any */}
            {announcement.attachmentName && (
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{announcement.attachmentName}</p>
                    <p className="text-[10px] text-indigo-600 font-medium">{announcement.attachmentSize || 'PDF Document'}</p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Simulated Download of ${announcement.attachmentName}`)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {announcement.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Done Reading
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
