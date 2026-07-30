import React from 'react';
import { ChevronRight, Home, ArrowUp, RefreshCw, Copy, Check, FolderPlus, Upload } from 'lucide-react';

interface BreadcrumbNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onRefresh: () => void;
  onOpenNewFolder: () => void;
  onOpenUpload: () => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  currentPath,
  onNavigate,
  onRefresh,
  onOpenNewFolder,
  onOpenUpload,
}) => {
  const [copied, setCopied] = React.useState(false);

  const parts = currentPath.split('/').filter(Boolean);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(currentPath || '/');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoUp = () => {
    if (!currentPath || currentPath === '/') return;
    const lastSlash = currentPath.lastIndexOf('/');
    const parent = lastSlash === 0 ? '/' : currentPath.substring(0, lastSlash);
    onNavigate(parent);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-2 bg-[#FAF8F5] dark:bg-[#1C1B1F] border-b border-[#D8D2C9] dark:border-[#49454F] text-xs select-none transition-colors">
      {/* Left: Up Button & Clickable Breadcrumb Segment Pills */}
      <div className="flex items-center space-x-1 overflow-x-auto py-1">
        {/* Go Up Parent Button */}
        <button
          onClick={handleGoUp}
          disabled={currentPath === '/'}
          className="p-1.5 rounded-full hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5] disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer mr-1"
          title="Go Up to Parent Directory"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

        {/* Root Home Button */}
        <button
          onClick={() => onNavigate('/')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer ${
            currentPath === '/'
              ? 'bg-[#FCEEE6] text-[#9A3800] dark:bg-[#49454F] dark:text-[#EADDFF] font-semibold border border-[#E89E6C]/50 dark:border-transparent'
              : 'hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5]'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-[#C85A17] dark:text-[#D0BCFF]" />
          <span>Root</span>
        </button>

        {/* Breadcrumb segments */}
        {parts.map((part, index) => {
          const pathUpTo = '/' + parts.slice(0, index + 1).join('/');
          const isLast = index === parts.length - 1;

          return (
            <React.Fragment key={pathUpTo}>
              <ChevronRight className="w-3.5 h-3.5 text-[#A89F95] dark:text-[#938F99] shrink-0" />
              <button
                onClick={() => onNavigate(pathUpTo)}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer truncate max-w-[150px] ${
                  isLast
                    ? 'bg-[#FCEEE6] text-[#9A3800] dark:bg-[#49454F] dark:text-[#EADDFF] font-semibold border border-[#E89E6C]/50 dark:border-transparent'
                    : 'hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5]'
                }`}
              >
                {part}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right: Path Copy & Directory Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleCopyPath}
          className="flex items-center space-x-1 px-3 py-1 rounded-full hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5] transition-colors cursor-pointer"
          title="Copy Current Path"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Path'}</span>
        </button>

        <button
          onClick={onRefresh}
          className="p-1.5 rounded-full hover:bg-[#EFECE6] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5] transition-colors cursor-pointer"
          title="Refresh Directory Files"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-[#D8D2C9] dark:bg-[#49454F]" />

        {/* Action Buttons */}
        <button
          onClick={onOpenNewFolder}
          className="flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#DFD9CE] hover:bg-[#D0C8BD] dark:bg-[#49454F] dark:hover:bg-[#5a5661] text-[#2C221E] dark:text-[#E6E1E5] transition-colors font-medium text-xs cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5 text-[#C85A17] dark:text-[#D0BCFF]" />
          <span className="hidden sm:inline">New Folder</span>
        </button>

        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-1.5 px-4 py-1 rounded-full bg-[#C85A17] hover:bg-[#B04C0F] text-white dark:bg-[#D0BCFF] dark:hover:bg-[#e0d0ff] dark:text-[#381E72] font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-white dark:text-[#381E72]" />
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>
    </div>
  );
};
