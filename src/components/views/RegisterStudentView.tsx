import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  UserPlus,
  Users,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Search,
  Check,
  Building,
  CreditCard,
  Trash2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { StudentDataBundle, avatarPresets, generateStudentBundle } from '../../data/mockData';

interface RegisterStudentViewProps {
  students: Record<string, StudentDataBundle>;
  currentStudentId: string;
  onRegisterStudent: (bundle: StudentDataBundle, autoSwitch: boolean) => void;
  onSwitchStudent: (studentId: string) => void;
  onDeleteStudent?: (studentId: string) => void;
  onOpenIdCardForStudent?: (profile: StudentProfile) => void;
}

const PROGRAM_OPTIONS = [
  {
    course: 'B.Tech in Computer Science & Engineering',
    dept: 'School of Computing Sciences',
    degree: 'Bachelor of Technology (Honors in AI)',
    codePrefix: 'BCE',
  },
  {
    course: 'B.S. in Artificial Intelligence & Data Science',
    dept: 'Department of Data Intelligence',
    degree: 'Bachelor of Science (Data Systems)',
    codePrefix: 'BAI',
  },
  {
    course: 'B.Tech in Electronics & Communication Engineering',
    dept: 'School of Electrical Sciences',
    degree: 'Bachelor of Technology (VLSI & Embedded)',
    codePrefix: 'BEC',
  },
  {
    course: 'B.Tech in Cybersecurity & Digital Forensics',
    dept: 'School of Computing Sciences',
    degree: 'Bachelor of Technology (Cyber Defense)',
    codePrefix: 'BCS',
  },
  {
    course: 'B.Tech in Robotics & Autonomous Systems',
    dept: 'Department of Mechanical & Mechatronics',
    degree: 'Bachelor of Technology (Robotics)',
    codePrefix: 'BRO',
  },
  {
    course: 'B.S. in Biotechnology & Bioinformatics',
    dept: 'School of Life Sciences',
    degree: 'Bachelor of Science (Computational Biology)',
    codePrefix: 'BBT',
  },
];

