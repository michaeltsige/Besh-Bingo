"use client"

import { AnimatePresence, motion } from "motion/react"
import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Cartela } from "@/lib/bingo/types"

interface WinModalProps {
  visible: boolean
  winningCartela: Cartela | null
  timer: number
  onBackToLobby: () => void
}

export function WinModal({ visible, winningCartela, timer, onBackToLobby }: WinModalProps) {
  const cartelaNumber = winningCartela?.id || 410
  const card = winningCartela?.card || []

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

            <Trophy size={64} className="text-bingo-gold mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />

            <h2 className="text-4xl font-display font-black text-white italic mb-2 tracking-tighter">BINGO!</h2>
            <p className="text-bingo-gold font-black uppercase tracking-widest text-sm mb-6">🏆 @YOU WON! 🏆</p>

            <div className="bg-black/30 p-2 rounded-2xl border border-white/10 w-full mb-6">
              <p className="text-[8px] font-bold text-gray-500 uppercase mb-2 tracking-widest">
                Winning Cartela #{cartelaNumber}
              </p>
              <div className="grid grid-cols-5 gap-0.5">
                {card && card.length > 0 ? (
                  card.map((row, r) =>
                    row && row.length > 0 ? (
                      row.map((cell, c) => (
                        <div
                          key={`${r}-${c}`}
                          className={cn(
                            "aspect-square rounded-[2px] flex items-center justify-center text-[7px] font-bold",
                            cell && cell.marked ? "bg-bingo-green text-white" : "bg-white/5 text-white/20",
                          )}
                        >
                          {cell && cell.number === "FREE" ? "★" : cell?.number ?? ""}
                        </div>
                      ))
                    ) : null
                  )
                ) : (
                  <div className="col-span-5 text-center text-gray-500 py-2">Loading card...</div>
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
  )
}