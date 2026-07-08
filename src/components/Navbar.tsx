import { Users, Settings, Database, Activity, FileCheck, Landmark, Presentation } from 'lucide-react';
import type { LoanApplication } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  applications: LoanApplication[];
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, applications }) => {
  const pendingCount = applications.filter((app) => app.status === 'UNDER_REVIEW').length;
  const approvedCount = applications.filter((app) => app.status === 'APPROVED').length;
  const rejectedCount = applications.filter((app) => app.status === 'REJECTED').length;

  const navItems = [
    { id: 'customer', label: 'Customer Portal', icon: Users },
    { id: 'orchestrator', label: 'AI Orchestration Hub', icon: Activity },
    { id: 'manager', label: 'Manager Desk', icon: FileCheck, badge: pendingCount },
    { id: 'coordinator', label: 'Coordinator Config', icon: Settings },
    { id: 'database', label: 'Database Explorer', icon: Database },
    { id: 'deck', label: 'Pitch Deck', icon: Presentation },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('customer')}>
            <div className="bg-gradient-to-tr from-emerald-500 to-orange-500 p-2 rounded-lg shadow-inner flex items-center justify-center animate-pulse">
              <Landmark className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-orange-400 bg-clip-text text-transparent">
                ISLO-AI
              </span>
              <span className="hidden md:block text-[9px] text-slate-400 font-mono tracking-widest leading-none">
                IDBI SMART LOAN ORCHESTRATOR
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 shadow-sm border-b-2 border-emerald-500'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-orange-500 text-slate-900 rounded-full animate-bounce">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Stats Badges */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="bg-slate-950/80 px-2 py-1 md:px-3 md:py-1 rounded border border-slate-800/80 text-center">
              <div className="text-[10px] text-slate-500 font-medium">TOTAL</div>
              <div className="text-sm font-bold font-mono text-slate-300">{applications.length}</div>
            </div>
            <div className="bg-emerald-950/30 px-2 py-1 md:px-3 md:py-1 rounded border border-emerald-900/40 text-center">
              <div className="text-[10px] text-emerald-400 font-medium">APPROVED</div>
              <div className="text-sm font-bold font-mono text-emerald-400">{approvedCount}</div>
            </div>
            <div className="bg-orange-950/30 px-2 py-1 md:px-3 md:py-1 rounded border border-orange-900/40 text-center">
              <div className="text-[10px] text-orange-400 font-medium">PENDING</div>
              <div className="text-sm font-bold font-mono text-orange-400">{pendingCount}</div>
            </div>
            <div className="bg-rose-950/30 px-2 py-1 md:px-3 md:py-1 rounded border border-rose-900/40 text-center">
              <div className="text-[10px] text-rose-400 font-medium">REJECTED</div>
              <div className="text-sm font-bold font-mono text-rose-400">{rejectedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Tabs (Bottom / Horizontal Scroll for responsiveness) */}
      <div className="lg:hidden bg-slate-950 border-t border-slate-800 py-1 overflow-x-auto flex justify-around whitespace-nowrap scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center px-3 py-1 text-[11px] font-medium transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className="h-4 w-4 mb-0.5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 text-[8px] font-bold bg-orange-500 text-slate-900 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
