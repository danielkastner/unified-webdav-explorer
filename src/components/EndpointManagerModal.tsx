import React, { useState } from 'react';
import {
  X,
  Server,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Link,
  User,
  Key,
  HardDrive
} from 'lucide-react';
import { WebDavEndpoint, AuthType } from '../types';

interface EndpointManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoints: WebDavEndpoint[];
  onAddEndpoint: (endpoint: Omit<WebDavEndpoint, 'id'>) => void;
  onUpdateEndpoint: (id: string, updates: Partial<WebDavEndpoint>) => void;
  onDeleteEndpoint: (id: string) => void;
  onTestEndpoint: (endpoint: WebDavEndpoint) => Promise<{ success: boolean; message: string }>;
}

const PRESET_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
];

export const EndpointManagerModal: React.FC<EndpointManagerModalProps> = ({
  isOpen,
  onClose,
  endpoints,
  onAddEndpoint,
  onUpdateEndpoint,
  onDeleteEndpoint,
  onTestEndpoint,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState<AuthType>('basic');
  const [color, setColor] = useState('#3b82f6');

  if (!isOpen) return null;

  const handleTest = async (ep: WebDavEndpoint) => {
    setTestingId(ep.id);
    setTestResult(null);
    const res = await onTestEndpoint(ep);
    setTestingId(null);
    setTestResult({ id: ep.id, success: res.success, message: res.message });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    onAddEndpoint({
      name: name.trim(),
      url: url.trim(),
      username: username.trim(),
      password: password.trim(),
      authType,
      color,
      enabled: true,
      status: 'connected',
      storageUsed: 1200000000,
      storageTotal: 25000000000,
      lastSynced: new Date().toISOString(),
    });

    // Reset form
    setName('');
    setUrl('');
    setUsername('');
    setPassword('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                WebDAV Endpoint Connections
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage remote WebDAV servers merged into your unified file view.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Endpoints List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Configured Endpoints ({endpoints.length})
              </h4>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add WebDAV Server</span>
                </button>
              )}
            </div>

            {endpoints.map((ep) => (
              <div
                key={ep.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span
                    className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: ep.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {ep.name}
                      </h5>
                      {ep.isDemo && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 px-1.5 py-0.2 rounded-full font-medium">
                          Demo Server
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {ep.url}
                    </p>
                  </div>
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleTest(ep)}
                    disabled={testingId === ep.id}
                    className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${testingId === ep.id ? 'animate-spin' : ''}`} />
                    <span>Test</span>
                  </button>

                  <input
                    type="checkbox"
                    checked={ep.enabled}
                    onChange={() => onUpdateEndpoint(ep.id, { enabled: !ep.enabled })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                    title="Enable/Disable Endpoint in View"
                  />

                  {!ep.isDemo && (
                    <button
                      onClick={() => onDeleteEndpoint(ep.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-full cursor-pointer"
                      title="Delete Endpoint"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Test Feedback */}
                {testResult && testResult.id === ep.id && (
                  <div
                    className={`w-full mt-2 p-2 rounded-xl text-xs flex items-center space-x-2 ${
                      testResult.success
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300/40'
                        : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-300/40'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Endpoint Form */}
          {isAdding && (
            <form onSubmit={handleCreateSubmit} className="p-4 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-4">
              <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-200 flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add New WebDAV Server Endpoint</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Work Nextcloud Drive"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    WebDAV Server URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://dav.example.com/remote.php/dav/files/user/"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Password / Access Token
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1 text-xs">
                  Endpoint Badge Color
                </label>
                <div className="flex items-center space-x-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        color === c.value ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Save Endpoint
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/80 dark:bg-slate-850">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
