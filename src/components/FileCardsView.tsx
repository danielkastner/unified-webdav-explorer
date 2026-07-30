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
  HardDrive
} from 'lucide-react';
import { WebDavFile } from '../types';
import { formatBytes, formatDate, formatMediaInfo } from '../lib/webdavEngine';

interface FileCardsViewProps {
  files: WebDavFile[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onNavigateFolder: (path: string) => void;
  onOpenFilePreview: (file: WebDavFile) => void;
  onOpenDuplicateInspector: (file: WebDavFile) => void;
  onToggleStarFile: (id: string) => void;
  onDeleteFile: (file: WebDavFile) => void;
}

export const FileCardsView: React.FC<FileCardsViewProps> = ({
  files,
  selectedIds,
  onToggleSelect,
  onNavigateFolder,
  onOpenFilePreview,
  onOpenDuplicateInspector,
  onToggleStarFile,
  onDeleteFile,
}) => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 select-none bg-[#F0EEEB] dark:bg-[#1C1B1F] transition-colors">
      {files.map((file) => {
        const isSelected = selectedIds.has(file.id);

        return (
          <div
            key={file.id}
            className={`p-4 rounded-3xl border transition-all ${
              isSelected
                ? 'bg-[#FCEEE6] border-[#E89E6C] ring-1 ring-[#E89E6C] dark:bg-[#381E72]/50 dark:border-[#D0BCFF] dark:ring-[#D0BCFF]'
                : file.isDuplicate
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 dark:bg-[#4a352c]/40 dark:hover:bg-[#4a352c]/60 dark:border-[#93000a]'
                : 'bg-[#FAF8F5] hover:bg-[#F2ECE4] border-[#D8D2C9] dark:bg-[#2B2930] dark:hover:bg-[#3B383E] dark:border-[#49454F] shadow-xs'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(file.id)}
                  className="w-4 h-4 rounded border-[#C8C0B3] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#1C1B1F] text-[#C85A17] dark:text-[#D0BCFF] focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF] cursor-pointer accent-[#C85A17] dark:accent-[#D0BCFF]"
                />
                <div className="min-w-0">
                  <h4
                    onClick={() => {
                      if (file.isDirectory) onNavigateFolder(file.path);
                      else onOpenFilePreview(file);
                    }}
                    className="font-semibold text-sm text-[#2C221E] dark:text-[#E6E1E5] truncate hover:text-[#C85A17] dark:hover:text-[#D0BCFF] cursor-pointer"
                  >
                    {file.name}
                  </h4>
                  <p className="text-[10px] text-[#786C63] dark:text-[#938F99] truncate">{file.path}</p>
                  <p className="text-[10px] leading-tight min-h-[14px] text-[#C85A17] dark:text-[#D0BCFF] font-medium truncate">
                    {formatMediaInfo(file) || '\u00A0'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onToggleStarFile(file.id)}
                className={`p-1.5 rounded-full hover:bg-[#DFD9CE] dark:hover:bg-[#49454F] cursor-pointer ${
                  file.isStarred ? 'text-amber-500 dark:text-amber-400' : 'text-[#A89F95] dark:text-[#49454F]'
                }`}
              >
                <Star className={`w-4 h-4 ${file.isStarred ? 'fill-amber-500 dark:fill-amber-400' : ''}`} />
              </button>
            </div>

            {/* Visual Preview Box */}
            <div
              onClick={() => {
                if (file.isDirectory) onNavigateFolder(file.path);
                else onOpenFilePreview(file);
              }}
              className="my-3 h-28 rounded-2xl bg-[#F0EEEB] dark:bg-[#1C1B1F] flex items-center justify-center cursor-pointer border border-[#D8D2C9] dark:border-[#49454F] group overflow-hidden relative"
            >
              {file.isDirectory ? (
                <Folder className="w-12 h-12 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform" />
              ) : file.tmdbData?.poster_url ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={file.tmdbData.poster_url}
                    alt={file.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-2">
                    <span className="text-[10px] font-bold text-amber-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-amber-500/40">
                      ★ {file.tmdbData.vote_average || 'TMDB'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                      .json cached
                    </span>
                  </div>
                </div>
              ) : file.fileType === 'image' ? (
                <ImageIcon className="w-12 h-12 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              ) : file.fileType === 'document' ? (
                <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              ) : (
                <File className="w-12 h-12 text-[#786C63] dark:text-[#CAC4D0] group-hover:scale-110 transition-transform" />
              )}
            </div>

            {/* Endpoints & Metadata Footer */}
            <div className="space-y-2 pt-2 border-t border-[#D8D2C9] dark:border-[#49454F] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#786C63] dark:text-[#CAC4D0] font-medium">WebDAV Sources:</span>
                {file.isDuplicate && (
                  <button
                    onClick={() => onOpenDuplicateInspector(file)}
                    className="flex items-center space-x-1 text-[10px] font-bold text-[#A1470A] dark:text-[#ffb4ab] bg-amber-500/15 dark:bg-[#ffb4ab]/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 dark:border-[#93000a]"
                  >
                    <Zap className="w-3 h-3 text-[#C85A17] dark:text-[#ffb4ab]" />
                    <span>⚡ Merged ({file.endpoints.length})</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {file.endpoints.map((ep) => (
                  <span
                    key={ep.endpointId}
                    className="px-2 py-0.5 rounded-full text-[10px] text-white font-medium shadow-xs"
                    style={{ backgroundColor: ep.endpointColor || '#4ADE80' }}
                  >
                    {ep.endpointName}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#786C63] dark:text-[#CAC4D0] pt-1 font-medium">
                <span>Size: {file.isDirectory ? 'Folder' : formatBytes(file.size)}</span>
                <span>Modified: {formatDate(file.lastModified)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
