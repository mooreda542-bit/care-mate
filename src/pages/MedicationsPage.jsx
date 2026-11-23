import { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getStorageItem, setStorageItem } from '../utils/storage';
import PrescriptionScannerModal from '../components/PrescriptionScannerModal';
import {
  Pill,
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  Clock,
  FileText,
  AlertTriangle,
  Info,
  Calendar,
  Camera,
} from 'lucide-react';

const STORAGE_KEY = 'caremate_medications';

export default function MedicationsPage() {
  const { t } = useLanguage();

  // Load initial medications list from LocalStorage
  const [medications, setMedications] = useState(() => {
    const stored = getStorageItem(STORAGE_KEY, []);
    return Array.isArray(stored) ? stored : [];
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal state: null (closed) | { mode: 'add' } | { mode: 'edit', item: Medication }
  const [formState, setFormState] = useState(null);

  // Scanner modal state: boolean
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Form inputs state
  const [formData, setFormData] = useState({
    name: '',
    instructions: '',
    times: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');

  // Delete confirmation modal state: null | item to delete
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Focus ref for accessible dialog focus management
  const nameInputRef = useRef(null);
  const cancelDeleteBtnRef = useRef(null);

  // Helper to persist list safely
  const persistMedications = (newList) => {
    setMedications(newList);
    setStorageItem(STORAGE_KEY, newList);
  };

  // ----------------------------------------------------
  // OCR Apply Handler: Transfer reviewed text into Add Form
  // ----------------------------------------------------
  const handleApplyOCRText = (reviewedText) => {
    if (!reviewedText || !reviewedText.trim()) return;

    const trimmedOCR = reviewedText.trim();

    // If form is already open, preserve existing instructions by appending or setting cleanly
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions
        ? `${prev.instructions}\n${trimmedOCR}`
        : trimmedOCR,
    }));

    setFormError('');
    setIsScannerOpen(false);

    // If form was not open, open it in 'add' mode so user can review and save
    setFormState({ mode: 'add' });
  };

  // ----------------------------------------------------
  // Form Handlers: Open Add / Edit, Validate, Save, Cancel
  // ----------------------------------------------------
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      instructions: '',
      times: '',
      notes: '',
    });
    setFormError('');
    setFormState({ mode: 'add' });
  };

  const handleOpenEdit = (item) => {
    setFormData({
      name: item.name || '',
      instructions: item.instructions || '',
      times: item.times || '',
      notes: item.notes || '',
    });
    setFormError('');
    setFormState({ mode: 'edit', item });
  };

  const handleCloseForm = () => {
    setFormState(null);
    setFormError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setFormError(t('medications.nameRequiredError'));
      return;
    }

    if (formState.mode === 'add') {
      const newEntry = {
        id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: trimmedName,
        instructions: formData.instructions.trim(),
        times: formData.times.trim(),
        notes: formData.notes.trim(),
        createdAt: new Date().toISOString(),
      };
      persistMedications([newEntry, ...medications]);
    } else if (formState.mode === 'edit' && formState.item) {
      const updatedList = medications.map((med) => {
        if (med.id === formState.item.id) {
          return {
            ...med,
            name: trimmedName,
            instructions: formData.instructions.trim(),
            times: formData.times.trim(),
            notes: formData.notes.trim(),
            updatedAt: new Date().toISOString(),
          };
        }
        return med;
      });
      persistMedications(updatedList);
    }

    handleCloseForm();
  };

  // ----------------------------------------------------
  // Delete Handlers: Open Confirmation, Confirm, Cancel
  // ----------------------------------------------------
  const handleOpenDelete = (item) => {
    setDeleteTarget(item);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const filtered = medications.filter((m) => m.id !== deleteTarget.id);
    persistMedications(filtered);
    handleCloseDelete();
  };

  // Keyboard accessibility: Escape key listener for open modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (formState) {
          setFormState(null);
          setFormError('');
        } else if (deleteTarget) {
          setDeleteTarget(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formState, deleteTarget]);

  // Accessible auto-focus when dialog opens
  useEffect(() => {
    if (formState && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [formState]);

  useEffect(() => {
    if (deleteTarget && cancelDeleteBtnRef.current) {
      cancelDeleteBtnRef.current.focus();
    }
  }, [deleteTarget]);

  // ----------------------------------------------------
  // Client-Side Search Filtering
  // ----------------------------------------------------
  const filteredMedications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return medications;
    return medications.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [medications, searchQuery]);

  // Format creation date for display
  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. PAGE HEADER & PRIMARY ACTION                          */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0 shadow-xs">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-charcoal">
                {t('medications.pageTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-muted">
                {t('medications.pageSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons: Scan Prescription (Secondary) & Add Medication (Primary) */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="inline-flex items-center justify-center gap-2.5 bg-surface hover:bg-surface-alt text-charcoal font-bold px-5 py-3 rounded-2xl border-2 border-border-line transition-all shadow-xs hover:border-primary text-sm sm:text-base min-h-[52px] cursor-pointer"
          >
            <Camera className="w-5 h-5 text-primary" />
            <span>{t('ocr.modalTitle')}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md text-base sm:text-lg min-h-[52px] cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
            <span>{t('medications.btnAdd')}</span>
          </button>
        </div>
      </div>

      {/* Local Storage Transparency Notice */}
      <div className="bg-surface rounded-xl border border-border-line p-3 sm:p-4 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-body leading-relaxed">
          {t('medications.storageNotice')}
        </p>
      </div>

      {/* ========================================================= */}
      {/* 2. SEARCH BAR & STATS BAR                                */}
      {/* ========================================================= */}
      {medications.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Input Field */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('medications.searchPlaceholder')}
                className="w-full min-h-[56px] ps-12 pe-12 py-3 rounded-2xl border-2 border-border-line bg-surface text-charcoal text-base placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                aria-label={t('medications.searchPlaceholder')}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={t('medications.searchClear')}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal p-2 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Total / Filtered Counts */}
            <div className="text-sm sm:text-base font-bold text-muted flex items-center gap-2">
              <span>{t('medications.totalCount')}</span>
              <span className="text-charcoal bg-surface px-3 py-1.5 rounded-xl border-2 border-border-line text-lg font-black">
                {searchQuery ? `${filteredMedications.length} / ${medications.length}` : medications.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. LIST OF MEDICATIONS / EMPTY STATES                    */}
      {/* ========================================================= */}
      {medications.length === 0 ? (
        // Empty State: No medications in storage
        <div className="bg-surface rounded-2xl border border-border-line p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-xs">
            <Pill className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-charcoal">
              {t('medications.emptyTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-body leading-relaxed max-w-sm mx-auto">
              {t('medications.emptyDesc')}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-xl transition-all shadow-xs text-sm sm:text-base min-h-[48px]"
          >
            <Plus className="w-5 h-5" />
            <span>{t('medications.emptyAction')}</span>
          </button>
        </div>
      ) : filteredMedications.length === 0 ? (
        // Empty State: Search yielded no matches
        <div className="bg-surface rounded-2xl border border-border-line p-8 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-surface-alt text-muted flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-charcoal">
              {t('medications.noSearchResultsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto">
              {t('medications.noSearchResultsDesc').replace('{query}', searchQuery)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-alt text-charcoal font-bold px-4 py-2.5 rounded-xl border border-border-line transition-all text-sm min-h-[44px]"
          >
            <X className="w-4 h-4" />
            <span>{t('medications.clearSearchAction')}</span>
          </button>
        </div>
      ) : (
        // Grid of Medication Cards
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMedications.map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-3xl border-2 border-border-line p-6 sm:p-7 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between gap-6"
            >
              {/* Card Header: Name & Actions */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0 shadow-xs">
                      <Pill className="w-7 h-7" />
                    </div>
                    <div className="min-w-0 text-start">
                      <h2 className="text-xl sm:text-2xl font-black text-charcoal truncate">
                        {item.name}
                      </h2>
                      {item.createdAt && (
                        <p className="text-xs sm:text-sm text-muted flex items-center gap-1.5 mt-1 font-semibold">
                          <Calendar className="w-4 h-4" />
                          <span>{t('medications.createdAtLabel')} {formatDate(item.createdAt)}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Edit and Delete Action Buttons (Min height 48px, obvious icons) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      aria-label={`${t('medications.actionEdit')} ${item.name}`}
                      className="px-3.5 py-2.5 text-primary hover:bg-primary-light rounded-xl border border-primary/30 transition-all min-h-[48px] flex items-center gap-1.5 font-bold text-sm cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>{t('medications.actionEdit')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(item)}
                      aria-label={`${t('medications.actionDelete')} ${item.name}`}
                      className="px-3 py-2.5 text-status-error hover:bg-status-error-bg rounded-xl border border-status-error/30 transition-all min-h-[48px] flex items-center gap-1.5 font-bold text-sm cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{t('medications.actionDelete')}</span>
                    </button>
                  </div>
                </div>

                {/* Card Body: Details */}
                <div className="space-y-3 pt-3 border-t-2 border-border-subtle text-start">
                  {/* Instructions */}
                  {item.instructions && (
                    <div className="space-y-1">
                      <span className="font-bold text-charcoal flex items-center gap-2 text-sm text-muted">
                        <FileText className="w-4 h-4 text-primary" />
                        {t('medications.instructionsLabel')}
                      </span>
                      <p className="text-body ps-6 leading-relaxed font-semibold text-base sm:text-lg">
                        {item.instructions}
                      </p>
                    </div>
                  )}

                  {/* Scheduled Times */}
                  <div className="space-y-0.5">
                    <span className="font-bold text-charcoal flex items-center gap-1.5 text-xs text-muted">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {t('medications.timesLabel')}
                    </span>
                    <p className="text-body ps-5 leading-relaxed">
                      {item.times ? (
                        <span className="inline-block bg-surface-alt font-semibold text-charcoal px-2.5 py-0.5 rounded-md border border-border-subtle">
                          {item.times}
                        </span>
                      ) : (
                        <span className="text-muted italic">{t('medications.noTimesSpecified')}</span>
                      )}
                    </p>
                  </div>

                  {/* Special Notes */}
                  {item.notes && (
                    <div className="space-y-0.5 pt-1">
                      <span className="font-bold text-charcoal flex items-center gap-1.5 text-xs text-muted">
                        <Info className="w-3.5 h-3.5 text-muted" />
                        {t('medications.notesLabel')}
                      </span>
                      <p className="text-muted ps-5 leading-relaxed">
                        {item.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Card Footer: Edit link */}
              <div className="pt-2 border-t border-border-subtle flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 py-1 px-2 rounded-md hover:bg-primary-light"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{t('medications.actionEdit')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. ADD / EDIT FORM MODAL                                  */}
      {/* ========================================================= */}
      {formState && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-surface rounded-2xl border border-border-line shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-border-subtle flex items-center justify-between gap-3">
              <div>
                <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-charcoal">
                  {formState.mode === 'add'
                    ? t('medications.formAddTitle')
                    : t('medications.formEditTitle')}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {t('medications.formSubtitle')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseForm}
                className="p-2 text-muted hover:text-charcoal hover:bg-surface-alt rounded-lg transition-all"
                aria-label={t('common.cancel')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4">
              {/* Validation Error Message */}
              {formError && (
                <div
                  role="alert"
                  className="bg-status-danger-bg text-status-danger border border-status-danger/40 p-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 font-semibold"
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Field 1: Medication Name (Required) */}
              <div className="space-y-1.5">
                <label htmlFor="med-name" className="block text-xs sm:text-sm font-bold text-charcoal">
                  {t('medications.nameLabel')} <span className="text-status-danger">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="med-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formError) setFormError('');
                  }}
                  placeholder={t('medications.namePlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-line bg-surface text-charcoal text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Field 2: Instructions (Optional) */}
              <div className="space-y-1.5">
                <label htmlFor="med-instructions" className="block text-xs sm:text-sm font-bold text-charcoal">
                  {t('medications.instructionsFieldLabel')}
                </label>
                <textarea
                  id="med-instructions"
                  rows={2}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder={t('medications.instructionsPlaceholder')}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-line bg-surface text-charcoal text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Field 3: Scheduled Times (Optional) */}
              <div className="space-y-1.5">
                <label htmlFor="med-times" className="block text-xs sm:text-sm font-bold text-charcoal">
                  {t('medications.timesFieldLabel')}
                </label>
                <input
                  id="med-times"
                  type="text"
                  value={formData.times}
                  onChange={(e) => setFormData({ ...formData, times: e.target.value })}
                  placeholder={t('medications.timesPlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-line bg-surface text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <p className="text-[11px] text-muted leading-tight">{t('medications.timesHelp')}</p>
              </div>

              {/* Field 4: Special Notes (Optional) */}
              <div className="space-y-1.5">
                <label htmlFor="med-notes" className="block text-xs sm:text-sm font-bold text-charcoal">
                  {t('medications.notesFieldLabel')}
                </label>
                <textarea
                  id="med-notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('medications.notesPlaceholder')}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-line bg-surface text-charcoal text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Safety notice in form */}
              <div className="bg-surface-alt p-3 rounded-xl border border-border-subtle flex items-start gap-2">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs text-muted leading-relaxed">
                  {t('medications.safetyDisclaimer')}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-border-subtle flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2.5 rounded-xl border border-border-line text-charcoal hover:bg-surface-alt font-semibold text-sm transition-all min-h-[44px]"
                >
                  {t('medications.btnCancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-xs transition-all min-h-[44px]"
                >
                  {formState.mode === 'add'
                    ? t('medications.btnSave')
                    : t('medications.btnSaveEdit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. DELETE CONFIRMATION MODAL                             */}
      {/* ========================================================= */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-surface rounded-2xl border border-border-line shadow-xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-status-danger-bg text-status-danger flex items-center justify-center flex-shrink-0 shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 id="delete-dialog-title" className="text-base sm:text-lg font-bold text-charcoal">
                  {t('medications.deleteTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-body leading-relaxed">
                  {t('medications.deleteWarning')}
                </p>
              </div>
            </div>

            {/* Highlighted item to be removed */}
            <div className="p-3 bg-surface-alt rounded-xl border border-border-subtle space-y-1">
              <span className="text-xs text-muted block">{t('medications.deleteItemName')}</span>
              <p className="text-sm sm:text-base font-bold text-charcoal flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                <span>{deleteTarget.name}</span>
              </p>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {t('medications.deleteIrreversible')}
            </p>

            {/* Actions */}
            <div className="pt-2 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                ref={cancelDeleteBtnRef}
                type="button"
                onClick={handleCloseDelete}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border-line text-charcoal hover:bg-surface-alt font-semibold text-sm transition-all min-h-[44px]"
              >
                {t('medications.btnCancelDelete')}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-status-danger hover:bg-red-700 text-white font-bold text-sm shadow-xs transition-all min-h-[44px]"
              >
                {t('medications.btnConfirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. PRESCRIPTION SCANNER MODAL                             */}
      {/* ========================================================= */}
      <PrescriptionScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplyText={handleApplyOCRText}
      />
    </div>
  );
}
