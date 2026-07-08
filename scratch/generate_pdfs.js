import fs from 'fs';
import path from 'path';

const DOCUMENTS_DIR = path.join('public', 'documents');

if (!fs.existsSync(DOCUMENTS_DIR)) {
  fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
}

// Function to generate a simple valid PDF containing text
const generateSimplePDF = (filePath, contentLines) => {
  const textStream = contentLines
    .map((line, idx) => {
      // Offset each line vertically
      const yPos = 700 - idx * 24;
      return `BT /F1 12 Tf 50 ${yPos} Td (${line}) Tj ET`;
    })
    .join('\n');

  const streamContent = `
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 595 842] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${textStream.length + 10} >>
stream
${textStream}
endstream
endobj
`;

  const header = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj`;

  const footer = `xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000300 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
400
%%EOF`;

  const pdfData = `${header}${streamContent}${footer}`;
  fs.writeFileSync(filePath, pdfData);
};

// Application Data list
const appData = [
  {
    id: 'APP_1001',
    name: 'Rajesh Kumar',
    salary: '85,000',
    employer: 'Infosys Limited (MNC)',
    declaredCibil: '785',
    purpose: 'Car Loan',
    bankNotes: [
      'IDBI Savings Account: 90081109282',
      'Balance Trend: UP (Steady Savings)',
      'No recurring EMI debits identified.',
      'Active Salary Credits: INR 85,000'
    ]
  },
  {
    id: 'APP_1002',
    name: 'Priya Sharma',
    salary: '1,10,000',
    employer: 'AeroSpace Design Pvt Ltd',
    declaredCibil: '710',
    purpose: 'Home Loan',
    bankNotes: [
      'SBI Savings Account: 1109282291',
      'Narration Match: SI_DEBIT_IDBI_HOME_LOAN_EMI_2209 (INR 28,000)',
      'Total EMI Debits Identified: INR 28,000/mo',
      'Balance Trend: STABLE'
    ]
  },
  {
    id: 'APP_1003',
    name: 'Amit Patel',
    salary: '60,000',
    employer: 'Patel Provisions Stores',
    declaredCibil: '560',
    purpose: 'Personal Loan',
    bankNotes: [
      'ICICI Business Current A/C: 881299102',
      'Narration Match: ACH_DEBIT_BAJAJ_FIN_PL_EMI_9918 (INR 8,400)',
      'Narration Match: ECS_DEBIT_HDFC_AUTO_LN_EMI_0091 (INR 12,500)',
      'Total EMI Debits Identified: INR 20,900/mo',
      'Balance Trend: DOWN (High volatility)'
    ]
  },
  {
    id: 'APP_1004',
    name: 'Sonal Sen',
    salary: '72,000',
    employer: 'Wipro Technologies (MNC)',
    declaredCibil: '760',
    purpose: 'Education Loan',
    bankNotes: [
      'Axis Savings Account: 339102837',
      'Balance Trend: UP',
      'No recurring EMI debits found.',
      'Document Alert: Missing Form-16 Income Proof'
    ]
  }
];

// Generate files for each application
appData.forEach((app) => {
  const salarySlipPath = path.join(DOCUMENTS_DIR, `${app.id}_salary_slip.pdf`);
  const bankStatementPath = path.join(DOCUMENTS_DIR, `${app.id}_bank_statement.pdf`);

  // 1. Generate Salary Slip PDF
  generateSimplePDF(salarySlipPath, [
    `IDBI SMART LOAN ORCHESTRATOR AI - VERIFIED SALARY DOCUMENT`,
    `=========================================================`,
    `Application Reference ID : ${app.id}`,
    `Employee Full Name       : ${app.name}`,
    `Verified Organization    : ${app.employer}`,
    `Declared Gross Salary    : INR ${app.salary} / month`,
    `Declared CIBIL Score     : ${app.declaredCibil}`,
    `Purpose of Credit        : ${app.purpose}`,
    `=========================================================`,
    `Document Metadata: Digital Signature Valid. Character Confidence: 98.4%`
  ]);

  // 2. Generate Bank Statement PDF
  generateSimplePDF(bankStatementPath, [
    `IDBI SMART LOAN ORCHESTRATOR AI - BANK TRANS HISTORY AUDIT`,
    `=========================================================`,
    `Application Reference ID : ${app.id}`,
    `Account Holder Name      : ${app.name}`,
    ...app.bankNotes,
    `=========================================================`,
    `Document Metadata: Transaction Log parsing check COMPLETE.`
  ]);

  console.log(`Generated sample documents for ${app.id}:`);
  console.log(`  - ${salarySlipPath}`);
  console.log(`  - ${bankStatementPath}`);
});

// 3. Generate generic test document files for manual uploads
const testSalaryPath = path.join(DOCUMENTS_DIR, 'test_salary_slip.pdf');
const testBankPath = path.join(DOCUMENTS_DIR, 'test_bank_statement.pdf');

generateSimplePDF(testSalaryPath, [
  `IDBI SMART LOAN ORCHESTRATOR AI - VERIFIED SALARY DOCUMENT`,
  `=========================================================`,
  `Application Reference ID : TEST_APP_CREDIT`,
  `Employee Full Name       : Test Applicant (Prime Profile)`,
  `Verified Organization    : Tata Consultancy Services (MNC)`,
  `Declared Gross Salary    : INR 150,000 / month`,
  `Declared CIBIL Score     : 810`,
  `Purpose of Credit        : Home Loan (Testing Auto-Approve)`,
  `=========================================================`,
  `Document Metadata: Digital Signature Valid. Character Confidence: 99.1%`
]);

generateSimplePDF(testBankPath, [
  `IDBI SMART LOAN ORCHESTRATOR AI - BANK TRANS HISTORY AUDIT`,
  `=========================================================`,
  `Application Reference ID : TEST_APP_CREDIT`,
  `Account Holder Name      : Test Applicant (Prime Profile)`,
  `SBI Savings Account      : 1234567890`,
  `Balance Trend            : UP (Highly liquid cash flow)`,
  `Active Salary Credits    : INR 150,000 (TCS Net Credit)`,
  `No active recurring loan EMI direct debits found.`,
  `=========================================================`,
  `Document Metadata: Transaction Log parsing check COMPLETE.`
]);

console.log(`Generated generic test documents:`);
console.log(`  - ${testSalaryPath}`);
console.log(`  - ${testBankPath}`);

console.log('Document generation process finished.');
