import React, { useState } from 'react';
import { Doctor, JobPosting, MatchResult } from '../types';
import { getAllMatches } from '../lib/matchingEngine';
import { 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  Clock, 
  Check, 
  Send
} from 'lucide-react';

interface MatchingModuleProps {
  doctors: Doctor[];
  jobs: JobPosting[];
  onApplyForJob: (jobId: string, doctorId: string) => void;
}

export const MatchingModule: React.FC<MatchingModuleProps> = ({
  doctors,
  jobs,
  onApplyForJob
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('All');
  const [selectedJobId, setSelectedJobId] = useState<string>('All');
  const [minMatchFilter, setMinMatchFilter] = useState<number>(60);
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  const allMatches = getAllMatches(doctors, jobs);

  const filteredMatches = allMatches.filter(m => {
    const matchesDoc = selectedDoctorId === 'All' || m.doctorId === selectedDoctorId;
    const matchesJob = selectedJobId === 'All' || m.jobId === selectedJobId;
    const matchesScore = m.overallScore >= minMatchFilter;

    return matchesDoc && matchesJob && matchesScore;
  });

  const handleSendOffer = (jobId: string, doctorId: string, doctorName: string, hospitalName: string) => {
    onApplyForJob(jobId, doctorId);
    setBookingToast(`Shift offer sent! ${doctorName} matched & connected to ${hospitalName}.`);
    setTimeout(() => {
      setBookingToast(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-2xl border border-amber-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-lg shadow-sm">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Module 3: Smart Doctor-Hospital Matching Engine</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Intelligent scoring engine computing weighted compatibility based on specialty, shift schedule, council verification & budget.
          </p>
        </div>

        <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span className="text-xs font-bold text-amber-900">
            {allMatches.length} Pairwise Match Evaluated
          </span>
        </div>
      </div>

      {/* Toast Banner */}
      {bookingToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-bounce">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-white" />
            <span>{bookingToast}</span>
          </div>
          <button onClick={() => setBookingToast(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Interactive Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filter Doctor:</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="All">All Doctors ({doctors.length})</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filter Hospital Job:</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="All">All Open Postings ({jobs.length})</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.hospitalName} - {j.specialty}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Min Match Score:</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="40"
                max="90"
                step="5"
                value={minMatchFilter}
                onChange={(e) => setMinMatchFilter(parseInt(e.target.value))}
                className="w-24 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {minMatchFilter}%+
              </span>
            </div>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
          Showing {filteredMatches.length} Matches
        </span>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
            No matches found meeting current filter criteria ({minMatchFilter}%+). Try lowering min score filter!
          </div>
        ) : (
          filteredMatches.map((match, idx) => {
            const isApplied = match.job.applicantIds.includes(match.doctorId);

            return (
              <div
                key={`${match.doctorId}-${match.jobId}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"
              >
                {/* Match Score Badge Bar on left side */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                  match.overallScore >= 85 ? 'bg-emerald-500' : match.overallScore >= 70 ? 'bg-amber-500' : 'bg-slate-300'
                }`}></div>

                {/* Doctor Info */}
                <div className="flex items-center gap-3 pl-3 min-w-[220px]">
                  <img
                    src={match.doctor.avatar}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      Doctor
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{match.doctor.name}</h3>
                    <p className="text-xs text-slate-500">{match.doctor.specialty} • ₹{match.doctor.hourlyRate}/hr</p>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="hidden lg:flex flex-col items-center text-slate-300">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Match Algorithm
                  </span>
                  <ArrowRight className="w-5 h-5 text-amber-500 mt-1" />
                </div>

                {/* Hospital Job Info */}
                <div className="min-w-[220px]">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    Hospital Job
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{match.job.hospitalName}</h3>
                  <p className="text-xs font-medium text-slate-600">{match.job.title}</p>
                  <p className="text-[11px] text-slate-400">{match.job.date} • ₹{match.job.payAmount}/hr</p>
                </div>

                {/* Score Circular Gauge & Breakdown */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-[220px] flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800">Match Compatibility</span>
                    <span className={`text-base font-black px-2.5 py-0.5 rounded-lg text-white ${
                      match.overallScore >= 85 ? 'bg-emerald-600' : match.overallScore >= 70 ? 'bg-amber-600' : 'bg-slate-600'
                    }`}>
                      {match.overallScore}%
                    </span>
                  </div>

                  {/* Justifications */}
                  <ul className="text-[11px] text-slate-600 space-y-1">
                    {match.reasons.slice(0, 3).map((r, i) => (
                      <li key={i} className="flex items-center gap-1.5 truncate">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="flex items-center gap-2 self-stretch md:self-center">
                  {isApplied ? (
                    <button
                      disabled
                      className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1.5 cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Match Offered</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendOffer(match.jobId, match.doctorId, match.doctor.name, match.job.hospitalName)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Instant Match Offer</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
