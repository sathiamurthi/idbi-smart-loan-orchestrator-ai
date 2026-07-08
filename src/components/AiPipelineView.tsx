import { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, FastForward, RotateCcw, ShieldCheck, FileCheck,
  TrendingUp, Receipt, Building2, Calculator, AlertOctagon,
  Coins, ScanEye, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import type { LoanApplication, AgentType } from '../types';

interface AiPipelineViewProps {
  app: LoanApplication | null;
  onRunStep: () => void;
  onAutoRunToggle: (playing: boolean) => void;
  isPlaying: boolean;
  onSpeedChange: (speed: number) => void;
  speed: number; // Delay in ms
  onResetApp: () => void;
}

const AGENT_META: Record<AgentType, { label: string; desc: string; icon: React.ComponentType<any> }> = {
  OCR_AGENT: { label: 'OCR Extraction', desc: 'Parses salary slips & documents', icon: ScanEye },
  DOCUMENT_VALIDATION_AGENT: { label: 'Doc Validation', desc: 'Checks signatures and file completeness', icon: FileCheck },
  SALARY_ANALYSIS_AGENT: { label: 'Salary Analysis', desc: 'Calculates net income stability', icon: TrendingUp },
  BANK_STATEMENT_AGENT: { label: 'Bank Analysis', desc: 'Scans transaction history and active EMIs', icon: Receipt },
  CREDIT_ASSESSMENT_AGENT: { label: 'Credit Check', desc: 'Queries bureau credit agencies', icon: ShieldCheck },
  EMPLOYER_VERIFICATION_AGENT: { label: 'Employer Audit', desc: 'Cross-checks registry classifications', icon: Building2 },
  ELIGIBILITY_AGENT: { label: 'Eligibility Calculator', desc: 'Applies earning multiplier limits', icon: Calculator },
  RISK_ASSESSMENT_AGENT: { label: 'Risk Assessor', desc: 'Runs policy exception checks', icon: AlertOctagon },
  LOAN_RECOMMENDATION_AGENT: { label: 'Recommendation', desc: 'Formulates recommended amount & rate', icon: Coins },
};

export const AiPipelineView: React.FC<AiPipelineViewProps> = ({
  app,
  onRunStep,
  onAutoRunToggle,
  isPlaying,
  onSpeedChange,
  speed,
  onResetApp,
}) => {
  const [selectedAgentNode, setSelectedAgentNode] = useState<AgentType | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [app?.logs?.length]);

  if (!app) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-8 border border-slate-800 text-center">
        <AlertCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">No Active Pipeline Selection</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Please select an application in the <b>Customer Portal</b> or create a new loan application to initialize the AI multi-agent orchestrator.
        </p>
      </div>
    );
  }

  // Determine node states
  const getNodeState = (agentName: AgentType) => {
    const pipelineIndex = app.agentPipeline.indexOf(agentName);
    const isIncluded = pipelineIndex !== -1;

    if (!isIncluded) return 'skipped';
    if (app.currentAgentIndex > pipelineIndex) return 'completed';
    if (app.currentAgentIndex === pipelineIndex) return 'processing';
    return 'idle';
  };

  const getLogColorClass = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-400 font-bold';
      case 'warning': return 'text-amber-400 font-medium';
      case 'error': return 'text-rose-400 font-bold';
      default: return 'text-slate-300';
    }
  };

  // List of all 9 agents in logical order
  const ALL_AGENTS: AgentType[] = [
    'OCR_AGENT',
    'DOCUMENT_VALIDATION_AGENT',
    'SALARY_ANALYSIS_AGENT',
    'BANK_STATEMENT_AGENT',
    'CREDIT_ASSESSMENT_AGENT',
    'EMPLOYER_VERIFICATION_AGENT',
    'ELIGIBILITY_AGENT',
    'RISK_ASSESSMENT_AGENT',
    'LOAN_RECOMMENDATION_AGENT',
  ];

  const activeAgentName = app.currentAgentIndex !== -1 && app.currentAgentIndex < app.agentPipeline.length
    ? app.agentPipeline[app.currentAgentIndex]
    : null;

  return (
    <div className="space-y-6">
      {/* Simulation Controller Panel */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-4 md:p-6 border border-slate-800/80 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-500 font-bold">{app.id}</span>
              <h2 className="text-lg font-bold text-white">Pipeline: {app.applicantName}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Status: <span className="text-emerald-400 font-semibold">{app.status}</span> • Risk Rating:{' '}
              <span className={app.riskLevel === 'HIGH' ? 'text-rose-400 font-bold' : app.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}>
                {app.riskLevel || 'TBD'}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Speed slider */}
            <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg mr-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Delay:</span>
              <input
                type="range"
                min="500"
                max="4000"
                step="500"
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-20 md:w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-300 font-mono font-bold">{speed}ms</span>
            </div>

            <button
              onClick={() => onAutoRunToggle(!isPlaying)}
              disabled={app.currentAgentIndex + 1 >= app.agentPipeline.length}
              className={`flex items-center space-x-1.5 text-xs font-bold py-2 px-4 rounded-lg shadow-sm border transition-all ${
                isPlaying
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                  : 'bg-emerald-500 text-slate-950 border-emerald-500 hover:bg-emerald-400 disabled:opacity-50'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Play Simulation</span>
                </>
              )}
            </button>

            <button
              onClick={onRunStep}
              disabled={isPlaying || app.currentAgentIndex + 1 >= app.agentPipeline.length}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold py-2 px-3 rounded-lg disabled:opacity-50"
            >
              <FastForward className="h-3.5 w-3.5" />
              <span>Step</span>
            </button>

            <button
              onClick={onResetApp}
              className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-bold py-2 px-3 rounded-lg"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Flow Visualization Grid */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-6 shadow-inner relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center space-x-2">
          <span>Coordinator Pipeline Graph</span>
          <span className="text-[10px] text-slate-600 lowercase font-normal">(Click nodes to inspect outputs)</span>
        </h3>

        {/* Nodes flow responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 gap-4 relative z-10">
          {ALL_AGENTS.map((agent, index) => {
            const state = getNodeState(agent);
            const Meta = AGENT_META[agent];
            const Icon = Meta.icon;
            
            const isNodeSelected = selectedAgentNode === agent;

            // Compute border & glow colors
            let styleClasses = '';
            if (state === 'completed') {
              styleClasses = 'border-emerald-500/80 bg-emerald-950/20 text-emerald-300 shadow-md shadow-emerald-950/20';
            } else if (state === 'processing') {
              styleClasses = 'border-amber-500 bg-amber-950/30 text-amber-300 shadow-lg shadow-amber-500/30 animate-pulse border-2';
            } else if (state === 'skipped') {
              styleClasses = 'border-slate-800 border-dashed bg-slate-900/10 text-slate-600 opacity-40';
            } else {
              styleClasses = 'border-slate-800 bg-slate-900/60 text-slate-400';
            }

            if (isNodeSelected) {
              styleClasses += ' ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950';
            }

            return (
              <div
                key={agent}
                onClick={() => state === 'completed' && setSelectedAgentNode(agent)}
                className={`relative flex flex-col items-center p-3 rounded-lg border transition-all text-center select-none ${styleClasses} ${
                  state === 'completed' ? 'cursor-pointer hover:border-emerald-400/50' : 'cursor-default'
                }`}
              >
                {/* Visual Step Number Badge */}
                <span className="absolute top-1 right-1 text-[8px] font-mono text-slate-600 font-bold">
                  {index + 1}
                </span>

                <div className={`p-2 rounded-full mb-2 ${
                  state === 'completed' ? 'bg-emerald-900/40 text-emerald-400' :
                  state === 'processing' ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-950 text-slate-600'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="text-[10px] font-bold tracking-tight line-clamp-1">{Meta.label}</div>
                <div className="text-[8px] text-slate-500 mt-0.5 leading-tight line-clamp-2 h-6 hidden lg:block">
                  {Meta.desc}
                </div>

                {/* Sub status details */}
                <div className="mt-2 flex items-center justify-center">
                  {state === 'completed' && (
                    <span className="flex items-center space-x-0.5 text-[8px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-900/40">
                      <CheckCircle2 className="h-2 w-2" />
                      <span>OK</span>
                    </span>
                  )}
                  {state === 'processing' && (
                    <span className="flex items-center space-x-0.5 text-[8px] font-mono text-amber-400 font-bold bg-amber-950/80 px-1 py-0.2 rounded border border-amber-900/40 animate-pulse">
                      <Clock className="h-2 w-2 animate-spin" />
                      <span>RUN</span>
                    </span>
                  )}
                  {state === 'skipped' && (
                    <span className="text-[8px] font-mono text-slate-500 bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                      SKIP
                    </span>
                  )}
                  {state === 'idle' && (
                    <span className="text-[8px] font-mono text-slate-600">
                      QUEUED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logs and Output Inspector Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Log Terminal Window */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-md h-[380px]">
          {/* Header */}
          <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-2">
                Coordinator System Console
              </span>
            </div>
            {activeAgentName && (
              <div className="flex items-center space-x-1 text-[9px] font-mono text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping mr-1" />
                <span>Running: {activeAgentName}</span>
              </div>
            )}
          </div>

          {/* Console Output */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 scrollbar-thin">
            {app.logs.length === 0 ? (
              <div className="text-slate-600 italic">Console initialized... Waiting for agent pipeline execution launch.</div>
            ) : (
              app.logs.map((log, index) => (
                <div key={index} className="hover:bg-slate-900/50 py-0.5 transition-colors">
                  <span className="text-slate-600 select-none mr-2">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="text-emerald-500/90 font-bold mr-1.5">
                    [{log.agentName}]
                  </span>
                  <span className={getLogColorClass(log.type)}>{log.message}</span>
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Output Inspector Panel */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-md h-[380px]">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Agent Output Inspector
            </h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto text-xs">
            {selectedAgentNode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{AGENT_META[selectedAgentNode].label}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Agent Key: {selectedAgentNode}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/40">
                    COMPLETED
                  </span>
                </div>

                <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  <pre>{JSON.stringify(app.agentOutputs[selectedAgentNode], null, 2)}</pre>
                </div>

                {/* Bank Statement Agent custom view */}
                {selectedAgentNode === 'BANK_STATEMENT_AGENT' && app.agentOutputs.BANK_STATEMENT_AGENT && (
                  <div className="space-y-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                    <h5 className="font-bold text-[10px] uppercase tracking-wider text-emerald-400">
                      Identified Active Liabilities (Loans / EMIs)
                    </h5>
                    {app.agentOutputs.BANK_STATEMENT_AGENT.detectedLoans && app.agentOutputs.BANK_STATEMENT_AGENT.detectedLoans.length > 0 ? (
                      <div className="space-y-2">
                        {app.agentOutputs.BANK_STATEMENT_AGENT.detectedLoans.map((loan, idx) => (
                          <div key={idx} className="bg-slate-950/90 border border-slate-800 p-2 flex justify-between items-center text-[10px]">
                            <div>
                              <span className="font-bold text-slate-200 block">{loan.loanType}</span>
                              <span className="text-[9px] text-slate-500 font-mono block">Lender: {loan.lenderName}</span>
                              <span className="text-[8px] text-slate-600 font-mono block mt-0.5">Pattern: {loan.narrationPattern}</span>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <span className="text-amber-400 font-bold font-mono">INR {loan.monthlyEmi.toLocaleString()}</span>
                              <span className="text-[8px] text-slate-500 block">/ mo</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-emerald-950/20 border border-emerald-900/40 p-2 rounded text-emerald-400 text-[10px]">
                        No active loan EMIs detected from bank statement transaction history.
                      </div>
                    )}
                  </div>
                )}

                {/* XAI insights snippet if available */}
                {selectedAgentNode === 'RISK_ASSESSMENT_AGENT' && app.agentOutputs.RISK_ASSESSMENT_AGENT && (
                  <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg text-amber-300 leading-relaxed">
                    <h5 className="font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center space-x-1 text-amber-400">
                      <AlertOctagon className="h-3.5 w-3.5" />
                      <span>Risk Aggregator Summary</span>
                    </h5>
                    <p className="text-[11px]">
                      Risk Tier evaluated as <b>{app.agentOutputs.RISK_ASSESSMENT_AGENT.riskRating}</b>.
                      Aggregate credit health index points: <b>{app.agentOutputs.RISK_ASSESSMENT_AGENT.aggregateScore}/100</b>.
                    </p>
                  </div>
                )}

                {selectedAgentNode === 'LOAN_RECOMMENDATION_AGENT' && app.agentOutputs.LOAN_RECOMMENDATION_AGENT && (
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg text-emerald-300 leading-relaxed">
                    <h5 className="font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center space-x-1 text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Orchestrated Recommendations</span>
                    </h5>
                    <p className="text-[11px]">
                      {app.agentOutputs.LOAN_RECOMMENDATION_AGENT.justification}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
                <Clock className="h-8 w-8 text-slate-700 mb-2" />
                <p className="text-xs">No Node Selected</p>
                <p className="text-[10px] text-slate-600 mt-1 max-w-[220px]">
                  Click on any green <b className="text-emerald-500/80">Completed</b> agent node above to inspect its real-time outputs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
