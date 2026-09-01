import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Plus, Sparkles } from 'lucide-react';
import { Achievement, AchievementCategory } from '../../types';
import { triggerStars } from '../../utils/confetti';

interface AddAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (achievement: Achievement) => void;
}

export const AddAchievementModal: React.FC<AddAchievementModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AchievementCategory>('certificate');
  const [issuedBy, setIssuedBy] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState<'Diamond' | 'Gold' | 'Silver' | 'Bronze'>('Gold');
  const [skillsInput, setSkillsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuedBy.trim()) return;

    const newAchievement: Achievement = {
      id: `ach-custom-${Date.now()}`,
      title: title.trim(),
      category,
      issuedBy: issuedBy.trim(),
      issueDate,
      credentialId: `VERIFY-${Math.floor(100000 + Math.random() * 900000)}`,
      description: description.trim() || 'Recognized for distinguished extracurricular accomplishment and domain expertise.',
      verificationStatus: 'verified',
      badgeIcon: category === 'sports' ? 'Medal' : category === 'hackathon' ? 'Trophy' : 'Award',
      tier,
      skills: skillsInput
        ? skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Leadership', 'Skill Mastery'],
    };

    onAdd(newAchievement);
    triggerStars();
    onClose();
    // Reset form
    setTitle('');
    setIssuedBy('');
    setDescription('');
    setSkillsInput('');
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
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Achievement</h3>
                <p className="text-xs text-slate-500">Log certificates, awards, hackathons & publications</p>
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
              <label className="block text-slate-700 font-medium mb-1">Achievement Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Google Cloud Certified Professional ML Engineer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AchievementCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 text-xs"
                >
                  <option value="certificate">Certification</option>
                  <option value="hackathon">Hackathon / Competition</option>
                  <option value="award">Academic Award / Honor</option>
                  <option value="publication">Research Paper / Publication</option>
                  <option value="extracurricular">Extracurricular Activity</option>
                  <option value="sports">Sports & Athletics</option>
                  <option value="club">Club Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Recognition Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 text-xs"
                >
                  <option value="Diamond">💎 Diamond (Top National)</option>
                  <option value="Gold">🥇 Gold (Institutional Honor)</option>
                  <option value="Silver">🥈 Silver (Department / Club)</option>
                  <option value="Bronze">🥉 Bronze (Participation)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Issued By / Organization *</label>
                <input
                  type="text"
                  required
                  value={issuedBy}
                  onChange={(e) => setIssuedBy(e.target.value)}
                  placeholder="e.g. IEEE, Google, ACM Student Chapter"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Brief Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key highlights, your role, or what you built..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Skills & Tags (comma separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Machine Learning, Python, PyTorch, Cloud"
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
                <Plus className="w-4 h-4" /> Save Achievement
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
