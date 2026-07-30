import React from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Copy,
  Download,
  Trash2,
  RefreshCw,
  Info
} from 'lucide-react';
import { WebDavFile } from '../types';
import { formatBytes, formatDate, formatMediaInfo } from '../lib/webdavEngine';

interface DuplicateInspectorModalProps {
  file: WebDavFile | null;
  onClose: () => void;
  onDownloadFromEndpoint: (endpointId: string) => void;
}

export const DuplicateInspectorModal: React.FC<DuplicateInspectorModalProps> = ({
  file,
  onClose,
  onDownloadFromEndpoint,
}) => {
  if (!file) return null;

  // Check size equality across endpoints
  const sizes = file.endpoints.map((e) => e.size);
  const sizesMatch = sizes.every((s) => s === sizes[0]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden select-none">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Duplicate File Inspector</h3>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Found on {file.endpoints.length} active WebDAV endpoints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* File Overview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{file.name}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 text-[10px] font-semibold">
                Unified Path
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">{file.path}</p>
            <p className="text-[11px] leading-tight min-h-[14px] text-[#C85A17] dark:text-[#D0BCFF] font-semibold truncate">
              {formatMediaInfo(file) || '\u00A0'}
            </p>

            <div className="pt-2 flex items-center space-x-2 text-[11px]">
              {sizesMatch ? (
                <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Identical File Sizes across Endpoints ({formatBytes(file.size)})</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-rose-600 dark:text-rose-400 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Size Mismatch detected between servers!</span>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown per Endpoint */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Host Endpoint Instances ({file.endpoints.length})
            </h4>

            {file.endpoints.map((ep) => (
              <div
                key={ep.endpointId}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs flex items-center justify-between"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: ep.endpointColor }}
                    />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {ep.endpointName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 font-mono">
                    <p>Path: {ep.realPath}</p>
                    <p>Size: {formatBytes(ep.size)} • Modified: {formatDate(ep.lastModified)}</p>
                    {ep.etag && <p className="text-[10px] text-slate-400">ETag: {ep.etag}</p>}
                  </div>
                </div>

                <button
                  onClick={() => onDownloadFromEndpoint(ep.endpointId)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer flex items-center space-x-1 shrink-0"
                  title="Download specifically from this endpoint"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/80 dark:bg-slate-850">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
