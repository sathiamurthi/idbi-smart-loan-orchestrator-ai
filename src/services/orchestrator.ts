import type { LoanApplication, PolicyConfig, AgentType } from '../types';
import * as mockAi from './mockAiService';

const getTimestamp = () => new Date().toISOString();

// Coordinator Agent: Builds pipeline dynamically
export const buildPipeline = (app: LoanApplication, policy: PolicyConfig): AgentType[] => {
  const pipeline: AgentType[] = [
    'OCR_AGENT',
    'DOCUMENT_VALIDATION_AGENT',
    'SALARY_ANALYSIS_AGENT',
    'BANK_STATEMENT_AGENT',
    'CREDIT_ASSESSMENT_AGENT',
  ];

  // Dynamic Rule: Skip Employer Verification if loan requested amount is low
  // and customer claims excellent credit, and they are in Government service.
  const isHighAmount = app.requestedAmount > policy.maxLoanAmountAutoApprove;
  const isSelfEmployedOrPrivate = app.employerType === 'Self-Employed' || app.employerType === 'Private';
  const needsEmployerVerification = isHighAmount || isSelfEmployedOrPrivate || policy.mandatoryAgents.includes('EMPLOYER_VERIFICATION_AGENT');

  if (needsEmployerVerification) {
    pipeline.push('EMPLOYER_VERIFICATION_AGENT');
  }

  pipeline.push('ELIGIBILITY_AGENT');
  pipeline.push('RISK_ASSESSMENT_AGENT');
  pipeline.push('LOAN_RECOMMENDATION_AGENT');

  return pipeline;
};

// Coordinator Agent: Run a single step of the pipeline
export const runPipelineStep = async (
  app: LoanApplication,
  policy: PolicyConfig
): Promise<LoanApplication> => {
  const updatedApp = { ...app };
  const nextIndex = updatedApp.currentAgentIndex + 1;

  if (nextIndex >= updatedApp.agentPipeline.length) {
    // Already completed pipeline
    return updatedApp;
  }

  // Set state to IN_PROGRESS on the first agent
  if (updatedApp.status === 'COORDINATED') {
    updatedApp.status = 'IN_PROGRESS';
    updatedApp.logs.push({
      timestamp: getTimestamp(),
      agentName: 'COORDINATOR_AGENT',
      message: 'Workflow execution initiated. Transitioning application status to IN_PROGRESS.',
      type: 'info',
    });
  }

  const activeAgent = updatedApp.agentPipeline[nextIndex];
  updatedApp.currentAgentIndex = nextIndex;
  
  updatedApp.logs.push({
    timestamp: getTimestamp(),
    agentName: 'COORDINATOR_AGENT',
    message: `Executing pipeline agent ${nextIndex + 1}/${updatedApp.agentPipeline.length}: ${activeAgent.replace(/_/g, ' ')}...`,
    type: 'info',
  });

  // Call mock agent matching the enum
  let agentResult: { output: any; logs: any[] };

  switch (activeAgent) {
    case 'OCR_AGENT':
      agentResult = mockAi.runOcrAgent(updatedApp);
      updatedApp.agentOutputs.OCR_AGENT = agentResult.output;
      break;
    case 'DOCUMENT_VALIDATION_AGENT':
      agentResult = mockAi.runDocumentValidationAgent(updatedApp);
      updatedApp.agentOutputs.DOCUMENT_VALIDATION_AGENT = agentResult.output;
      break;
    case 'SALARY_ANALYSIS_AGENT':
      agentResult = mockAi.runSalaryAnalysisAgent(updatedApp);
      updatedApp.agentOutputs.SALARY_ANALYSIS_AGENT = agentResult.output;
      break;
    case 'BANK_STATEMENT_AGENT':
      agentResult = mockAi.runBankStatementAgent(updatedApp);
      updatedApp.agentOutputs.BANK_STATEMENT_AGENT = agentResult.output;
      break;
    case 'CREDIT_ASSESSMENT_AGENT':
      agentResult = mockAi.runCreditAssessmentAgent(updatedApp);
      updatedApp.agentOutputs.CREDIT_ASSESSMENT_AGENT = agentResult.output;
      // Copy credit score over to app state
      updatedApp.actualCreditScore = agentResult.output.creditScore;
      break;
    case 'EMPLOYER_VERIFICATION_AGENT':
      agentResult = mockAi.runEmployerVerificationAgent(updatedApp);
      updatedApp.agentOutputs.EMPLOYER_VERIFICATION_AGENT = agentResult.output;
      break;
    case 'ELIGIBILITY_AGENT':
      agentResult = mockAi.runEligibilityAgent(updatedApp, policy);
      updatedApp.agentOutputs.ELIGIBILITY_AGENT = agentResult.output;
      break;
    case 'RISK_ASSESSMENT_AGENT':
      agentResult = mockAi.runRiskAssessmentAgent(updatedApp);
      updatedApp.agentOutputs.RISK_ASSESSMENT_AGENT = agentResult.output;
      updatedApp.riskLevel = agentResult.output.riskRating;
      break;
    case 'LOAN_RECOMMENDATION_AGENT':
      agentResult = mockAi.runLoanRecommendationAgent(updatedApp, policy);
      updatedApp.agentOutputs.LOAN_RECOMMENDATION_AGENT = agentResult.output;
      updatedApp.approvedAmount = agentResult.output.suggestedAmount;
      updatedApp.interestRate = agentResult.output.suggestedRate;
      break;
    default:
      throw new Error(`Unknown agent: ${activeAgent}`);
  }

  // Append logs
  updatedApp.logs.push(...agentResult.logs);
  updatedApp.updatedAt = getTimestamp();

  // If this was the last agent, evaluate final orchestration decision
  const isLastAgent = nextIndex === updatedApp.agentPipeline.length - 1;
  if (isLastAgent) {
    evaluateFinalDecision(updatedApp, policy);
  }

  return updatedApp;
};

