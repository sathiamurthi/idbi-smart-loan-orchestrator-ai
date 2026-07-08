import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CustomerPortal } from './components/CustomerPortal';
import { AiPipelineView } from './components/AiPipelineView';
import { CoordinatorPanel } from './components/CoordinatorPanel';
import { ManagerDashboard } from './components/ManagerDashboard';
import { DatabaseViewer } from './components/DatabaseViewer';
import { PitchDeck } from './components/PitchDeck';
import { ScreenRecorder } from './components/ScreenRecorder';
import type { LoanApplication, PolicyConfig } from './types';
import { buildPipeline, runPipelineStep } from './services/orchestrator';
import { Sparkles } from 'lucide-react';

const LOCAL_STORAGE_APPS_KEY = 'islo_applications';
const LOCAL_STORAGE_POLICY_KEY = 'islo_policy';

const DEFAULT_POLICY: PolicyConfig = {
  minCreditScoreAutoApprove: 750,
  maxLoanAmountAutoApprove: 1000000,
  minCreditScoreAutoReject: 600,
  incomeMultiplier: 48, // salary x 48 = base eligible loan
  mandatoryAgents: [],
  baseInterestRate: 8.5,
};

// Preset demo records for seeding
const SEED_APPLICATIONS = (policy: PolicyConfig): LoanApplication[] => {
  const getPastISOString = (offsetMinutes: number) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - offsetMinutes);
    return d.toISOString();
  };

  const app1: LoanApplication = {
    id: 'APP_1001',
    applicantName: 'Rajesh Kumar',
    monthlySalary: 85000,
    requestedAmount: 750000,
    employerName: 'Infosys Limited',
    employerType: 'MNC',
    declaredCreditScore: 785,
    purpose: 'Car Loan',
    status: 'COORDINATED',
    currentAgentIndex: -1,
    agentPipeline: [],
    agentOutputs: {},
    salarySlipFile: { name: 'APP_1001_salary_slip.pdf', sizeBytes: 1240, status: 'uploaded' },
    bankStatementFile: { name: 'APP_1001_bank_statement.pdf', sizeBytes: 2450, status: 'uploaded' },
    logs: [
      {
        timestamp: getPastISOString(5),
        agentName: 'SYSTEM',
        message: 'Application submitted successfully. Linked sample docs: APP_1001_salary_slip.pdf, APP_1001_bank_statement.pdf',
        type: 'success',
      },
    ],
    createdAt: getPastISOString(5),
    updatedAt: getPastISOString(5),
  };
  app1.agentPipeline = buildPipeline(app1, policy);
  app1.logs.push({
    timestamp: getPastISOString(4.8),
    agentName: 'COORDINATOR_AGENT',
    message: `Dynamic pipeline constructed: [${app1.agentPipeline.join(', ')}]. Verification checklist updated.`,
    type: 'info',
  });

  const app2: LoanApplication = {
    id: 'APP_1002',
    applicantName: 'Priya Sharma',
    monthlySalary: 110000,
    requestedAmount: 1800000, // Exceeds auto approve limit (1M)
    employerName: 'AeroSpace Design Pvt Ltd',
    employerType: 'Private',
    declaredCreditScore: 710, // Medium Credit
    purpose: 'Home Loan',
    status: 'COORDINATED',
    currentAgentIndex: -1,
    agentPipeline: [],
    agentOutputs: {},
    salarySlipFile: { name: 'APP_1002_salary_slip.pdf', sizeBytes: 1240, status: 'uploaded' },
    bankStatementFile: { name: 'APP_1002_bank_statement.pdf', sizeBytes: 2450, status: 'uploaded' },
    logs: [
      {
        timestamp: getPastISOString(4),
        agentName: 'SYSTEM',
        message: 'Application submitted successfully. Linked sample docs: APP_1002_salary_slip.pdf, APP_1002_bank_statement.pdf',
        type: 'success',
      },
    ],
    createdAt: getPastISOString(4),
    updatedAt: getPastISOString(4),
  };
  app2.agentPipeline = buildPipeline(app2, policy);
  app2.logs.push({
    timestamp: getPastISOString(3.8),
    agentName: 'COORDINATOR_AGENT',
    message: `Dynamic pipeline constructed: [${app2.agentPipeline.join(', ')}]. System configured for private employment scrutiny.`,
    type: 'info',
  });

  const app3: LoanApplication = {
    id: 'APP_1003',
    applicantName: 'Amit Patel',
    monthlySalary: 60000,
    requestedAmount: 500000,
    employerName: 'Patel Provisions Stores',
    employerType: 'Self-Employed',
    declaredCreditScore: 560, // Low Credit
    purpose: 'Personal Loan',
    status: 'COORDINATED',
    currentAgentIndex: -1,
    agentPipeline: [],
    agentOutputs: {},
    salarySlipFile: { name: 'APP_1003_salary_slip.pdf', sizeBytes: 1240, status: 'uploaded' },
    bankStatementFile: { name: 'APP_1003_bank_statement.pdf', sizeBytes: 2450, status: 'uploaded' },
    logs: [
      {
        timestamp: getPastISOString(3),
        agentName: 'SYSTEM',
        message: 'Application submitted successfully. Linked sample docs: APP_1003_salary_slip.pdf, APP_1003_bank_statement.pdf',
        type: 'success',
      },
    ],
    createdAt: getPastISOString(3),
    updatedAt: getPastISOString(3),
  };
  app3.agentPipeline = buildPipeline(app3, policy);
  app3.logs.push({
    timestamp: getPastISOString(2.8),
    agentName: 'COORDINATOR_AGENT',
    message: `Dynamic pipeline constructed: [${app3.agentPipeline.join(', ')}]. Mandatory credit score analysis queued.`,
    type: 'info',
  });

  const app4: LoanApplication = {
    id: 'APP_1004',
    applicantName: 'Sonal Sen (MissingDoc)', // Will fail document check
    monthlySalary: 72000,
    requestedAmount: 400000,
    employerName: 'Wipro Technologies',
    employerType: 'MNC',
    declaredCreditScore: 760,
    purpose: 'Education Loan',
    status: 'COORDINATED',
    currentAgentIndex: -1,
    agentPipeline: [],
    agentOutputs: {},
    salarySlipFile: { name: 'APP_1004_salary_slip.pdf', sizeBytes: 1240, status: 'uploaded' },
    bankStatementFile: { name: 'APP_1004_bank_statement.pdf', sizeBytes: 2450, status: 'uploaded' },
    logs: [
      {
        timestamp: getPastISOString(2),
        agentName: 'SYSTEM',
        message: 'Application submitted successfully. Linked sample docs: APP_1004_salary_slip.pdf, APP_1004_bank_statement.pdf',
        type: 'success',
      },
    ],
    createdAt: getPastISOString(2),
    updatedAt: getPastISOString(2),
  };
  app4.agentPipeline = buildPipeline(app4, policy);
  app4.logs.push({
    timestamp: getPastISOString(1.8),
    agentName: 'COORDINATOR_AGENT',
    message: `Dynamic pipeline constructed: [${app4.agentPipeline.join(', ')}]. Compliance files validation pending.`,
    type: 'info',
  });

  return [app1, app2, app3, app4];
};

