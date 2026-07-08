# IDBI Innovate Hackathon: Prototype Submission Deck
**Project: IDBI Lending Orchestration Control Panel (ISLO-AI)**  
*The AI Operating System for Intelligent Lending*

---

## Slide 1: Title Slide & Core Pitch
* **Title**: IDBI Lending Orchestration Control Panel (ISLO-AI)
* **Subtitle**: The AI Operating System for Intelligent Lending
* **One-Line Pitch**: 
  > *"We are not building another loan dashboard. We are building the AI Operating System that enables IDBI Bank to predict, orchestrate, and optimize lending decisions with explainable AI."*
* **Team Name**: Team OrchAI / Smart Orchestrators
* **Visual Concept**: Central glowing bank logo connecting dynamic multi-agent system nodes with real-time state changes.

---

## Slide 2: The Business Problem
* **Headline**: Fragmented Processes & Invisible Bottlenecks
* **Key Challenges**:
  * **System Fragmentation**: Relationship Managers, Credit Officers, Risk Analysts, Operations Teams, and Branch Managers work on disconnected legacy terminals.
  * **Opaque Progress**: RMs chase credit officers for file status, while customers experience delayed approval times.
  * **Manual Statements Audit**: Analyzing bank logs for hidden loans (existing EMIs) is a slow, error-prone manual process.
* **Speaker Notes**: *Focus on how loan volume growth across retail and MSME banking compounds this workflow friction, resulting in SLA breaches and lost business.*

---

## Slide 3: Our Solution
* **Headline**: The AI-Powered Lending Digital Twin
* **Core Value**:
  * **Unified Intelligence Layer**: Sits above core banking nodes to unify people, policy, and data.
  * **Workflow Orchestration**: A central Coordinator Agent automatically parses applicant profiles and builds custom multi-agent routing paths.
  * **Explainable AI (XAI)**: Generates human-readable rationales for every auto-approval, hold, or rejection.
* **Speaker Notes**: *We transform fragmented lending into a transparent, policy-driven decision ecosystem.*

---

## Slide 4: High-Level System Architecture
* **Headline**: The Multi-Agent Pipeline
* **Flow Diagram**:
  ```
  [Customer Portal / RM Upload] ➔ Ingestion & Document Check (KYC & Salary Slip)
                                         │
                                         ▼
  [Coordinator Orchestrator] ➔ Builds Custom Pipeline Node Route (Policy Config)
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          ▼                              ▼                              ▼
  [Bank Statement Agent]       [Credit Assessment Agent]     [Risk Aggregator Agent]
   Scans transaction codes      Queries simulated bureau      Computes aggregate score
   for outstanding EMIs.        credit score parameters.      and flags risk tier.
          └──────────────────────────────┬──────────────────────────────┘
                                         │
                                         ▼
  [Decision Engine] ➔ Auto-Approve (CIBIL ≥750) / Manual HOLD / Auto-Reject (<600)
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
         [Auto-Disbursed]       [Senior Manager Desk]      [XAI Auto-Rejected]
         Direct approval        Human-in-the-Loop          Opacities explained
                                rates/limits override      with clear reasons
  ```
* **Speaker Notes**: *Highlight the client-side localStorage database tracking current state snapshots, log sheets, and configuration tables.*

---

## Slide 5: Core Innovation - Narration Matching & Verification
* **Headline**: Intelligent Transaction Scrutiny
* **Bullet Points**:
  * **Narration Scanning**: The Bank Statement Agent scans direct-debit keywords to isolate existing loans:
    * `ACH_DEBIT_BAJAJ_FIN_PL_EMI` ➜ Classified as **Personal Loan Liability**
    * `SI_DEBIT_IDBI_HOME_LOAN_EMI` ➜ Classified as **Home Loan Liability**
    * `ECS_DEBIT_HDFC_AUTO_LN_EMI` ➜ Classified as **Auto Loan Liability**
  * **Debt Service Ratio (DSCR)**: Dynamically sums identified EMI values to assess true repayment capability against verified income.
