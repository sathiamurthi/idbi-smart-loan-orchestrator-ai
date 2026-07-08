export type WorkflowState = 'NEW' | 'COORDINATED' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type EmployerType = 'MNC' | 'Govt' | 'Private' | 'Self-Employed';

export type AgentType =
  | 'OCR_AGENT'
  | 'DOCUMENT_VALIDATION_AGENT'
  | 'SALARY_ANALYSIS_AGENT'
  | 'BANK_STATEMENT_AGENT'
  | 'CREDIT_ASSESSMENT_AGENT'
  | 'EMPLOYER_VERIFICATION_AGENT'
  | 'ELIGIBILITY_AGENT'
  | 'RISK_ASSESSMENT_AGENT'
  | 'LOAN_RECOMMENDATION_AGENT';

export interface AgentLog {
  timestamp: string;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  monthlySalary: number;
  requestedAmount: number;
  employerName: string;
  employerType: EmployerType;
  declaredCreditScore: number; // Credit score declared by customer
  actualCreditScore?: number;  // Credit score verified by Credit Agent
  purpose: string;
  status: WorkflowState;
  riskLevel?: RiskLevel;
  approvedAmount?: number;
  interestRate?: number;
  coordinatorNotes?: string;
  salarySlipFile?: { name: string; sizeBytes: number; status: 'uploaded' | 'pending' };
  bankStatementFile?: { name: string; sizeBytes: number; status: 'uploaded' | 'pending' };
  xaiReport?: {
    approvalReason?: string;
    rejectionReason?: string;
    riskAnalysis?: string;
    financialInsights?: string;
  };
  agentPipeline: AgentType[];
  currentAgentIndex: number; // -1 if not started, equal to pipeline.length if finished
  agentOutputs: {
    OCR_AGENT?: { salaryExtracted: number; employerExtracted: string; success: boolean };
    DOCUMENT_VALIDATION_AGENT?: { missingDocs: string[]; isValid: boolean; documentQuality: string };
    SALARY_ANALYSIS_AGENT?: { incomeStability: string; monthlySavingsEst: number; savingsRate: number };
    BANK_STATEMENT_AGENT?: {
      detectedEmis: number;
      spendingProfile: string;
      balanceTrend: 'UP' | 'STABLE' | 'DOWN';
      detectedLoans?: { loanType: 'Home Loan' | 'Personal Loan' | 'Auto Loan' | 'Other EMI'; lenderName: string; monthlyEmi: number; narrationPattern: string }[];
    };
    CREDIT_ASSESSMENT_AGENT?: { creditScore: number; paymentHistory: string; activeAccounts: number };
    EMPLOYER_VERIFICATION_AGENT?: { companyCategory: 'A' | 'B' | 'C' | 'Unlisted'; jobStability: string; verified: boolean };
    ELIGIBILITY_AGENT?: { maxEligibleAmount: number; multiplierUsed: number };
    RISK_ASSESSMENT_AGENT?: { aggregateScore: number; riskRating: RiskLevel; flags: string[] };
    LOAN_RECOMMENDATION_AGENT?: { suggestedAmount: number; suggestedRate: number; justification: string };
  };
  logs: AgentLog[];
  createdAt: string;
  updatedAt: string;
  managerNotes?: string;
}

export interface PolicyConfig {
  minCreditScoreAutoApprove: number;
  maxLoanAmountAutoApprove: number;
  minCreditScoreAutoReject: number;
  incomeMultiplier: number;
  mandatoryAgents: AgentType[];
  baseInterestRate: number;
}
