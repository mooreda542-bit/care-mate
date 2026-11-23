import { useState, useEffect, useRef, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  Upload,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  Copy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function PrescriptionScannerModal({
  isOpen,
  onClose,
  onApplyText,
}) {
  const { language, t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Selected file and preview URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Recognition language: 'ara' | 'eng' | 'ara+eng'
  const [ocrLang, setOcrLang] = useState(() => (language === 'ar' ? 'ara' : 'eng'));

  // Processing state: 'idle' | 'initializing' | 'downloading' | 'processing' | 'done' | 'error'
  const [scanStatus, setScanStatus] = useState('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Extracted text review area
  const [extractedText, setExtractedText] = useState('');
  const [copied, setCopied] = useState(false);

  // Refs for file inputs and cancellation
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const activeWorkerRef = useRef(null);
  const isCancelledRef = useRef(false);
  const previewUrlRef = useRef(null);

  // Keep previewUrlRef in sync
  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);

  // Object URL cleanup helper
  const clearPreviewUrl = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
      setPreviewUrl(null);
    }
  }, []);

  // Terminate active worker safely
  const terminateActiveWorker = useCallback(async () => {
    if (activeWorkerRef.current) {
      try {
        const workerToTerminate = activeWorkerRef.current;
        activeWorkerRef.current = null;
        await workerToTerminate.terminate();
      } catch (err) {
        console.warn('[CareMate OCR] Worker termination error:', err);
      }
    }
  }, []);

  // Full reset helper
  const resetScannerState = useCallback(() => {
    clearPreviewUrl();
    setSelectedFile(null);
    setScanStatus('idle');
    setProgressPercent(0);
    setStatusMessage('');
    setErrorMessage('');
    setExtractedText('');
    setCopied(false);
  }, [clearPreviewUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      terminateActiveWorker();
      clearPreviewUrl();
    };
  }, [terminateActiveWorker, clearPreviewUrl]);

  // Handle modal close
  const handleClose = useCallback(async () => {
    isCancelledRef.current = true;
    await terminateActiveWorker();
    resetScannerState();
    if (onClose) onClose();
  }, [terminateActiveWorker, resetScannerState, onClose]);

  // Keyboard accessibility: Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Only allow escape if not in the middle of active OCR scanning to avoid abrupt worker leaks
      if (e.key === 'Escape') {
        if (scanStatus !== 'initializing' && scanStatus !== 'downloading' && scanStatus !== 'processing') {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, scanStatus, handleClose]);

  // Validate and accept image file
  const handleFileChange = (file) => {
    if (!file) return;

    // Validate MIME type (JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(t('ocr.errUnsupportedType'));
      return;
    }

    // Reset previous scan results and preview URL
    clearPreviewUrl();
    setExtractedText('');
    setScanStatus('idle');
    setErrorMessage('');
    setProgressPercent(0);
    setCopied(false);

    try {
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
    } catch {
      setErrorMessage(t('ocr.errFileRead'));
    }
  };

  // Handle OCR language toggle (resets extracted text to prevent applying outdated language results)
  const handleLanguageChange = (newLang) => {
    setOcrLang(newLang);
    if (extractedText) {
      setExtractedText('');
    }
    if (scanStatus !== 'idle') {
      setScanStatus('idle');
      setProgressPercent(0);
    }
  };

  // ----------------------------------------------------
  // OCR Recognition Flow
  // ----------------------------------------------------
  const handleStartOCR = async () => {
    if (!selectedFile || scanStatus === 'initializing' || scanStatus === 'downloading' || scanStatus === 'processing') {
      return;
    }

    isCancelledRef.current = false;
    setErrorMessage('');
    setExtractedText('');
    setCopied(false);
    setProgressPercent(0);
    setScanStatus('initializing');
    setStatusMessage(t('ocr.statusInitializing'));

    let worker = null;

    try {
      // 1. Create Tesseract v7 worker with logger callback
      worker = await createWorker(ocrLang, 1, {
        logger: (m) => {
          if (isCancelledRef.current) return;

          // Safe bounded progress percentage (0..100)
          const p = Math.min(100, Math.max(0, Math.round((m.progress || 0) * 100)));
          setProgressPercent(p);

          if (m.status === 'loading tesseract core' || m.status === 'initializing tesseract' || m.status === 'loading api') {
            setScanStatus('initializing');
            setStatusMessage(t('ocr.statusInitializing'));
          } else if (m.status === 'downloading' || m.status === 'loading language traineddata') {
            setScanStatus('downloading');
            setStatusMessage(t('ocr.statusDownloading').replace('{progress}', String(p)));
          } else if (m.status === 'recognizing text') {
            setScanStatus('processing');
            setStatusMessage(t('ocr.statusProcessing').replace('{progress}', String(p)));
          }
        },
      });

      if (isCancelledRef.current) {
        await worker.terminate();
        return;
      }

      activeWorkerRef.current = worker;

      // 2. Perform text recognition on the selected image file
      const result = await worker.recognize(selectedFile);

      if (isCancelledRef.current) {
        return;
      }

      const text = result?.data?.text ? result.data.text.trim() : '';

      if (!text) {
        setScanStatus('error');
        setErrorMessage(t('ocr.emptyNoText'));
      } else {
        setExtractedText(text);
        setScanStatus('done');
        setStatusMessage(t('ocr.statusComplete'));
      }
    } catch (err) {
      console.warn('[CareMate OCR] Recognition failed:', err);
      if (!isCancelledRef.current) {
        setScanStatus('error');
        setErrorMessage(t('ocr.errEngineFailed'));
      }
    } finally {
      // Always terminate worker to release memory
      if (worker) {
        try {
          await worker.terminate();
        } catch {
          // ignore termination error
        }
      }
      activeWorkerRef.current = null;
    }
  };

  // Copy to clipboard helper
  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback silent
    }
  };

  // Apply text to parent handler
  const handleApply = () => {
    if (!extractedText.trim()) return;
    if (onApplyText) {
      onApplyText(extractedText.trim());
    }
    handleClose();
  };

  if (!isOpen) return null;

  const isScanning = scanStatus === 'initializing' || scanStatus === 'downloading' || scanStatus === 'processing';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ocr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-surface rounded-2xl border border-border-line shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* ======================================================= */}
        {/* 1. MODAL HEADER                                         */}
        {/* ======================================================= */}
        <div className="p-4 sm:p-5 border-b border-border-subtle flex items-center justify-between gap-3 bg-surface">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0 shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 id="ocr-modal-title" className="text-base sm:text-lg font-bold text-charcoal truncate">
                {t('ocr.modalTitle')}
              </h2>
              <p className="text-xs text-muted truncate">
                {t('ocr.modalSubtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isScanning}
            aria-label={t('ocr.btnClose')}
            className="p-2 text-muted hover:text-charcoal hover:bg-surface-alt rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================= */}
        {/* 2. MODAL BODY (SCROLLABLE)                              */}
        {/* ======================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Hidden native file inputs */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
              e.target.value = '';
            }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
              e.target.value = '';
            }}
          />

          {/* Medical Accuracy & Safety Notice */}
          <div className="bg-status-warning-bg/40 border border-status-warning/40 p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-status-warning flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-charcoal block">
                {t('ocr.safetyWarningTitle')}
              </span>
              <p className="text-body leading-relaxed">
                {t('ocr.safetyWarningText')}
              </p>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="bg-status-danger-bg text-status-danger border border-status-danger/30 p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 font-semibold animate-in fade-in"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Image Selection Area (Upload / Preview) */}
          {!previewUrl ? (
            <div className="border-2 border-dashed border-border-line hover:border-primary/50 rounded-2xl p-6 sm:p-8 text-center space-y-4 bg-surface-alt/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-xs">
                <Upload className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-bold text-charcoal">
                  {t('ocr.uploadAreaTitle')}
                </p>
                <p className="text-xs text-muted">
                  {t('ocr.uploadAreaSubtitle')}
                </p>
              </div>

              {/* Action Buttons for File Picker and Camera */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-xs transition-all min-h-[48px]"
                >
                  <Upload className="w-4 h-4" />
                  <span>{t('ocr.btnChooseGallery')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface hover:bg-surface-alt text-charcoal font-bold text-sm border border-border-line transition-all min-h-[48px]"
                >
                  <Camera className="w-4 h-4 text-primary" />
                  <span>{t('ocr.btnTakePhoto')}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Selected Image Preview & Replacement */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-charcoal">
                  {t('ocr.previewTitle')}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isScanning}
                    className="text-xs font-semibold text-primary hover:text-primary-dark p-1.5 rounded-lg hover:bg-primary-light transition-colors disabled:opacity-40"
                  >
                    {t('ocr.btnChangeImage')}
                  </button>
                  <button
                    type="button"
                    onClick={resetScannerState}
                    disabled={isScanning}
                    className="text-xs font-semibold text-status-danger hover:underline p-1.5 rounded-lg transition-colors disabled:opacity-40"
                  >
                    {t('ocr.btnRemoveImage')}
                  </button>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-border-line bg-charcoal/5 flex items-center justify-center max-h-64 sm:max-h-72">
                <img
                  src={previewUrl}
                  alt={t('ocr.previewTitle')}
                  className="w-full h-full object-contain max-h-64 sm:max-h-72"
                />
              </div>
            </div>
          )}

          {/* OCR Language Selector (Arabic / English / Both) */}
          <div className="bg-surface p-3.5 rounded-xl border border-border-line space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-charcoal">
              {t('ocr.ocrLangTitle')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isScanning}
                onClick={() => handleLanguageChange('ara')}
                className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                  ocrLang === 'ara'
                    ? 'bg-primary-light text-primary border-primary/40 shadow-xs'
                    : 'bg-surface text-muted border-border-line hover:text-charcoal'
                } disabled:opacity-40`}
              >
                {t('ocr.langArabic')}
              </button>
              <button
                type="button"
                disabled={isScanning}
                onClick={() => handleLanguageChange('eng')}
                className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                  ocrLang === 'eng'
                    ? 'bg-primary-light text-primary border-primary/40 shadow-xs'
                    : 'bg-surface text-muted border-border-line hover:text-charcoal'
                } disabled:opacity-40`}
              >
                {t('ocr.langEnglish')}
              </button>
              <button
                type="button"
                disabled={isScanning}
                onClick={() => handleLanguageChange('ara+eng')}
                className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                  ocrLang === 'ara+eng'
                    ? 'bg-primary-light text-primary border-primary/40 shadow-xs'
                    : 'bg-surface text-muted border-border-line hover:text-charcoal'
                } disabled:opacity-40`}
              >
                {t('ocr.langBoth')}
              </button>
            </div>
          </div>

          {/* Start Recognition Action & Live Progress Bar */}
          {previewUrl && (
            <div className="space-y-3 pt-1">
              {!isScanning && scanStatus !== 'done' && (
                <button
                  type="button"
                  onClick={handleStartOCR}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-5 rounded-xl transition-all shadow-xs text-sm sm:text-base min-h-[48px]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t('ocr.btnStartScan')}</span>
                </button>
              )}

              {/* Progress Indicator */}
              {isScanning && (
                <div className="bg-surface-alt p-4 rounded-xl border border-border-line space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-charcoal">
                    <span>{statusMessage}</span>
                    <span className="text-primary">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-border-line h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Editable Review Area (Appears after successful scan or manual edit) */}
          {extractedText && (
            <div className="space-y-2.5 pt-2 border-t border-border-subtle animate-in fade-in">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="ocr-extracted-text" className="text-xs sm:text-sm font-bold text-charcoal block">
                  {t('ocr.reviewTitle')}
                </label>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 p-1 rounded-md hover:bg-primary-light transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? t('ocr.textCopied') : t('ocr.btnCopyText')}</span>
                </button>
              </div>

              <p className="text-xs text-muted">
                {t('ocr.reviewSubtitle')}
              </p>

              <textarea
                id="ocr-extracted-text"
                rows={5}
                dir={ocrLang === 'ara' ? 'rtl' : 'auto'}
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder={t('ocr.reviewPlaceholder')}
                className="w-full p-3.5 rounded-xl border border-border-line bg-surface text-charcoal text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans leading-relaxed"
              />

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartOCR}
                  disabled={isScanning}
                  className="text-xs font-semibold text-muted hover:text-charcoal inline-flex items-center gap-1 p-1.5 rounded-lg hover:bg-surface-alt transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('ocr.btnStartScan')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Guidance Tips & Local Privacy Notice */}
          <div className="bg-surface-alt/60 p-4 rounded-xl border border-border-subtle space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-charcoal">
              <Info className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{t('ocr.guidanceTipsTitle')}</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-muted ps-1">
              <li>{t('ocr.guidanceTip1')}</li>
              <li>{t('ocr.guidanceTip2')}</li>
              <li>{t('ocr.guidanceTip3')}</li>
            </ul>
            <p className="text-[11px] text-muted pt-1 border-t border-border-subtle leading-relaxed">
              {t('ocr.privacyNotice')}
            </p>
          </div>
        </div>

        {/* ======================================================= */}
        {/* 3. MODAL FOOTER ACTIONS                                 */}
        {/* ======================================================= */}
        <div className="p-4 border-t border-border-subtle bg-surface flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isScanning}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border-line text-charcoal hover:bg-surface-alt font-semibold text-sm transition-all min-h-[44px] disabled:opacity-40"
          >
            {t('ocr.btnClose')}
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!extractedText.trim() || isScanning}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-xs transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('ocr.btnApplyToForm')}</span>
            <ArrowIcon className="w-4 h-4 ms-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
