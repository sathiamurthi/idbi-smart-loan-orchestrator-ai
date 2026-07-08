import { useState } from 'react';
import { Landmark, ArrowRight, User, Briefcase, FileText, CheckCircle2, AlertTriangle, Play, UploadCloud, Check, Loader2 } from 'lucide-react';
import type { LoanApplication, EmployerType } from '../types';

interface CustomerPortalProps {
  applications: LoanApplication[];
  onSubmitApplication: (data: {
    applicantName: string;
    monthlySalary: number;
    requestedAmount: number;
    employerName: string;
    employerType: EmployerType;
    declaredCreditScore: number;
    purpose: string;
    simulateMissingDocs: boolean;
    salarySlipFile?: { name: string; sizeBytes: number; status: 'uploaded' | 'pending' };
    bankStatementFile?: { name: string; sizeBytes: number; status: 'uploaded' | 'pending' };
  }) => void;
  onSelectApplication: (app: LoanApplication) => void;
  activeAppId: string | null;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  applications,
  onSubmitApplication,
  onSelectApplication,
  activeAppId,
}) => {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState(75000);
  const [amount, setAmount] = useState(1000000);
  const [employer, setEmployer] = useState('');
  const [employerType, setEmployerType] = useState<EmployerType>('MNC');
  const [creditScore, setCreditScore] = useState(740);
  const [purpose, setPurpose] = useState('Home Loan');
  const [simulateMissingDocs, setSimulateMissingDocs] = useState(false);

  // Document upload state
  const [salarySlip, setSalarySlip] = useState<{ name: string; sizeBytes: number; status: 'uploaded' | 'pending' | 'uploading' } | null>(null);
  const [bankStatement, setBankStatement] = useState<{ name: string; sizeBytes: number; status: 'uploaded' | 'pending' | 'uploading' } | null>(null);

  const handleSalaryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSalarySlip({ name: file.name, sizeBytes: file.size, status: 'uploading' });
      setTimeout(() => {
        setSalarySlip({ name: file.name, sizeBytes: file.size, status: 'uploaded' });
      }, 1200);
    }
  };

  const handleBankFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBankStatement({ name: file.name, sizeBytes: file.size, status: 'uploading' });
      setTimeout(() => {
        setBankStatement({ name: file.name, sizeBytes: file.size, status: 'uploaded' });
      }, 1200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !employer) {
      alert('Please fill in Name and Employer fields.');
      return;
    }
    onSubmitApplication({
      applicantName: name,
      monthlySalary: salary,
      requestedAmount: amount,
      employerName: employer,
      employerType,
      declaredCreditScore: creditScore,
      purpose,
      simulateMissingDocs,
      salarySlipFile: salarySlip?.status === 'uploaded' ? { name: salarySlip.name, sizeBytes: salarySlip.sizeBytes, status: 'uploaded' } : undefined,
      bankStatementFile: bankStatement?.status === 'uploaded' ? { name: bankStatement.name, sizeBytes: bankStatement.sizeBytes, status: 'uploaded' } : undefined,
    });
    // Reset form fields
    setName('');
    setEmployer('');
    setSimulateMissingDocs(false);
    setSalarySlip(null);
    setBankStatement(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/60';
      case 'REJECTED':
        return 'bg-rose-950/40 text-rose-400 border border-rose-800/60';
      case 'UNDER_REVIEW':
        return 'bg-amber-950/40 text-amber-400 border border-amber-800/60';
      case 'IN_PROGRESS':
        return 'bg-blue-950/40 text-blue-400 border border-blue-800/60 animate-pulse';
      case 'COORDINATED':
        return 'bg-indigo-950/40 text-indigo-400 border border-indigo-800/60';
      default:
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Column 1: Application Form */}
      <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-md rounded-xl p-6 border border-slate-800/80 shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <Landmark className="h-6 w-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">New Loan Application</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Applicant Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Net Monthly Income (INR)
              </label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Loan Amount Request (INR)
              </label>
              <input
                type="number"
                min="50000"
                step="50000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Employer Organization Name
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Tata Consultancy Services"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Employment Sector
              </label>
              <select
                value={employerType}
                onChange={(e) => setEmployerType(e.target.value as EmployerType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="MNC">Tier-1 MNC</option>
                <option value="Govt">Government / PSU</option>
                <option value="Private">Private Limited</option>
                <option value="Self-Employed">Self-Employed / Business</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Loan Purpose Category
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Home Loan">Home Loan</option>
                <option value="Car Loan">Auto Loan</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Education Loan">Education Loan</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span>Declared Credit Score (CIBIL)</span>
              <span className={`font-mono ${creditScore >= 750 ? 'text-emerald-400' : creditScore < 650 ? 'text-rose-400' : 'text-amber-400'}`}>
                {creditScore}
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="850"
              value={creditScore}
              onChange={(e) => setCreditScore(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
              <span>300 (POOR)</span>
              <span>650 (AVG)</span>
              <span>750 (EXCELLENT)</span>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-lg border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
              <UploadCloud className="h-4 w-4 text-emerald-400" />
              <span>Attach Verification Documents</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Salary Slip Selector */}
              <div className="relative border border-dashed border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors bg-slate-950/60">
                <input
                  type="file"
                  id="salary-upload"
                  accept=".pdf"
                  onChange={handleSalaryFileChange}
                  className="hidden"
                />
                <label htmlFor="salary-upload" className="cursor-pointer block text-center">
                  {!salarySlip && (
                    <div className="space-y-1 py-1">
                      <FileText className="h-5 w-5 text-slate-500 mx-auto" />
                      <span className="block text-[11px] font-semibold text-slate-400">Salary Slip (PDF)</span>
                      <span className="block text-[8px] text-slate-600">Click to upload doc</span>
                    </div>
                  )}

                  {salarySlip && salarySlip.status === 'uploading' && (
                    <div className="space-y-2 py-1 flex flex-col items-center">
                      <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
                      <span className="text-[10px] text-slate-400">Uploading {salarySlip.name}...</span>
                      <div className="w-16 bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}

                  {salarySlip && salarySlip.status === 'uploaded' && (
                    <div className="space-y-1 py-1 flex flex-col items-center">
                      <Check className="h-5 w-5 text-emerald-400 bg-emerald-950/60 p-0.5 rounded-full border border-emerald-900" />
                      <span className="text-[10px] font-bold text-emerald-400 truncate max-w-[130px]">{salarySlip.name}</span>
                      <span className="text-[8px] text-slate-500">{(salarySlip.sizeBytes / 1024).toFixed(0)} KB • Success</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Bank Statement Selector */}
              <div className="relative border border-dashed border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors bg-slate-950/60">
                <input
                  type="file"
                  id="bank-upload"
                  accept=".pdf,.csv"
                  onChange={handleBankFileChange}
                  className="hidden"
                />
                <label htmlFor="bank-upload" className="cursor-pointer block text-center">
                  {!bankStatement && (
                    <div className="space-y-1 py-1">
                      <FileText className="h-5 w-5 text-slate-500 mx-auto" />
                      <span className="block text-[11px] font-semibold text-slate-400">Bank Statement</span>
                      <span className="block text-[8px] text-slate-600">PDF or CSV statement</span>
                    </div>
                  )}

                  {bankStatement && bankStatement.status === 'uploading' && (
                    <div className="space-y-2 py-1 flex flex-col items-center">
                      <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
                      <span className="text-[10px] text-slate-400">Uploading {bankStatement.name}...</span>
                      <div className="w-16 bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}

                  {bankStatement && bankStatement.status === 'uploaded' && (
                    <div className="space-y-1 py-1 flex flex-col items-center">
                      <Check className="h-5 w-5 text-emerald-400 bg-emerald-950/60 p-0.5 rounded-full border border-emerald-900" />
                      <span className="text-[10px] font-bold text-emerald-400 truncate max-w-[130px]">{bankStatement.name}</span>
                      <span className="text-[8px] text-slate-500">{(bankStatement.sizeBytes / 1024).toFixed(0)} KB • Success</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Compliance Mock Simulation Check */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="missingDocs"
                checked={simulateMissingDocs}
                onChange={(e) => setSimulateMissingDocs(e.target.checked)}
                className="mt-1 h-4 w-4 bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500/20 rounded"
              />
              <label htmlFor="missingDocs" className="cursor-pointer select-none">
                <span className="block text-xs font-bold text-slate-300">
                  Simulate Missing Documents
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  Fails document check (e.g. misses Form-16) to verify immediate compliance rejection behavior.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold py-2.5 px-4 rounded-lg shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-[0.98]"
          >
            <span>Orchestrate Loan Process</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Column 2: Applications Tracker */}
      <div className="lg:col-span-7 flex flex-col bg-slate-900/60 backdrop-blur-md rounded-xl p-6 border border-slate-800/80 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">Active Applications Tracker</h2>

        {applications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-lg">
            <FileText className="h-12 w-12 text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">No applications found in the system database.</p>
            <p className="text-slate-500 text-xs mt-1">Submit the form on the left or seed sample records in the Database tab.</p>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {applications.map((app) => {
              const isActive = activeAppId === app.id;
              const pipelineProgress = app.agentPipeline.length > 0 
                ? Math.round(((app.currentAgentIndex + 1) / app.agentPipeline.length) * 100)
                : 0;

              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className={`group relative overflow-hidden bg-slate-950/80 p-4 rounded-lg border transition-all cursor-pointer hover:border-slate-700/60 ${
                    isActive ? 'border-emerald-500/60 bg-slate-950/90 shadow-md shadow-emerald-950/10' : 'border-slate-800/90'
                  }`}
                >
                  {/* Visual indication line for state */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    app.status === 'APPROVED' ? 'bg-emerald-500' :
                    app.status === 'REJECTED' ? 'bg-rose-500' :
                    app.status === 'UNDER_REVIEW' ? 'bg-amber-500' :
                    app.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-indigo-500'
                  }`} />

                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-slate-500 font-bold">{app.id}</span>
                        <span className="text-sm font-bold text-white">{app.applicantName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {app.purpose} • Requested: INR {app.requestedAmount.toLocaleString()}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${getStatusBadgeClass(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Progress Indicator */}
                  {app.status !== 'NEW' && (
                    <div className="pl-2 mt-3">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1 font-mono">
                        <span>Agent Pipeline: {app.currentAgentIndex === -1 ? 'Constructed' : (app.currentAgentIndex + 1 >= app.agentPipeline.length ? 'Analyses Completed' : `Running ${app.agentPipeline[app.currentAgentIndex].replace(/_/g, ' ')}`)}</span>
                        <span>{pipelineProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            app.status === 'APPROVED' ? 'bg-emerald-500' :
                            app.status === 'REJECTED' ? 'bg-rose-500' :
                            app.status === 'UNDER_REVIEW' ? 'bg-amber-500' : 'bg-blue-500 animate-pulse'
                          }`}
                          style={{ width: `${pipelineProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Extra insights (Manager Review reasons or OCR warning) */}
                  {app.status === 'UNDER_REVIEW' && app.coordinatorNotes && (
                    <div className="pl-2 mt-3 flex items-start space-x-2 bg-amber-950/20 border border-amber-900/30 p-2 rounded text-[10px] text-amber-300">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="whitespace-pre-line leading-relaxed">
                        {app.coordinatorNotes}
                      </div>
                    </div>
                  )}

                  {app.status === 'APPROVED' && app.approvedAmount && (
                    <div className="pl-2 mt-2 flex items-center space-x-2 text-[10px] text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Approved Amount: <b>INR {app.approvedAmount.toLocaleString()}</b> @ <b>{app.interestRate?.toFixed(2)}% APR</b></span>
                    </div>
                  )}

                  {/* Linked Files Section */}
                  {(app.salarySlipFile || app.bankStatementFile) && (
                    <div className="pl-2 mt-3 flex flex-wrap gap-2 text-[9px] font-mono text-slate-400">
                      <span className="text-slate-500 font-bold shrink-0 self-center">DOCS:</span>
                      {app.salarySlipFile && (
                        <a
                          href={`/documents/${app.salarySlipFile.name}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 px-1.5 py-0.5 rounded transition-all hover:border-emerald-500/20"
                        >
                          <FileText className="h-2.5 w-2.5" />
                          <span className="truncate max-w-[120px]">{app.salarySlipFile.name}</span>
                        </a>
                      )}
                      {app.bankStatementFile && (
                        <a
                          href={`/documents/${app.bankStatementFile.name}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-teal-400 px-1.5 py-0.5 rounded transition-all hover:border-teal-500/20"
                        >
                          <FileText className="h-2.5 w-2.5" />
                          <span className="truncate max-w-[120px]">{app.bankStatementFile.name}</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Actions hover bar */}
                  <div className="flex justify-between items-center mt-3 pl-2 pt-2 border-t border-slate-900 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-slate-500 font-mono">Submitted: {new Date(app.createdAt).toLocaleDateString()}</span>
                    <button
                      className={`flex items-center space-x-1 text-[10px] font-bold py-1 px-2 rounded transition-all ${
                        app.status === 'NEW' || app.status === 'COORDINATED'
                          ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Play className="h-2.5 w-2.5" />
                      <span>{app.status === 'NEW' || app.status === 'COORDINATED' ? 'Launch Agent Pipeline' : 'Open Pipeline Hub'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