export const RegisterStudentView: React.FC<RegisterStudentViewProps> = ({
  students,
  currentStudentId,
  onRegisterStudent,
  onSwitchStudent,
  onDeleteStudent,
  onOpenIdCardForStudent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'registry'>('form');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [selectedProgramIndex, setSelectedProgramIndex] = useState(0);
  const [year, setYear] = useState('1st Year');
  const [semester, setSemester] = useState<number>(1);
  const [batch, setBatch] = useState('2024 - 2028');
  
  // Dynamic Roll & PRN Generation
  const generateRandomRoll = () => {
    const yearPrefix = '24';
    const progCode = PROGRAM_OPTIONS[selectedProgramIndex]?.codePrefix || 'BCE';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `${yearPrefix}${progCode}${randNum}`;
  };

  const [rollNumber, setRollNumber] = useState(generateRandomRoll());
  const [prnNumber, setPrnNumber] = useState(`PRN2024${Math.floor(1000000 + Math.random() * 9000000)}`);
  
  // Personal Info
  const [dob, setDob] = useState('2005-06-15');
  const [bloodGroup, setBloodGroup] = useState('O+ Positive');
  const [phone, setPhone] = useState('+1 (555) 349-8821');
  const [personalEmail, setPersonalEmail] = useState('');
  const [address, setAddress] = useState('Evergreen Hall Room 302, North Campus');
  const [mentorName, setMentorName] = useState('Dr. Evelyn Martinez');
  const [mentorEmail, setMentorEmail] = useState('evelyn.martinez@university.edu');

  // Avatar Selection
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(avatarPresets[0].url);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Initial Stats
  const [cgpa, setCgpa] = useState<number>(8.75);
  const [overallAttendance, setOverallAttendance] = useState<number>(88.0);
  const [rankInBatch, setRankInBatch] = useState<number>(18);
  const [totalStudentsInBatch, setTotalStudentsInBatch] = useState<number>(240);

  // Success state alert
  const [registeredSuccessName, setRegisteredSuccessName] = useState<string | null>(null);

  // Registry Search & Filters
  const [registrySearch, setRegistrySearch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const selectedProgram = PROGRAM_OPTIONS[selectedProgramIndex];

  // Auto-fill institutional email from name
  const computedCollegeEmail = fullName.trim()
    ? `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '.')}${semester ? '24' : ''}@university.edu`
    : 'student.name24@university.edu';

  const handleProgramChange = (idx: number) => {
    setSelectedProgramIndex(idx);
    const prog = PROGRAM_OPTIONS[idx];
    const yr = '24';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setRollNumber(`${yr}${prog.codePrefix}${randNum}`);
  };

  const handleRegenerateRoll = () => {
    setRollNumber(generateRandomRoll());
    setPrnNumber(`PRN2024${Math.floor(1000000 + Math.random() * 9000000)}`);
  };

  const handleSubmit = (e: React.FormEvent, autoSwitch = true) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newStudentId = `STU-${Date.now()}-${selectedProgram.codePrefix}`;
    const avatar = customAvatarInput.trim() || selectedAvatarUrl;

    const newProfile: StudentProfile = {
      id: newStudentId,
      rollNumber: rollNumber.trim() || generateRandomRoll(),
      prnNumber: prnNumber.trim() || `PRN2024${Math.floor(1000000 + Math.random() * 9000000)}`,
      fullName: fullName.trim(),
      avatar: avatar,
      course: selectedProgram.course,
      department: selectedProgram.dept,
      degree: selectedProgram.degree,
      year: year,
      semester: Number(semester),
      batch: batch,
      collegeEmail: computedCollegeEmail,
      personalEmail: personalEmail.trim() || `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      phone: phone.trim(),
      dob: dob,
      bloodGroup: bloodGroup,
      mentorName: mentorName.trim(),
      mentorEmail: mentorEmail.trim(),
      address: address.trim(),
      cgpa: Number(cgpa),
      totalCreditsEarned: Number(semester) * 22,
      overallAttendance: Number(overallAttendance),
      rankInBatch: Number(rankInBatch),
      totalStudentsInBatch: Number(totalStudentsInBatch),
    };

    const newBundle = generateStudentBundle(newProfile);
    onRegisterStudent(newBundle, autoSwitch);

    setRegisteredSuccessName(fullName.trim());
    setTimeout(() => {
      setRegisteredSuccessName(null);
    }, 4500);

    // Reset some form values
    setFullName('');
    setPersonalEmail('');
    handleRegenerateRoll();
  };

  const studentsList: StudentDataBundle[] = Object.values(students);

  const filteredStudents: StudentDataBundle[] = studentsList.filter((s: StudentDataBundle) => {
    const matchesSearch =
      s.profile.fullName.toLowerCase().includes(registrySearch.toLowerCase()) ||
      s.profile.rollNumber.toLowerCase().includes(registrySearch.toLowerCase()) ||
      s.profile.course.toLowerCase().includes(registrySearch.toLowerCase()) ||
      s.profile.collegeEmail.toLowerCase().includes(registrySearch.toLowerCase());

    const matchesDept =
      filterDepartment === 'all' || s.profile.department.toLowerCase().includes(filterDepartment.toLowerCase());

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs mb-1">
            <UserPlus className="w-4 h-4" />
            <span>INSTITUTIONAL ADMISSIONS & REGISTRY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student Enrollment & Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Register new students with full academic records, attendance schedules, and institutional profiles.
          </p>
        </div>

        {/* Action / View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveSubTab('form')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'form'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New Student</span>
          </button>
          <button
            onClick={() => setActiveSubTab('registry')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'registry'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Enrolled Students ({studentsList.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert Banner */}
      {registeredSuccessName && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Student Successfully Enrolled!</p>
              <p className="text-xs text-emerald-700">
                <span className="font-semibold">{registeredSuccessName}</span>'s academic records, timetable, and attendance vault are now active.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSubTab('registry')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            View in Registry
          </button>
        </motion.div>
      )}

      {activeSubTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Registration Form (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
              {/* Section 1: Basic Identity & Demographics */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">Personal & Identity Information</h2>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">* Required fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Gwen Stacy, Miles Morales, or Bruce Wayne"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 font-semibold">Roll Number *</label>
                      <button
                        type="button"
                        onClick={handleRegenerateRoll}
                        className="text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">PRN / Registration No.</label>
                    <input
                      type="text"
                      required
                      value={prnNumber}
                      onChange={(e) => setPrnNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                    >
                      <option value="O+ Positive">O+ Positive</option>
                      <option value="O- Negative">O- Negative</option>
                      <option value="A+ Positive">A+ Positive</option>
                      <option value="A- Negative">A- Negative</option>
                      <option value="B+ Positive">B+ Positive</option>
                      <option value="B- Negative">B- Negative</option>
                      <option value="AB+ Positive">AB+ Positive</option>
                      <option value="AB- Negative">AB- Negative</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Program & Degree */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm font-bold text-slate-900">Academic Program & Department</h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Degree & Major *</label>
                    <select
                      value={selectedProgramIndex}
                      onChange={(e) => handleProgramChange(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-indigo-600"
                    >
                      {PROGRAM_OPTIONS.map((p, idx) => (
                        <option key={p.course} value={idx}>
                          {p.course} ({p.dept})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Year of Study</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                      >
                        <option value="1st Year">1st Year (Freshman)</option>
                        <option value="2nd Year">2nd Year (Sophomore)</option>
                        <option value="3rd Year">3rd Year (Junior)</option>
                        <option value="4th Year">4th Year (Senior)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Current Semester</label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Batch Cohort</label>
                      <input
                        type="text"
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        placeholder="e.g. 2024 - 2028"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Assigned Faculty Mentor</label>
                      <input
                        type="text"
                        value={mentorName}
                        onChange={(e) => setMentorName(e.target.value)}
                        placeholder="e.g. Dr. Evelyn Martinez"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mentor Email</label>
                      <input
                        type="email"
                        value={mentorEmail}
                        onChange={(e) => setMentorEmail(e.target.value)}
                        placeholder="e.g. evelyn.martinez@university.edu"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Contact & Campus Residence */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-slate-900">Contact & Institutional Credentials</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Primary Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Personal Email</label>
                    <input
                      type="email"
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      placeholder="e.g. student.personal@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">
                      Institutional College Email (Auto-Configured)
                    </label>
                    <div className="flex items-center px-3.5 py-2.5 bg-indigo-50/50 border border-indigo-200 rounded-xl text-indigo-900 font-mono text-xs">
                      <Mail className="w-4 h-4 text-indigo-600 mr-2 shrink-0" />
                      <span>{computedCollegeEmail}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Campus Residence / Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Hall 4, Room 204, North Campus"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Initial Academic Baseline */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h2 className="text-sm font-bold text-slate-900">Academic Standing Baseline</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Initial CGPA (0 - 10.0)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Baseline Attendance % (0 - 100)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={overallAttendance}
                      onChange={(e) => setOverallAttendance(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Batch Rank</label>
                    <input
                      type="number"
                      min="1"
                      value={rankInBatch}
                      onChange={(e) => setRankInBatch(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Register & Stay Here
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Switch to Student Portal</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Student Profile Preview & Avatar Selector */}
          <div className="space-y-6">
            {/* Avatar Selector */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select Profile Photo Preset
              </h2>
              <p className="text-[11px] text-slate-500">
                Choose an institutional avatar or paste a custom URL:
              </p>

              <div className="grid grid-cols-4 gap-2 pt-1">
                {avatarPresets.map((av) => {
                  const isSelected = selectedAvatarUrl === av.url && !customAvatarInput.trim();
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarUrl(av.url);
                        setCustomAvatarInput('');
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Or Custom Image URL
                </label>
                <input
                  type="url"
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>
            </div>

            {/* Live Card Preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Portal Preview Card
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready to Enroll
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4 shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={customAvatarInput.trim() || selectedAvatarUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-400/50 shadow"
                    />
                    <div>
                      <h3 className="text-sm font-bold truncate max-w-[150px]">
                        {fullName.trim() || 'Student Full Name'}
                      </h3>
                      <p className="text-[10px] text-indigo-300 font-mono">{rollNumber}</p>
                      <p className="text-[10px] text-slate-300">{year} • Sem {semester}</p>
                    </div>
                  </div>
                  <GraduationCap className="w-6 h-6 text-indigo-400 shrink-0" />
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] space-y-1">
                  <p className="text-slate-300 truncate font-medium">{selectedProgram.course}</p>
                  <p className="text-[10px] text-slate-400 truncate">{selectedProgram.dept}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
                  <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400">Target CGPA</p>
                    <p className="font-bold text-amber-300">{cgpa.toFixed(2)}</p>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl border border-white/10">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400">Attendance</p>
                    <p className="font-bold text-emerald-400">{overallAttendance.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Generated Academic Artifacts</span>
                </div>
                <p>
                  Submitting creates a fully functional course timetable, attendance logs, semester grade sheets, welcome announcements, and an official digital ID.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Registry View: All Enrolled Students */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={registrySearch}
                onChange={(e) => setRegistrySearch(e.target.value)}
                placeholder="Search by student name, roll number, or department..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-slate-500">Department:</span>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
              >
                <option value="all">All Departments</option>
                <option value="Computing">Computing Sciences</option>
                <option value="Data">Data Intelligence</option>
                <option value="Electrical">Electrical Sciences</option>
                <option value="Life">Life Sciences</option>
              </select>
            </div>
          </div>

          {/* Student Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((stu: StudentDataBundle) => {
              const isCurrent = stu.profile.id === currentStudentId;

              return (
                <div
                  key={stu.profile.id}
                  className={`bg-white rounded-2xl border p-5 transition-all flex flex-col justify-between space-y-4 ${
                    isCurrent
                      ? 'border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={stu.profile.avatar}
                          alt={stu.profile.fullName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900 truncate">
                              {stu.profile.fullName}
                            </h3>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 font-mono">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono font-medium text-indigo-600">
                            Roll: {stu.profile.rollNumber}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {stu.profile.year} • Sem {stu.profile.semester}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <p className="text-slate-800 font-medium text-[11px] truncate">
                        {stu.profile.course}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {stu.profile.department}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-indigo-50/50 border border-indigo-100">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 block">CGPA</span>
                        <span className="font-bold text-indigo-700">{stu.profile.cgpa.toFixed(2)}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Attendance</span>
                        <span className="font-bold text-emerald-700">{stu.profile.overallAttendance}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {isCurrent ? (
                      <div className="flex-1 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold text-center flex items-center justify-center gap-1.5 border border-indigo-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Current Active User</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onSwitchStudent(stu.profile.id)}
                        className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Switch to Portal</span>
                      </button>
                    )}

                    {onOpenIdCardForStudent && (
                      <button
                        onClick={() => onOpenIdCardForStudent(stu.profile)}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                        title="View Digital ID Card"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                    )}

                    {onDeleteStudent && studentsList.length > 1 && !isCurrent && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${stu.profile.fullName} from the registry?`)) {
                            onDeleteStudent(stu.profile.id);
                          }
                        }}
                        className="p-2 rounded-xl text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                        title="Remove Student Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No students matched your search criteria.</p>
              <p className="mt-1">Try clearing filters or registering a new student.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