function App() {
  const [activeTab, setActiveTab] = useState<string>('customer');
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [policy, setPolicy] = useState<PolicyConfig>(DEFAULT_POLICY);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1500); // delay in ms
  const [showVision, setShowVision] = useState<boolean>(true);
  const [showRecorder, setShowRecorder] = useState<boolean>(false);

  // Load initial data from localStorage
  useEffect(() => {
    const savedPolicy = localStorage.getItem(LOCAL_STORAGE_POLICY_KEY);
    const parsedPolicy = savedPolicy ? JSON.parse(savedPolicy) : DEFAULT_POLICY;
    setPolicy(parsedPolicy);

    const savedApps = localStorage.getItem(LOCAL_STORAGE_APPS_KEY);
    if (savedApps) {
      const parsedApps = JSON.parse(savedApps);
      setApplications(parsedApps);
      if (parsedApps.length > 0) {
        setActiveAppId(parsedApps[0].id);
      }
    } else {
      // Seed default apps if database is empty on first load
      const seeded = SEED_APPLICATIONS(parsedPolicy);
      setApplications(seeded);
      localStorage.setItem(LOCAL_STORAGE_APPS_KEY, JSON.stringify(seeded));
      if (seeded.length > 0) {
        setActiveAppId(seeded[0].id);
      }
    }
  }, []);

  // Sync state helpers
  const saveAppsToStorage = (updatedApps: LoanApplication[]) => {
    setApplications(updatedApps);
    localStorage.setItem(LOCAL_STORAGE_APPS_KEY, JSON.stringify(updatedApps));
  };

  const savePolicyToStorage = (updatedPolicy: PolicyConfig) => {
    setPolicy(updatedPolicy);
    localStorage.setItem(LOCAL_STORAGE_POLICY_KEY, JSON.stringify(updatedPolicy));
  };

  // 1. Submit loan application
  const handleSubmitApplication = (data: {
    applicantName: string;
    monthlySalary: number;
    requestedAmount: number;
    employerName: string;
    employerType: typeof applications[0]['employerType'];
    declaredCreditScore: number;
    purpose: string;
    simulateMissingDocs: boolean;
    salarySlipFile?: { name: string; sizeBytes: number; status: 'uploaded' | 'pending' };
    bankStatementFile?: { name: string; sizeBytes: number; status: 'uploaded' | 'pending' };
  }) => {
    const nextNumber = applications.length > 0 
      ? Math.max(...applications.map(a => Number(a.id.split('_')[1]))) + 1
      : 1001;
    const newId = `APP_${nextNumber}`;

    const newApp: LoanApplication = {
      id: newId,
      applicantName: data.simulateMissingDocs ? `${data.applicantName} (MissingDoc)` : data.applicantName,
      monthlySalary: data.monthlySalary,
      requestedAmount: data.requestedAmount,
      employerName: data.employerName,
      employerType: data.employerType,
      declaredCreditScore: data.declaredCreditScore,
      purpose: data.purpose,
      status: 'NEW',
      currentAgentIndex: -1,
      agentPipeline: [],
      agentOutputs: {},
      salarySlipFile: data.salarySlipFile,
      bankStatementFile: data.bankStatementFile,
      logs: [
        {
          timestamp: new Date().toISOString(),
          agentName: 'SYSTEM',
          message: `Application submitted successfully. Assigned tracking ID: ${newId}.`,
          type: 'success',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (data.salarySlipFile) {
      newApp.logs.push({
        timestamp: new Date().toISOString(),
        agentName: 'SYSTEM',
        message: `Linked document: ${data.salarySlipFile.name} (${(data.salarySlipFile.sizeBytes / 1024).toFixed(0)} KB) linked for salary OCR validation.`,
        type: 'info',
      });
    }
    if (data.bankStatementFile) {
      newApp.logs.push({
        timestamp: new Date().toISOString(),
        agentName: 'SYSTEM',
        message: `Linked document: ${data.bankStatementFile.name} (${(data.bankStatementFile.sizeBytes / 1024).toFixed(0)} KB) linked for trans-analysis extraction.`,
        type: 'info',
      });
    }

    // Coordinator builds pipeline dynamically
    const pipeline = buildPipeline(newApp, policy);
    newApp.agentPipeline = pipeline;
    newApp.status = 'COORDINATED';

    const isEmpSkipped = !pipeline.includes('EMPLOYER_VERIFICATION_AGENT');

    newApp.logs.push({
      timestamp: new Date().toISOString(),
      agentName: 'COORDINATOR_AGENT',
      message: `Policy Evaluation: Built pipeline containing ${pipeline.length} verification nodes. ${
        isEmpSkipped 
          ? 'Skipped Employer Verification (relying on declared Prime credit & moderate loan value).' 
          : 'Employer Verification marked MANDATORY (due to credit or employment tier limits).'
      }`,
      type: 'info',
    });

    const updatedList = [newApp, ...applications];
    saveAppsToStorage(updatedList);
    setActiveAppId(newId);
    
    // Auto route to Orchestration View so they watch it happen live!
    setActiveTab('orchestrator');
  };

  // 2. Select application
  const handleSelectApplication = (app: LoanApplication) => {
    setActiveAppId(app.id);
    setActiveTab('orchestrator');
  };

  // Find active application object
  const activeApp = applications.find((app) => app.id === activeAppId) || null;

  // 3. Step forward single pipeline node
  const handleRunStep = async () => {
    if (!activeApp) return;
    if (activeApp.currentAgentIndex + 1 >= activeApp.agentPipeline.length) {
      setIsPlaying(false);
      return;
    }

    const updatedApp = await runPipelineStep(activeApp, policy);
    const updatedApps = applications.map((app) => 
      app.id === updatedApp.id ? updatedApp : app
    );
    saveAppsToStorage(updatedApps);
  };

  // 4. Auto run simulation loop
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && activeApp) {
      const hasMoreSteps = activeApp.currentAgentIndex + 1 < activeApp.agentPipeline.length;
      if (hasMoreSteps) {
        timer = setTimeout(() => {
          handleRunStep();
        }, speed);
      } else {
        setIsPlaying(false);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, activeApp?.currentAgentIndex, speed, activeAppId]);

  // 5. Reset application pipeline state
  const handleResetApp = () => {
    if (!activeApp) return;
    setIsPlaying(false);

    const resetApp = { ...activeApp };
    resetApp.status = 'COORDINATED';
    resetApp.currentAgentIndex = -1;
    resetApp.agentOutputs = {};
    resetApp.riskLevel = undefined;
    resetApp.approvedAmount = undefined;
    resetApp.interestRate = undefined;
    resetApp.coordinatorNotes = undefined;
    resetApp.xaiReport = undefined;
    resetApp.logs = [
      {
        timestamp: new Date().toISOString(),
        agentName: 'COORDINATOR_AGENT',
        message: 'Simulation reset requested. Re-initialized dynamic execution pipeline.',
        type: 'info',
      },
    ];

    const updatedApps = applications.map((app) => 
      app.id === resetApp.id ? resetApp : app
    );
    saveAppsToStorage(updatedApps);
  };

  // 6. Save coordinator policies
  const handleSavePolicy = (newPolicy: PolicyConfig) => {
    savePolicyToStorage(newPolicy);
  };

  // 7. Update database directly
  const handleUpdateDatabase = (apps: LoanApplication[], newPolicy: PolicyConfig) => {
    saveAppsToStorage(apps);
    savePolicyToStorage(newPolicy);
    if (apps.length > 0 && (!activeAppId || !apps.some(a => a.id === activeAppId))) {
      setActiveAppId(apps[0].id);
    }
  };

  // 8. Re-seed default database records
  const handleSeedDatabase = () => {
    const seeded = SEED_APPLICATIONS(policy);
    saveAppsToStorage(seeded);
    if (seeded.length > 0) {
      setActiveAppId(seeded[0].id);
    }
  };

  // 9. Manager decision approval trigger
  const handleManagerDecision = (
    id: string,
    decision: 'APPROVED' | 'REJECTED',
    notes: string,
    modifiedAmount?: number,
    modifiedRate?: number
  ) => {
    const updatedApps = applications.map((app) => {
      if (app.id !== id) return app;
      
      const appCopy = { ...app };
      appCopy.status = decision;
      appCopy.managerNotes = notes;
      
      if (modifiedAmount !== undefined) {
        appCopy.approvedAmount = modifiedAmount;
      }
      if (modifiedRate !== undefined) {
        appCopy.interestRate = modifiedRate;
      }

      appCopy.logs.push({
        timestamp: new Date().toISOString(),
        agentName: 'MANAGER_OFFICE',
        message: `Human-In-The-Loop Decision: Loan is manual ${decision}. Decision notes: "${notes}".${
          modifiedAmount !== undefined ? ` Approved Amount overridden to INR ${modifiedAmount.toLocaleString()}.` : ''
        }${modifiedRate !== undefined ? ` APR modified to ${modifiedRate.toFixed(2)}%.` : ''}`,
        type: decision === 'APPROVED' ? 'success' : 'error',
      });

      return appCopy;
    });

    saveAppsToStorage(updatedApps);
    alert(`Loan ${id} successfully ${decision.toLowerCase()}!`);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Header Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} applications={applications} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner Vibe */}
        <div className="bg-gradient-to-r from-emerald-950/20 via-slate-900 to-orange-950/20 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/5 to-transparent blur-2xl pointer-events-none" />
          <div className="space-y-2 text-center md:text-left relative z-10 mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                Simulation Live Environment
              </span>
              <Sparkles className="h-4 w-4 text-emerald-400 animate-spin" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Lending Orchestration Control Panel
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Experience the power of policy-driven multi-agent systems. Watch the Coordinator Agent dynamically route applications through evaluation checkpoints, with a human manager overseeing boundary rules.
            </p>
          </div>
          <div className="shrink-0 flex items-center bg-slate-950/50 p-4 border border-slate-800 rounded-xl relative z-10">
            <div className="text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Storage Engine</div>
              <div className="text-xs text-emerald-400 font-bold font-mono mt-0.5">LOCALSTORAGE JSON</div>
            </div>
          </div>
        </div>

        {/* Hackathon Vision & Problem Statement Help Section */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 mb-8 shadow-md">
          <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setShowVision(!showVision)}>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                Hackathon Vision & PS
              </span>
              <h2 className="text-sm font-bold text-white">IDBI Platform Vision & Problem Statement</h2>
            </div>
            <button className="text-xs text-slate-500 hover:text-white font-mono transition-colors">
              {showVision ? '[ Collapse ]' : '[ Expand ]'}
            </button>
          </div>

          {showVision && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-slate-800/60 text-xs text-slate-300 leading-relaxed transition-all">
              <div className="space-y-2">
                <span className="font-bold text-orange-400 block uppercase tracking-wider text-[10px]">Lending Problem Statement:</span>
                <p>
                  As loan volumes increase across retail, MSME, and corporate banking, the lending process has become increasingly complex. Loan applications pass through multiple stakeholders—including Relationship Managers, Credit Officers, Risk Analysts, Operations Teams, and Branch Managers—each working on different systems with limited real-time visibility.
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[10px]">Lending Platform Vision:</span>
                <p>
                  The IDBI Lending Orchestration Control Panel is more than a dashboard. It is an AI-powered decision intelligence platform that unifies people, processes, and data to make lending faster, smarter, and more transparent. By combining orchestration, predictive analytics, and explainable AI, it empowers every stakeholder—from relationship managers to executives—to make better decisions with confidence.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Render Switcher */}
        <div className="transition-all duration-300">
          {activeTab === 'customer' && (
            <CustomerPortal
              applications={applications}
              onSubmitApplication={handleSubmitApplication}
              onSelectApplication={handleSelectApplication}
              activeAppId={activeAppId}
            />
          )}

          {activeTab === 'orchestrator' && (
            <AiPipelineView
              app={activeApp}
              onRunStep={handleRunStep}
              onAutoRunToggle={setIsPlaying}
              isPlaying={isPlaying}
              onSpeedChange={setSpeed}
              speed={speed}
              onResetApp={handleResetApp}
            />
          )}

          {activeTab === 'manager' && (
            <ManagerDashboard
              applications={applications}
              onManagerDecision={handleManagerDecision}
            />
          )}

          {activeTab === 'coordinator' && (
            <CoordinatorPanel
              policy={policy}
              onSavePolicy={handleSavePolicy}
            />
          )}

          {activeTab === 'database' && (
            <DatabaseViewer
              applications={applications}
              policy={policy}
              onUpdateDatabase={handleUpdateDatabase}
              onSeedDatabase={handleSeedDatabase}
            />
          )}

          {activeTab === 'deck' && (
            <PitchDeck />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-600 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span>© 2026 ISLO-AI. Dedicated pair programming session.</span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-500">Service Status: Simulation Operational</span>
          </span>
        </div>
      </footer>

      {/* Floating Screen Recorder Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {!showRecorder ? (
          <button
            onClick={() => setShowRecorder(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-red-500 hover:text-red-400 font-bold py-2 px-3.5 rounded-full shadow-lg transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-xs font-mono">🎥 Record Walkthrough</span>
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowRecorder(false)}
              className="absolute -top-2 -right-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-full p-1 leading-none text-[10px] w-5 h-5 flex items-center justify-center font-bold z-50 shadow-md"
            >
              ×
            </button>
            <ScreenRecorder />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
