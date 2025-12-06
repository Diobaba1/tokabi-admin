// =============================================================================
// FILE: src/components/signals/SignalDetailModal.tsx
// =============================================================================
// Signal Detail Modal - Full signal information view
// =============================================================================

import React from "react";
import { SignalDetail, SignalDecision, SignalStatus, SignalSource } from "../../types";
import {
  Modal,
  Button,
  SignalDecisionBadge,
  SignalStatusBadge,
  SignalSourceBadge,
  ProgressBar,
  Card,
  Spinner,
} from "../ui";

interface SignalDetailModalProps {
  signal: SignalDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onUpdateStatus?: (status: SignalStatus) => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({
  signal,
  isOpen,
  onClose,
  isLoading = false,
  onUpdateStatus,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "—";
    return price >= 1
      ? `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : `$${price.toFixed(6)}`;
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString();
  };

  const formatPercent = (value: number | null | undefined) => {
    if (!value) return "—";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Signal Details" size="lg">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : signal ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{signal.symbol}</h2>
                <SignalDecisionBadge
                  decision={signal.decision as SignalDecision}
                  size="lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <SignalSourceBadge source={signal.source as SignalSource} />
                <SignalStatusBadge status={signal.status as SignalStatus} />
              </div>
            </div>
            {signal.current_price && (
              <div className="text-right">
                <p className="text-sm text-slate-500">Current Price</p>
                <p className="text-xl font-bold text-white">
                  {formatPrice(signal.current_price)}
                </p>
              </div>
            )}
          </div>

          {/* Consensus Strength */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">
                Consensus Strength
              </span>
              <span className="text-lg font-bold text-white">
                {signal.consensus_strength.toFixed(1)}%
              </span>
            </div>
            <ProgressBar
              value={signal.consensus_strength}
              variant={
                signal.consensus_strength >= 80
                  ? "success"
                  : signal.consensus_strength >= 60
                  ? "warning"
                  : "danger"
              }
              size="md"
            />
            {signal.decision_method && (
              <p className="text-xs text-slate-500 mt-2">
                Method: {signal.decision_method}
              </p>
            )}
          </div>

          {/* Price Levels */}
          {signal.decision !== SignalDecision.HOLD && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Entry Price
                </p>
                <p className="text-lg font-bold text-white">
                  {formatPrice(signal.entry_price)}
                </p>
              </Card>
              <Card className="p-4 text-center border-rose-500/30 bg-rose-500/5">
                <p className="text-xs text-rose-400 uppercase tracking-wider mb-1">
                  Stop Loss
                </p>
                <p className="text-lg font-bold text-rose-400">
                  {formatPrice(signal.stop_loss_price)}
                </p>
                {signal.stop_loss_percent && (
                  <p className="text-xs text-rose-400/70">
                    {formatPercent(-Math.abs(signal.stop_loss_percent))}
                  </p>
                )}
              </Card>
              <Card className="p-4 text-center border-emerald-500/30 bg-emerald-500/5">
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">
                  Take Profit
                </p>
                <p className="text-lg font-bold text-emerald-400">
                  {formatPrice(signal.take_profit_price)}
                </p>
                {signal.take_profit_percent && (
                  <p className="text-xs text-emerald-400/70">
                    {formatPercent(signal.take_profit_percent)}
                  </p>
                )}
              </Card>
            </div>
          )}

          {/* Risk Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {signal.risk_reward_ratio && (
              <div className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Risk/Reward</p>
                <p className="text-lg font-bold text-white">
                  {signal.risk_reward_ratio.toFixed(2)}:1
                </p>
              </div>
            )}
            {signal.suggested_leverage && (
              <div className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Leverage</p>
                <p className="text-lg font-bold text-amber-400">
                  {signal.suggested_leverage.toFixed(1)}x
                </p>
              </div>
            )}
            {signal.avg_confidence && (
              <div className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Avg Confidence</p>
                <p className="text-lg font-bold text-white">
                  {(signal.avg_confidence * 100).toFixed(1)}%
                </p>
              </div>
            )}
            {signal.active_providers && (
              <div className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">LLM Providers</p>
                <p className="text-lg font-bold text-white">
                  {signal.active_providers}
                </p>
              </div>
            )}
          </div>

          {/* Provider Decisions */}
          {signal.providers && Object.keys(signal.providers).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Provider Decisions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(signal.providers).map(([provider, decision]) => (
                  <div
                    key={provider}
                    className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-between"
                  >
                    <span className="text-sm text-slate-300 capitalize">
                      {provider}
                    </span>
                    {decision.decision && (
                      <SignalDecisionBadge
                        decision={decision.decision}
                        size="sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning Summary */}
          {signal.reasoning_summary && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Analysis Summary
              </h3>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {signal.reasoning_summary}
                </p>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          {signal.admin_notes && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Admin Notes
              </h3>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <p className="text-sm text-amber-200 leading-relaxed">
                  {signal.admin_notes}
                </p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Created</p>
              <p className="text-slate-300">{formatDate(signal.created_at)}</p>
            </div>
            <div>
              <p className="text-slate-500">Expires</p>
              <p className="text-slate-300">{formatDate(signal.expires_at)}</p>
            </div>
            {signal.executed_at && (
              <div>
                <p className="text-slate-500">Executed</p>
                <p className="text-slate-300">{formatDate(signal.executed_at)}</p>
              </div>
            )}
            {signal.timeframes_analyzed && (
              <div>
                <p className="text-slate-500">Timeframes</p>
                <p className="text-slate-300">
                  {signal.timeframes_analyzed.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              {onUpdateStatus && signal.status === SignalStatus.ACTIVE && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onUpdateStatus(SignalStatus.EXECUTED)}
                  >
                    Mark Executed
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onUpdateStatus(SignalStatus.CANCELLED)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Edit Signal
                </Button>
              )}
              {isAdmin && onDelete && (
                <Button variant="danger" size="sm" onClick={onDelete}>
                  Delete
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          Signal not found
        </div>
      )}
    </Modal>
  );
};

export default SignalDetailModal;