import type { AgentLog, LoanApplication, PolicyConfig, RiskLevel } from '../types';

// Helper to format timestamp
const getTimestamp = () => new Date().toISOString();

// Helper to create a log
const createLog = (agentName: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): AgentLog => ({
  timestamp: getTimestamp(),
  agentName,
  message,
  type,
});

export const runOcrAgent = (app: LoanApplication): { output: any; logs: AgentLog[] } => {
  const agentName = 'OCR_AGENT';
  const logs: AgentLog[] = [
    createLog(agentName, 'Starting text extraction from uploaded PDF documents...'),
    createLog(agentName, `Scanning 'Salary_Slip_${app.applicantName.replace(/\s+/g, '_')}.pdf'...`),
    createLog(agentName, 'Extracting text layers using character recognition OCR...'),
    createLog(agentName, `Successfully extracted monthly credit: INR ${app.monthlySalary.toLocaleString()}`, 'success'),
    createLog(agentName, `Successfully extracted employer name: "${app.employerName}"`, 'success'),
    createLog(agentName, 'Document OCR matching confidence: 98.4%', 'info'),
  ];

  return {
    output: {
      salaryExtracted: app.monthlySalary,
      employerExtracted: app.employerName,
      success: true,
    },
    logs,
  };
};

export const runDocumentValidationAgent = (app: LoanApplication): { output: any; logs: AgentLog[] } => {
  const agentName = 'DOCUMENT_VALIDATION_AGENT';
  const logs: AgentLog[] = [
    createLog(agentName, 'Validating uploaded file formats and digital signatures...'),
    createLog(agentName, 'Verifying identity proof (Aadhaar/PAN) matching name...'),
    createLog(agentName, 'Checking salary slip date range (last 3 months)...'),
  ];

  const hasMissingDocs = app.applicantName.toLowerCase().includes('missingdoc');
  const missingDocs = hasMissingDocs ? ['Form_16_Tax_Return.pdf'] : [];
  
  if (hasMissingDocs) {
    logs.push(createLog(agentName, 'Validation Alert: Missing critical document (Form 16 Tax Return)', 'error'));
    return {
      output: {
        missingDocs,
        isValid: false,
        documentQuality: 'POOR',
      },
      logs,
    };
  }

  logs.push(createLog(agentName, 'Digital signatures match banking issuers. All files valid.', 'success'));
  return {
    output: {
      missingDocs: [],
      isValid: true,
      documentQuality: 'EXCELLENT',
    },
    logs,
  };
};

export const runSalaryAnalysisAgent = (app: LoanApplication): { output: any; logs: AgentLog[] } => {
  const agentName = 'SALARY_ANALYSIS_AGENT';
  const logs: AgentLog[] = [
    createLog(agentName, 'Analyzing monthly income components (basic, allowances, deductions)...'),
    createLog(agentName, 'Calculating net vs gross variance...'),
  ];

  let incomeStability = 'HIGH';
  let savingsRate = 0.3; // Default 30% savings

  if (app.employerType === 'Self-Employed') {
    incomeStability = 'MEDIUM_VOLATILITY';
    savingsRate = 0.15;
    logs.push(createLog(agentName, 'Self-employed income profile shows seasonal variance.', 'warning'));
  } else if (app.employerType === 'Private') {
    incomeStability = 'STABLE';
    savingsRate = 0.22;
  } else {
    // Govt, MNC
    incomeStability = 'VERY_STABLE';
    savingsRate = 0.35;
    logs.push(createLog(agentName, 'Employer profile indicates premium employment stability.', 'success'));
  }

  const monthlySavingsEst = Math.round(app.monthlySalary * savingsRate);
  logs.push(createLog(agentName, `Estimated monthly surplus: INR ${monthlySavingsEst.toLocaleString()} (Savings Rate: ${(savingsRate * 100).toFixed(0)}%)`, 'success'));

  return {
    output: {
      incomeStability,
      monthlySavingsEst,
      savingsRate,
    },
    logs,
  };
};

