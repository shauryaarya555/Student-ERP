import React, { useState, useEffect } from 'react';
import { mockStudents, defaultStudentId, StudentDataBundle } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Overview } from './components/views/Overview';
import { AttendanceView } from './components/views/AttendanceView';
import { AcademicsView } from './components/views/AcademicsView';
import { AchievementsView } from './components/views/AchievementsView';
import { EventsScheduleView } from './components/views/EventsScheduleView';
import { AnnouncementsView } from './components/views/AnnouncementsView';
import { ProfileView } from './components/views/ProfileView';
import { CalculatorsView } from './components/views/CalculatorsView';
import { RegisterStudentView } from './components/views/RegisterStudentView';

// Modals
import { DigitalIdCardModal } from './components/modals/DigitalIdCardModal';
import { CertificateModal } from './components/modals/CertificateModal';
import { AddAchievementModal } from './components/modals/AddAchievementModal';
import { AddDeadlineModal } from './components/modals/AddDeadlineModal';
import { SearchCommandModal } from './components/modals/SearchCommandModal';
import { StudentAuthModal } from './components/modals/StudentAuthModal';
import { AnnouncementDetailModal } from './components/modals/AnnouncementDetailModal';

import { Achievement, EventDeadline, FacultyAnnouncement, StudentProfile } from './types';

