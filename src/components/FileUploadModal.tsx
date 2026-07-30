import React, { useState } from 'react';
import { X, Upload, Server, CheckCircle2, FileUp } from 'lucide-react';
import { WebDavEndpoint } from '../types';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  endpoints: WebDavEndpoint[];
  onUploadFiles: (files: FileList, targetEndpointIds: string[]) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  currentPath,
  endpoints,
  onUploadFiles,
}) => {
  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>(
    endpoints.filter((e) => e.enabled).map((e) => e.id)
  );
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  if (!isOpen) return null;

  const activeEndpoints = endpoints.filter((e) => e.enabled);

  const toggleEndpoint = (id: string) => {
    if (selectedEndpoints.includes(id)) {
      if (selectedEndpoints.length === 1) return; // Keep at least one
      setSelectedEndpoints(selectedEndpoints.filter((e) => e !== id));
    } else {
      setSelectedEndpoints([...selectedEndpoints, id]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    onUploadFiles(files, selectedEndpoints);
    setFiles(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Upload File to WebDAV
              </h3>
              <p className="text-xs text-slate-500 font-mono truncate max-w-[240px]">
                Target Folder: {currentPath || '/'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Endpoint selection targets */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Destination WebDAV Server(s)
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Uploading to multiple endpoints automatically creates synced duplicate entries.
            </p>

            <div className="flex flex-wrap gap-2">
              {activeEndpoints.map((ep) => {
                const isSelected = selectedEndpoints.includes(ep.id);
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => toggleEndpoint(ep.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                      isSelected
                        ? 'text-white border-transparent shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                    }`}
                    style={isSelected ? { backgroundColor: ep.color } : {}}
                  >
                    <span>{ep.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drag & Drop File Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <input
              type="file"
              multiple
              onChange={handleChange}
              className="hidden"
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer space-y-2">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto w-fit">
                <FileUp className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {files && files.length > 0
                    ? `${files.length} File(s) Selected`
                    : 'Click or Drag files to upload'}
                </p>
                <p className="text-[11px] text-slate-400">Supports documents, media, code, and archives</p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!files || files.length === 0}
              className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm cursor-pointer disabled:opacity-40"
            >
              Start Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
