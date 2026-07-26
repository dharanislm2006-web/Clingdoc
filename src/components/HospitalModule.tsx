import React, { useState } from 'react';
import { JobPosting, Doctor, Specialty, ShiftType } from '../types';
import { 
  Building2, 
  Plus, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  MapPin, 
  Search, 
  User, 
  CheckCircle2, 
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HospitalModuleProps {
  jobs: JobPosting[];
  doctors: Doctor[];
  onAddJob: (newJob: Omit<JobPosting, 'id' | 'postedDate' | 'applicantIds'>) => void;
  onApplyForJob: (jobId: string, doctorId: string) => void;
}

const specialtiesList: Specialty[] = [
  'Emergency Medicine',
  'Cardiology',
  'Anesthesiology',
  'Pediatrics',
  'General Surgery',
  'Internal Medicine',
  'Orthopedics',
  'Obstetrics & Gynecology',
  'Radiology',
  'Neurology'
];

const shiftTypes: ShiftType[] = [
  'ICU Locum',
  'ER Shift',
  'OPD Duty',
  'General Ward',
  'Night On-Call',
  'Surgical Assisting'
];

export const HospitalModule: React.FC<HospitalModuleProps> = ({
  jobs,
  doctors,
  onAddJob,
  onApplyForJob
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<JobPosting | null>(null);

  const [formData, setFormData] = useState({
    hospitalName: '',
    department: 'Emergency & Trauma',
    specialty: 'Emergency Medicine' as Specialty,
    title: '',
    shiftType: 'ER Shift' as ShiftType,
    date: 'Today',
    shiftHours: '02:00 PM - 10:00 PM (8 Hours)',
    payAmount: 1800,
    payType: 'per_hour' as const,
    location: 'Central Delhi',
    urgency: 'Urgent' as const,
    experienceRequired: 5,
    requirementsStr: 'Valid State License, ACLS Certified',
    status: 'Open' as const
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUrgency = selectedUrgency === 'All' || job.urgency === selectedUrgency;
    const matchesSpecialty = selectedSpecialty === 'All' || job.specialty === selectedSpecialty;

    return matchesSearch && matchesUrgency && matchesSpecialty;
  });

  const handleSubmitNewJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hospitalName || !formData.title) return;

    onAddJob({
      ...formData,
      requirements: formData.requirementsStr.split(',').map(s => s.trim()).filter(Boolean)
    });

    setShowPostModal(false);
    // Reset form
    setFormData({
      hospitalName: '',
      department: 'Emergency & Trauma',
      specialty: 'Emergency Medicine',
      title: '',
      shiftType: 'ER Shift',
      date: 'Today',
      shiftHours: '02:00 PM - 10:00 PM (8 Hours)',
      payAmount: 1800,
      payType: 'per_hour',
      location: 'Central Delhi',
      urgency: 'Urgent',
      experienceRequired: 5,
      requirementsStr: 'Valid State License, ACLS Certified',
      status: 'Open'
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Module 2: Hospital Job Posting</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Post locum shifts, ER demands, and department requirements with specified pay rates and required experience.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Shift Requirement</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search hospital, shift title, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Specialties</option>
            {specialtiesList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Urgency Levels</option>
            <option value="Urgent">🚨 Urgent Only</option>
            <option value="High">⚡ High Priority</option>
            <option value="Normal">Standard</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1.5 rounded-lg">
          {filteredJobs.length} Active Postings
        </span>
      </div>

      {/* Job Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => {
          const applicantDoctors = doctors.filter(d => job.applicantIds.includes(d.id));

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Job Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {job.department}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{job.hospitalName}</h3>
                  </div>

                  {job.urgency === 'Urgent' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      URGENT
                    </span>
                  ) : job.urgency === 'High' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                      HIGH
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                      Standard
                    </span>
                  )}
                </div>

                {/* Job Title */}
                <h4 className="font-bold text-blue-900 text-sm mb-3">{job.title}</h4>

                {/* Details Pills */}
                <div className="space-y-2 text-xs mb-4">
                  <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[11px]">Specialty:</span>
                    <span className="font-semibold text-slate-800">{job.specialty}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[11px]">Shift & Time:</span>
                    <span className="font-medium text-slate-800 text-[11px]">{job.date} • {job.shiftHours}</span>
                  </div>

                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-900 p-2 rounded-lg border border-emerald-100">
                    <span className="text-xs font-medium">Offered Rate:</span>
                    <span className="font-bold text-sm text-emerald-800">₹{job.payAmount} / hr</span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Requirements:</div>
                  <ul className="text-[11px] text-slate-600 space-y-0.5 pl-3 list-disc">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                    <li>Min {job.experienceRequired} yrs experience required</li>
                  </ul>
                </div>
              </div>

              {/* Card Footer: Applicants & Quick Apply */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedJobForApplicants(job)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{applicantDoctors.length} Applicants</span>
                </button>

                {/* Quick Apply Button for Doctor Demo */}
                <button
                  onClick={() => {
                    const firstAvailDoc = doctors.find(d => d.isAvailable) || doctors[0];
                    if (firstAvailDoc) {
                      onApplyForJob(job.id, firstAvailDoc.id);
                    }
                  }}
                  className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <span>Quick Apply</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post New Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Post Hospital Shift Requirement</h2>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitNewJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Institute Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Max Super Specialty Hospital"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Shift Requirement Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Urgent ER Locum Night Specialist Duty"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Required Specialty *</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value as Specialty })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {specialtiesList.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Shift Duty Type</label>
                  <select
                    value={formData.shiftType}
                    onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as ShiftType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {shiftTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Shift Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Shift Hours</label>
                  <input
                    type="text"
                    value={formData.shiftHours}
                    onChange={(e) => setFormData({ ...formData, shiftHours: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Offered Hourly Rate (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={formData.payAmount}
                    onChange={(e) => setFormData({ ...formData, payAmount: parseInt(e.target.value) || 1000 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency Priority</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Urgent">🚨 Urgent (Immediate Duty)</option>
                    <option value="High">⚡ High Priority</option>
                    <option value="Normal">Standard</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Requirements (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Valid License, ACLS Certified, ICU Exp"
                    value={formData.requirementsStr}
                    onChange={(e) => setFormData({ ...formData, requirementsStr: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Post Shift Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Applicants Modal */}
      {selectedJobForApplicants && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{selectedJobForApplicants.hospitalName}</h3>
                <p className="text-xs text-blue-700 font-semibold">{selectedJobForApplicants.title}</p>
              </div>
              <button
                onClick={() => setSelectedJobForApplicants(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <h4 className="text-xs font-bold text-slate-700 mb-3">Applied Doctors:</h4>

            {selectedJobForApplicants.applicantIds.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center italic bg-slate-50 rounded-xl">
                No doctors have applied yet. Use "Quick Apply" or "Smart AI Matching" module to connect doctors!
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {doctors
                  .filter(d => selectedJobForApplicants.applicantIds.includes(d.id))
                  .map(doc => (
                    <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={doc.avatar} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-xs text-slate-900">{doc.name}</div>
                          <div className="text-[11px] text-teal-700 font-medium">{doc.specialty} • ₹{doc.hourlyRate}/hr</div>
                        </div>
                      </div>

                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md font-bold">
                        Applied
                      </span>
                    </div>
                  ))}
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedJobForApplicants(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
