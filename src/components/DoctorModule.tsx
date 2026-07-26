import React, { useState } from 'react';
import { Doctor, Specialty } from '../types';
import { 
  Stethoscope, 
  Plus, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  MapPin, 
  Award, 
  Phone, 
  Mail, 
  Power,
  Calendar,
  DollarSign,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

interface DoctorModuleProps {
  doctors: Doctor[];
  onToggleAvailability: (id: string) => void;
  onAddDoctor: (newDoctor: Omit<Doctor, 'id' | 'rating' | 'completedShifts'>) => void;
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

export const DoctorModule: React.FC<DoctorModuleProps> = ({
  doctors,
  onToggleAvailability,
  onAddDoctor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for registering doctor
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Emergency Medicine' as Specialty,
    qualification: 'MD / MBBS',
    experienceYears: 5,
    medicalLicenseNo: '',
    stateCouncil: 'Delhi Medical Council',
    contactPhone: '+91 98000 11223',
    email: '',
    location: 'Central Delhi',
    hourlyRate: 1500,
    isAvailable: true,
    preferredShifts: ['Evening', 'Night'] as ('Morning' | 'Evening' | 'Night' | '24hr Emergency')[],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    verificationStatus: 'Verified' as const,
    bio: ''
  });

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.medicalLicenseNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesAvail = !availableOnly || doc.isAvailable;

    return matchesSearch && matchesSpecialty && matchesAvail;
  });

  const handleSubmitNewDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.medicalLicenseNo) return;

    onAddDoctor({
      ...formData,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    });

    setShowAddModal(false);
    // Reset form
    setFormData({
      name: '',
      specialty: 'Emergency Medicine',
      qualification: 'MD / MBBS',
      experienceYears: 5,
      medicalLicenseNo: '',
      stateCouncil: 'Delhi Medical Council',
      contactPhone: '+91 98000 11223',
      email: '',
      location: 'Central Delhi',
      hourlyRate: 1500,
      isAvailable: true,
      preferredShifts: ['Evening', 'Night'],
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      verificationStatus: 'Verified',
      bio: ''
    });
  };

  const handleShiftToggle = (shift: 'Morning' | 'Evening' | 'Night' | '24hr Emergency') => {
    if (formData.preferredShifts.includes(shift)) {
      setFormData({
        ...formData,
        preferredShifts: formData.preferredShifts.filter(s => s !== shift)
      });
    } else {
      setFormData({
        ...formData,
        preferredShifts: [...formData.preferredShifts, shift]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Module 1: Doctor Registration & Availability</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Register doctor credentials, set hourly rates, and toggle live availability for locum shift calls.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Doctor</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search doctor name, specialty, license no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="All">All Specialties</option>
            {specialtiesList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
            />
            <span>Show Available Only</span>
          </label>
          <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1.5 rounded-lg">
            {filteredDoctors.length} Doctors
          </span>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className={`bg-white rounded-2xl border transition shadow-sm overflow-hidden flex flex-col justify-between ${
              doctor.isAvailable ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/20 to-white' : 'border-slate-200 opacity-90'
            }`}
          >
            <div className="p-5">
              {/* Doctor Card Top */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{doctor.name}</h3>
                    <p className="text-xs font-semibold text-teal-700">{doctor.specialty}</p>
                    <p className="text-[11px] text-slate-500">{doctor.qualification}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {doctor.verificationStatus === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Pending
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-medium">★ {doctor.rating} ({doctor.completedShifts} shifts)</span>
                </div>
              </div>

              {/* License & Council Info */}
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-[11px] space-y-1 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">License No:</span>
                  <span className="font-mono font-bold text-slate-800">{doctor.medicalLicenseNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Council:</span>
                  <span className="font-medium text-slate-700">{doctor.stateCouncil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-semibold text-slate-800">{doctor.experienceYears} Years</span>
                </div>
              </div>

              {/* Location & Rate */}
              <div className="flex items-center justify-between text-xs py-1 text-slate-600 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] text-slate-600 truncate max-w-[140px]">{doctor.location}</span>
                </div>
                <div className="font-bold text-slate-900 bg-teal-50 text-teal-800 px-2 py-0.5 rounded">
                  ₹{doctor.hourlyRate}/hr
                </div>
              </div>

              {/* Preferred Shift Chips */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Preferred Shift Duty
                </div>
                <div className="flex flex-wrap gap-1">
                  {doctor.preferredShifts.map((shift) => (
                    <span
                      key={shift}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200"
                    >
                      {shift}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Toggle Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${doctor.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span className="text-xs font-semibold text-slate-700">
                  {doctor.isAvailable ? 'Available for Duty' : 'Off Duty / On Leave'}
                </span>
              </div>

              <button
                onClick={() => onToggleAvailability(doctor.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  doctor.isAvailable
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{doctor.isAvailable ? 'Active' : 'Turn On'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Register New Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Register Doctor Profile</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitNewDoctor} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialty *</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value as Specialty })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    {specialtiesList.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medical License No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MCI-2021-99881"
                    value={formData.medicalLicenseNo}
                    onChange={(e) => setFormData({ ...formData, medicalLicenseNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State Medical Council</label>
                  <input
                    type="text"
                    value={formData.stateCouncil}
                    onChange={(e) => setFormData({ ...formData, stateCouncil: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification Degrees</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hourly Locum Rate (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 1000 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 font-bold text-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location Radius</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Preferred Shift Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Shift Types</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Morning', 'Evening', 'Night', '24hr Emergency'] as const).map((shift) => {
                    const isSelected = formData.preferredShifts.includes(shift);
                    return (
                      <button
                        type="button"
                        key={shift}
                        onClick={() => handleShiftToggle(shift)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {shift}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
