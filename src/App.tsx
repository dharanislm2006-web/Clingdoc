import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { DoctorModule } from './components/DoctorModule';
import { HospitalModule } from './components/HospitalModule';
import { MatchingModule } from './components/MatchingModule';
import { VerificationModule } from './components/VerificationModule';
import { AttendanceModule } from './components/AttendanceModule';

import { ActiveTab, Doctor, JobPosting, DoctorDocument, ShiftCheckIn, VerificationStatus } from './types';
import { initialDoctors, initialJobs, initialDocuments, initialShiftCheckIns } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Application local state
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [documents, setDocuments] = useState<DoctorDocument[]>(initialDocuments);
  const [shiftCheckIns, setShiftCheckIns] = useState<ShiftCheckIn[]>(initialShiftCheckIns);

  // 1. Reset Demo Data
  const handleResetData = () => {
    setDoctors(initialDoctors);
    setJobs(initialJobs);
    setDocuments(initialDocuments);
    setShiftCheckIns(initialShiftCheckIns);
  };

  // 2. Doctor Actions
  const handleToggleAvailability = (id: string) => {
    setDoctors(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, isAvailable: !doc.isAvailable } : doc
      )
    );
  };

  const handleAddDoctor = (newDoctorData: Omit<Doctor, 'id' | 'rating' | 'completedShifts'>) => {
    const newDoc: Doctor = {
      ...newDoctorData,
      id: `doc-${Date.now()}`,
      rating: 4.8,
      completedShifts: 0
    };
    setDoctors(prev => [newDoc, ...prev]);
  };

  // 3. Hospital Job Actions
  const handleAddJob = (newJobData: Omit<JobPosting, 'id' | 'postedDate' | 'applicantIds'>) => {
    const newJob: JobPosting = {
      ...newJobData,
      id: `job-${Date.now()}`,
      postedDate: 'Just now',
      applicantIds: []
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const handleApplyForJob = (jobId: string, doctorId: string) => {
    setJobs(prev =>
      prev.map(job => {
        if (job.id === jobId && !job.applicantIds.includes(doctorId)) {
          return { ...job, applicantIds: [...job.applicantIds, doctorId] };
        }
        return job;
      })
    );

    // Automatically create a scheduled shift check-in entry if not present
    const doctor = doctors.find(d => d.id === doctorId);
    const job = jobs.find(j => j.id === jobId);

    if (doctor && job) {
      const existingShift = shiftCheckIns.find(s => s.doctorId === doctorId && s.jobId === jobId);
      if (!existingShift) {
        const newShift: ShiftCheckIn = {
          id: `chk-${Date.now()}`,
          doctorId: doctor.id,
          doctorName: doctor.name,
          jobId: job.id,
          hospitalName: job.hospitalName,
          department: job.department,
          scheduledStart: `${job.date} • ${job.shiftHours.split('(')[0]}`,
          scheduledEnd: 'End of Shift',
          status: 'Scheduled',
          isGeoVerified: false,
          notes: 'Matched & application confirmed via ClingDoc Platform.'
        };
        setShiftCheckIns(prev => [newShift, ...prev]);
      }
    }
  };

  // 4. Verification Actions
  const handleUpdateDocumentStatus = (docId: string, status: VerificationStatus, notes?: string) => {
    setDocuments(prev =>
      prev.map(d =>
        d.id === docId ? { ...d, status, verificationNotes: notes || d.verificationNotes } : d
      )
    );

    // Also update doctor's verification badge if all their docs are verified
    const docItem = documents.find(d => d.id === docId);
    if (docItem) {
      const docOwnerId = docItem.doctorId;
      setDoctors(prevDocs =>
        prevDocs.map(d => {
          if (d.id === docOwnerId && status === 'Verified') {
            return { ...d, verificationStatus: 'Verified' };
          }
          return d;
        })
      );
    }
  };

  const handleAddDocument = (newDocData: Omit<DoctorDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: DoctorDocument = {
      ...newDocData,
      id: `doc-file-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  // 5. Attendance Actions
  const handleCheckIn = (shiftId: string, qrCode?: string) => {
    setShiftCheckIns(prev =>
      prev.map(s => {
        if (s.id === shiftId) {
          return {
            ...s,
            status: 'Checked In',
            checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isGeoVerified: true,
            distanceFromHospitalMeters: 38,
            qrScanCode: qrCode || 'DESK-QR-VERIFIED-102'
          };
        }
        return s;
      })
    );
  };

  const handleCheckOut = (shiftId: string) => {
    setShiftCheckIns(prev =>
      prev.map(s => {
        if (s.id === shiftId) {
          return {
            ...s,
            status: 'Completed',
            checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return s;
      })
    );
  };

  const availableDoctorCount = doctors.filter(d => d.isAvailable).length;
  const urgentJobCount = jobs.filter(j => j.urgency === 'Urgent' && j.status === 'Open').length;
  const pendingDocCount = documents.filter(d => d.status === 'Pending').length;
  const activeShiftCount = shiftCheckIns.filter(s => s.status === 'Checked In').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        doctorCount={doctors.length}
        availableDoctorCount={availableDoctorCount}
        jobCount={jobs.length}
        urgentJobCount={urgentJobCount}
        pendingDocCount={pendingDocCount}
        activeShiftCount={activeShiftCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <DashboardOverview
            doctors={doctors}
            jobs={jobs}
            documents={documents}
            shiftCheckIns={shiftCheckIns}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorModule
            doctors={doctors}
            onToggleAvailability={handleToggleAvailability}
            onAddDoctor={handleAddDoctor}
          />
        )}

        {activeTab === 'jobs' && (
          <HospitalModule
            jobs={jobs}
            doctors={doctors}
            onAddJob={handleAddJob}
            onApplyForJob={handleApplyForJob}
          />
        )}

        {activeTab === 'matching' && (
          <MatchingModule
            doctors={doctors}
            jobs={jobs}
            onApplyForJob={handleApplyForJob}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationModule
            documents={documents}
            doctors={doctors}
            onUpdateDocumentStatus={handleUpdateDocumentStatus}
            onAddDocument={handleAddDocument}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceModule
            shiftCheckIns={shiftCheckIns}
            doctors={doctors}
            jobs={jobs}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">ClingDoc</span>
            <span>— Healthcare Staffing & Verification Prototype</span>
          </div>
          <div className="text-slate-500">
            Hackathon Functional Prototype • 5 Modules Operational
          </div>
        </div>
      </footer>
    </div>
  );
}
