// src/pages/admin/Trades.tsx

import React, { useEffect, useState } from 'react';
import { adminService } from '../../api/services/adminService';
import { TradeMonitoringResponse } from '../../types/admin.types';
import {
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  XCircle,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';

const Trades: React.FC = () => {
  const [trades, setTrades] = useState<TradeMonitoringResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [symbolFilter, setSymbolFilter] = useState('');

  useEffect(() => {
    loadTrades();
  }, [statusFilter, symbolFilter]);

  const loadTrades = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTrades({
        status: statusFilter || undefined,
        symbol: symbolFilter || undefined,
      });
      setTrades(data);
    } catch (error) {
      console.error('Failed to load trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceClose = async (tradeId: string) => {
    if (!window.confirm('Are you sure you want to force close this trade?')) return;

    try {
      await adminService.forceCloseTrade(tradeId);
      loadTrades();
    } catch (error) {
      console.error('Failed to force close trade:', error);
    }
  };

  const totalVolume = trades.reduce((sum, t) => sum + t.position_size_usd, 0);
  const totalPnL = trades
    .filter((t) => t.status === 'open')
    .reduce((sum, t) => sum + t.unrealized_pnl_usd, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Trade Monitoring
          </h1>
          <p className="text-gray-400 mt-1">Real-time trade oversight and management</p>
        </div>

        <div className="flex gap-4">
          <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-cyan-500/20">
            <p className="text-gray-400 text-xs mb-1">Total Volume</p>
            <p className="text-white font-bold text-lg">${totalVolume.toLocaleString()}</p>
          </div>
          <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-cyan-500/20">
            <p className="text-gray-400 text-xs mb-1">Open P&L</p>
            <p
              className={`font-bold text-lg ${
                totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              ${totalPnL.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Filter by symbol..."
              value={symbolFilter}
              onChange={(e) => setSymbolFilter(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 appearance-none"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trades Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-cyan-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Symbol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Side
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Entry
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Leverage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    P&L
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium text-sm">{trade.user_email}</p>
                        <p className="text-gray-400 text-xs">{trade.user_id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold">{trade.symbol}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          trade.side === 'long'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {trade.side === 'long' ? (
                          <>
                            <TrendingUp size={12} /> LONG
                          </>
                        ) : (
                          <>
                            <TrendingDown size={12} /> SHORT
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">${trade.entry_price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{trade.quantity}</p>
                        <p className="text-gray-400 text-xs">
                          ${trade.position_size_usd.toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-purple-400 font-bold">{trade.leverage}x</span>
                    </td>
                    <td className="px-6 py-4">
                      {trade.status === 'open' ? (
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className={trade.unrealized_pnl_usd >= 0 ? 'text-green-400' : 'text-red-400'} />
                          <span
                            className={`font-bold ${
                              trade.unrealized_pnl_usd >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            ${trade.unrealized_pnl_usd.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">
                          ${(trade.realized_pnl_usd || 0).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          trade.status === 'open'
                            ? 'bg-blue-500/20 text-blue-400'
                            : trade.status === 'closed'
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {trade.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {trade.status === 'open' && (
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleForceClose(trade.id)}
                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                            title="Force close trade"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-yellow-400 font-semibold mb-1">Force Close Warning</h4>
          <p className="text-gray-300 text-sm">
            Force closing trades should only be used in emergency situations. This action will
            immediately close the position at market price and cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Trades;