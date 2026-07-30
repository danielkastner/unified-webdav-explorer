import React, { useState, useEffect } from 'react';
import { X, Monitor, Download, Terminal, Check, Copy, Laptop, Cpu, ShieldCheck, Play, Folder, Sparkles } from 'lucide-react';

interface ElectronGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElectronGuideModal: React.FC<ElectronGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'packaging' | 'native'>('quickstart');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [electronInfo, setElectronInfo] = useState<{
    isElectron: boolean;
    platform: string;
    version: string;
    electronVersion: string;
  } | null>(null);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getElectronInfo().then(setElectronInfo).catch(() => {});
    }
  }, []);

  if (!isOpen) return null;

  const handleCopy = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const isRunningInElectron = !!window.electronAPI || electronInfo?.isElectron;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#1C1B1F] border border-[#49454F] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#E6E1E5]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#2B2930] border-b border-[#49454F] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#381E72] border border-[#D0BCFF]/30 text-[#D0BCFF]">
              <Monitor className="w-5 h-5 text-[#D0BCFF]" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#E6E1E5] flex items-center space-x-2">
                <span>Electron Desktop App Setup</span>
                {isRunningInElectron ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Active in Electron</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#49454F] text-[#D0BCFF] border border-[#D0BCFF]/30">
                    Browser Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#CAC4D0]">Run Unified WebDAV Explorer natively on macOS, Windows, or Linux</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#3B383E] text-[#CAC4D0] hover:text-[#E6E1E5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 px-6 pt-3 bg-[#25232A] border-b border-[#49454F]">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-xl text-xs font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'quickstart'
                ? 'border-[#D0BCFF] text-[#D0BCFF] bg-[#1C1B1F]'
                : 'border-transparent text-[#CAC4D0] hover:text-[#E6E1E5]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>1-Click Launch Commands</span>
          </button>
          
          <button
            onClick={() => setActiveTab('packaging')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-xl text-xs font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'packaging'
                ? 'border-[#D0BCFF] text-[#D0BCFF] bg-[#1C1B1F]'
                : 'border-transparent text-[#CAC4D0] hover:text-[#E6E1E5]'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Build Executable (.exe / .dmg)</span>
          </button>

          <button
            onClick={() => setActiveTab('native')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-xl text-xs font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'native'
                ? 'border-[#D0BCFF] text-[#D0BCFF] bg-[#1C1B1F]'
                : 'border-transparent text-[#CAC4D0] hover:text-[#E6E1E5]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Native Desktop Features</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs leading-relaxed">
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#2B2930] border border-[#49454F] space-y-2">
                <div className="flex items-center space-x-2 text-[#D0BCFF] font-semibold">
                  <Play className="w-4 h-4" />
                  <span>How to Launch Locally with Electron</span>
                </div>
                <p className="text-[#CAC4D0]">
                  Follow these 3 simple steps to download the project source and start it inside your local desktop Electron window:
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[#E6E1E5] font-semibold">
                  <span>Step 1: Export/Download Code & Install Dependencies</span>
                  <span className="text-[10px] text-[#CAC4D0]">In terminal inside project folder</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#141318] border border-[#49454F] font-mono text-[11px] text-[#D0BCFF]">
                  <code>npm install</code>
                  <button
                    onClick={() => handleCopy('npm install', 'step1')}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#2B2930] hover:bg-[#3B383E] text-[#E6E1E5] cursor-pointer"
                  >
                    {copiedCmd === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd === 'step1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[#E6E1E5] font-semibold">
                  <span>Step 2: Run Electron Desktop App (Dev Mode)</span>
                  <span className="text-[10px] text-[#CAC4D0]">Spawns Express + Vite + Electron window</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#141318] border border-[#49454F] font-mono text-[11px] text-[#D0BCFF]">
                  <code>npm run electron:dev</code>
                  <button
                    onClick={() => handleCopy('npm run electron:dev', 'step2')}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#2B2930] hover:bg-[#3B383E] text-[#E6E1E5] cursor-pointer"
                  >
                    {copiedCmd === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd === 'step2' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[#E6E1E5] font-semibold">
                  <span>Step 3: Direct Launch (If server is already running)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#141318] border border-[#49454F] font-mono text-[11px] text-[#D0BCFF]">
                  <code>npx electron .</code>
                  <button
                    onClick={() => handleCopy('npx electron .', 'step3')}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#2B2930] hover:bg-[#3B383E] text-[#E6E1E5] cursor-pointer"
                  >
                    {copiedCmd === 'step3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd === 'step3' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#381E72]/40 border border-[#D0BCFF]/30 text-[#EADDFF]">
                <p className="flex items-center space-x-1.5 font-semibold text-xs text-[#D0BCFF]">
                  <Sparkles className="w-4 h-4 text-[#D0BCFF]" />
                  <span>Pro-Tip for Local Desktop</span>
                </p>
                <p className="text-[11px] mt-1 text-[#CAC4D0]">
                  When running locally, Electron seamlessly binds native file dialogs, hardware window controls, and direct high-speed WebDAV socket connections directly to your OS!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'packaging' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#2B2930] border border-[#49454F] space-y-2">
                <div className="flex items-center space-x-2 text-[#D0BCFF] font-semibold">
                  <Laptop className="w-4 h-4" />
                  <span>Packaging Standalone Installers</span>
                </div>
                <p className="text-[#CAC4D0]">
                  We have pre-configured <code className="text-[#D0BCFF]">electron-builder</code> in <code className="text-[#D0BCFF]">package.json</code>. You can generate production binary installers for your operating system:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#25232A] border border-[#49454F] space-y-2">
                  <span className="font-semibold text-[#E6E1E5] block">Windows (.exe / NSIS)</span>
                  <div className="flex items-center justify-between bg-[#141318] p-2 rounded-lg font-mono text-[11px] text-[#D0BCFF]">
                    <code>npm run electron:dist -- --win</code>
                    <button
                      onClick={() => handleCopy('npm run electron:dist -- --win', 'win')}
                      className="p-1 hover:bg-[#3B383E] rounded text-[#E6E1E5]"
                    >
                      {copiedCmd === 'win' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#25232A] border border-[#49454F] space-y-2">
                  <span className="font-semibold text-[#E6E1E5] block">macOS (.dmg / .app)</span>
                  <div className="flex items-center justify-between bg-[#141318] p-2 rounded-lg font-mono text-[11px] text-[#D0BCFF]">
                    <code>npm run electron:dist -- --mac</code>
                    <button
                      onClick={() => handleCopy('npm run electron:dist -- --mac', 'mac')}
                      className="p-1 hover:bg-[#3B383E] rounded text-[#E6E1E5]"
                    >
                      {copiedCmd === 'mac' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#25232A] border border-[#49454F] space-y-2 md:col-span-2">
                  <span className="font-semibold text-[#E6E1E5] block">Linux (.AppImage / .deb)</span>
                  <div className="flex items-center justify-between bg-[#141318] p-2 rounded-lg font-mono text-[11px] text-[#D0BCFF]">
                    <code>npm run electron:dist -- --linux</code>
                    <button
                      onClick={() => handleCopy('npm run electron:dist -- --linux', 'linux')}
                      className="p-1 hover:bg-[#3B383E] rounded text-[#E6E1E5]"
                    >
                      {copiedCmd === 'linux' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'native' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#2B2930] border border-[#49454F] space-y-3">
                <div className="flex items-center space-x-2 text-[#D0BCFF] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#D0BCFF]" />
                  <span>Native Inter-Process Communication (IPC) Integration</span>
                </div>
                <p className="text-[#CAC4D0]">
                  The app automatically detects whether it's running in a Web Browser or inside Electron via secure preload bindings (<code className="text-[#D0BCFF]">window.electronAPI</code>).
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#25232A] border border-[#49454F]">
                  <Folder className="w-4 h-4 text-[#D0BCFF] mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-semibold text-[#E6E1E5]">Native Folder Selection</h5>
                    <p className="text-[11px] text-[#CAC4D0]">Uses native OS folder selection dialogs when choosing download/backup directories.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#25232A] border border-[#49454F]">
                  <Monitor className="w-4 h-4 text-[#D0BCFF] mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-semibold text-[#E6E1E5]">Frameless Hardware Controls</h5>
                    <p className="text-[11px] text-[#CAC4D0]">Minimize, maximize, restore, and close hardware window triggers in the title bar.</p>
                  </div>
                </div>

                {isRunningInElectron && electronInfo && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-1">
                    <p className="font-semibold text-xs text-emerald-300">Environment Diagnostics:</p>
                    <p className="text-[11px]">Platform: {electronInfo.platform} | Electron: v{electronInfo.electronVersion}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#2B2930] border-t border-[#49454F] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-[#CAC4D0]">
            <Monitor className="w-4 h-4 text-[#D0BCFF]" />
            <span>Electron integration configured & ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#D0BCFF] hover:bg-[#e0d0ff] text-[#381E72] font-semibold transition-colors cursor-pointer text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
