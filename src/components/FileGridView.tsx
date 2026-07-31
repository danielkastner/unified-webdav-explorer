import React from 'react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Code,
  Archive,
  File,
  Zap,
  Star,
  Eye,
  Trash2,
  Download,
  Play,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { WebDavFile, WebDavEndpoint, EndpointFileInfo } from '../types';
import { formatBytes, formatDate, formatMediaInfo, isMovieFile, getEndpointFileFullUrl } from '../lib/webdavEngine';

interface FileGridViewProps {
  files: WebDavFile[];
  selectedIds: Set<string>;
  endpoints?: WebDavEndpoint[];
  onToggleSelect: (id: string) => void;
  onNavigateFolder: (path: string) => void;
  onOpenFilePreview: (file: WebDavFile) => void;
  onOpenDuplicateInspector: (file: WebDavFile) => void;
  onToggleStarFile: (id: string) => void;
  onDeleteFile: (file: WebDavFile) => void;
  onDownloadFile?: (file: WebDavFile) => void;
  onCopyEndpointUrl?: (epInfo: EndpointFileInfo, file: WebDavFile) => void;
}

export const FileGridView: React.FC<FileGridViewProps> = ({
  files,
  selectedIds,
  endpoints = [],
  onToggleSelect,
  onNavigateFolder,
  onOpenFilePreview,
  onOpenDuplicateInspector,
  onToggleStarFile,
  onDeleteFile,
  onDownloadFile,
  onCopyEndpointUrl,
}) => {
  const getFileIcon = (file: WebDavFile) => {
    if (file.isDirectory) return <Folder className="w-10 h-10 text-amber-500 shrink-0" />;
    switch (file.fileType) {
      case 'document':
        return <FileText className="w-10 h-10 text-blue-500 shrink-0" />;
      case 'image':
        return <ImageIcon className="w-10 h-10 text-emerald-500 shrink-0" />;
      case 'video':
        return <Video className="w-10 h-10 text-purple-500 shrink-0" />;
      case 'audio':
        return <Music className="w-10 h-10 text-rose-500 shrink-0" />;
      case 'code':
        return <Code className="w-10 h-10 text-amber-500 shrink-0" />;
      case 'archive':
        return <Archive className="w-10 h-10 text-indigo-500 shrink-0" />;
      default:
        return <File className="w-10 h-10 text-slate-400 shrink-0" />;
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 select-none bg-[#F0EEEB] dark:bg-[#1C1B1F] transition-colors">
      {files.map((file) => {
        const isSelected = selectedIds.has(file.id);

        return (
          <div
            key={file.id}
            onClick={() => {
              if (file.isDirectory) onNavigateFolder(file.path);
              else onOpenFilePreview(file);
            }}
            className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              isSelected
                ? 'bg-[#FCEEE6] border-[#E89E6C] ring-1 ring-[#E89E6C] dark:bg-[#381E72]/50 dark:border-[#D0BCFF] dark:ring-[#D0BCFF]'
                : file.isDuplicate
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 dark:bg-[#4a352c]/40 dark:hover:bg-[#4a352c]/60 dark:border-[#93000a]'
                : 'bg-[#FAF8F5] hover:bg-[#F2ECE4] border-[#D8D2C9] dark:bg-[#2B2930] dark:hover:bg-[#3B383E] dark:border-[#49454F] shadow-xs'
            }`}
          >
            {/* Top Bar: Select Checkbox, Star & Duplicate Badge */}
            <div className="flex items-center justify-between mb-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleSelect(file.id);
                }}
                className="w-4 h-4 rounded border-[#C8C0B3] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#1C1B1F] text-[#C85A17] dark:text-[#D0BCFF] focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF] cursor-pointer accent-[#C85A17] dark:accent-[#D0BCFF] opacity-0 group-hover:opacity-100 transition-opacity"
              />

              <div className="flex items-center space-x-1">
                {file.isDuplicate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDuplicateInspector(file);
                    }}
                    className="flex items-center space-x-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-[#A1470A] border border-amber-500/30 dark:bg-[#ffb4ab]/20 dark:text-[#ffb4ab] dark:border-[#93000a] cursor-pointer"
                    title={`${file.endpoints.length} WebDAV Endpoints`}
                  >
                    <Zap className="w-2.5 h-2.5 text-[#C85A17] dark:text-[#ffb4ab]" />
                    <span>{file.endpoints.length} EP</span>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStarFile(file.id);
                  }}
                  className={`p-1 rounded-full hover:bg-[#DFD9CE] dark:hover:bg-[#49454F] cursor-pointer ${
                    file.isStarred ? 'text-amber-500 dark:text-amber-400' : 'text-[#A89F95] dark:text-[#49454F] opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${file.isStarred ? 'fill-amber-500 dark:fill-amber-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Middle: Icon & Name */}
            <div className="flex flex-col items-center text-center my-2 space-y-2">
              <div className="p-2.5 rounded-2xl bg-[#F0EEEB] dark:bg-[#1C1B1F] border border-[#D8D2C9] dark:border-[#49454F] group-hover:scale-105 transition-transform">
                {getFileIcon(file)}
              </div>

              <div className="w-full">
                <p className="font-semibold text-xs text-[#2C221E] dark:text-[#E6E1E5] truncate px-1">
                  {file.name}
                </p>
                <p className="text-[10px] text-[#786C63] dark:text-[#938F99] font-mono truncate">
                  {file.path}
                </p>
                <p className="text-[10px] leading-tight min-h-[14px] text-[#C85A17] dark:text-[#D0BCFF] font-medium truncate">
                  {formatMediaInfo(file) || '\u00A0'}
                </p>
              </div>
            </div>

            {/* Actions Bar for files */}
            {!file.isDirectory && (
              <div className="my-1.5 pt-1.5 border-t border-[#D8D2C9]/60 dark:border-[#49454F]/60 flex items-center justify-center gap-1 flex-wrap">
                {/* Download */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDownloadFile) onDownloadFile(file);
                    else window.open(`/api/webdav/file?path=${encodeURIComponent(file.path)}`, '_blank');
                  }}
                  className="p-1 rounded-md bg-[#E7E2DB] dark:bg-[#381E72] hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 text-[#786C63] dark:text-[#D0BCFF] cursor-pointer transition-colors"
                  title="Download File"
                >
                  <Download className="w-3 h-3" />
                </button>

                {/* Stream Movie (Movies only) */}
                {isMovieFile(file) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFilePreview(file);
                    }}
                    className="p-1 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white cursor-pointer transition-colors"
                    title="Stream Movie"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                )}

                {/* Copy Endpoint Full URL per Endpoint */}
                {file.endpoints.map((ep) => {
                  const fullUrl = getEndpointFileFullUrl(ep, endpoints);
                  return (
                    <button
                      key={ep.endpointId}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onCopyEndpointUrl) {
                          onCopyEndpointUrl(ep, file);
                        } else {
                          navigator.clipboard.writeText(fullUrl);
                        }
                      }}
                      className="p-1 rounded-full text-white hover:scale-110 transition-transform cursor-pointer flex items-center justify-center shadow-2xs shrink-0"
                      style={{ backgroundColor: ep.endpointColor || '#3b82f6' }}
                      title={`Copy URL on ${ep.endpointName}`}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom: Source Endpoint Badges & Modified date */}
            <div className="mt-1 pt-1.5 border-t border-[#D8D2C9] dark:border-[#49454F] flex items-center justify-between">
              <div className="flex items-center -space-x-1.5 overflow-hidden">
                {file.endpoints.map((ep) => (
                  <span
                    key={ep.endpointId}
                    className="w-4 h-4 rounded-full border border-[#FAF8F5] dark:border-[#2B2930] flex items-center justify-center text-[8px] font-bold text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: ep.endpointColor || '#4ADE80' }}
                    title={ep.endpointName}
                  >
                    {ep.endpointName.charAt(0)}
                  </span>
                ))}
              </div>

              <span className="text-[9px] text-[#786C63] dark:text-[#CAC4D0]">
                {formatDate(file.lastModified).split(',')[0]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
