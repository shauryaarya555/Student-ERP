import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingUp, Clock, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { StudentProfile, SubjectAttendance } from '../../types';

interface CalculatorsViewProps {
  profile: StudentProfile;
  attendance: SubjectAttendance[];
}

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({ profile, attendance }) => {
  // Calculator 1: Internal to End-Sem Target
  const [internalMarks, setInternalMarks] = useState<number>(28);
  const [targetTotalMarks, setTargetTotalMarks] = useState<number>(90); // e.g. O grade is 90+

  // Calculator 2: Semester GPA Estimator
  const [courseEstimates, setCourseEstimates] = useState([
    { name: 'Course 1 (Core)', credits: 4, expectedGradePoint: 10 },
    { name: 'Course 2 (Core)', credits: 4, expectedGradePoint: 10 },
    { name: 'Course 3 (Core)', credits: 4, expectedGradePoint: 9 },
    { name: 'Course 4 (Elective)', credits: 3, expectedGradePoint: 8 },
    { name: 'Course 5 (Lab)', credits: 2, expectedGradePoint: 10 },
    { name: 'Course 6 (Seminar)', credits: 2, expectedGradePoint: 9 },
  ]);

  const neededExternalMarks = Math.max(0, targetTotalMarks - internalMarks);
  const isPossibleIn70 = neededExternalMarks <= 70;

  // Calculate SGPA for estimate
  const totalCredits = courseEstimates.reduce((acc, c) => acc + c.credits, 0);
  const totalPoints = courseEstimates.reduce((acc, c) => acc + c.credits * c.expectedGradePoint, 0);
  const estimatedSGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" /> Academic & Exam Calculators
        </h2>
        <p className="text-xs text-slate-500">
          Interactive planning utilities to simulate end-semester target scores, future SGPA, and graduation CGPA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator 1: End-Semester Score Predictor */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">End-Semester Required Marks Predictor</h3>
                <p className="text-xs text-slate-500">Calculate required score out of 70 to achieve letter grade</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-700 font-medium">Your Internal Assessment Marks (out of 30)</label>
                  <span className="font-mono font-bold text-indigo-700">{internalMarks} / 30</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={internalMarks}
                  onChange={(e) => setInternalMarks(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-700 font-medium">Desired Total Target Score (out of 100)</label>
                  <span className="font-mono font-bold text-indigo-700">
                    {targetTotalMarks} / 100 ({targetTotalMarks >= 90 ? 'O Grade' : targetTotalMarks >= 80 ? 'A+ Grade' : 'A Grade'})
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={targetTotalMarks}
                  onChange={(e) => setTargetTotalMarks(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700">Target Score in Final Exam</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {isPossibleIn70 ? (
                <>
                  Need <span className="text-indigo-700">{neededExternalMarks}</span> / 70 in Final Exam
                </>
              ) : (
                <span className="text-rose-600">Exceeds 70 max ({neededExternalMarks}/70)</span>
              )}
            </div>
            <p className="text-xs text-slate-600">
              {isPossibleIn70
                ? `Scoring ${neededExternalMarks} out of 70 combined with your internal score of ${internalMarks}/30 will secure your target total of ${targetTotalMarks}/100.`
                : `Because maximum final exam marks are 70, the highest achievable total with ${internalMarks} internals is ${internalMarks + 70}/100.`}
            </p>
          </div>
        </div>

        {/* Calculator 2: Semester SGPA Estimator */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upcoming Semester SGPA Calculator</h3>
                <p className="text-xs text-slate-500">Estimate term GPA by configuring expected subject grades</p>
              </div>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {courseEstimates.map((course, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800 truncate">{course.name} ({course.credits}cr)</span>
                  <select
                    value={course.expectedGradePoint}
                    onChange={(e) => {
                      const updated = [...courseEstimates];
                      updated[idx].expectedGradePoint = Number(e.target.value);
                      setCourseEstimates(updated);
                    }}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-indigo-700 font-mono text-xs focus:outline-none focus:border-indigo-600"
                  >
                    <option value={10}>O (10 GP)</option>
                    <option value={9}>A+ (9 GP)</option>
                    <option value={8}>A (8 GP)</option>
                    <option value={7}>B+ (7 GP)</option>
                    <option value={6}>B (6 GP)</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">Estimated Semester SGPA</span>
              <p className="text-3xl font-black text-slate-900 mt-0.5">{estimatedSGPA} <span className="text-xs font-normal text-slate-500">/ 10.0</span></p>
            </div>
            <div className="text-right text-xs">
              <span className="font-mono text-indigo-700 font-semibold">{totalCredits} Registered Credits</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Weighted Grade Average</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
