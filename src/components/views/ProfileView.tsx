import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  Bell,
  MapPin,
  Heart,
  Save,
  CheckCircle2,
  Lock,
  Sparkles,
  MessageSquare,
  LifeBuoy,
  BookOpen,
  Tag,
} from 'lucide-react';
import { StudentProfile, PrivacySettings } from '../../types';

interface ProfileViewProps {
  profile: StudentProfile;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onOpenIdCard: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  privacyMode,
  onTogglePrivacy,
  onOpenIdCard,
}) => {
  const [personalEmail, setPersonalEmail] = useState(profile.personalEmail);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [bio, setBio] = useState(
    "Curious technologist passionate about artificial intelligence, robotics, and high-impact web software. Enjoys hackathons, street photography, and weekend campus club projects."
  );
  const [skills, setSkills] = useState([
    'Python & AI/ML',
    'Robotics & Embedded Systems',
    'TypeScript & React',
    'Computer Vision',
    'Campus Hackathons',
    'Photography Club',
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkillInput.trim())) {
        setSkills([...skills, newSkillInput.trim()]);
      }
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (tagToRemove: string) => {
    setSkills(skills.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> Student Profile & University Identity
          </h2>
          <p className="text-xs text-slate-500">
            Manage your personal profile, bio, campus contact info, and confidential identity settings.
          </p>
        </div>

        <button
          onClick={onOpenIdCard}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <CreditCard className="w-4 h-4" /> Open Digital Student Pass
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: ID & Quick Profile Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-3xl object-cover border-4 border-indigo-100 shadow-md mx-auto"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{profile.fullName}</h3>
              <p className="text-xs text-indigo-600 font-semibold">{profile.course}</p>
              <p className="text-[11px] text-slate-500 mt-1">{profile.department}</p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-2 text-[10px] font-mono">
              <span className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold">
                Roll: {privacyMode ? '••••••••' : profile.rollNumber}
              </span>
              <span className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 text-indigo-700 font-semibold">
                PRN: {privacyMode ? '••••••••••••' : profile.prnNumber}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Standing:</span>
                <span className="font-bold text-slate-800">{profile.year} (Sem {profile.semester})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Cohort:</span>
                <span className="font-bold text-slate-800">{profile.batch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-bold text-rose-600">{profile.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-mono text-slate-800 font-medium">{profile.dob}</span>
              </div>
            </div>
          </div>

          {/* Privacy Controls Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Privacy & Discreet Mode</h4>
                <p className="text-[10px] text-slate-500">Protect on-screen grades in libraries or cafés</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-800">Mask Sensitive Stats</p>
                  <p className="text-[10px] text-slate-500">Hides GPA, marks & Roll number</p>
                </div>
                <button
                  onClick={onTogglePrivacy}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    privacyMode
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Campus Support & Mentorship Quick Connect */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Campus Support Network</h4>
                <p className="text-[10px] text-slate-500">Direct university contacts</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-800">Academic Faculty Mentor</p>
                <p className="text-xs text-indigo-700 font-medium">{profile.mentorName}</p>
                <a
                  href={`mailto:${profile.mentorEmail}`}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <Mail className="w-3 h-3" /> {profile.mentorEmail}
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-[11px] font-bold text-slate-800">Student Counseling & Wellness</p>
                <p className="text-[11px] text-slate-600">Confidential guidance & mental wellness desk</p>
                <a
                  href="tel:+18005550199"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold hover:underline"
                >
                  <Phone className="w-3 h-3" /> +1 (800) 555-0199 (24/7 Helpline)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Editable Bio, Interests & Contact */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Official Student Profile & Bio</h3>
                <p className="text-xs text-slate-500">Keep your personal bio, contact channels, and skills up-to-date</p>
              </div>
              {isSaved && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Profile Updated
                </span>
              )}
            </div>

            {/* Read-Only Academic Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Full Legal Name (Institutional Record)</label>
                <input
                  type="text"
                  disabled
                  value={profile.fullName}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Institutional Email Address</label>
                <input
                  type="text"
                  disabled
                  value={profile.collegeEmail}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono text-xs cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Faculty Academic Mentor</label>
                <input
                  type="text"
                  disabled
                  value={`${profile.mentorName} (${profile.mentorEmail})`}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Degree & Major</label>
                <input
                  type="text"
                  disabled
                  value={profile.degree}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* Humanized Student Bio */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Personal Bio & Passions
                </label>
                <span className="text-[11px] text-slate-400">Visible on student team rosters & clubs</span>
              </div>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief introduction about your goals, interests, and creative projects..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs leading-relaxed"
              />
            </div>

            {/* Academic Interests & Tags */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                Interests, Skills & Campus Clubs
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
                  >
                    #{skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-500 font-bold ml-0.5 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="+ Add tag (press Enter)"
                  className="px-2 py-1 bg-transparent text-[11px] text-slate-700 placeholder-slate-400 focus:outline-none min-w-[140px]"
                />
              </div>
            </div>

            {/* Editable Contact Fields */}
            <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
              <h4 className="font-bold text-slate-900">Contact & Residential Details</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Personal Alternate Email</label>
                  <input
                    type="email"
                    required
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Primary Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Campus / Residential Hostel Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Profile Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

