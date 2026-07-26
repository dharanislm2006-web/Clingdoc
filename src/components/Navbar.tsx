import React from 'react';
import { ActiveTab } from '../types';
import { 
  Stethoscope, 
  Building2, 
  Zap, 
  FileCheck, 
  Clock, 
  LayoutDashboard, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onResetData: () => void;
  doctorCount: number;
  availableDoctorCount: number;
  jobCount: number;
  urgentJobCount: number;
  pendingDocCount: number;
  activeShiftCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetData,
  doctorCount,
  availableDoctorCount,
  jobCount,
  urgentJobCount,
  pendingDocCount,
  activeShiftCount
}) => {
  const tabs = [
    { 
      id: 'overview' as ActiveTab, 
      label: 'Overview', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'doctors' as ActiveTab, 
      label: 'Doctor Profile & Availability', 
      icon: Stethoscope,
      badge: `${availableDoctorCount}/${doctorCount} Avail`
    },
    { 
      id: 'jobs' as ActiveTab, 
      label: 'Hospital Job Postings', 
      icon: Building2,
      badge: urgentJobCount > 0 ? `${urgentJobCount} Urgent` : `${jobCount} Jobs`
    },
    { 
      id: 'matching' as ActiveTab, 
      label: 'Smart AI Matching', 
      icon: Zap,
      badge: 'Auto Match'
    },
    { 
      id: 'verification' as ActiveTab, 
      label: 'Document Verification', 
      icon: FileCheck,
      badge: pendingDocCount > 0 ? `${pendingDocCount} Review` : 'Verified'
    },
    { 
      id: 'attendance' as ActiveTab, 
      label: 'Attendance & Check-in', 
      icon: Clock,
      badge: activeShiftCount > 0 ? `${activeShiftCount} Active` : null
    },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white font-bold text-xl">
            +
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">ClingDoc</span>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs px-2 py-0.5 rounded-full font-medium">
                Prototype v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Healthcare Staffing, Smart Matching & Verification Platform</p>
          </div>
        </div>

        {/* Quick Stats & Reset Demo button */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">Doctors:</span>
              <span className="font-semibold text-white">{availableDoctorCount} Available</span>
            </div>
            <div className="h-3 w-px bg-slate-700"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-300">Jobs:</span>
              <span className="font-semibold text-teal-400">{jobCount} Open</span>
            </div>
            <div className="h-3 w-px bg-slate-700"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-300">Active Duty:</span>
              <span className="font-semibold text-amber-400">{activeShiftCount} On Shift</span>
            </div>
          </div>

          <button
            onClick={onResetData}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
            title="Reload initial seed data for testing"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Module Tabs Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-teal-800/80 text-teal-100'
                        : 'bg-slate-800 text-teal-400 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
