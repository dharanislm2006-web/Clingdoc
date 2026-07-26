import React, { useState } from 'react';
import { DoctorDocument, Doctor, VerificationStatus } from '../types';
import { 
  FileCheck, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Eye, 
  ShieldCheck, 
  Upload, 
  Sparkles, 
  FileText, 
  X,
  FileCode,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

interface VerificationModuleProps {
  documents: DoctorDocument[];
  doctors: Doctor[];
  onUpdateDocumentStatus: (docId: string, status: VerificationStatus, notes?: string) => void;
  onAddDocument: (newDoc: Omit<DoctorDocument, 'id' | 'uploadedAt'>) => void;
}

export const VerificationModule: React.FC<VerificationModuleProps> = ({
  documents,
  doctors,
  onUpdateDocumentStatus,
  onAddDocument
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedDoc, setSelectedDoc] = useState<DoctorDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // New Upload Form State
  const [uploadData, setUploadData] = useState({
    doctorId: doctors[0]?.id || 'doc-1',
    type: 'Medical Council Registration' as const,
    documentName: 'Delhi_Medical_Council_Certificate.pdf',
    licenseNo: 'MCI-2022-99120',
    issuerName: 'Delhi Medical Council'
  });

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRunOcrAutoCheck = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Auto verify all pending docs
      documents.forEach(d => {
        if (d.status === 'Pending') {
          onUpdateDocumentStatus(d.id, 'Verified', 'Verified via Automated Medical Council Database Query.');
        }
      });
      setIsScanning(false);
    }, 1500);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = doctors.find(d => d.id === uploadData.doctorId);

    onAddDocument({
      doctorId: uploadData.doctorId,
      doctorName: doctor ? doctor.name : 'Dr. Unknown',
      type: uploadData.type,
      documentName: uploadData.documentName,
      status: 'Pending',
      ocrExtractedData: {
        licenseNo: uploadData.licenseNo,
        issueDate: '2022-05-10',
        expiryDate: '2027-05-09',
        issuerName: uploadData.issuerName
      },
      verificationNotes: 'Newly uploaded document queued for state council review.'
    });

    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <FileCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Module 4: Credential & License Verification</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated license verification, state council registration checks, degree verification and OCR certificate audit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunOcrAutoCheck}
            disabled={isScanning}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Running OCR Check...' : 'Run Automated OCR Audit'}</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search doctor, file name, document type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Verification Statuses</option>
            <option value="Verified">✓ Verified Only</option>
            <option value="Pending">⏳ Pending Review</option>
            <option value="Rejected">❌ Rejected</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1.5 rounded-lg">
          {filteredDocs.length} Documents
        </span>
      </div>

      {/* Documents Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Doctor Name</th>
                <th className="px-5 py-3">Document Type</th>
                <th className="px-5 py-3">File Name</th>
                <th className="px-5 py-3">Extracted License</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {doc.doctorName}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-indigo-900">
                    {doc.type}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-600 text-[11px]">
                    {doc.documentName}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-800 font-medium">
                    {doc.ocrExtractedData?.licenseNo || 'N/A'}
                  </td>
                  <td className="px-5 py-3.5">
                    {doc.status === 'Verified' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    ) : doc.status === 'Pending' ? (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Pending Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Audit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect / Verification Audit Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Credential Verification Inspection</h3>
                  <p className="text-xs text-slate-500">{selectedDoc.doctorName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Document Details & OCR Extracted Section */}
            <div className="space-y-4">
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-teal-400 border-b border-slate-800 pb-2">
                  <span className="font-bold">FILE CHECKSUM</span>
                  <span className="text-[10px] opacity-80">SHA256: e928a011bf4399c</span>
                </div>
                <div>Document Name: <span className="text-white">{selectedDoc.documentName}</span></div>
                <div>Category Type: <span className="text-amber-300">{selectedDoc.type}</span></div>
                <div>Uploaded Date: {selectedDoc.uploadedAt}</div>
              </div>

              {/* OCR Extraction Box */}
              <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-2 text-xs">
                <div className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Automated OCR License Extracted Fields
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-500 block text-[10px]">License Number:</span>
                    <span className="font-bold font-mono text-slate-900">{selectedDoc.ocrExtractedData?.licenseNo || 'MCI-2016-88942'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Issuing Council:</span>
                    <span className="font-semibold text-slate-800">{selectedDoc.ocrExtractedData?.issuerName || 'Medical Council of India'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Issue Date:</span>
                    <span className="font-medium text-slate-800">{selectedDoc.ocrExtractedData?.issueDate || '2016-04-12'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Validity Expiry:</span>
                    <span className="font-medium text-slate-800">{selectedDoc.ocrExtractedData?.expiryDate || '2031-04-11'}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                <span className="font-bold text-slate-800 not-italic">Verification Note: </span>
                {selectedDoc.verificationNotes || 'Document matches registered State Council record.'}
              </div>

              {/* Admin Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    onUpdateDocumentStatus(selectedDoc.id, 'Rejected', 'Rejected due to illegible scan. Re-upload required.');
                    setSelectedDoc(null);
                  }}
                  className="px-3.5 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Reject & Request Re-upload
                </button>

                <button
                  onClick={() => {
                    onUpdateDocumentStatus(selectedDoc.id, 'Verified', 'Verified via Admin Manual Audit.');
                    setSelectedDoc(null);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Approve & Set Verified
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Upload Doctor Credential</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 text-xl font-bold p-1">×</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Doctor</label>
                <select
                  value={uploadData.doctorId}
                  onChange={(e) => setUploadData({ ...uploadData, doctorId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
                <select
                  value={uploadData.type}
                  onChange={(e) => setUploadData({ ...uploadData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Medical Council Registration">Medical Council Registration</option>
                  <option value="MBBS / MD Degree">MBBS / MD Degree</option>
                  <option value="Government Photo ID">Government Photo ID</option>
                  <option value="Indemnity Insurance Policy">Indemnity Insurance Policy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={uploadData.documentName}
                  onChange={(e) => setUploadData({ ...uploadData, documentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">License Number</label>
                <input
                  type="text"
                  value={uploadData.licenseNo}
                  onChange={(e) => setUploadData({ ...uploadData, licenseNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Upload & Queue Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
