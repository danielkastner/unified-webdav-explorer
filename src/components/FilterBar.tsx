import React from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  LayoutGrid,
  ArrowUpDown,
  Zap,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Code,
  Archive,
  Layers,
  Check,
  Star,
  Download,
  Trash2,
  X
} from 'lucide-react';
import { TabItem } from '../types';

interface FilterBarProps {
  currentFilter: TabItem['filter'];
  onSelectFilter: (filter: TabItem['filter']) => void;
  minRating?: number;
  onChangeMinRating?: (minRating: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  duplicatesOnly: boolean;
  onToggleDuplicatesOnly: () => void;
  sortBy: TabItem['sortBy'];
  sortOrder: TabItem['sortOrder'];
  onChangeSort: (sortBy: TabItem['sortBy']) => void;
  onToggleSortOrder: () => void;
  viewMode: TabItem['viewMode'];
  onChangeViewMode: (viewMode: TabItem['viewMode']) => void;
  selectedCount: number;
  onClearSelection: () => void;
  onBatchStar: () => void;
  onBatchDownload: () => void;
  onBatchDelete: () => void;
  totalMatchingFiles: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onSelectFilter,
  minRating,
  onChangeMinRating,
  searchQuery,
  onSearchChange,
  duplicatesOnly,
  onToggleDuplicatesOnly,
  sortBy,
  sortOrder,
  onChangeSort,
  onToggleSortOrder,
  viewMode,
  onChangeViewMode,
  selectedCount,
  onClearSelection,
  onBatchStar,
  onBatchDownload,
  onBatchDelete,
  totalMatchingFiles,
}) => {
  const filterChips: Array<{ key: TabItem['filter']; label: string; icon: React.ReactNode }> = [
    { key: 'all', label: 'All Items', icon: <Layers className="w-3.5 h-3.5" /> },
    { key: 'rating', label: 'Rating', icon: <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 dark:fill-amber-300 dark:text-amber-400" /> },
    { key: 'document', label: 'Documents', icon: <FileText className="w-3.5 h-3.5" /> },
    { key: 'image', label: 'Images', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { key: 'video', label: 'Videos', icon: <Video className="w-3.5 h-3.5" /> },
    { key: 'audio', label: 'Audio', icon: <Music className="w-3.5 h-3.5" /> },
    { key: 'code', label: 'Code & Data', icon: <Code className="w-3.5 h-3.5" /> },
    { key: 'archive', label: 'Archives', icon: <Archive className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="px-6 py-3 bg-[#F0EEEB] dark:bg-[#1C1B1F] border-b border-[#D8D2C9] dark:border-[#49454F] space-y-3 select-none transition-colors">
      {/* Top Row: Search Input, View Mode Segmented Control, Sort Control */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar (MD3 Container Style) */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#786C63] dark:text-[#CAC4D0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search in unified view..."
            className="w-full pl-10 pr-9 py-2 rounded-full bg-[#DFD9CE] dark:bg-[#49454F] text-xs text-[#2C221E] dark:text-[#E6E1E5] placeholder-[#786C63] dark:placeholder-[#CAC4D0] focus:outline-none focus:ring-1 focus:ring-[#C85A17] dark:focus:ring-[#D0BCFF] transition-all border border-transparent font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#786C63] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode & Sort Segment Controls */}
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          {/* Matching Count Pill */}
          <span className="text-xs text-[#786C63] dark:text-[#938F99] font-medium px-2.5 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#2B2930] border border-[#D8D2C9] dark:border-[#49454F]">
            {totalMatchingFiles} items
          </span>

          {/* Sort Dropdown & Order */}
          <div className="flex items-center space-x-1 bg-[#DFD9CE] dark:bg-[#49454F] rounded-full p-0.5 border border-[#D8D2C9] dark:border-[#49454F]">
            <select
              value={sortBy}
              onChange={(e) => onChangeSort(e.target.value as TabItem['sortBy'])}
              className="bg-transparent text-xs font-semibold px-2 py-1 text-[#2C221E] dark:text-[#E6E1E5] focus:outline-none cursor-pointer"
            >
              <option value="name" className="bg-[#FAF8F5] dark:bg-[#2B2930] text-[#2C221E] dark:text-[#E6E1E5]">Sort: Name</option>
              <option value="rating" className="bg-[#FAF8F5] dark:bg-[#2B2930] text-[#2C221E] dark:text-[#E6E1E5]">Sort: Rating (TMDB)</option>
              <option value="size" className="bg-[#FAF8F5] dark:bg-[#2B2930] text-[#2C221E] dark:text-[#E6E1E5]">Sort: Size</option>
              <option value="modified" className="bg-[#FAF8F5] dark:bg-[#2B2930] text-[#2C221E] dark:text-[#E6E1E5]">Sort: Modified</option>
              <option value="endpoints" className="bg-[#FAF8F5] dark:bg-[#2B2930] text-[#2C221E] dark:text-[#E6E1E5]">Sort: Endpoints</option>
              <option value="type" className="bg-[#FAF8F5] dark:bg-[#2B2930] text-[#2C221E] dark:text-[#E6E1E5]">Sort: Type</option>
            </select>
            <button
              onClick={onToggleSortOrder}
              className="p-1 rounded-full hover:bg-[#D0C8BD] dark:hover:bg-[#5a5661] text-[#786C63] dark:text-[#CAC4D0] cursor-pointer"
              title={`Sort Direction: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className={`w-3.5 h-3.5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* MD3 View Mode Segmented Controls */}
          <div className="flex items-center bg-[#DFD9CE] dark:bg-[#49454F] p-0.5 rounded-full border border-[#D8D2C9] dark:border-[#49454F]">
            <button
              onClick={() => onChangeViewMode('table')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#C85A17] text-white dark:bg-[#D0BCFF] dark:text-[#381E72] shadow-xs'
                  : 'text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5]'
              }`}
              title="Table Grid View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('grid')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#C85A17] text-white dark:bg-[#D0BCFF] dark:text-[#381E72] shadow-xs'
                  : 'text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5]'
              }`}
              title="Grid Cards View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('cards')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#C85A17] text-white dark:bg-[#D0BCFF] dark:text-[#381E72] shadow-xs'
                  : 'text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#2C221E] dark:hover:text-[#E6E1E5]'
              }`}
              title="Large Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: MD3 Filter Chips & Duplicates Quick Filter */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center space-x-2 shrink-0">
          {filterChips.map((chip) => {
            const isActive = currentFilter === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => onSelectFilter(chip.key)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C85A17] text-white dark:bg-[#D0BCFF] dark:text-[#381E72] shadow-xs'
                    : 'bg-[#DFD9CE] text-[#6E6259] hover:bg-[#D0C8BD] dark:bg-[#49454F] dark:text-[#CAC4D0] dark:hover:bg-[#5a5661]'
                }`}
              >
                {chip.icon}
                <span>{chip.label}</span>
                {isActive && <Check className="w-3 h-3 text-white dark:text-[#381E72]" />}
              </button>
            );
          })}

          {/* Rating Min Threshold Pills when Rating Filter is Active */}
          {currentFilter === 'rating' && (
            <div className="flex items-center space-x-1.5 pl-2 border-l border-[#D8D2C9] dark:border-[#49454F] animate-fadeIn">
              <span className="text-[11px] font-semibold text-[#786C63] dark:text-[#CAC4D0] shrink-0">Min Rating:</span>
              {[0, 6, 7, 8, 9].map((ratingVal) => (
                <button
                  key={ratingVal}
                  onClick={() => onChangeMinRating?.(ratingVal)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    (minRating ?? 0) === ratingVal
                      ? 'bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-900 shadow-xs scale-105'
                      : 'bg-[#DFD9CE] text-[#6E6259] hover:bg-[#D0C8BD] dark:bg-[#49454F] dark:text-[#CAC4D0]'
                  }`}
                >
                  {ratingVal === 0 ? 'All Rated' : `★ ${ratingVal}+`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Duplicates Only Filter Chip */}
        <button
          onClick={onToggleDuplicatesOnly}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
            duplicatesOnly
              ? 'bg-rose-600 text-white dark:bg-[#ffb4ab] dark:text-[#690005]'
              : 'bg-amber-500/15 text-[#A1470A] hover:bg-amber-500/25 dark:bg-[#4a352c] dark:text-[#ffb4ab] dark:hover:bg-[#5c4238]'
          }`}
          title="Filter to show only files hosted on multiple WebDAV endpoints"
        >
          <Zap className={`w-3.5 h-3.5 ${duplicatesOnly ? 'text-white dark:text-[#690005]' : 'text-[#A1470A] dark:text-[#ffb4ab]'}`} />
          <span>Duplicates Only</span>
        </button>
      </div>

      {/* Batch Actions Toolbar when files are selected */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-2.5 rounded-full bg-[#C85A17] dark:bg-[#381E72] text-white dark:text-[#EADDFF] shadow-md animate-fadeIn text-xs border border-[#E89E6C]/40 dark:border-[#D0BCFF]/30">
          <div className="flex items-center space-x-2 pl-2">
            <span className="font-semibold bg-white/20 dark:bg-[#49454F] px-2.5 py-0.5 rounded-full text-white dark:text-[#D0BCFF]">
              {selectedCount} Selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-white/90 dark:text-[#D0BCFF] hover:text-white underline text-[11px] cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center space-x-2 pr-1">
            <button
              onClick={onBatchStar}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 dark:bg-[#49454F] dark:hover:bg-[#5a5661] text-amber-200 dark:text-amber-300 transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>Favorite</span>
            </button>

            <button
              onClick={onBatchDownload}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 dark:bg-[#49454F] dark:hover:bg-[#5a5661] text-white dark:text-[#E6E1E5] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Batch</span>
            </button>

            <button
              onClick={onBatchDelete}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-700 hover:bg-rose-800 dark:bg-[#93000a] dark:hover:bg-[#b3000f] text-white dark:text-[#ffb4ab] transition-colors cursor-pointer font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
