import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Presentation, Cpu, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

interface Slide {
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  visuals?: string;
  speakerNotes?: string;
}

export const PitchDeck: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const slides: Slide[] = [
    {
      title: "IDBI Lending Orchestration Control Panel (ISLO-AI)",
      subtitle: "The AI Operating System for Intelligent Lending",
      bulletPoints: [
        "Dynamic workflow coordinator sits above legacy core banking terminals.",
        "Integrates multi-agent automated validation engines.",
        "Delivers complete, explainable decision rationales for compliance.",
        "Empowers Relationship Managers, Branch Executives, and Risk Officers."
      ],
      speakerNotes: "We are not building another loan dashboard. We are building the AI Operating System that enables IDBI Bank to predict, orchestrate, and optimize lending decisions with explainable AI."
    },
    {
      title: "The Core Problem: Fragmented Lending",
      subtitle: "Legacy Process Sinks Efficiency",
      bulletPoints: [
        "Departmental Silos: RMs, Credit Officers, and Branch Managers work across disconnected systems.",
        "Manual Statement Verification: Auditing bank files for recurring EMI liabilities wastes hours.",
        "Black-Box Rejections: opaque validation leaves customers and agents in the dark.",
        "Compliance Leakage: Missing files (e.g. Form-16) are discovered late in processing paths."
      ],
      speakerNotes: "As loan volumes increase across retail, MSME, and corporate banking, linear workflows cause massive SLA queues."
    },
    {
      title: "Our Solution: Decision Intelligence Twin",
      subtitle: "Unifying Process, Policies, and Performance",
      bulletPoints: [
        "Intelligent Middleware: Combines AI routing orchestration with human-in-the-loop controls.",
        "Dynamic Inception: coordinator parses application profiles to construct custom pipelines.",
        "Explainable AI: Every decision (approvals & rejections) is fully justified with rationales.",
        "Real-Time Trackability: live tracking states eliminate manual check-ins."
      ],
      speakerNotes: "Transforms linear pipelines into a reactive decision engine, enforcing policy boundaries consistently."
    },
    {
      title: "System Architecture Flow",
      subtitle: "Dynamic Multi-Agent Verification Map",
      visuals: "architecture",
      bulletPoints: [
        "Ingestion Node: Accepts files (Salary Slip & Bank Statements) with loading upload states.",
        "Coordinator Engine: Constructs node checklist (OCR, Statement check, Credit check, Eligibility).",
        "Decision Dispatch: Triggers Auto-Approved (CIBIL >= 750) or Manual HITL overrides.",
        "Data Layer: Persisted client-side snapshots in localStorage JSON tables."
      ],
      speakerNotes: "The coordinator dynamic state machine automatically skips optional verification steps for prime applicants to speed up SLAs."
    },
    {
      title: "Core Innovation: Narration Scanning",
      subtitle: "Automated Transaction Audits",
      bulletPoints: [
        "NAR-Match: Scans monthly direct-debit strings for outstanding liabilities.",
        "ACH_DEBIT_BAJAJ_FIN_PL_EMI ➜ Classifies active Personal Loan.",
        "SI_DEBIT_IDBI_HOME_LOAN_EMI ➜ Classifies active Home Loan.",
        "ECS_DEBIT_HDFC_AUTO_LN_EMI ➜ Classifies active Auto Loan.",
        "Calculates exact monthly EMI debt coverage to predict repayment thresholds."
      ],
      speakerNotes: "By parsing narration triggers automatically, the Bank Statement agent determines true savings stability indices."
    },
    {
      title: "Live Prototype Walkthroughs",
      subtitle: "End-to-End Simulation Scenarios",
      bulletPoints: [
        "APP_1001 (Rajesh Kumar): High-earning MNC Car Loan with prime credit ➜ Auto-Approved.",
        "APP_1002 (Priya Sharma): Home Loan exceeding auto limit (1.8M) ➜ Escapes to Manager Desk.",
        "APP_1003 (Amit Patel): Self-Employed with sub-prime CIBIL score (560) ➜ Auto-Rejected.",
        "APP_1004 (Sonal Sen): MNC Education Loan missing Form-16 ➜ Compliance check rejected."
      ],
      speakerNotes: "Users can test these scenarios directly by uploading the pre-generated test documents on the portal."
    },
    {
      title: "Implemented Stakeholder Views",
      subtitle: "A Complete Visual Control Suite",
      bulletPoints: [
        "Customer Portal: Interactive upload areas for PDF statements with loaders.",
        "AI Orchestration Hub: Live timeline chart mapping active agent verification status.",
        "Senior Manager Desk: HITL interface showing CIBIL, volatility alerts, and rate overrides.",
        "Coordinator Policy Panel: Configuration boundaries for limits and multi-agent requirements.",
        "Database Explorer: Direct browser localStorage state table editor."
      ],
      speakerNotes: "Each stakeholder gets dedicated tools, ensuring complete organizational alignment."
    },
    {
      title: "The Technology Stack",
      subtitle: "Client-Side Portability and Performance",
      bulletPoints: [
        "React 19 & TypeScript: strict types mapping schema compliance.",
        "Tailwind CSS v4: compiled utilities for premium dark layouts.",
        "Vite 6: lightning-fast hot module reloading and build outputs.",
        "LocalStorage database: Client-first JSON files database with seed utilities.",
        "Mock PDF Utility: creates valid binary PDFs for offline uploads testing."
      ],
      speakerNotes: "Zero server installs are needed. The prototype compiles into a portable static website that can be deployed instantly."
    },
    {
      title: "Expected Business Impact",
      subtitle: "Quantitative Value for IDBI Bank",
      bulletPoints: [
        "95% SLA turnaround improvement (from days to under 5 minutes).",
        "Reduction in bad debt leakage through absolute policies checking.",
        "Operational cost savings by automating statement audit tasks.",
        "Customer satisfaction boost through clear Explainable AI justifications."
      ],
      speakerNotes: "Saves hours per application, prevents compliance failure, and optimizes relationship manager throughput."
    },
    {
      title: "Future Roadmap & Presentation Conclusion",
      subtitle: "Scaling Beyond the Sandbox",
      bulletPoints: [
        "Phase 1: Integrate with IDBI Core Banking Sandbox and Bureau API endpoints.",
        "Phase 2: Build Relationship Manager mobile applications using React Native.",
        "Phase 3: Enhance document validations with Tesseract.js client-side OCR.",
        "Phase 4: Incorporate local small language models for natural language data analytics queries."
      ],
      speakerNotes: "The IDBI Control Panel transforms fragmented workflows into an intelligent, explainable, and proactive ecosystem."
    }
  ];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const activeSlide = slides[currentSlideIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Slide Deck Container */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-10 shadow-xl backdrop-blur-md relative overflow-hidden min-h-[460px] flex flex-col justify-between">
        {/* Background Accent glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Info */}
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Presentation className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">IDBI INNOVATE SUBMISSION DECK</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700/60">
              Interactive Mode
            </span>
            <span className="text-xs font-mono text-slate-500">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>
        </div>

        {/* Slide Body */}
        <div className="flex-1 flex flex-col justify-center space-y-6 py-4">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {activeSlide.title}
            </h2>
            {activeSlide.subtitle && (
              <p className="text-xs font-semibold text-emerald-400 font-mono tracking-wide uppercase">
                {activeSlide.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Slide Content */}
            <div className="lg:col-span-8 space-y-4">
              <ul className="space-y-2.5">
                {activeSlide.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs md:text-[13px] text-slate-300 leading-relaxed">
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Column / Representation */}
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center min-h-[150px] text-center font-mono">
              {activeSlide.visuals === 'architecture' ? (
                <div className="space-y-1 text-left w-full text-[9px] text-emerald-400/90 leading-normal">
                  <div className="font-bold text-center border-b border-slate-900 pb-1 mb-2 text-white text-[10px]">AGENT PIPELINE</div>
                  <div className="flex items-center space-x-1"><Sparkles className="h-2.5 w-2.5 shrink-0" /> <span>Upload Portal Ingestion</span></div>
                  <div className="flex items-center space-x-1"><FileText className="h-2.5 w-2.5 shrink-0" /> <span>Compliance Verification</span></div>
                  <div className="flex items-center space-x-1"><Cpu className="h-2.5 w-2.5 shrink-0" /> <span>Narration scanning & CIBIL</span></div>
                  <div className="flex items-center space-x-1"><CheckCircle2 className="h-2.5 w-2.5 shrink-0" /> <span>Escalation / Disbursal</span></div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Cpu className="h-9 w-9 text-emerald-500/80 mx-auto animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-sans">ISLO-AI SYSTEM</span>
                  <span className="text-[8px] text-slate-600 block">IDBI Bank Operating System</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Presenter Notes */}
        <div className="mt-6 bg-slate-950/60 border border-slate-800/60 p-3 rounded-lg text-xs leading-relaxed text-slate-400">
          <span className="font-bold text-emerald-400 font-mono text-[9px] uppercase block mb-1">Speaker Brief / Presentation Guide:</span>
          <p className="italic font-sans">"{activeSlide.speakerNotes}"</p>
        </div>

        {/* Controls Bar */}
        <div className="flex justify-between items-center border-t border-slate-800/80 pt-5 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className={`flex items-center space-x-1 text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${
              currentSlideIndex === 0
                ? 'bg-slate-850 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          {/* Quick Timeline Dots */}
          <div className="hidden md:flex space-x-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlideIndex ? 'bg-emerald-400 w-4' : 'bg-slate-700 hover:bg-slate-605'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === slides.length - 1}
            className={`flex items-center space-x-1 text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${
              currentSlideIndex === slides.length - 1
                ? 'bg-slate-850 text-slate-600 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
            }`}
          >
            <span>Next Slide</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