* **Speaker Notes**: *By scanning transaction history tags, the agent predicts financial stability and flags low-balance trends.*

---

## Slide 6: Implemented Prototype Scenarios
* **Headline**: Real-Time Simulated Walkthroughs
* **Scenarios**:
  * **APP_1001 (Rajesh Kumar)**: Car Loan • CIBIL 785 • High MNC income ➜ **Auto-Approved** based on policy rules.
  * **APP_1002 (Priya Sharma)**: Home Loan • CIBIL 710 • Requested 1.8M ➜ **HOLD (Manager Review)**. Routed to Manager Desk for limit/rate override.
  * **APP_1003 (Amit Patel)**: Personal Loan • CIBIL 560 • Self-Employed ➜ **Auto-Rejected** (Below 600 CIBIL threshold).
  * **APP_1004 (Sonal Sen)**: Education Loan • CIBIL 760 ➜ **Compliance Rejection** due to missing Form-16 income proof.
* **Speaker Notes**: *Highlight how easily users can test these flows by uploading the generated mock files (test_salary_slip.pdf / test_bank_statement.pdf).*

---

## Slide 7: Integrated UI Prototype Screens
* **Headline**: Unified Stakeholder Views
* **Screens Implemented**:
  * **Customer Portal**: For application submission and upload progress.
  * **Lending Digital Twin (AI Pipeline Hub)**: Visually maps nodes running, progress SLAs, speed dials, and terminal outputs.
  * **Executive Command Center**: Monitors total loans, approval ratios, and outstanding pending queues.
  * **Senior Manager Desk (HITL)**: For explainable AI audits, risk aggregation overrides, and manager notes.
  * **Database Explorer**: For direct local storage JSON records inspection and live edits.
  * **Pitch Deck**: Built-in interactive presentation slide player to present slides directly from the control panel.
* **Speaker Notes**: *The dashboard adapts dynamically to give RMs, credit officers, and branch managers total real-time alignment.*

---

## Slide 8: The Technology Stack
* **Headline**: Modern, Lightweight & Highly Portable
* **Tech Specifications**:
  * **Frontend Library**: React 19 & TypeScript (Strict compiler flags).
  * **Styles Engine**: Tailwind CSS v4 (CSS-first import compiling).
  * **Bundler & Server**: Vite 6.0 (Built cleanly for static browser rendering).
  * **State & DB Persistence**: Client-side JSON tables in browser `localStorage`.
  * **Utilities**: Custom document utility script (`scratch/generate_pdfs.js`) to generate test PDF documents.
* **Speaker Notes**: *Our prototype builds into static web assets that run directly inside any browser sandbox, requiring zero heavy server setup for testing.*

---

## Slide 9: Expected Business Impact & ROI
* **Headline**: SLA Compression & Cost Savings
* **Metrics**:
  * **Processing Turnaround (SLA)**: Reduced from **3 to 7 Days** down to **Under 5 Minutes**.
  * **Operational Savings**: Automation of statement audits reduces credit desk processing costs.
  * **Portfolio Health**: Absolute enforcement of CIBIL and salary policy thresholds reduces bad loan leakage.
  * **Transparency**: Automated XAI reports eliminate customer support follow-ups.
* **Speaker Notes**: *Explain how predicting delays and presenting next-best-actions speeds up operational throughput by over 90%.*

---

## Slide 10: Future Roadmap
* **Headline**: Scaling to Production
* **Next Phases**:
  * **Sandbox API Integration**: Connect to IDBI Bank Core Banking Sandbox and Bureau APIs.
  * **Client-Side OCR Enhancement**: Integrate Tesseract.js / PDF.js to parse real customer documents locally.
  * **Predictive Delay Engine**: Train a classification model to forecast pipeline SLA breaches based on manager queue volumes.
  * **What-If Simulator**: Allow risk officers to simulate changing macro APR interest margins and visually track portfolio volume impacts.

---
**Thank You!**  
*Team: Smart Orchestrators*  
*Repository: https://github.com/your-username/idbi-smart-loan-orchestrator-ai*
