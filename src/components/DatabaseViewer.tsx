import { useState, useEffect } from 'react';
import { Database, Trash2, Save, Sparkles, Code } from 'lucide-react';
import type { LoanApplication, PolicyConfig } from '../types';

interface DatabaseViewerProps {
  applications: LoanApplication[];
  policy: PolicyConfig;
  onUpdateDatabase: (apps: LoanApplication[], policy: PolicyConfig) => void;
  onSeedDatabase: () => void;
}

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({
  applications,
  policy,
  onUpdateDatabase,
  onSeedDatabase,
}) => {
  const [dbKey, setDbKey] = useState<'applications' | 'policies'>('applications');
  const [jsonText, setJsonText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);

  // Sync state with props
  useEffect(() => {
    if (!editMode) {
      if (dbKey === 'applications') {
        setJsonText(JSON.stringify(applications, null, 2));
      } else {
        setJsonText(JSON.stringify(policy, null, 2));
      }
      setFormatError(null);
    }
  }, [applications, policy, dbKey, editMode]);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the entire local database? This resets all application logs and entries.')) {
      onUpdateDatabase([], policy);
      alert('Database cleared.');
    }
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (dbKey === 'applications') {
        if (!Array.isArray(parsed)) {
          throw new Error('Applications database must be an array of objects.');
        }
        onUpdateDatabase(parsed as LoanApplication[], policy);
      } else {
        onUpdateDatabase(applications, parsed as PolicyConfig);
      }
      setEditMode(false);
      setFormatError(null);
      alert('Database saved successfully!');
    } catch (err: any) {
      setFormatError(err.message || 'Invalid JSON syntax');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md rounded-xl p-5 border border-slate-800/80 shadow-lg flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Database className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Database Explorer</h2>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Database Table
            </label>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => { setDbKey('applications'); setEditMode(false); }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  dbKey === 'applications'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                Applications Table ({applications.length} records)
              </button>
              <button
                onClick={() => { setDbKey('policies'); setEditMode(false); }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  dbKey === 'policies'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700/50'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                System Policies Config
              </button>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-300 block">DB Target Information:</span>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              Key: {dbKey === 'applications' ? 'islo_applications' : 'islo_policy'}<br />
              Storage: browser.localStorage<br />
              Encryption: None (Plaintext JSON)
            </p>
          </div>
        </div>

        {/* Database Action Buttons */}
        <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
          <button
            onClick={onSeedDatabase}
            className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 hover:from-emerald-500 hover:to-teal-500 hover:text-slate-950 font-bold py-2 rounded-lg text-xs transition-all active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Seed Demo Applications</span>
          </button>

          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center space-x-1.5 bg-rose-950/20 border border-rose-900/30 text-rose-400 hover:bg-rose-500 hover:text-slate-950 font-bold py-2 rounded-lg text-xs transition-all active:scale-[0.98]"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset Local Database</span>
          </button>
        </div>
      </div>

      {/* Code Editor Window */}
      <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-md flex flex-col h-[500px]">
        {/* Terminal Header */}
        <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Code className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              {dbKey === 'applications' ? 'Applications_DB_Schema.json' : 'Policies_Config.json'}
            </span>
          </div>

          <div className="flex space-x-2">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="text-[10px] font-bold py-1 px-3 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-[10px] font-bold py-1 px-3 rounded bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center space-x-1"
                >
                  <Save className="h-3 w-3" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="text-[10px] font-bold py-1 px-3 rounded bg-slate-800 text-emerald-400 border border-slate-700/60 hover:bg-slate-700/60"
              >
                Edit JSON Code
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex-1 relative flex flex-col">
          <textarea
            readOnly={!editMode}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="flex-1 w-full bg-slate-950 border-0 p-4 font-mono text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none resize-none scrollbar-thin"
          />

          {formatError && (
            <div className="absolute bottom-0 left-0 right-0 bg-rose-950/80 border-t border-rose-800 p-2.5 text-rose-300 font-mono text-[10px] flex items-start space-x-2">
              <Trash2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span><b>Syntax Error:</b> {formatError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