export const runBankStatementAgent = (app: LoanApplication): { output: any; logs: AgentLog[] } => {
  const agentName = 'BANK_STATEMENT_AGENT';
  const logs: AgentLog[] = [
    createLog(agentName, 'Parsing monthly bank statement transactions...'),
  ];

  if (app.bankStatementFile) {
    logs.push(createLog(agentName, `Successfully verified uploaded PDF: ${app.bankStatementFile.name} (Signature verified).`, 'success'));
  }

  logs.push(createLog(agentName, 'Running keyword pattern recognition on transaction narrations (ACH/ECS/SI direct-debits)...'));

  const detectedLoans: { loanType: 'Home Loan' | 'Personal Loan' | 'Auto Loan' | 'Other EMI'; lenderName: string; monthlyEmi: number; narrationPattern: string }[] = [];
  let detectedEmis = 0;

  // Simulate narration matching based on credit profile
  if (app.declaredCreditScore < 650) {
    detectedLoans.push({
      loanType: 'Personal Loan',
      lenderName: 'Bajaj Finance',
      monthlyEmi: 8400,
      narrationPattern: 'ACH_DEBIT_BAJAJ_FIN_PL_EMI_9918',
    });
    detectedLoans.push({
      loanType: 'Auto Loan',
      lenderName: 'HDFC Auto Finance',
      monthlyEmi: 12500,
      narrationPattern: 'ECS_DEBIT_HDFC_AUTO_LN_EMI_0091',
    });
    detectedEmis = 20900;
  } else if (app.declaredCreditScore < 720) {
    detectedLoans.push({
      loanType: 'Home Loan',
      lenderName: 'IDBI Home Finance',
      monthlyEmi: 28000,
      narrationPattern: 'SI_DEBIT_IDBI_HOME_LOAN_EMI_2209',
    });
    detectedEmis = 28000;
  } else {
    // Prime customer requested large amount might have small device or card EMI
    if (app.requestedAmount > 1500000) {
      detectedLoans.push({
        loanType: 'Other EMI',
        lenderName: 'SBI Card EMI',
        monthlyEmi: 3200,
        narrationPattern: 'ACH_DEBIT_SBI_CARD_EMI_3811',
      });
      detectedEmis = 3200;
    }
  }

  // Log matching patterns
  if (detectedLoans.length > 0) {
    detectedLoans.forEach(loan => {
      logs.push(createLog(
        agentName, 
        `Narration Match: "${loan.narrationPattern}" ➜ Identified Active ${loan.loanType} (EMI: INR ${loan.monthlyEmi.toLocaleString()} by ${loan.lenderName})`, 
        'warning'
      ));
    });
    logs.push(createLog(agentName, `Total identified recurring loan EMI liability: INR ${detectedEmis.toLocaleString()}/month`, 'warning'));
  } else {
    logs.push(createLog(agentName, 'Transaction history narration audit clean. No active EMI direct-debits found.', 'success'));
  }

  const balanceTrend = app.declaredCreditScore > 750 ? 'UP' : (app.declaredCreditScore < 660 ? 'DOWN' : 'STABLE');
  logs.push(createLog(agentName, `End-of-Day balance trend over last 90 days evaluated as: ${balanceTrend}`, 'info'));

  return {
    output: {
      detectedEmis,
      spendingProfile: app.declaredCreditScore > 750 ? 'CONSERVATIVE' : 'MODERATE',
      balanceTrend,
      detectedLoans,
    },
    logs,
  };
};

export const runCreditAssessmentAgent = (app: LoanApplication): { output: any; logs: AgentLog[] } => {
  const agentName = 'CREDIT_ASSESSMENT_AGENT';
  const logs: AgentLog[] = [
    createLog(agentName, 'Requesting external credit data from CIBIL API...'),
    createLog(agentName, 'Verifying pan card link with tax department records...'),
  ];

  // We fetch actual score matching declared score (with +/- 15 score noise)
  const scoreNoise = Math.floor(Math.random() * 21) - 10; // -10 to +10
  const creditScore = Math.min(850, Math.max(300, app.declaredCreditScore + scoreNoise));
  
  logs.push(createLog(agentName, `CIBIL API returned verified credit score: ${creditScore}`, creditScore >= 750 ? 'success' : (creditScore < 650 ? 'error' : 'warning')));

  let paymentHistory = '99% ON-TIME';
  let activeAccounts = 2;

  if (creditScore < 650) {
    paymentHistory = '82% ON-TIME (2 Delinquencies in 12 months)';
    activeAccounts = 6;
    logs.push(createLog(agentName, 'Multiple inquiries and late payments detected in report.', 'error'));
  } else if (creditScore < 750) {
    paymentHistory = '94% ON-TIME';
    activeAccounts = 4;
  } else {
    logs.push(createLog(agentName, 'Excellent repayment history with near-zero utilization.', 'success'));
  }

  return {
    output: {
      creditScore,
      paymentHistory,
      activeAccounts,
    },
    logs,
  };
};

