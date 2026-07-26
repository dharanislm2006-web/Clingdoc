export type Specialty = 
  | 'Cardiology'
  | 'Emergency Medicine'
  | 'Pediatrics'
  | 'Anesthesiology'
  | 'General Surgery'
  | 'Internal Medicine'
  | 'Orthopedics'
  | 'Obstetrics & Gynecology'
  | 'Radiology'
  | 'Neurology';

export type ShiftType = 
  | 'ICU Locum' 
  | 'ER Shift' 
  | 'OPD Duty' 
  | 'General Ward' 
  | 'Night On-Call' 
  | 'Surgical Assisting';

export type VerificationStatus = 'Verified' | 'Pending' | 'Needs Review' | 'Rejected';

export interface Doctor {
  id: string;
  name: string;
  avatar: string;
  specialty: Specialty;
  qualification: string;
  experienceYears: number;
  medicalLicenseNo: string;
  stateCouncil: string;
  contactPhone: string;
  email: string;
  location: string;
  hourlyRate: number;
  isAvailable: boolean;
  preferredShifts: ('Morning' | 'Evening' | 'Night' | '24hr Emergency')[];
  availableDays: string[];
  verificationStatus: VerificationStatus;
  rating: number;
  completedShifts: number;
  bio?: string;
}

export interface JobPosting {
  id: string;
  hospitalName: string;
  department: string;
  specialty: Specialty;
  title: string;
  shiftType: ShiftType;
  date: string;
  shiftHours: string;
  payAmount: number;
  payType: 'per_hour' | 'per_shift';
  location: string;
  urgency: 'Urgent' | 'High' | 'Normal';
  experienceRequired: number;
  requirements: string[];
  status: 'Open' | 'Matched' | 'Completed' | 'Closed';
  postedDate: string;
  applicantIds: string[];
}

export interface DoctorDocument {
  id: string;
  doctorId: string;
  doctorName: string;
  type: 'MBBS / MD Degree' | 'Medical Council Registration' | 'Government Photo ID' | 'Indemnity Insurance Policy';
  documentName: string;
  fileUrl?: string;
  uploadedAt: string;
  status: VerificationStatus;
  ocrExtractedData?: {
    licenseNo?: string;
    issueDate?: string;
    expiryDate?: string;
    issuerName?: string;
  };
  verificationNotes?: string;
}

export interface ShiftCheckIn {
  id: string;
  doctorId: string;
  doctorName: string;
  jobId: string;
  hospitalName: string;
  department: string;
  scheduledStart: string;
  scheduledEnd: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'Scheduled' | 'Checked In' | 'Completed' | 'Late CheckIn';
  distanceFromHospitalMeters?: number;
  isGeoVerified: boolean;
  qrScanCode?: string;
  notes?: string;
}

export interface MatchResult {
  doctorId: string;
  doctor: Doctor;
  jobId: string;
  job: JobPosting;
  overallScore: number;
  specialtyScore: number;
  availabilityScore: number;
  locationScore: number;
  payScore: number;
  verificationScore: number;
  reasons: string[];
  matchStatus: 'Suggested' | 'Requested' | 'Accepted' | 'Booked';
}

export type ActiveTab = 'overview' | 'doctors' | 'jobs' | 'matching' | 'verification' | 'attendance';
