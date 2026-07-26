import { Doctor, JobPosting, MatchResult } from '../types';

export function calculateDoctorJobMatch(doctor: Doctor, job: JobPosting): MatchResult {
  let specialtyScore = 0;
  let availabilityScore = 0;
  let verificationScore = 0;
  let locationScore = 0;
  let payScore = 0;
  const reasons: string[] = [];

  // 1. Specialty Match (Max 35 points)
  if (doctor.specialty === job.specialty) {
    specialtyScore = 35;
    reasons.push(`Exact Specialty Match: ${doctor.specialty}`);
  } else {
    // Partial specialty domain credit
    specialtyScore = 10;
    reasons.push(`Cross-specialty potential: ${doctor.specialty} to ${job.specialty}`);
  }

  // 2. Doctor Availability & Shift Alignment (Max 25 points)
  if (doctor.isAvailable) {
    availabilityScore += 15;
    reasons.push('Doctor is actively marked Available for locum duties');
  } else {
    reasons.push('Doctor is currently off-duty or on leave');
  }

  // Check shift overlap
  const isNightShift = job.shiftHours.toLowerCase().includes('pm') || job.shiftType.toLowerCase().includes('night');
  const isEmergency = job.urgency === 'Urgent' || job.shiftType.includes('ER');

  if (isEmergency && doctor.preferredShifts.includes('24hr Emergency')) {
    availabilityScore += 10;
    reasons.push('Doctor explicitly registered for 24/7 Emergency response');
  } else if (isNightShift && doctor.preferredShifts.includes('Night')) {
    availabilityScore += 10;
    reasons.push('Shift time aligns with doctor’s preferred Night schedule');
  } else {
    availabilityScore += 5;
  }

  // 3. Document Verification (Max 20 points)
  if (doctor.verificationStatus === 'Verified') {
    verificationScore = 20;
    reasons.push('100% Verified Credentials & Medical Council License');
  } else if (doctor.verificationStatus === 'Pending') {
    verificationScore = 10;
    reasons.push('Credentials under verification review');
  } else {
    verificationScore = 0;
    reasons.push('Verification incomplete or rejected');
  }

  // 4. Experience & Rate Alignment (Max 20 points)
  if (doctor.experienceYears >= job.experienceRequired) {
    locationScore = 10;
    reasons.push(`${doctor.experienceYears} yrs experience exceeds required ${job.experienceRequired} yrs`);
  } else {
    locationScore = 4;
    reasons.push(`Experience (${doctor.experienceYears} yrs) slightly below target (${job.experienceRequired} yrs)`);
  }

  if (doctor.hourlyRate <= job.payAmount) {
    payScore = 10;
    reasons.push(`Expected rate (₹${doctor.hourlyRate}/hr) within job budget (₹${job.payAmount}/hr)`);
  } else {
    payScore = 5;
    reasons.push(`Rate mismatch (₹${doctor.hourlyRate}/hr vs ₹${job.payAmount}/hr budget)`);
  }

  const overallScore = Math.min(100, Math.round(specialtyScore + availabilityScore + verificationScore + locationScore + payScore));

  const isApplied = job.applicantIds.includes(doctor.id);

  return {
    doctorId: doctor.id,
    doctor,
    jobId: job.id,
    job,
    overallScore,
    specialtyScore,
    availabilityScore,
    locationScore,
    payScore,
    verificationScore,
    reasons,
    matchStatus: isApplied ? 'Accepted' : overallScore > 80 ? 'Suggested' : 'Suggested',
  };
}

export function getAllMatches(doctors: Doctor[], jobs: JobPosting[]): MatchResult[] {
  const matches: MatchResult[] = [];
  doctors.forEach(doctor => {
    jobs.forEach(job => {
      matches.push(calculateDoctorJobMatch(doctor, job));
    });
  });

  return matches.sort((a, b) => b.overallScore - a.overallScore);
}