export const runEmployerVerificationAgent = (app: LoanApplication): { output: any; logs: AgentLog[] } => {
  const agentName = 'EMPLOYER_VERIFICATION_AGENT';
  const logs: AgentLog[] = [
    createLog(agentName, `Cross-referencing corporate registry for "${app.employerName}"...`),
    createLog(agentName, 'Verifying corporate tax deposit matches salary slip records...'),
  ];

  let companyCategory: 'A' | 'B' | 'C' | 'Unlisted' = 'C';
  let jobStability = 'GOOD';

  if (app.employerType === 'MNC') {
    companyCategory = 'A';
    jobStability = 'EXCELLENT';
    logs.push(createLog(agentName, 'Employer classified as Tier-1 MNC. Highly stable.', 'success'));
  } else if (app.employerType === 'Govt') {
    companyCategory = 'A';
    jobStability = 'MAXIMUM';
    logs.push(createLog(agentName, 'Employer verified as government department/agency.', 'success'));
  } else if (app.employerType === 'Private') {
    companyCategory = 'B';
    jobStability = 'STABLE';
    logs.push(createLog(agentName, 'Employer verified as private limited company (Category B).', 'info'));
  } else {
    companyCategory = 'Unlisted';
    jobStability = 'VARIABLE';
    logs.push(createLog(agentName, 'Employer profile: Unlisted partnership or self-employed registry.', 'warning'));
  }

  return {
    output: {
      companyCategory,
      jobStability,
      verified: true,
    },
    logs,
  };
};

export const runEligibilityAgent = (app: LoanApplication, policy: PolicyConfig): { output: any; logs: AgentLog[] } => {
  const agentName = 'ELIGIBILITY_AGENT';
  const logs: AgentLog[] = [
    createLog(agentName, `Assessing income multiplier rules. Policy Base Multiplier: ${policy.incomeMultiplier}x`),
  ];

  // Adjust multiplier based on credit score
  const actualCredit = app.actualCreditScore || app.declaredCreditScore;
  let multiplier = policy.incomeMultiplier;

  if (actualCredit >= 780) {
    multiplier += 12;
    logs.push(createLog(agentName, 'Credit score premium: +12x multiplier applied.', 'success'));
  } else if (actualCredit >= 720) {
    multiplier += 6;
    logs.push(createLog(agentName, 'Credit score premium: +6x multiplier applied.', 'success'));
  } else if (actualCredit < 650) {
    multiplier -= 12;
    logs.push(createLog(agentName, 'Credit score penalty: -12x multiplier applied.', 'error'));
  }

  const maxEligibleAmount = Math.max(0, app.monthlySalary * multiplier);
  logs.push(createLog(agentName, `Max eligible loan computed: net salary × ${multiplier} = INR ${maxEligibleAmount.toLocaleString()}`, 'info'));

  return {
    output: {
      maxEligibleAmount,
      multiplierUsed: multiplier,
    },
    logs,
  };
};

