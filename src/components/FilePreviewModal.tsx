import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Eye,
  FileText,
  Image as ImageIcon,
  Check,
  Play,
  Terminal,
  Loader2,
  Film,
  Sparkles,
  Clapperboard,
  RefreshCw,
  Star,
  FileJson,
  FileCode,
  Calendar,
  Clock,
  Tag,
} from 'lucide-react';
import { WebDavFile, TMDBMovieData } from '../types';
import { formatBytes, formatDate, formatMediaInfo, isMovieFile, fetchTmdbMetadata } from '../lib/webdavEngine';

interface FilePreviewModalProps {
  file: WebDavFile | null;
  onClose: () => void;
  onDownload: (file: WebDavFile) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [isRefreshingTmdb, setIsRefreshingTmdb] = useState(false);
  const [tmdbData, setTmdbData] = useState<TMDBMovieData | null>(file?.tmdbData || null);
  const [tmdbJsonPath, setTmdbJsonPath] = useState<string | null>(file?.tmdbJsonPath || null);
  const [jsonRawContent, setJsonRawContent] = useState<string | null>(null);

  const [shellLog, setShellLog] = useState<{
    command: string;
    action: 'download' | 'watch';
    stdout: string;
    stderr: string;
    exitCode?: number;
  } | null>(null);

