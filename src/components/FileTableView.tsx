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
  MoreVertical,
  Star,
  Download,
  Eye,
  Trash2,
  Layers,
  ArrowUpDown,
  ExternalLink,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { WebDavFile, TabItem, WebDavEndpoint, EndpointFileInfo } from '../types';
import { formatBytes, formatDate, formatMediaInfo, isMovieFile, getEndpointFileFullUrl } from '../lib/webdavEngine';

interface FileTableViewProps {
  files: WebDavFile[];
  selectedIds: Set<string>;
  endpoints?: WebDavEndpoint[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onNavigateFolder: (path: string) => void;
  onOpenFilePreview: (file: WebDavFile) => void;
  onOpenDuplicateInspector: (file: WebDavFile) => void;
  onToggleStarFile: (id: string) => void;
  onDeleteFile: (file: WebDavFile) => void;
  onDownloadFile?: (file: WebDavFile) => void;
  onCopyEndpointUrl?: (epInfo: EndpointFileInfo, file: WebDavFile) => void;
  sortBy: TabItem['sortBy'];
  sortOrder: TabItem['sortOrder'];
  onHeaderSort: (key: TabItem['sortBy']) => void;
}

export const FileTableView: React.FC<FileTableViewProps> = ({
  files,
  selectedIds,
  endpoints = [],
  onToggleSelect,
  onToggleSelectAll,
  onNavigateFolder,
  onOpenFilePreview,
  onOpenDuplicateInspector,
  onToggleStarFile,
  onDeleteFile,
  onDownloadFile,
  onCopyEndpointUrl,
  sortBy,
  sortOrder,
  onHeaderSort,
}) => {
  const allSelected = files.length > 0 && selectedIds.size === files.length;

  const getFileIcon = (file: WebDavFile) => {
    if (file.isDirectory) return <Folder className="w-4 h-4 text-amber-500 shrink-0" />;
    switch (file.fileType) {
      case 'document':
        return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'audio':
        return <Music className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'code':
        return <Code className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-indigo-500 shrink-0" />;
      default:
        return <File className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-[#786C63] dark:text-[#CAC4D0] select-none space-y-3 transition-colors">
        <div className="p-4 rounded-full bg-[#FAF8F5] dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F]">
          <Layers className="w-8 h-8 text-[#C85A17] dark:text-[#D0BCFF] opacity-80" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-[#2C221E] dark:text-[#E6E1E5]">No Files Found</p>
          <p className="text-xs max-w-sm text-[#786C63] dark:text-[#938F99]">
            This directory is empty or no enabled WebDAV endpoints contain matching files with the active filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto select-none bg-[#F0EEEB] dark:bg-[#1C1B1F] transition-colors">
      <table className="w-full text-left border-collapse text-xs">
        {/* Table Header with Clickable Sorting */}
        <thead className="bg-[#E7E2DB] dark:bg-[#2B2930] text-[#2C221E] dark:text-[#CAC4D0] border-b border-[#D8D2C9] dark:border-[#49454F] sticky top-0 z-10 font-semibold transition-colors">
          <tr>
            <th className="p-3 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="w-4 h-4 rounded border-[#C8C0B3] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#1C1B1F] text-[#C85A17] dark:text-[#D0BCFF] focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF] cursor-pointer accent-[#C85A17] dark:accent-[#D0BCFF]"
              />
            </th>

            <th
              onClick={() => onHeaderSort('name')}
              className="p-3 cursor-pointer hover:text-[#C85A17] dark:hover:text-[#E6E1E5] transition-colors"
            >
              <div className="flex items-center space-x-1">
                <span>Name & Details</span>
                {sortBy === 'name' && <ArrowUpDown className="w-3 h-3 text-[#C85A17] dark:text-[#D0BCFF]" />}
              </div>
            </th>

            <th
              onClick={() => onHeaderSort('size')}
              className="p-3 cursor-pointer hover:text-[#C85A17] dark:hover:text-[#E6E1E5] transition-colors text-right"
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Size</span>
                {sortBy === 'size' && <ArrowUpDown className="w-3 h-3 text-[#C85A17] dark:text-[#D0BCFF]" />}
              </div>
            </th>

            <th
              onClick={() => onHeaderSort('modified')}
              className="p-3 hidden md:table-cell cursor-pointer hover:text-[#C85A17] dark:hover:text-[#E6E1E5] transition-colors text-right"
            >
              <div className="flex items-center justify-end space-x-1">
                <span>Last Modified</span>
                {sortBy === 'modified' && <ArrowUpDown className="w-3 h-3 text-[#C85A17] dark:text-[#D0BCFF]" />}
              </div>
            </th>

            <th className="p-3 text-center min-w-[180px] w-48">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-[#D8D2C9] dark:divide-[#49454F]">
          {files.map((file) => {
            const isSelected = selectedIds.has(file.id);

            return (
              <tr
                key={file.id}
                className={`group transition-colors ${
                  isSelected
                    ? 'bg-[#FCEEE6] dark:bg-[#381E72]/40'
                    : file.isDuplicate
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 dark:bg-[#4a352c]/30 dark:hover:bg-[#4a352c]/50'
                    : 'hover:bg-[#EFECE6] dark:hover:bg-[#3B383E]'
                }`}
              >
                {/* Selection Checkbox */}
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(file.id)}
                    className="w-4 h-4 rounded border-[#C8C0B3] dark:border-[#49454F] bg-[#FAF8F5] dark:bg-[#1C1B1F] text-[#C85A17] dark:text-[#D0BCFF] focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF] cursor-pointer accent-[#C85A17] dark:accent-[#D0BCFF]"
                  />
                </td>

                {/* File Name & Path Details */}
                <td className="p-3 max-w-xs sm:max-w-sm">
                  <div className="flex items-center space-x-2.5">
                    {/* Star favorite toggle */}
                    <button
                      onClick={() => onToggleStarFile(file.id)}
                      className={`p-1 rounded hover:bg-[#DFD9CE] dark:hover:bg-[#49454F] cursor-pointer transition-colors ${
                        file.isStarred ? 'text-amber-500 dark:text-amber-400' : 'text-[#A89F95] dark:text-[#49454F] opacity-0 group-hover:opacity-100'
                      }`}
                      title="Star File"
                    >
                      <Star className={`w-3.5 h-3.5 ${file.isStarred ? 'fill-amber-500 dark:fill-amber-400' : ''}`} />
                    </button>

                    {getFileIcon(file)}

                    <div className="min-w-0">
                      {file.isDirectory ? (
                        <button
                          onClick={() => onNavigateFolder(file.path)}
                          className="font-semibold text-[#C85A17] dark:text-[#D0BCFF] hover:underline truncate text-left block text-xs cursor-pointer"
                        >
                          {file.name}
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenFilePreview(file)}
                          className="font-medium text-[#2C221E] dark:text-[#E6E1E5] hover:text-[#C85A17] dark:hover:text-[#D0BCFF] truncate text-left block text-xs cursor-pointer"
                        >
                          {file.name}
                        </button>
                      )}
                      <p className="text-[10px] text-[#786C63] dark:text-[#938F99] truncate">
                        {file.path}
                      </p>
                      <p className="text-[10px] leading-tight min-h-[14px] text-[#C85A17] dark:text-[#D0BCFF] font-medium truncate">
                        {formatMediaInfo(file) || '\u00A0'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* File Size */}
                <td className="p-3 text-right font-mono text-[#2C221E] dark:text-[#E6E1E5] font-semibold">
                  {file.isDirectory ? '--' : formatBytes(file.size)}
                </td>

                {/* Last Modified */}
                <td className="p-3 hidden md:table-cell text-right text-[#786C63] dark:text-[#CAC4D0] text-[11px]">
                  {formatDate(file.lastModified)}
                </td>

                {/* Actions */}
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap gap-y-1">
                    {!file.isDirectory && (
                      <>
                        {/* Download Action */}
                        <button
                          onClick={() => onDownloadFile ? onDownloadFile(file) : window.open(`/api/webdav/file?path=${encodeURIComponent(file.path)}`, '_blank')}
                          className="p-1 rounded-full hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 cursor-pointer"
                          title="Download File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Stream Action (Movies only) */}
                        {isMovieFile(file) && (
                          <button
                            onClick={() => onOpenFilePreview(file)}
                            className="p-1 rounded-full hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 cursor-pointer flex items-center space-x-0.5"
                            title="Stream Movie"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        )}

                        {/* Copy Endpoint Full URL Action (One per endpoint having the file) */}
                        {file.endpoints.map((ep) => {
                          const fullUrl = getEndpointFileFullUrl(ep, endpoints);
                          return (
                            <button
                              key={ep.endpointId}
                              onClick={() => {
                                if (onCopyEndpointUrl) {
                                  onCopyEndpointUrl(ep, file);
                                } else {
                                  navigator.clipboard.writeText(fullUrl);
                                }
                              }}
                              className="p-1 rounded-full text-white shadow-2xs hover:scale-110 transition-transform cursor-pointer flex items-center justify-center shrink-0"
                              style={{ backgroundColor: ep.endpointColor || '#3b82f6' }}
                              title={`Copy URL on ${ep.endpointName}`}
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          );
                        })}

                        {/* Preview Action */}
                        <button
                          onClick={() => onOpenFilePreview(file)}
                          className="p-1 rounded-full hover:bg-[#DFD9CE] dark:hover:bg-[#49454F] text-[#786C63] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5] cursor-pointer"
                          title="Preview File"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {file.isDuplicate && (
                      <button
                        onClick={() => onOpenDuplicateInspector(file)}
                        className="p-1 rounded-full hover:bg-amber-500/20 dark:hover:bg-[#4a352c] text-[#C85A17] dark:text-[#ffb4ab] cursor-pointer"
                        title="Inspect Endpoint Duplicates"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteFile(file)}
                      className="p-1 rounded-full hover:bg-rose-500/15 dark:hover:bg-[#93000a] text-rose-600 dark:text-[#ffb4ab] cursor-pointer"
                      title="Remove File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
