import React, { useState, useEffect } from 'react';
import { ShiftCheckIn, Doctor, JobPosting } from '../types';
import { 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  Play, 
  Square, 
  Check, 
  Building2, 
  Stethoscope, 
  ShieldCheck,
  Award,
  Download,
  Sparkles
} from 'lucide-react';

interface AttendanceModuleProps {
  shiftCheckIns: ShiftCheckIn[];
  doctors: Doctor[];
  jobs: JobPosting[];
  onCheckIn: (shiftId: string, qrCode?: string) => void;
  onCheckOut: (shiftId: string) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  shiftCheckIns,
  doctors,
  jobs,
  onCheckIn,
  onCheckOut
}) => {
  const [selectedShiftId, setSelectedShiftId] = useState<string>(shiftCheckIns[0]?.id || '');
  const [showQrScanModal, setShowQrScanModal] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeSeconds, setActiveSeconds] = useState<number>(3420); // 57 mins sample shift time

  const currentShift = shiftCheckIns.find(s => s.id === selectedShiftId) || shiftCheckIns[0];

  // Timer simulation for checked-in shift
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleSimulateQrScan = (shiftId: string) => {
    setShowQrScanModal(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onCheckIn(shiftId, 'DUTY-DESK-QR-OK-992');
            setShowQrScanModal(false);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Module 5: Attendance & Duty Check-in Desk</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Geo-fence location verification, hospital desk QR scan check-ins, live duty timers and timesheets.
          </p>
        </div>

        <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-bold text-slate-800">
            {shiftCheckIns.filter(s => s.status === 'Checked In').length} Live Duty Active
          </span>
        </div>
      </div>

      {/* Main Active Duty Workspace */}
      {currentShift && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shift Details & Timer Card */}
          <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-sm text-teal-300">{currentShift.hospitalName}</span>
                </div>

                {currentShift.status === 'Checked In' ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    ON DUTY SHIFT
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold">
                    SCHEDULED
                  </span>
                )}
              </div>

              {/* Doctor & Dept */}
              <div className="space-y-1 mb-6">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Reporting Medical Officer
                </div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-400" />
                  {currentShift.doctorName}
                </div>
                <div className="text-xs text-teal-300 font-medium">
                  {currentShift.department}
                </div>
              </div>

              {/* Geo Verification Status */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 mb-6 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    GPS Geo-Fence Radius Check:
                  </span>
                  {currentShift.isGeoVerified ? (
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      45m from Trauma Desk (Verified ✓)
                    </span>
                  ) : (
                    <span className="font-bold text-amber-400">
                      Pending Location Check
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <QrCode className="w-4 h-4 text-teal-400" />
                    Duty Desk QR Scan:
                  </span>
                  <span className="font-mono text-slate-200">
                    {currentShift.qrScanCode || 'QR Scan Required on Site'}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Shift Counter & Check-In Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Live Shift Duration Timer
                </div>
                <div className="text-2xl font-mono font-bold text-teal-400 tracking-wider">
                  {currentShift.status === 'Checked In' ? formatTimer(activeSeconds) : '00:00:00'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {currentShift.status !== 'Checked In' ? (
                  <button
                    onClick={() => handleSimulateQrScan(currentShift.id)}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Scan QR to Check In</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onCheckOut(currentShift.id)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-slate-950" />
                    <span>Check Out & Submit Timesheet</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* List of Duty Shifts */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-3">All Shift Duty Logs</h3>
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {shiftCheckIns.map((s) => {
                  const isSelected = s.id === currentShift.id;

                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedShiftId(s.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-500/20'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900">{s.doctorName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          s.status === 'Checked In'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">{s.hospitalName}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {s.scheduledStart}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500">
                All duty logs automatically generate verified timesheets for hospital payroll.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal Simulation */}
      {showQrScanModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Hospital Duty Desk QR Scanner
              </span>
              <button
                onClick={() => setShowQrScanModal(false)}
                className="text-slate-400 hover:text-white font-bold text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* QR Viewfinder simulator */}
            <div className="relative w-48 h-48 mx-auto bg-slate-950 border-2 border-teal-500 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-inner">
              <QrCode className="w-24 h-24 text-teal-400/80 animate-pulse" />
              <div className="absolute inset-x-0 h-1 bg-teal-400 animate-bounce shadow-lg shadow-teal-400"></div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-300 font-medium">Scanning Hospital Desk QR Code...</p>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500">Cross-referencing GPS Geo-Location & Timestamp</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
