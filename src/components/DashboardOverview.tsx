import React from 'react';
import { Doctor, JobPosting, DoctorDocument, ShiftCheckIn, ActiveTab } from '../types';
import { 
  Stethoscope, 
  Building2, 
  Zap, 
  FileCheck, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  UserCheck, 
  Sparkles,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';

interface DashboardOverviewProps {
  doctors: Doctor[];
  jobs: JobPosting[];
  documents: DoctorDocument[];
  shiftCheckIns: ShiftCheckIn[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  doctors,
  jobs,
  documents,
  shiftCheckIns,
  setActiveTab
}) => {
  const availableDoctors = doctors.filter(d => d.isAvailable);
  const verifiedDoctors = doctors.filter(d => d.verificationStatus === 'Verified');
  const openJobs = jobs.filter(j => j.status === 'Open');
  const urgentJobs = jobs.filter(j => j.urgency === 'Urgent' && j.status === 'Open');
  const pendingDocs = documents.filter(d => d.status === 'Pending');
  const activeShifts = shiftCheckIns.filter(s => s.status === 'Checked In');

  const modules = [
    {
      id: 'doctors' as ActiveTab,
      num: '01',
      title: 'Doctor Registration & Availability',
      desc: 'Doctor profiles with license details, hourly shift rates, and real-time ON/OFF duty schedule toggles.',
      stat: `${availableDoctors.length} Doctors Available Now`,
      statSub: `${doctors.length} Total Registered`,
      icon: Stethoscope,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      buttonText: 'Manage Doctors & Availability'
    },
    {
      id: 'jobs' as ActiveTab,
      num: '02',
      title: 'Hospital Job Posting',
      desc: 'Hospitals post locum duties, ER shifts, and specialty ward coverage with custom pay and urgency.',
      stat: `${openJobs.length} Active Shift Postings`,
      statSub: `${urgentJobs.length} Urgent ER/CCU Demands`,
      icon: Building2,
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200',
      buttonText: 'View & Post Hospital Jobs'
    },
    {
      id: 'matching' as ActiveTab,
      num: '03',
      title: 'Smart Doctor-Hospital Matching',
      desc: 'Algorithm matching doctors with postings based on specialty, shift alignment, license verification & rates.',
      stat: 'Auto Match Engine',
      statSub: '95% Top Compatibility Score',
      icon: Zap,
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-200',
      buttonText: 'Test Smart Matching Engine'
    },
    {
      id: 'verification' as ActiveTab,
      num: '04',
      title: 'Document Verification',
      desc: 'Medical license OCR extraction, State Council database cross-checks, and trust status badges.',
      stat: `${documents.filter(d => d.status === 'Verified').length} Documents Verified`,
      statSub: `${pendingDocs.length} Pending Admin Review`,
      icon: FileCheck,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      buttonText: 'Inspect & Verify Documents'
    },
    {
      id: 'attendance' as ActiveTab,
      num: '05',
      title: 'Attendance & Geo Check-in',
      desc: 'Geo-fenced GPS distance validation, hospital desk QR scan check-ins, live shift timers and timesheets.',
      stat: `${activeShifts.length} Active Doctor on Shift`,
      statSub: '100% Geo-Verified',
      icon: Clock,
      badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-200',
      buttonText: 'Duty Desk & Check-in'
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Banner / Introduction Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs px-3 py-1 rounded-full font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            Hackathon Functional Prototype Demo
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            ClingDoc Healthcare Staffing & Verification Platform
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A comprehensive locum doctor management solution linking hospitals with verified medical professionals. Test all 5 functional modules below or switch tabs above.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('matching')}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              Launch Smart Match Demo
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm border border-slate-700 transition cursor-pointer"
            >
              <Clock className="w-4 h-4 text-teal-400" />
              Test Geo & QR Attendance
            </button>
          </div>
        </div>
      </div>

      {/* End-to-End Workflow Guide Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600" />
            End-to-End Locum Flow Stepper
          </h2>
          <span className="text-xs text-slate-500 font-medium">5 Sequential Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {modules.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className="bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 p-3.5 rounded-xl cursor-pointer transition group relative"
            >
              <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-1">
                Step {idx + 1}
              </div>
              <div className="font-semibold text-slate-800 text-xs line-clamp-1 group-hover:text-teal-900">
                {m.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {m.stat}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of the 5 Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Platform Functional Modules</h2>
          <span className="text-xs text-slate-500">Click any card to launch interactive module</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between group hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${m.badgeColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                      Module {m.num}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition mb-2">
                    {m.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{m.stat}</span>
                    <span className="text-slate-500 text-[11px]">{m.statSub}</span>
                  </div>

                  <button
                    onClick={() => setActiveTab(m.id)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 group-hover:bg-teal-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition cursor-pointer"
                  >
                    <span>{m.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fast Live Stats Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 text-slate-500">
          Live System Operational Status
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <UserCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Verified Doctors</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {verifiedDoctors.length} / {doctors.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Medical license confirmed</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Open Postings</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {openJobs.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{urgentJobs.length} urgent ER requests</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Documents</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {documents.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{pendingDocs.length} pending review</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Active Duty</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {shiftCheckIns.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">GPS & QR verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};
