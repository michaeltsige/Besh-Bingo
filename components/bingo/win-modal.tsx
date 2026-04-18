"use client";

import { AnimatePresence, motion } from "motion/react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BingoCell } from "@/lib/bingo/types";

interface WinModalProps {
  visible: boolean;
  card: BingoCell[][];
  timer: number;
  cartelaNumber?: number;
  onBackToLobby: () => void;
}

export function WinModal({
  visible,
  card,
  timer,
  cartelaNumber = 410,
  onBackToLobby,
}: WinModalProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] px-6"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full bg-bingo-purple rounded-[32px] p-6 border border-white/20 relative overflow-hidden flex flex-col items-center text-center shadow-2xl"
          >
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-bingo-gold/20 to-transparent pointer-events-none" />

            <Trophy
              size={64}
              className="text-bingo-gold mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]"
            />

            <h2 className="text-4xl font-display font-black text-white italic mb-2 tracking-tighter">
              BINGO!
            </h2>
            <p className="text-bingo-gold font-black uppercase tracking-widest text-sm mb-6">
              🏆 @[USER] WON! 🏆
            </p>

            <div className="bg-black/30 p-2 rounded-2xl border border-white/10 w-full mb-6">
              <p className="text-[8px] font-bold text-gray-500 uppercase mb-2 tracking-widest">
                Winning Cartela #{cartelaNumber}
              </p>
              <div className="grid grid-cols-5 gap-0.5">
                {card.map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={cn(
                        "aspect-square rounded-[2px] flex items-center justify-center text-[7px] font-bold",
                        cell.marked
                          ? "bg-bingo-green text-white"
                          : "bg-white/5 text-white/20",
                      )}
                    >
                      {cell.number === "FREE" ? "★" : cell.number}
                    </div>
                  )),
                )}
              </div>
            </div>

            <div className="w-full bg-white/5 py-2 px-4 rounded-full border border-white/10 flex items-center justify-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-bingo-gold animate-ping" />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                Next game in {timer}s
              </span>
            </div>

            <button
              onClick={onBackToLobby}
              className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm active:scale-[0.98] transition-all"
            >
              BACK TO LOBBY
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
