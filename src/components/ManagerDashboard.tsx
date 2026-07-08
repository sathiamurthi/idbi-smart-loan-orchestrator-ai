import { useState, useEffect } from 'react';
import { UserCheck, ShieldAlert, Sparkles, FileText, CheckCircle2, XCircle } from 'lucide-react';
import type { LoanApplication } from '../types';

interface ManagerDashboardProps {
  applications: LoanApplication[];
  onManagerDecision: (
    id: string,
    decision: 'APPROVED' | 'REJECTED',
    notes: string,
    modifiedAmount?: number,
    modifiedRate?: number
  ) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ applications, onManagerDecision }) => {
  const pendingApps = applications.filter((app) => app.status === 'UNDER_REVIEW');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    pendingApps.length > 0 ? pendingApps[0].id : null
  );

  // States for decision adjustments
  const [notes, setNotes] = useState('');
  const [modifyTerms, setModifyTerms] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [customRate, setCustomRate] = useState<number>(0);

  // Auto select first application when pending apps list changes
  useEffect(() => {
    if (pendingApps.length > 0) {
      if (!selectedAppId || !pendingApps.some(a => a.id === selectedAppId)) {
        const firstApp = pendingApps[0];
        setSelectedAppId(firstApp.id);
        setCustomAmount(firstApp.approvedAmount || firstApp.requestedAmount);
        setCustomRate(firstApp.interestRate || 8.5);
        setNotes('');
        setModifyTerms(false);
      }
    } else {
      setSelectedAppId(null);
    }
  }, [pendingApps, selectedAppId]);

  const activeApp = pendingApps.find((app) => app.id === selectedAppId);

  const handleSelectApp = (app: LoanApplication) => {
    setSelectedAppId(app.id);
    setCustomAmount(app.approvedAmount || app.requestedAmount);
    setCustomRate(app.interestRate || 8.5);
    setNotes('');
    setModifyTerms(false);
  };

  const handleAction = (decision: 'APPROVED' | 'REJECTED') => {
    if (!activeApp) return;
    onManagerDecision(
      activeApp.id,
      decision,
      notes || `Manual manager review ${decision.toLowerCase()}.`,
      modifyTerms ? customAmount : undefined,
      modifyTerms ? customRate : undefined
    );
    // Reset state
    setNotes('');
    setModifyTerms(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Column 1: Pending Applications list */}
      <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md rounded-xl p-5 border border-slate-800/80 shadow-lg flex flex-col h-[580px]">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
          <UserCheck className="h-5 w-5 text-orange-400" />
          <h2 className="text-base font-bold text-white">Pending Manager Sign-off</h2>
          <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full font-mono font-bold">
            {pendingApps.length}
          </span>
        </div>

        {pendingApps.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-lg">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
            <p className="text-slate-400 text-xs font-bold">Lending Queue Clear</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
              No loans are currently flagged on HOLD. All applications have been processed automatically.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {pendingApps.map((app) => (
              <div
                key={app.id}
                onClick={() => handleSelectApp(app)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  selectedAppId === app.id
                    ? 'border-orange-500/60 bg-slate-950/80 shadow-sm'
                    : 'border-slate-800 bg-slate-950/30 hover:border-slate-700/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold block">{app.id}</span>
                    <span className="text-sm font-bold text-white">{app.applicantName}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-950/50 text-orange-400 border border-orange-900/30 font-mono">
                    {app.riskLevel || 'MEDIUM'} RISK
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-mono flex justify-between">
                  <span>Req: INR {app.requestedAmount.toLocaleString()}</span>
                  <span className="text-slate-500">CIBIL: {app.actualCreditScore || app.declaredCreditScore}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Column 2: Audit and Decision Panel */}
      <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-md rounded-xl p-6 border border-slate-800/80 shadow-lg flex flex-col h-[580px] overflow-y-auto">
        {activeApp ? (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Audit Application: {activeApp.applicantName}</h2>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Employer: {activeApp.employerName} ({activeApp.employerType}) • Salary: INR {activeApp.monthlySalary.toLocaleString()}/mo
                </p>
              </div>
              <span className="mt-2 sm:mt-0 text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 px-2 py-1 text-slate-400 rounded">
                Pipeline Path: {activeApp.agentPipeline.length} Agents Run
              </span>
            </div>

            {/* Explainable AI (XAI) Report Card */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>Explainable AI (XAI) Decision Insight</span>
              </h3>

              {activeApp.coordinatorNotes && (
                <div className="p-3 bg-orange-950/20 border border-orange-900/40 rounded-lg text-orange-400">
                  <div className="flex items-center space-x-1.5 mb-1.5 font-bold text-xs">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>Lending Policy Escalation Flags:</span>
                  </div>
                  <div className="text-[11px] whitespace-pre-line leading-relaxed pl-1">
                    {activeApp.coordinatorNotes}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-400 block">System Suggestion:</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-900">
                    {activeApp.agentOutputs.LOAN_RECOMMENDATION_AGENT?.justification || 'TBD'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-400 block">Risk Analytics Breakdown:</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-900">
                    {activeApp.xaiReport?.riskAnalysis || 'TBD'}
                  </p>
                </div>
              </div>
            </div>

            {/* Agent-by-Agent audit parameters */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Agent Pipeline Audits</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 text-[11px]">
                  <span className="text-slate-500 font-bold block mb-1">OCR Analysis</span>
                  <span className="text-slate-300 block">Salary: INR {activeApp.agentOutputs.OCR_AGENT?.salaryExtracted.toLocaleString()}</span>
                  <span className="text-slate-300 block">Emp: {activeApp.agentOutputs.OCR_AGENT?.employerExtracted}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 text-[11px]">
                  <span className="text-slate-500 font-bold block mb-1">Salary Analytics</span>
                  <span className="text-slate-300 block">Stability: {activeApp.agentOutputs.SALARY_ANALYSIS_AGENT?.incomeStability}</span>
                  <span className="text-slate-300 block">Est Savings: INR {activeApp.agentOutputs.SALARY_ANALYSIS_AGENT?.monthlySavingsEst.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 text-[11px]">
                  <span className="text-slate-500 font-bold block mb-1">Bank Statement</span>
                  <span className="text-slate-300 block">Trend: {activeApp.agentOutputs.BANK_STATEMENT_AGENT?.balanceTrend}</span>
                  <span className="text-slate-300 block">Active EMI: INR {activeApp.agentOutputs.BANK_STATEMENT_AGENT?.detectedEmis.toLocaleString()}/mo</span>
                </div>
              </div>
            </div>

            {/* Decision Controls Form */}
            <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Add Decision Action
                </span>
                
                {/* Modify Terms toggle */}
                <button
                  type="button"
                  onClick={() => setModifyTerms(!modifyTerms)}
                  className={`text-[10px] font-bold py-1 px-2.5 rounded border transition-colors ${
                    modifyTerms 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {modifyTerms ? 'Cancel Term Modifications' : 'Modify Loan Terms'}
                </button>
              </div>

              {modifyTerms && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-md text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Override Approved Amount (INR)
                    </label>
                    <input
                      type="number"
                      step="50000"
                      min="50000"
                      max={activeApp.agentOutputs.ELIGIBILITY_AGENT?.maxEligibleAmount || activeApp.requestedAmount}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 focus:outline-none"
                    />
                    <span className="text-[9px] text-slate-500 mt-0.5 block">
                      Max permissible eligibility limit is INR {(activeApp.agentOutputs.ELIGIBILITY_AGENT?.maxEligibleAmount || 0).toLocaleString()}.
                    </span>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Override Interest Rate (APR %)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="5"
                      max="25"
                      value={customRate}
                      onChange={(e) => setCustomRate(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-100 focus:outline-none"
                    />
                    <span className="text-[9px] text-slate-500 mt-0.5 block">
                      Recommended rate from AI agent: {(activeApp.interestRate || 8.5).toFixed(2)}%.
                    </span>
                  </div>
                </div>
              )}

              <div>
                <textarea
                  rows={2}
                  placeholder="Provide decision rationales (e.g. Verified co-applicant income is strong, approving restricted sum...)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500/40"
                />
              </div>

              {/* Action Triggers */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleAction('REJECTED')}
                  className="flex items-center space-x-1 text-rose-400 bg-rose-950/20 border border-rose-900/40 hover:bg-rose-950/40 transition-colors font-bold text-xs py-2 px-4 rounded-lg active:scale-95"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject Application</span>
                </button>
                <button
                  onClick={() => handleAction('APPROVED')}
                  className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 hover:bg-emerald-950/40 transition-colors font-bold text-xs py-2 px-4 rounded-lg active:scale-95 animate-shimmer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{modifyTerms ? 'Approve with Terms Override' : 'Approve Application'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <CheckCircle2 className="h-12 w-12 text-slate-700 mb-2" />
            <span>Audit Desk Idle</span>
            <span className="text-[10px] text-slate-600 mt-1 max-w-[200px] text-center">
              Please select a pending application from the left panel to begin.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
