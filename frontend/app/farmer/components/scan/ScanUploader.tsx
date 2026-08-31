import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, RefreshCw, Trash2, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Farm } from '../../types/farmer';

interface ScanUploaderProps {
  farms: Farm[];
  selectedFarmId: string;
  onSelectFarmId: (id: string) => void;
  selectedCrop: string;
  onSelectCrop: (crop: string) => void;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
}

export const ScanUploader: React.FC<ScanUploaderProps> = ({
  farms,
  selectedFarmId,
  onSelectFarmId,
  selectedCrop,
  onSelectCrop,
  selectedFile,
  onFileSelect,
  onStartAnalysis,
  isAnalyzing,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (.jpg, .jpeg, .png, .webp).');
      return;
    }
    onFileSelect(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const cropOptions = ['Tomato', 'Apple', 'Blueberry', 'Cherry', 'Corn', 'Grape', 'Orange', 'Peach', 'Pepper', 'Potato', 'Raspberry', 'Soybean', 'Strawberry'];

  return (
    <div className="space-y-6">
      {/* Step 1: Select Plot and Crop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            {t.scan.selectFarm}
          </label>
          <select
            value={selectedFarmId}
            onChange={(e) => {
              const fId = e.target.value;
              onSelectFarmId(fId);
              const found = farms.find((f) => f.id === fId);
              if (found) onSelectCrop(found.crop.name);
            }}
            className="input-field font-medium text-slate-800"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.crop.name} - {f.village})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5">
            {t.scan.selectCrop}
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => onSelectCrop(e.target.value)}
            className="input-field font-medium text-slate-800"
          >
            {cropOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hidden File / Camera Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Upload Drop Zone / Image Preview */}
      {!selectedFile || !previewUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`card border-2 border-dashed text-center py-10 sm:py-14 px-6 transition-all ${
            isDragOver
              ? 'border-agri-600 bg-agri-50/70 scale-[1.01]'
              : 'border-stone-300 hover:border-agri-500 bg-stone-50/50'
          }`}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-agri-100 text-agri-700 mb-4 shadow-inner">
            <ImageIcon className="h-8 w-8" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900">{t.scan.uploadTitle}</h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {t.scan.uploadInstructions}
          </p>

          {/* Large touch buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="btn-primary w-full sm:w-auto text-base py-3.5 px-6"
            >
              <Camera className="h-5 w-5" />
              <span>{t.scan.takePhoto}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary w-full sm:w-auto text-base py-3.5 px-6"
            >
              <Upload className="h-5 w-5 text-slate-600" />
              <span>{t.scan.chooseFile}</span>
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Supports JPG, PNG, WEBP from mobile camera or storage (Max 10MB)
          </p>
        </div>
      ) : (
        /* Image Preview State */
        <div className="card border-agri-300 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-agri-800">
              <Check className="h-4 w-4 text-agri-600" />
              <span>Photo ready for AI analysis ({selectedCrop})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{t.scan.changeImage}</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t.scan.removeImage}</span>
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-stone-900 flex items-center justify-center max-h-80 sm:max-h-96">
            <img
              src={previewUrl}
              alt="Crop leaf preview"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Quick tips */}
          <div className="rounded-xl bg-stone-50 p-3 border border-stone-200 text-xs text-slate-600 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-agri-700 shrink-0 mt-0.5" />
            <span>Ensure the leaf lesion spots or discolored areas are clearly in focus for accurate AI detection.</span>
          </div>

          {/* Start Analysis CTA Button */}
          <button
            type="button"
            disabled={isAnalyzing}
            onClick={onStartAnalysis}
            className="btn-primary w-full text-base sm:text-lg py-4 shadow-lg shadow-agri-700/20"
          >
            <span>Analyze Crop Health</span>
          </button>
        </div>
      )}
    </div>
  );
};