// Coordinator Decision Engine logic
const evaluateFinalDecision = (app: LoanApplication, policy: PolicyConfig): void => {
  const creditScore = app.actualCreditScore || app.declaredCreditScore;
  const riskTier = app.riskLevel || 'MEDIUM';
  const requested = app.requestedAmount;
  const docIsValid = app.agentOutputs.DOCUMENT_VALIDATION_AGENT?.isValid !== false;
  const maxEligible = app.agentOutputs.ELIGIBILITY_AGENT?.maxEligibleAmount || 0;

  app.logs.push({
    timestamp: getTimestamp(),
    agentName: 'COORDINATOR_AGENT',
    message: 'All agents execution completed. Starting Coordinator Decision Engine evaluation...',
    type: 'info',
  });

  // Check 1: Hard rejection criteria
  if (creditScore < policy.minCreditScoreAutoReject) {
    app.status = 'REJECTED';
    app.xaiReport = {
      rejectionReason: `Credit score of ${creditScore} is below the bank's absolute policy minimum threshold of ${policy.minCreditScoreAutoReject}.`,
      riskAnalysis: `Extreme repayment risk. CIBIL database flags late history: "${app.agentOutputs.CREDIT_ASSESSMENT_AGENT?.paymentHistory}".`,
      financialInsights: 'Applicant does not meet minimum creditworthiness standards for clean lending.',
    };
    app.logs.push({
      timestamp: getTimestamp(),
      agentName: 'COORDINATOR_AGENT',
      message: `System Auto-Rejection: Credit score (${creditScore}) is below minimum limit (${policy.minCreditScoreAutoReject}).`,
      type: 'error',
    });
    return;
  }

  if (!docIsValid) {
    app.status = 'REJECTED';
    app.xaiReport = {
      rejectionReason: 'Application documents failed verification checks or critical files were missing.',
      riskAnalysis: 'Operational/compliance risk. Missing files: ' + (app.agentOutputs.DOCUMENT_VALIDATION_AGENT?.missingDocs?.join(', ') || 'N/A'),
      financialInsights: 'Compliance review fails. KYC/Form-16 documents incomplete.',
    };
    app.logs.push({
      timestamp: getTimestamp(),
      agentName: 'COORDINATOR_AGENT',
      message: 'System Auto-Rejection: Document validation failed validation parameters.',
      type: 'error',
    });
    return;
  }

  // Check 2: Auto approval criteria
  const withinAmountLimit = requested <= policy.maxLoanAmountAutoApprove;
  const isExcellentCredit = creditScore >= policy.minCreditScoreAutoApprove;
  const isLowRisk = riskTier === 'LOW';

  if (isExcellentCredit && isLowRisk && withinAmountLimit && maxEligible >= requested) {
    app.status = 'APPROVED';
    app.xaiReport = {
      approvalReason: `Credit score (${creditScore}) exceeds auto-approval threshold (${policy.minCreditScoreAutoApprove}), risk assessment is LOW, and requested amount (INR ${requested.toLocaleString()}) is below the auto-approve cap (INR ${policy.maxLoanAmountAutoApprove.toLocaleString()}).`,
      riskAnalysis: 'Negligible risk. Verified stable income, solid credit file, and zero negative credit trends.',
      financialInsights: `Requested loan is fully covered by eligible earnings multiplier. Strong debt-service capacity. Approved at rate ${app.interestRate?.toFixed(2)}%.`,
    };
    app.logs.push({
      timestamp: getTimestamp(),
      agentName: 'COORDINATOR_AGENT',
      message: 'System Auto-Approval: Application passes all high-credit low-risk parameters.',
      type: 'success',
    });
    return;
  }

  // Check 3: Escalation/Hold criteria
  app.status = 'UNDER_REVIEW'; // HOLD status
  
  let escalationNotes = '';
  if (!withinAmountLimit) {
    escalationNotes += `• Requested amount (INR ${requested.toLocaleString()}) exceeds automatic approval threshold (INR ${policy.maxLoanAmountAutoApprove.toLocaleString()}).\n`;
  }
  if (!isExcellentCredit) {
    escalationNotes += `• Credit score (${creditScore}) is in the medium-risk band (Minimum for auto-approve: ${policy.minCreditScoreAutoApprove}).\n`;
  }
  if (riskTier === 'MEDIUM' || riskTier === 'HIGH') {
    escalationNotes += `• Risk rating is evaluated as ${riskTier}.\n`;
  }
  if (maxEligible < requested) {
    escalationNotes += `• Requested loan amount exceeds computed eligibility limit of INR ${maxEligible.toLocaleString()}.\n`;
  }
  if (app.employerType === 'Self-Employed') {
    escalationNotes += '• Applicant is Self-Employed (requires verification of profit & loss statements).\n';
  }

  app.coordinatorNotes = escalationNotes.trim();
  app.xaiReport = {
    approvalReason: 'Pending Manager Sign-off: Loan shows creditworthiness but flags policy boundary checks.',
    riskAnalysis: `Risk factors raise escalation flags:\n${escalationNotes}`,
    financialInsights: `Max calculated income eligibility is INR ${maxEligible.toLocaleString()}. Suggested approved amount is INR ${app.approvedAmount?.toLocaleString()} at APR ${app.interestRate?.toFixed(2)}%.`,
  };

  app.logs.push({
    timestamp: getTimestamp(),
    agentName: 'COORDINATOR_AGENT',
    message: 'Orchestration Action: Application escalated to HOLD status for manual Senior Manager review.',
    type: 'warning',
  });
};
