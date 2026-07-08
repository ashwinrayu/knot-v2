import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

interface UploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

export const Upload: React.FC<UploadProps> = ({
  onFileSelect,
  acceptedTypes = '.pdf,.png,.jpg,.jpeg',
  maxSizeMB = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds limit of ${maxSizeMB}MB.`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
        selectedFile ? 'border-indigo-400 bg-indigo-50/10' :
        dragOver ? 'border-indigo-500 bg-indigo-50/20' :
        'border-slate-300 hover:bg-slate-50/50'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex flex-col items-center select-none text-xs font-semibold">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
            <FileText className="h-6 w-6" />
          </div>
          <p className="text-slate-800 font-bold block max-w-xs truncate">{selectedFile.name}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <button 
            type="button" 
            onClick={clearFile}
            className="mt-3 text-[10px] font-bold text-rose-600 hover:text-rose-755 border border-rose-100 rounded-lg px-2.5 py-1 bg-white hover:bg-rose-50 shadow-sm"
          >
            Remove File
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-700">Drag and drop file here</p>
          <p className="text-xs text-slate-400 mt-1">Supports transcript formats (PDF, PNG, JPG)</p>
          <button
            type="button"
            className="mt-4 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl text-xs shadow-sm bg-white"
          >
            Select Document
          </button>
        </div>
      )}
    </div>
  );
};