  useEffect(() => {
    setTmdbData(file?.tmdbData || null);
    setTmdbJsonPath(file?.tmdbJsonPath || null);
    setShowRawJson(false);
    setJsonRawContent(null);

    // If movie file lacks TMDB data, attempt async fetch
    if (file && isMovieFile(file) && !file.tmdbData) {
      setIsRefreshingTmdb(true);
      fetchTmdbMetadata(file.path, file.name, false).then((res) => {
        if (res?.data) {
          setTmdbData(res.data);
          setTmdbJsonPath(res.jsonFilePath);
        }
        setIsRefreshingTmdb(false);
      });
    }

    // If clicking a .json sidecar file directly, fetch its content
    if (file && file.name.endsWith('.json')) {
      fetch(`/api/tmdb/json-content?path=${encodeURIComponent(file.path)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setJsonRawContent(JSON.stringify(data, null, 2));
          }
        })
        .catch(() => {});
    }
  }, [file]);

  if (!file) return null;

  const isMovie = isMovieFile(file);
  const isJsonFile = file.name.endsWith('.json');

  const handleRefreshTmdb = async () => {
    if (!file) return;
    setIsRefreshingTmdb(true);
    const res = await fetchTmdbMetadata(file.path, file.name, true);
    if (res?.data) {
      setTmdbData(res.data);
      setTmdbJsonPath(res.jsonFilePath);
      setJsonRawContent(JSON.stringify(res.data, null, 2));
    }
    setIsRefreshingTmdb(false);
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(file.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleExecuteShell = async (action: 'download' | 'watch') => {
    if (!file) return;

    const previewUrl = `${window.location.origin}/api/webdav/preview?path=${encodeURIComponent(file.path)}`;
    let command = '';

    if (action === 'download') {
      command = `curl -s -L -o "$HOME/Downloads/${file.name}" "${previewUrl}"`;
    } else if (action === 'watch') {
      command = `vlc "${previewUrl}" --title "${file.name}"`;
    }

    setIsExecuting(true);
    try {
      let result: { success: boolean; stdout: string; stderr: string; exitCode: number };

      if (window.electronAPI?.executeBashCommand) {
        result = await window.electronAPI.executeBashCommand(command, action);
      } else {
        const res = await fetch('/api/shell/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command,
            action,
            path: file.path,
            name: file.name,
          }),
        });
        result = await res.json();
      }

      setShellLog({
        command,
        action,
        stdout: result.stdout || 'Process dispatched to Bash environment.',
        stderr: result.stderr || '',
        exitCode: result.exitCode ?? 0,
      });
    } catch (err: any) {
      setShellLog({
        command,
        action,
        stdout: `[BASH SHELL ERROR]\n$ ${command}\nFailed to execute process: ${err.message}`,
        stderr: err.toString(),
        exitCode: 1,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F5] dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col select-none max-h-[90vh] text-[#2C221E] dark:text-[#E6E1E5]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D8D2C9] dark:border-[#49454F] flex items-center justify-between bg-[#F0EEEB] dark:bg-[#1C1B1F]">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-[#E7E2DB] dark:bg-[#381E72] text-[#C85A17] dark:text-[#D0BCFF] shrink-0">
              {isMovie ? <Film className="w-5 h-5" /> : isJsonFile ? <FileJson className="w-5 h-5 text-amber-500" /> : <Eye className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-[#2C221E] dark:text-[#E6E1E5] truncate flex items-center space-x-2">
                <span>{file.name}</span>
                {isMovie && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C85A17]/15 dark:bg-[#381E72] text-[#C85A17] dark:text-[#D0BCFF] border border-[#C85A17]/30 dark:border-[#D0BCFF]/30">
                    Movie / Media
                  </span>
                )}
                {isJsonFile && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    TMDB Sidecar JSON
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#786C63] dark:text-[#CAC4D0] font-mono truncate">
                {file.path}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#DFD9CE] dark:hover:bg-[#49454F] text-[#786C63] dark:text-[#CAC4D0] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview Stage */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TMDB Movie Hero Section */}
          {isMovie && tmdbData && !showRawJson && (
            <div className="relative rounded-2xl overflow-hidden border border-[#D8D2C9] dark:border-[#49454F] bg-[#121115] text-white shadow-lg">
              {/* Backdrop image */}
              {tmdbData.backdrop_url && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 blur-xs"
                  style={{ backgroundImage: `url(${tmdbData.backdrop_url})` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121115] via-[#121115]/80 to-transparent" />

              <div className="relative p-5 flex flex-col sm:flex-row gap-5 items-start">
                {/* Poster image */}
                {tmdbData.poster_url ? (
                  <img
                    src={tmdbData.poster_url}
                    alt={tmdbData.title}
                    referrerPolicy="no-referrer"
                    className="w-28 h-40 object-cover rounded-xl shadow-md border border-white/10 shrink-0 self-center sm:self-start"
                  />
                ) : (
                  <div className="w-28 h-40 bg-slate-800 rounded-xl flex flex-col items-center justify-center p-2 text-center text-slate-400 shrink-0">
                    <Clapperboard className="w-10 h-10 mb-2 opacity-60" />
                    <span className="text-[10px]">No Poster</span>
                  </div>
                )}

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">
                          The Movie Database (TMDB)
                        </span>
                      </div>
                      <h3 className="text-xl font-bold leading-tight text-white drop-shadow-xs">
                        {tmdbData.title}
                      </h3>
                      {tmdbData.tagline && (
                        <p className="text-xs italic text-amber-200/90 font-serif pt-0.5">
                          "{tmdbData.tagline}"
                        </p>
                      )}
                    </div>
                    {tmdbData.vote_average ? (
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        <span>{tmdbData.vote_average}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Metadata pill badges */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300 pt-1">
                    {tmdbData.release_date && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white/10">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{tmdbData.release_date.slice(0, 4)}</span>
                      </span>
                    )}
                    {tmdbData.runtime && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white/10">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{tmdbData.runtime} mins</span>
                      </span>
                    )}
                    {Array.isArray(tmdbData.genres) &&
                      tmdbData.genres.map((g) => (
                        <span
                          key={g}
                          className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium"
                        >
                          {g}
                        </span>
                      ))}
                  </div>

                  {/* Overview */}
                  {tmdbData.overview && (
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 pt-1">
                      {tmdbData.overview}
                    </p>
                  )}

                  {/* Sidecar JSON confirmation strip */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 text-[11px]">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                      <FileJson className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Sidecar JSON stored: {tmdbJsonPath || `${file.name.replace(/\.[^/.]+$/, '')}.json`}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleRefreshTmdb}
                        disabled={isRefreshingTmdb}
                        className="flex items-center space-x-1 text-[10px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRefreshingTmdb ? 'animate-spin' : ''}`} />
                        <span>Re-query TMDB</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowRawJson(true);
                          if (!jsonRawContent) {
                            setJsonRawContent(JSON.stringify(tmdbData, null, 2));
                          }
                        }}
                        className="flex items-center space-x-1 text-[10px] px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 font-semibold text-slate-950 transition-colors cursor-pointer"
                      >
                        <FileCode className="w-3 h-3" />
                        <span>View JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Raw JSON Sidecar Inspector Mode */}
          {showRawJson && (
            <div className="p-4 rounded-2xl bg-[#121115] border border-[#36343B] text-xs font-mono text-emerald-400 space-y-2">
              <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-[#36343B]">
                <div className="flex items-center space-x-2">
                  <FileJson className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">Sidecar Data ({tmdbJsonPath || `${file.name}.json`})</span>
                </div>
                <button
                  onClick={() => setShowRawJson(false)}
                  className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs text-slate-200 cursor-pointer"
                >
                  Back to Poster View
                </button>
              </div>
              <pre className="p-3 bg-[#1C1B1F] rounded-xl overflow-x-auto max-h-60 text-[11px] leading-relaxed text-amber-200">
                {jsonRawContent || JSON.stringify(tmdbData, null, 2)}
              </pre>
            </div>
          )}

          {/* Standard Visual Render Box when not movie or when raw json view for .json file */}
          {(!isMovie || showRawJson) && !isJsonFile && (
            <div className="h-44 rounded-2xl bg-[#F0EEEB] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
              {file.fileType === 'image' ? (
                <div className="flex flex-col items-center space-y-2">
                  <ImageIcon className="w-14 h-14 text-emerald-500" />
                  <span className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                    Image Asset ({file.extension?.toUpperCase()})
                  </span>
                </div>
              ) : file.fileType === 'document' ? (
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="w-14 h-14 text-blue-500" />
                  <span className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                    Document File ({file.extension?.toUpperCase()})
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="w-14 h-14 text-[#C85A17] dark:text-[#D0BCFF]" />
                  <span className="text-xs text-[#786C63] dark:text-[#CAC4D0]">
                    Unified WebDAV Resource
                  </span>
                </div>
              )}
            </div>
          )}

          {/* JSON File Direct View */}
          {isJsonFile && (
            <div className="p-4 rounded-2xl bg-[#121115] border border-[#36343B] text-xs font-mono text-emerald-400 space-y-2">
              <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-[#36343B]">
                <div className="flex items-center space-x-2">
                  <FileJson className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">JSON Sidecar File ({file.name})</span>
                </div>
                <span className="text-[10px] text-emerald-400">Cached Sidecar</span>
              </div>
              <pre className="p-3 bg-[#1C1B1F] rounded-xl overflow-x-auto max-h-60 text-[11px] leading-relaxed text-amber-200">
                {jsonRawContent || `{\n  "file": "${file.name}",\n  "status": "TMDB Cached Metadata",\n  "path": "${file.path}"\n}`}
              </pre>
            </div>
          )}

          {/* Bash Shell Actions (Electron Integration) */}
          <div className="p-4 rounded-2xl bg-[#E7E2DB]/50 dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#C85A17] dark:text-[#D0BCFF]" />
                <h4 className="font-bold text-xs text-[#2C221E] dark:text-[#E6E1E5]">
                  Electron Bash Shell Actions
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D8D2C9] dark:bg-[#3B383E] text-[#786C63] dark:text-[#CAC4D0]">
                Shell / CLI Trigger
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Action 1: Download File via Bash */}
              <button
                onClick={() => handleExecuteShell('download')}
                disabled={isExecuting}
                className="p-3 rounded-2xl border border-[#C8C0B3] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#2B2930] hover:bg-[#F0EEEB] dark:hover:bg-[#3B383E] text-[#2C221E] dark:text-[#E6E1E5] flex flex-col items-start space-y-1 text-left transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-1.5 rounded-xl bg-[#E7E2DB] dark:bg-[#381E72] text-[#C85A17] dark:text-[#D0BCFF] group-hover:scale-105 transition-transform">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-[#786C63] dark:text-[#CAC4D0]">curl</span>
                </div>
                <span className="font-semibold text-xs pt-1">Download File</span>
                <span className="text-[10px] text-[#786C63] dark:text-[#CAC4D0]">
                  Runs curl in Bash to ~/Downloads
                </span>
              </button>

              {/* Action 2: Watch Movie via Bash (Enabled ONLY for Movies) */}
              <button
                onClick={() => handleExecuteShell('watch')}
                disabled={!isMovie || isExecuting}
                className={`p-3 rounded-2xl border flex flex-col items-start space-y-1 text-left transition-all shadow-xs group ${
                  isMovie
                    ? 'border-[#C85A17] dark:border-[#D0BCFF] bg-[#C85A17]/10 dark:bg-[#381E72]/40 hover:bg-[#C85A17]/20 dark:hover:bg-[#381E72]/70 text-[#2C221E] dark:text-[#E6E1E5] cursor-pointer'
                    : 'border-[#D8D2C9] dark:border-[#49454F] bg-[#E7E2DB]/30 dark:bg-[#1C1B1F]/40 text-[#A0958C] dark:text-[#6E6B73] cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`p-1.5 rounded-xl transition-transform ${
                      isMovie
                        ? 'bg-[#C85A17] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] group-hover:scale-105'
                        : 'bg-[#D8D2C9] dark:bg-[#3B383E] text-[#A0958C] dark:text-[#6E6B73]'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-[10px] font-mono">
                    {isMovie ? 'vlc / player' : 'Disabled'}
                  </span>
                </div>
                <span className="font-semibold text-xs pt-1">Watch Movie</span>
                <span className="text-[10px]">
                  {isMovie
                    ? 'Launches video stream in Bash player'
                    : 'Disabled (Movie files only)'}
                </span>
              </button>
            </div>
          </div>

          {/* Bash Terminal Console Output */}
          {(isExecuting || shellLog) && (
            <div className="rounded-2xl bg-[#121115] border border-[#36343B] overflow-hidden text-xs font-mono shadow-inner">
              <div className="px-4 py-2 bg-[#1C1B1F] border-b border-[#36343B] flex items-center justify-between text-[#CAC4D0]">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-[11px]">Bash Terminal Console</span>
                  {isExecuting ? (
                    <span className="flex items-center space-x-1 text-[10px] text-amber-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Executing bash command...</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Exit Code: {shellLog?.exitCode ?? 0}
                    </span>
                  )}
                </div>
                {shellLog?.command && (
                  <button
                    onClick={() => handleCopyCommand(shellLog.command)}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-[#2B2930] hover:bg-[#3B383E] text-[10px] text-[#D0BCFF] cursor-pointer"
                  >
                    {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd ? 'Copied' : 'Copy Cmd'}</span>
                  </button>
                )}
              </div>

              <div className="p-4 space-y-2 max-h-40 overflow-y-auto text-[11px] leading-relaxed select-text">
                {shellLog?.command && (
                  <div className="text-amber-300 font-semibold">
                    <span className="text-emerald-400">$ </span>
                    {shellLog.command}
                  </div>
                )}
                {isExecuting && (
                  <div className="text-[#CAC4D0] animate-pulse">
                    Spawning process in Bash shell environment...
                  </div>
                )}
                {shellLog?.stdout && (
                  <pre className="text-emerald-400 whitespace-pre-wrap font-mono">
                    {shellLog.stdout}
                  </pre>
                )}
                {shellLog?.stderr && (
                  <pre className="text-rose-400 whitespace-pre-wrap font-mono">
                    {shellLog.stderr}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* Metadata Table */}
          <div className="p-4 rounded-2xl bg-[#F0EEEB] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] space-y-2 text-xs">
            <h4 className="font-bold text-[#2C221E] dark:text-[#E6E1E5]">File Details</h4>
            <div className="grid grid-cols-2 gap-2 text-[#6E6259] dark:text-[#CAC4D0]">
              <div><span className="text-[#938F99]">Size:</span> {formatBytes(file.size)}</div>
              <div><span className="text-[#938F99]">Type:</span> {file.mimeType || file.fileType}</div>
              <div><span className="text-[#938F99]">Last Modified:</span> {formatDate(file.lastModified)}</div>
              <div><span className="text-[#938F99]">Endpoints Count:</span> {file.endpoints.length}</div>
            </div>
          </div>

          {/* Endpoints Hosting list */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-[#2C221E] dark:text-[#E6E1E5]">Hosting WebDAV Endpoints</h4>
            <div className="flex flex-wrap gap-2">
              {file.endpoints.map((ep) => (
                <div
                  key={ep.endpointId}
                  className="px-3 py-1.5 rounded-2xl text-white font-medium flex items-center space-x-2 text-xs"
                  style={{ backgroundColor: ep.endpointColor }}
                >
                  <span className="w-2 h-2 rounded-full bg-white opacity-90" />
                  <span>{ep.endpointName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-[#D8D2C9] dark:border-[#49454F] flex items-center justify-between bg-[#F0EEEB] dark:bg-[#1C1B1F]">
          <button
            onClick={handleCopyPath}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#DFD9CE] dark:bg-[#3B383E] text-[#2C221E] dark:text-[#E6E1E5] text-xs font-medium cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Path' : 'Copy Path'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-[#786C63] dark:text-[#CAC4D0] hover:bg-[#DFD9CE] dark:hover:bg-[#49454F] text-xs font-medium cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onDownload(file)}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-[#C85A17] hover:bg-[#A1470A] text-white dark:bg-[#D0BCFF] dark:hover:bg-[#E8DEF8] dark:text-[#381E72] text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

