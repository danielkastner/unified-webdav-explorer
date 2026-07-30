import React from 'react';
import { Plus, X, Folder, Layers } from 'lucide-react';
import { TabItem } from '../types';

interface TabBarProps {
  tabs: TabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onAddTab: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onAddTab,
}) => {
  return (
    <div className="flex items-center bg-[#E7E2DB] dark:bg-[#2B2930] border-b border-[#D0C8BD] dark:border-[#49454F] px-3 pt-1 select-none overflow-x-auto no-scrollbar transition-colors">
      <div className="flex items-center space-x-1 flex-1 min-w-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const displayTitle = tab.path === '/' ? 'Unified Root' : tab.path.split('/').pop() || tab.path;

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center space-x-2 px-4 py-2 rounded-t-xl text-xs font-medium cursor-pointer transition-all border-t border-x shrink-0 max-w-[200px] ${
                isActive
                  ? 'bg-[#F0EEEB] dark:bg-[#1C1B1F] border-[#D0C8BD] dark:border-[#49454F] text-[#C85A17] dark:text-[#D0BCFF] font-semibold shadow-xs border-t-2 border-t-[#C85A17] dark:border-t-[#D0BCFF]'
                  : 'bg-transparent border-transparent hover:bg-[#DFD9CE] dark:hover:bg-[#3B383E] text-[#6E6259] dark:text-[#CAC4D0]'
              }`}
            >
              <Folder
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? 'text-[#C85A17] dark:text-[#D0BCFF]' : 'text-[#6E6259] dark:text-[#CAC4D0]'
                }`}
              />
              <span className="truncate">{displayTitle}</span>

              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="ml-1 opacity-60 hover:opacity-100 p-0.5 rounded-full hover:bg-[#D0C8BD] dark:hover:bg-[#49454F] text-[#6E6259] dark:text-[#CAC4D0] transition-opacity cursor-pointer"
                  title="Close Tab"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add New Tab Button */}
        <button
          onClick={onAddTab}
          className="p-2 text-[#6E6259] dark:text-[#CAC4D0] hover:text-[#C85A17] dark:hover:text-[#D0BCFF] hover:bg-[#DFD9CE] dark:hover:bg-[#3B383E] rounded-full transition-colors cursor-pointer shrink-0 ml-1"
          title="Open New Directory Tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
