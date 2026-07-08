# IDBI Lending Orchestration Control Panel (ISLO-AI)
> **"We are not building another loan dashboard. We are building the AI Operating System that enables IDBI Bank to predict, orchestrate, and optimize lending decisions with explainable AI."**

This repository contains the **IDBI Smart Loan Orchestrator AI (ISLO-AI)**, a multi-agent decision intelligence platform built for retail, MSME, and corporate banking lending pipelines. It replaces static, fragmented loan approvals with a dynamic, policy-driven workflow coordinator that evaluates applications, scans statements for liabilities, compiles credit scores, and delivers complete, explainable decision reports (XAI).

---

## 🛠️ The Technology Stack
*   **Frontend**: React 19, TypeScript (Strict compiling)
*   **Styling**: Vanilla CSS + Tailwind CSS v4 (Sleek dark layout with micro-animations)
*   **Compilation & Server**: Vite 6.0
*   **Data & State Layer**: Standalone client-side JSON database persisted in browser `localStorage`
*   **Mock Verification PDFs**: Built-in script to compile valid PDF attachments for offline testing

---

## ⚙️ System Architecture
```
CUSTOMER PORTAL (Application submit & PDF upload)
        │
        ▼
COORDINATOR AGENT (ORCHESTRATOR) ➔ Evaluates profile against policy limits
        │
        ├── OCR Agent (Simulates income extraction)
        ├── Document Validation Agent (Flags compliance exceptions)
        ├── Salary Analysis Agent (Calculates monthly stability surplus)
        ├── Bank Statement Agent (Classifies active loans from transaction narrations)
        ├── Credit Assessment Agent (Simulates bureau credit API queries)
        ├── Employer Verification Agent (Checks corporate directories)
        ├── Eligibility Agent (Salary-based maximum multiplier check)
        ├── Risk Assessment Agent (Computes aggregate risk tier)
        └── Loan Recommendation Agent (Generates optimal APR & final limits)
        │
        ▼
DECISION ENGINE (Auto-Approve / Manual Review HOLD / Auto-Reject)
        │
        ▼
MANAGER DESK (Human-in-the-Loop review, limit overrides & notes signing)
```

---

## 🌟 Key Features
1.  **AI Lending Copilot**: Instantly flags inconsistencies and verifies document uploads in real-time.
2.  **Lending Digital Twin (AI Pipeline view)**: Provides a visual execution node graph showing SLA speeds, log lines, and analytical inspector blocks for every running agent.
3.  **Statement Transaction Mining**: The Bank Statement Agent scans transaction narrations to automatically isolate active loan EMIs (e.g. matching `ACH_DEBIT_BAJAJ_FIN_PL_EMI_9918` ➔ Active Personal Loan).
4.  **Explainable AI (XAI)**: Generates human-readable rationales explaining the exact calculations and credit boundaries checked.
5.  **Manager HITL Desk**: Allows credit managers to override recommended loan parameters and enter audit sign-off comments.
6.  **Interactive Pitch Deck**: Built-in 10-slide presentation deck tab directly in the dashboard header for seamless pitches.

---

## 🧪 Simulated Testing Walkthroughs
The database is pre-seeded with four diverse profiles:
1.  **Auto-Approval (APP_1001 - Rajesh Kumar)**: High salary, prime credit score (785), MNC employment ➜ Auto-approved instantly.
2.  **Manager Desk Escaped (APP_1002 - Priya Sharma)**: Prime credit but requested amount exceeds the auto limit threshold (1.8M) ➜ Placed on HOLD. Go to **Manager Desk** to override limits/rates.
3.  **Auto-Rejection (APP_1003 - Amit Patel)**: Low credit score (560), self-employed ➜ Auto-rejected (CIBIL score below 600 limit).
4.  **Compliance Hold (APP_1004 - Sonal Sen)**: Missing required Form-16 tax declaration ➜ Compliance verification fails, auto-rejected.

---

## 🚀 Running Locally

### 1. Installation
Clone the repository, navigate to the folder, and install dependencies:
```bash
npm install
```

### 2. Generate Testing PDFs
Compile the mock PDF documents (Salary Slip & Bank Statements) locally:
```bash
node scratch/generate_pdfs.cjs
```
This generates openable, lightweight PDF documents inside `public/documents/` for each application.

### 3. Start Development Server
Run the local dev environment:
```bash
npm run dev
```
Open **[http://localhost:5174/](http://localhost:5174/)** in your browser.

---

## 📋 Hackathon Deliverables
*   **Roadmap Reference**: Open **[http://localhost:5174/project.md.html](http://localhost:5174/project.md.html)** to review the timeline deliverables (June 10 to August 21 Grand Finale).
*   **Presentation Deck Outline**: Access [submission_deck.md](submission_deck.md) in the project root for the 10-slide ppt structure.
