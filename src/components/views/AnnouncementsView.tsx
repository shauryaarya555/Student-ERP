import React, { useState, useMemo } from 'react';
import {
  Bell,
  Pin,
  FileText,
  Download,
  CheckCircle2,
  Search,
  Building,
  Calendar,
  Sparkles,
  AlertTriangle,
  Bookmark,
  Share2,
  UserCheck,
} from 'lucide-react';
import { FacultyAnnouncement, AnnouncementCategory } from '../../types';

interface AnnouncementsViewProps {
  announcements: FacultyAnnouncement[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onOpenDetail: (announcement: FacultyAnnouncement) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return announcements.filter((item) => {
      if (selectedCategory === 'bookmarked' && !bookmarkedIds.has(item.id)) return false;
      if (selectedCategory !== 'all' && selectedCategory !== 'bookmarked' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesContent = item.content.toLowerCase().includes(q);
        const matchesSender = item.senderName.toLowerCase().includes(q);
        const matchesDept = item.department.toLowerCase().includes(q);
        if (!matchesTitle && !matchesContent && !matchesSender && !matchesDept) return false;
      }
      return true;
    });
  }, [announcements, selectedCategory, searchQuery, bookmarkedIds]);

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" /> University Notices & Faculty Circulars
          </h2>
          <p className="text-xs text-slate-500">
            Official announcements from Controller of Examinations, Placement Cell, Department Deans & Library.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-indigo-700 hover:text-indigo-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars, department notices, or keywords..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: `All (${announcements.length})` },
            { id: 'urgent', label: 'Urgent Alerts' },
            { id: 'exam', label: 'Examinations' },
            { id: 'placement', label: 'Placement Cell' },
            { id: 'academic', label: 'Academic & Rules' },
            { id: 'general', label: 'Campus & Library' },
            { id: 'bookmarked', label: `Saved (${bookmarkedIds.size})` },
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
      </div>

      {/* Announcements Feed List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-xs shadow-xs">
            No notices match your selected filter or search query.
          </div>
        ) : (
          filtered.map((item) => {
            const isBookmarked = bookmarkedIds.has(item.id);

            return (
              <div
                key={item.id}
                onClick={() => {
                  onMarkAsRead(item.id);
                  onOpenDetail(item);
                }}
                className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-3 group relative overflow-hidden shadow-xs ${
                  item.isPinned
                    ? 'bg-gradient-to-r from-amber-50/40 via-white to-amber-50/20 border-amber-300 hover:border-amber-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                {/* Top Sender & Category Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.senderAvatar}
                      alt={item.senderName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.senderName}</span>
                        <span className="text-[10px] text-indigo-700 font-medium">({item.senderRole})</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{item.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                        <Pin className="w-3 h-3 fill-amber-500 text-amber-700" /> Pinned Notice
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        item.category === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.category === 'placement'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : item.category === 'exam'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.category}
                    </span>

                    <button
                      onClick={(e) => toggleBookmark(item.id, e)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark notice'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-3">{item.content}</p>
                </div>

                {/* Tags and Attachment */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] rounded-md border border-slate-200 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    {item.attachmentName && (
                      <span className="inline-flex items-center gap-1.5 text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[140px]">{item.attachmentName}</span>
                      </span>
                    )}
                    <span className="font-mono">{item.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
