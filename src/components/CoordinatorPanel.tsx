import { useState } from 'react';
import { Settings, Info, ShieldCheck, Calculator, CheckSquare, Sparkles } from 'lucide-react';
import type { PolicyConfig, AgentType } from '../types';

interface CoordinatorPanelProps {
  policy: PolicyConfig;
  onSavePolicy: (policy: PolicyConfig) => void;
}

export const CoordinatorPanel: React.FC<CoordinatorPanelProps> = ({ policy, onSavePolicy }) => {
  const [minCreditApprove, setMinCreditApprove] = useState(policy.minCreditScoreAutoApprove);
  const [maxAmountApprove, setMaxAmountApprove] = useState(policy.maxLoanAmountAutoApprove);
  const [minCreditReject, setMinCreditReject] = useState(policy.minCreditScoreAutoReject);
  const [multiplier, setMultiplier] = useState(policy.incomeMultiplier);
  const [baseRate, setBaseRate] = useState(policy.baseInterestRate);
  const [mandatoryAgents, setMandatoryAgents] = useState<AgentType[]>(policy.mandatoryAgents);

  const handleToggleAgent = (agent: AgentType) => {
    if (mandatoryAgents.includes(agent)) {
      setMandatoryAgents(mandatoryAgents.filter(a => a !== agent));
    } else {
      setMandatoryAgents([...mandatoryAgents, agent]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePolicy({
      minCreditScoreAutoApprove: minCreditApprove,
      maxLoanAmountAutoApprove: maxAmountApprove,
      minCreditScoreAutoReject: minCreditReject,
      incomeMultiplier: multiplier,
      baseInterestRate: baseRate,
      mandatoryAgents,
    });
    alert('Orchestrator Policies updated successfully!');
  };

  // Optional agents that coordinator allows toggling
  const TOGGLEABLE_AGENTS: { key: AgentType; label: string; desc: string }[] = [
    {
      key: 'EMPLOYER_VERIFICATION_AGENT',
      label: 'Employer Verification Agent',
      desc: 'Verify corporate registration & payroll tax receipts (otherwise, only runs for self-employed/private companies or high amounts).',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-md rounded-xl p-6 border border-slate-800/80 shadow-lg">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-6">
        <Settings className="h-6 w-6 text-emerald-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Coordinator Policy Panel</h2>
          <p className="text-xs text-slate-400">Configure business rules and threshold parameters governing the dynamic AI pipeline.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Approval Parameters */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5 border-b border-slate-900 pb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Credit Approval Boundaries</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Auto-Approval Credit Threshold
              </label>
              <input
                type="number"
                min="600"
                max="850"
                value={minCreditApprove}
                onChange={(e) => setMinCreditApprove(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Loans with score $\ge$ this limit and LOW risk bypass manager review.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Max Loan for Auto-Approval (INR)
              </label>
              <input
                type="number"
                min="100000"
                step="50000"
                value={maxAmountApprove}
                onChange={(e) => setMaxAmountApprove(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Loan requests exceeding this are automatically sent to HOLD for review.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Auto-Rejection Credit Limit
              </label>
              <input
                type="number"
                min="300"
                max="650"
                value={minCreditReject}
                onChange={(e) => setMinCreditReject(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Applicants scoring below this are instantly rejected without manager review.
              </span>
            </div>
          </div>

          {/* Section 2: Financial Formula Configuration */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <h3 className="text-sm font-bold text-teal-400 flex items-center space-x-1.5 border-b border-slate-900 pb-2">
              <Calculator className="h-4 w-4" />
              <span>Financial Calculation Formulas</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Income Multiplier Constant
              </label>
              <input
                type="number"
                min="12"
                max="120"
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Base loan eligibility capacity = net monthly salary $\times$ multiplier.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Base Interest APR (%)
              </label>
              <input
                type="number"
                step="0.05"
                min="5"
                max="25"
                value={baseRate}
                onChange={(e) => setBaseRate(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/50"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Standard bank base rate, adjusted by agents based on risk rating.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Orchestrator Pipeline Rules */}
        <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-orange-400 flex items-center space-x-1.5 border-b border-slate-900 pb-2">
            <CheckSquare className="h-4 w-4" />
            <span>Coordinator Pipeline Rules Override</span>
          </h3>

          <div className="space-y-3">
            {TOGGLEABLE_AGENTS.map((agent) => {
              const isChecked = mandatoryAgents.includes(agent.key);
              return (
                <div key={agent.key} className="flex items-start space-x-3 p-2 bg-slate-900/60 rounded border border-slate-800/80 hover:border-slate-700/60 transition-colors">
                  <input
                    type="checkbox"
                    id={`policy-${agent.key}`}
                    checked={isChecked}
                    onChange={() => handleToggleAgent(agent.key)}
                    className="mt-1 h-4 w-4 bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500/20 rounded"
                  />
                  <label htmlFor={`policy-${agent.key}`} className="cursor-pointer">
                    <span className="block text-xs font-bold text-slate-200">{agent.label}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{agent.desc}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative Explanation box */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-lg text-emerald-400 flex items-start space-x-3">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold flex items-center space-x-1 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>How this affects Orchestration:</span>
            </span>
            Our Coordinator Agent dynamically maps the workflow tree based on the configurations above. If you reduce the "Auto-Approval Credit Threshold" or disable certain validations, subsequent applications will route directly to final approval or skip intermediate agents, and you will see the changes instantly reflected in the logs.
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-6 rounded-lg shadow transition-all active:scale-[0.98]"
          >
            Apply Policy Settings
          </button>
        </div>
      </form>
    </div>
  );
};
