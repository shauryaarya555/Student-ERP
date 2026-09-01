import React, { useState, useMemo } from 'react';
import {
  Award,
  Trophy,
  Cloud,
  BookOpen,
  Sparkles,
  Medal,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Download,
  Filter,
  FileCheck,
} from 'lucide-react';
import { Achievement, AchievementCategory } from '../../types';

interface AchievementsViewProps {
  achievements: Achievement[];
  studentName: string;
  onOpenCertificate: (achievement: Achievement) => void;
  onOpenAddModal: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  studentName,
  onOpenCertificate,
  onOpenAddModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const filtered = useMemo(() => {
    return achievements.filter((ach) => {
      if (selectedCategory !== 'all' && ach.category !== selectedCategory) return false;
      if (selectedTier !== 'all' && ach.tier !== selectedTier) return false;
      return true;
    });
  }, [achievements, selectedCategory, selectedTier]);

  const diamondCount = achievements.filter((a) => a.tier === 'Diamond').length;
  const goldCount = achievements.filter((a) => a.tier === 'Gold').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Honors, Credentials & Extracurriculars
          </h2>
          <p className="text-xs text-slate-500">
            Verified competitive hackathons, academic awards, cloud credentials & publications.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export Portfolio
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" /> Add Achievement
          </button>
        </div>
      </div>

      {/* Recognition Badges Highlight Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg">
            💎
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Diamond Tier</p>
            <p className="text-[11px] text-indigo-700 font-mono font-semibold">{diamondCount} National Honors</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
            🥇
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Gold Tier</p>
            <p className="text-[11px] text-amber-800 font-mono font-semibold">{goldCount} Certifications & Awards</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg border border-emerald-200">
            📜
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Verification Status</p>
            <p className="text-[11px] text-emerald-700 font-mono font-semibold">100% Cryptographic Verified</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-lg">
            ⚡
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Student Badges</p>
            <p className="text-[11px] text-slate-500 font-mono">{achievements.length} Recorded Accomplishments</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Showcase' },
            { id: 'hackathon', label: 'Hackathons & Contests' },
            { id: 'certificate', label: 'Certifications' },
            { id: 'award', label: 'Academic Honors' },
            { id: 'publication', label: 'Research Papers' },
            { id: 'sports', label: 'Sports' },
            { id: 'club', label: 'Club Leadership' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-indigo-600"
        >
          <option value="all">All Tiers</option>
          <option value="Diamond">💎 Diamond Only</option>
          <option value="Gold">🥇 Gold Only</option>
          <option value="Silver">🥈 Silver Only</option>
          <option value="Bronze">🥉 Bronze Only</option>
        </select>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const isDiamond = item.tier === 'Diamond';
          const isGold = item.tier === 'Gold';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-4 hover:shadow-md group relative overflow-hidden shadow-xs ${
                isDiamond
                  ? 'border-indigo-200 hover:border-indigo-300'
                  : isGold
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isDiamond
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : isGold
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" /> {item.tier} Tier
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">{item.issueDate}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug group-hover:text-indigo-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-indigo-600 font-medium mt-1">{item.issuedBy}</p>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-mono border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </div>

                  <button
                    onClick={() => onOpenCertificate(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold transition-colors shadow-xs"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>View Credential</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
