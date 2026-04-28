// ============================================================
// FILE: components/bingo/screens/cartela-selection-screen.tsx
// ============================================================

"use client";

import { useState } from "react";
import { Clock, Check, X, ShoppingCart, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartelaSelectionScreenProps {
  cartelaStatuses: Array<{
    id: number;
    status: string;
    isMine: boolean;
    isTaken: boolean;
    isAvailable: boolean;
  }>;
  selectedIds: number[];
  timer: number;
  onSelectCartela: (id: number) => void;
  stake: number;
  playBalance?: number;
}

export function CartelaSelectionScreen({
  cartelaStatuses = [],
  selectedIds = [],
  timer = 30,
  onSelectCartela,
  stake=10,
  playBalance = 0,
}: CartelaSelectionScreenProps) {
  const maxCartelas = 2;
  const totalCost = selectedIds.length * stake;
  const canAfford = playBalance >= totalCost;

  // Build rows of 8
  const rows: Array<typeof cartelaStatuses> = [];
  for (let i = 0; i < cartelaStatuses.length; i += 8) {
    rows.push(cartelaStatuses.slice(i, i + 8));
  }

  // Only show first 80 cartelas (10 rows) to keep it performant
  const displayRows = rows.slice(0, 10);

  return (
    <div className="flex flex-col h-full">
      {/* Timer Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a2e] border-b border-[#333]">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-yellow-400" />
          <span className="text-yellow-400 font-bold text-lg">
            {timer}s
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ShoppingCart size={16} className="text-gray-400" />
          <span className="text-gray-300">
            Selected: {selectedIds.length}/{maxCartelas}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Coins size={16} className="text-green-400" />
          <span className="text-green-400">
            Cost: {totalCost} ETB
          </span>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full h-2 bg-[#1a1a2e]">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
          initial={{ width: "100%" }}
          animate={{ width: `${(timer / 30) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Cartela Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {displayRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-8 gap-1.5">
              {row.map((cartela) => {
                const isSelected = selectedIds.includes(cartela.id);
                const isDisabled =
                  !cartela.isAvailable &&
                  !cartela.isMine;

                return (
                  <motion.button
                    key={cartela.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (
                        cartela.isAvailable ||
                        cartela.isMine
                      ) {
                        onSelectCartela(cartela.id);
                      }
                    }}
                    disabled={
                      isDisabled ||
                      (selectedIds.length >= maxCartelas &&
                        !isSelected)
                    }
                    className={`
                      relative aspect-square rounded-lg text-sm font-bold
                      flex items-center justify-center
                      transition-all duration-200 border-2
                      ${
                        cartela.isMine
                          ? "bg-green-600 border-green-400 text-white shadow-lg shadow-green-600/30"
                          : cartela.isTaken
                            ? "bg-orange-600/50 border-orange-400/50 text-orange-200 cursor-not-allowed"
                            : selectedIds.length >= maxCartelas
                              ? "bg-[#2a2a4a] border-[#444] text-gray-500 cursor-not-allowed"
                              : "bg-[#2a2a4a] border-[#555] text-gray-300 hover:bg-[#3a3a5a] hover:border-yellow-400"
                      }
                    `}
                  >
                    {cartela.id}
                    {cartela.isMine && (
                      <Check
                        size={12}
                        className="absolute top-0.5 right-0.5 text-white"
                      />
                    )}
                    {cartela.isTaken && !cartela.isMine && (
                      <X
                        size={10}
                        className="absolute top-0.5 right-0.5 text-orange-300"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Load more hint */}
        {cartelaStatuses.length > 80 && (
          <p className="text-center text-gray-500 text-xs mt-3">
            Showing 80 of {cartelaStatuses.length} cartelas
          </p>
        )}
      </div>

      {/* Bottom Status */}
      <div className="px-4 py-3 bg-[#1a1a2e] border-t border-[#333]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Balance: {playBalance} ETB
          </span>
          <span
            className={
              canAfford || selectedIds.length === 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {!canAfford && selectedIds.length > 0
              ? "Insufficient balance"
              : "Game starting soon..."}
          </span>
        </div>
      </div>
    </div>
  );
}