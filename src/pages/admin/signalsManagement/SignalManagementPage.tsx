// =============================================================================
// FILE: src/pages/admin/signals/SignalManagementPage.tsx
// =============================================================================
// Dedicated Signal Management Page for Admin
// =============================================================================

import React, { useState, useCallback } from "react";
import {
  useAdminSignals,
  useSignalDetail,
  useAvailableSymbols,
} from "../../../components/hooks";
import {
  Signal,
  SignalDetail as SignalDetailType,
  SignalCreateRequest,
  SignalUpdateRequest,
  SignalStatus,
} from "../../../types";
import { AdminSignalsManagement } from "../../../components/admin/AdminSignalsManagement";
import { SignalDetailModal } from "../../../components/signals/SignalDetailModal";
import { SignalForm } from "../../../components/signals/SignalForm";

const SignalManagementPage: React.FC = () => {
  // State
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingSignal, setEditingSignal] = useState<SignalDetailType | null>(null);

  // Hooks
  const {
    signals,
    isLoading,
    error,
    filters,
    fetchSignals,
    createSignal,
    updateSignal,
    deleteSignal,
    bulkDelete,
    cleanupExpired,
    updateFilters,
  } = useAdminSignals();

  const { signal: selectedSignal, isLoading: isLoadingDetail } =
    useSignalDetail(selectedSignalId);
  const { symbols } = useAvailableSymbols();

  // Handlers
  const handleViewSignal = useCallback((signal: Signal) => {
    setSelectedSignalId(signal.id);
    setShowDetailModal(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedSignalId(null);
  }, []);

  const handleCreateSignal = useCallback(() => {
    setFormMode("create");
    setEditingSignal(null);
    setShowFormModal(true);
  }, []);

  const handleEditSignal = useCallback((signal: Signal) => {
    setFormMode("edit");
    setSelectedSignalId(signal.id);
    setEditingSignal(signal as SignalDetailType);
    setShowFormModal(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: SignalCreateRequest | SignalUpdateRequest) => {
      if (formMode === "create") {
        await createSignal(data as SignalCreateRequest);
      } else if (selectedSignalId) {
        await updateSignal(selectedSignalId, data as SignalUpdateRequest);
      }
      setShowFormModal(false);
      setEditingSignal(null);
      setSelectedSignalId(null);
      fetchSignals();
    },
    [formMode, selectedSignalId, createSignal, updateSignal, fetchSignals]
  );

  const handleDeleteSignal = useCallback(
    async (signalId: string) => {
      if (window.confirm("Are you sure you want to delete this signal?")) {
        await deleteSignal(signalId);
      }
    },
    [deleteSignal]
  );

  const handleBulkDelete = useCallback(
    async (signalIds: string[]) => {
      if (window.confirm(`Delete ${signalIds.length} signals?`)) {
        await bulkDelete(signalIds);
      }
    },
    [bulkDelete]
  );

  const handleCleanupExpired = useCallback(async () => {
    const result = await cleanupExpired();
    alert(result.message);
  }, [cleanupExpired]);

  const handleUpdateSignalStatus = useCallback(
    async (status: SignalStatus) => {
      if (!selectedSignalId) return;
      await updateSignal(selectedSignalId, { status });
      handleCloseDetailModal();
      fetchSignals();
    },
    [selectedSignalId, updateSignal, fetchSignals, handleCloseDetailModal]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Signal Management</h1>
          <p className="text-slate-400 mt-1">
            Create, edit, and manage trading signals
          </p>
        </div>
      </div>

      {/* Signal Management Component */}
      <AdminSignalsManagement
        signals={signals}
        isLoading={isLoading}
        error={error}
        filters={filters}
        onFilterChange={updateFilters}
        onCreateSignal={handleCreateSignal}
        onEditSignal={handleEditSignal}
        onDeleteSignal={handleDeleteSignal}
        onBulkDelete={handleBulkDelete}
        onCleanupExpired={handleCleanupExpired}
        onViewSignal={handleViewSignal}
        availableSymbols={symbols}
      />

      {/* Signal Detail Modal */}
      <SignalDetailModal
        signal={selectedSignal}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        isLoading={isLoadingDetail}
        onUpdateStatus={handleUpdateSignalStatus}
        isAdmin={true}
        onEdit={() => {
          handleCloseDetailModal();
          if (selectedSignal) {
            handleEditSignal(selectedSignal as Signal);
          }
        }}
        onDelete={() => {
          if (selectedSignalId && window.confirm("Delete this signal?")) {
            deleteSignal(selectedSignalId);
            handleCloseDetailModal();
          }
        }}
      />

      {/* Signal Form Modal */}
      <SignalForm
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingSignal(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingSignal}
        isLoading={isLoading}
        mode={formMode}
        availableSymbols={symbols}
      />
    </div>
  );
};

export default SignalManagementPage;