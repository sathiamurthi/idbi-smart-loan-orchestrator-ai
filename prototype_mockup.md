# IDBI Lending Orchestration Control Panel (ISLO-AI)
## Prototype Mockup Screen & Architectural Diagram

Here is the high-fidelity UI prototype screenshot and architectural diagram designed for your hackathon submission.

---

### 🎨 Prototype Dashboard Mockup (16:9 Screen)
This mockup represents the premium dark-mode decision intelligence interface. It utilizes a deep slate/midnight-blue background overlayed with subtle grids to reduce banker fatigue, highlighted by glowing status indicators (emerald green, teal, and amber) to emphasize pipeline progression.

![IDBI Control Panel Mockup UI](islo_dashboard_mockup.jpg)

---

### ⚙️ Multi-Agent Decision Workflow Diagram
The following diagram maps the precise data flow from the moment a customer uploads verification files in the portal to the final automated or manual sign-off decision.

```mermaid
graph TD
    classDef portal fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef coordinator fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff;
    classDef agent fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef action fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#fff;

    A["Customer Ingestion (Portal)"] -->|"Uploads PDF statements"| B("Coordinator Agent")
    B -->|"Builds custom pipeline"| C("OCR Agent (Extracts Income)")
    C --> D("Document Validator (KYC check)")
    D --> E("Salary Analyzer (Stability surplus)")
    E --> F("Bank Statement Agent (EMI check)")
    F --> G("Credit Bureau Simulator (CIBIL check)")
    G --> H("Employer Verifier (Tier check)")
    H --> I("Eligibility Agent (Multiplier check)")
    I --> J("Risk Assessment Agent (Risk scoring)")
    J --> K("Loan Advisor (APR recommendation)")
    
    K --> L{"Decision Engine"}
    L -->|"CIBIL >= 750 & Amount <= 1M"| M["Auto-Approved Disbursal"]
    L -->|"CIBIL < 600 or Missing Documents"| N["Auto-Rejected (XAI explanation)"]
    L -->|"Exceeds thresholds"| O["Manager Review HOLD (HITL override)"]

    class A portal;
    class B coordinator;
    class C,D,E,F,G,H,I,J,K agent;
    class L,M,N,O action;
```

---

### 🔍 Background & Vibe Critique
*   **The Theme**: The dark-slate gradient (`from-slate-950 via-slate-900 to-slate-950`) combined with emerald green accents provides a highly premium "tech-first" banking aesthetic. It mimics modern trading terminals rather than old-fashioned white dashboard templates.
*   **The Grid Overlay**: The clean grid borders (`border-slate-800`) are light enough to separate widgets without creating clutter.
*   **Recommendation**: The current background color hierarchy is excellent. We recommend keeping the deep slate background as it makes the glowing timeline nodes (in progress, completed, failed) pop visually, guiding the viewer's eye straight to the decision path.
