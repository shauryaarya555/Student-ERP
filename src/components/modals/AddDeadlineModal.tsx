import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Plus, Clock, AlertCircle } from 'lucide-react';
import { EventDeadline, EventType, PriorityLevel } from '../../types';

interface AddDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (deadline: EventDeadline) => void;
}

export const AddDeadlineModal: React.FC<AddDeadlineModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('assignment');
  const [subjectName, setSubjectName] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [location, setLocation] = useState('Canvas / Online Submission');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: EventDeadline = {
      id: `dl-custom-${Date.now()}`,
      title: title.trim(),
      type,
      subjectName: subjectName.trim() || undefined,
      dueDate,
      dueTime,
      locationOrPlatform: location.trim() || 'Online Portal',
      description: description.trim() || 'Custom academic task created by student.',
      priority,
      status: 'pending',
      isPersonalReminder: true,
    };

    onAdd(newEvent);
    onClose();
    setTitle('');
    setDescription('');
    setSubjectName('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-900 overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Deadline or Event</h3>
                <p className="text-xs text-slate-500">Track exams, project deliverables & club milestones</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Title / Milestone Name *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Systems Lab Sprint 3 Demo"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Event Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 text-xs"
                >
                  <option value="assignment">Assignment / Project</option>
                  <option value="exam">Exam / Quiz</option>
                  <option value="workshop">Workshop / Seminar</option>
                  <option value="event">College Activity / Fest</option>
                  <option value="holiday">Academic Break / Holiday</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 text-xs"
                >
                  <option value="urgent">🔴 Urgent / High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Normal / Low Priority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Time</label>
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="e.g. 11:59 PM or 02:00 PM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Subject / Course (Optional)</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. Distributed Systems (CS601)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Location / Submission Link</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lab 4B / Canvas Submission"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Instructions / Notes</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include submission requirements, format, or team notes..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs text-xs font-semibold transition-all"
              >
                <Plus className="w-4 h-4" /> Add to Schedule
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