export const runRiskAssessmentAgent = (app: LoanApplication): { output: any; logs: AgentLog[] } => {
  const agentName = 'RISK_ASSESSMENT_AGENT';
  const logs: AgentLog[] = [
    createLog(agentName, 'Compiling bank logs, credit bureaus, stability markers and files...'),
  ];

  const actualCredit = app.actualCreditScore || app.declaredCreditScore;

  const bankData = app.agentOutputs.BANK_STATEMENT_AGENT;
  const docData = app.agentOutputs.DOCUMENT_VALIDATION_AGENT;

  let score = 100;
  const flags: string[] = [];

  // Deduct based on risk factors
  if (actualCredit < 650) {
    score -= 40;
    flags.push('CRITICAL: Poor Credit Score');
  } else if (actualCredit < 720) {
    score -= 15;
    flags.push('Moderate Credit Score');
  }

  if (app.employerType === 'Self-Employed') {
    score -= 15;
    flags.push('Employment Type: Self-Employed volatility');
  }

  if (bankData && bankData.detectedEmis > app.monthlySalary * 0.25) {
    score -= 20;
    flags.push('HIGH LIABILITY: Monthly EMIs exceed 25% of net salary');
  }

  if (docData && !docData.isValid) {
    score -= 30;
    flags.push('CRITICAL: Missing files or documentation invalidity');
  }

  let riskRating: RiskLevel = 'LOW';
  if (score < 50) {
    riskRating = 'HIGH';
  } else if (score < 80) {
    riskRating = 'MEDIUM';
  }

  logs.push(createLog(agentName, `Computed risk scoring index: ${score}/100`, 'info'));
  logs.push(createLog(agentName, `Assigned risk tier: ${riskRating}`, riskRating === 'LOW' ? 'success' : (riskRating === 'HIGH' ? 'error' : 'warning')));
  
  if (flags.length > 0) {
    flags.forEach(f => logs.push(createLog(agentName, `Risk flag raised: ${f}`, 'warning')));
  } else {
    logs.push(createLog(agentName, 'No risk exceptions or warning flags flagged.', 'success'));
  }

  return {
    output: {
      aggregateScore: score,
      riskRating,
      flags,
    },
    logs,
  };
};

export const runLoanRecommendationAgent = (
  app: LoanApplication,
  policy: PolicyConfig
): { output: any; logs: AgentLog[] } => {
  const agentName = 'LOAN_RECOMMENDATION_AGENT';
  const logs: AgentLog[] = [
    createLog(agentName, 'Calculating final recommendation figures...'),
  ];

  const eligibility = app.agentOutputs.ELIGIBILITY_AGENT?.maxEligibleAmount || 0;
  const riskTier = app.agentOutputs.RISK_ASSESSMENT_AGENT?.riskRating || 'MEDIUM';
  const actualCredit = app.actualCreditScore || app.declaredCreditScore;

  // Recommended amount is the min of requested amount and eligibility
  let suggestedAmount = Math.min(app.requestedAmount, eligibility);

  // Interest rate calculation
  let suggestedRate = policy.baseInterestRate; // e.g. 8.5%

  if (riskTier === 'HIGH') {
    suggestedRate += 4.5;
    // Cap amount to 50% of request for high risk if we approve at all
    suggestedAmount = Math.round(suggestedAmount * 0.5);
    logs.push(createLog(agentName, 'High risk premium +4.5% added to interest rate. Amount capped to 50% eligibility.', 'warning'));
  } else if (riskTier === 'MEDIUM') {
    suggestedRate += 2.0;
    suggestedAmount = Math.round(suggestedAmount * 0.85);
    logs.push(createLog(agentName, 'Medium risk premium +2.0% added to interest rate. Amount reduced to 85% eligibility.', 'warning'));
  } else {
    // LOW risk gets slight discount
    if (actualCredit >= 780) {
      suggestedRate -= 0.5;
      logs.push(createLog(agentName, 'Super Prime customer discount of -0.5% rate applied.', 'success'));
    }
  }

  logs.push(createLog(agentName, `Final recommended Loan: INR ${suggestedAmount.toLocaleString()}`, 'success'));
  logs.push(createLog(agentName, `Final recommended APR: ${suggestedRate.toFixed(2)}%`, 'success'));

  return {
    output: {
      suggestedAmount,
      suggestedRate,
      justification: `Loan amount set to INR ${suggestedAmount.toLocaleString()} based on ${riskTier} risk rating, credit score of ${actualCredit}, and monthly savings capability. Recommended interest rate is ${suggestedRate.toFixed(2)}%.`,
    },
    logs,
  };
};