export default function App() {
  const [currentStudentId, setCurrentStudentId] = useState<string>(defaultStudentId);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Student dynamic state (allows adding achievements, completing tasks, reading notices, registering new students)
  const [studentsState, setStudentsState] = useState<Record<string, StudentDataBundle>>(() => {
    return mockStudents;
  });

  const currentData: StudentDataBundle =
    studentsState[currentStudentId] ||
    Object.values(studentsState)[0] ||
    mockStudents[defaultStudentId];

  // Modals state
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [idCardProfileOverride, setIdCardProfileOverride] = useState<StudentProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddAchievementOpen, setIsAddAchievementOpen] = useState(false);
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<Achievement | null>(null);
  const [activeAnnouncement, setActiveAnnouncement] = useState<FacultyAnnouncement | null>(null);

  // Global Keyboard Shortcut for Command Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for student registration & registry management
  const handleRegisterStudent = (newBundle: StudentDataBundle, autoSwitch: boolean) => {
    setStudentsState((prev) => ({
      ...prev,
      [newBundle.profile.id]: newBundle,
    }));

    if (autoSwitch) {
      setCurrentStudentId(newBundle.profile.id);
      setActiveTab('overview');
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudentsState((prev) => {
      const keys = Object.keys(prev);
      if (keys.length <= 1) return prev; // Do not delete last student

      const next = { ...prev };
      delete next[studentId];

      if (currentStudentId === studentId) {
        const remainingKeys = Object.keys(next);
        setCurrentStudentId(remainingKeys[0]);
      }

      return next;
    });
  };

  // Handlers for dynamic student mutations
  const handleToggleDeadlineStatus = (deadlineId: string) => {
    setStudentsState((prev) => {
      const student = prev[currentStudentId];
      if (!student) return prev;

      const updatedDeadlines = student.deadlines.map((dl) => {
        if (dl.id === deadlineId) {
          const nextStatus: 'pending' | 'submitted' | 'completed' =
            dl.status === 'pending' ? 'submitted' : 'pending';
          return { ...dl, status: nextStatus };
        }
        return dl;
      });

      return {
        ...prev,
        [currentStudentId]: {
          ...student,
          deadlines: updatedDeadlines,
        },
      };
    });
  };

  const handleAddAchievement = (newAchievement: Achievement) => {
    setStudentsState((prev) => {
      const student = prev[currentStudentId];
      if (!student) return prev;

      return {
        ...prev,
        [currentStudentId]: {
          ...student,
          achievements: [newAchievement, ...student.achievements],
        },
      };
    });
  };

  const handleAddDeadline = (newDeadline: EventDeadline) => {
    setStudentsState((prev) => {
      const student = prev[currentStudentId];
      if (!student) return prev;

      return {
        ...prev,
        [currentStudentId]: {
          ...student,
          deadlines: [newDeadline, ...student.deadlines],
        },
      };
    });
  };

  const handleMarkNoticeAsRead = (noticeId: string) => {
    setStudentsState((prev) => {
      const student = prev[currentStudentId];
      if (!student) return prev;

      const updated = student.announcements.map((a) => (a.id === noticeId ? { ...a, isRead: true } : a));

      return {
        ...prev,
        [currentStudentId]: {
          ...student,
          announcements: updated,
        },
      };
    });
  };

  const handleMarkAllNoticesAsRead = () => {
    setStudentsState((prev) => {
      const student = prev[currentStudentId];
      if (!student) return prev;

      const updated = student.announcements.map((a) => ({ ...a, isRead: true }));

      return {
        ...prev,
        [currentStudentId]: {
          ...student,
          announcements: updated,
        },
      };
    });
  };

  const unreadCount = currentData.announcements.filter((a) => !a.isRead).length;
  const urgentDeadlinesCount = currentData.deadlines.filter((d) => d.status === 'pending' && d.priority === 'urgent').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Fixed Navigation */}
      <Navbar
        profile={currentData.profile}
        privacyMode={privacyMode}
        onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenIdCard={() => {
          setIdCardProfileOverride(null);
          setIsIdCardOpen(true);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        announcements={currentData.announcements}
        onOpenAnnouncementDetail={(ann) => {
          handleMarkNoticeAsRead(ann.id);
          setActiveAnnouncement(ann);
        }}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          profile={currentData.profile}
          unreadCount={unreadCount}
          urgentDeadlinesCount={urgentDeadlinesCount}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Center Main View Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'overview' && (
            <Overview
              data={currentData}
              privacyMode={privacyMode}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenIdCard={() => {
                setIdCardProfileOverride(null);
                setIsIdCardOpen(true);
              }}
              onToggleDeadlineStatus={handleToggleDeadlineStatus}
              onOpenAnnouncementDetail={(ann) => {
                handleMarkNoticeAsRead(ann.id);
                setActiveAnnouncement(ann);
              }}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              attendance={currentData.attendance}
              monthlyAttendance={currentData.monthlyAttendance}
              overallAttendance={currentData.profile.overallAttendance}
            />
          )}

          {activeTab === 'academics' && (
            <AcademicsView
              academicHistory={currentData.academicHistory}
              profile={currentData.profile}
              privacyMode={privacyMode}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              achievements={currentData.achievements}
              studentName={currentData.profile.fullName}
              onOpenCertificate={(ach) => setActiveCertificate(ach)}
              onOpenAddModal={() => setIsAddAchievementOpen(true)}
            />
          )}

          {activeTab === 'schedule' && (
            <EventsScheduleView
              deadlines={currentData.deadlines}
              onToggleStatus={handleToggleDeadlineStatus}
              onOpenAddModal={() => setIsAddDeadlineOpen(true)}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsView
              announcements={currentData.announcements}
              onMarkAsRead={handleMarkNoticeAsRead}
              onMarkAllAsRead={handleMarkAllNoticesAsRead}
              onOpenDetail={(ann) => {
                handleMarkNoticeAsRead(ann.id);
                setActiveAnnouncement(ann);
              }}
            />
          )}

          {activeTab === 'calculators' && (
            <CalculatorsView
              profile={currentData.profile}
              attendance={currentData.attendance}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={currentData.profile}
              privacyMode={privacyMode}
              onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
              onOpenIdCard={() => {
                setIdCardProfileOverride(null);
                setIsIdCardOpen(true);
              }}
            />
          )}

          {activeTab === 'register' && (
            <RegisterStudentView
              students={studentsState}
              currentStudentId={currentStudentId}
              onRegisterStudent={handleRegisterStudent}
              onSwitchStudent={(id) => {
                setCurrentStudentId(id);
                setActiveTab('overview');
              }}
              onDeleteStudent={handleDeleteStudent}
              onOpenIdCardForStudent={(prof) => {
                setIdCardProfileOverride(prof);
                setIsIdCardOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <DigitalIdCardModal
        isOpen={isIdCardOpen}
        onClose={() => {
          setIsIdCardOpen(false);
          setIdCardProfileOverride(null);
        }}
        profile={idCardProfileOverride || currentData.profile}
        privacyMode={privacyMode}
      />

      <CertificateModal
        isOpen={!!activeCertificate}
        onClose={() => setActiveCertificate(null)}
        achievement={activeCertificate}
        studentName={currentData.profile.fullName}
      />

      <AddAchievementModal
        isOpen={isAddAchievementOpen}
        onClose={() => setIsAddAchievementOpen(false)}
        onAdd={handleAddAchievement}
      />

      <AddDeadlineModal
        isOpen={isAddDeadlineOpen}
        onClose={() => setIsAddDeadlineOpen(false)}
        onAdd={handleAddDeadline}
      />

      <SearchCommandModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        data={currentData}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectStudent={(stuId) => setCurrentStudentId(stuId)}
        currentStudentId={currentStudentId}
        students={studentsState}
      />

      <AnnouncementDetailModal
        isOpen={!!activeAnnouncement}
        onClose={() => setActiveAnnouncement(null)}
        announcement={activeAnnouncement}
      />
    </div>
  );
}
