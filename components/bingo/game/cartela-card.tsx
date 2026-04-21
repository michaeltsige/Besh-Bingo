"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BingoCell } from "@/lib/bingo/types"

interface CartelaCardProps {
  card: BingoCell[][]
  onCellClick: (row: number, col: number) => void
  cartelaNumber?: number
}

export function CartelaCard({ card, onCellClick, cartelaNumber = 410 }: CartelaCardProps) {
  return (
    <div className="bg-black/20 p-2 rounded-xl border border-white/5 scale-95 origin-top">
      <p className="text-center text-[8px] font-bold text-gray-500 uppercase mb-2 tracking-widest">
        Cartela #{cartelaNumber}
      </p>
      <div className="grid grid-cols-5 gap-1">
        {["B", "I", "N", "G", "O"].map((l) => (
          <div
            key={l}
            className="aspect-square bg-blue-600 rounded flex items-center justify-center text-[10px] font-black text-white"
          >
            {l}
          </div>
        ))}
        {card.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              className={cn(
                "aspect-square rounded flex items-center justify-center text-[10px] font-bold transition-all relative overflow-hidden",
                cell.marked
                  ? "bg-bingo-gold text-black shadow-inner shadow-black/20"
                  : "bg-white/10 text-white border border-white/5",
                cell.number === "FREE" && "bg-bingo-accent text-white",
              )}
            >
              {cell.number === "FREE" ? <Star size={10} fill="white" /> : cell.number}
            </button>
          )),
        )}
      </div>
    </div>
  )
}

export function WatchingBanner() {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-6 px-2">
      <h3 className="text-white font-display font-black text-2xl leading-tight tracking-wide">
        WATCHING
        <br />
        ONLY
      </h3>
      <p className="text-xs text-gray-400 leading-relaxed font-semibold max-w-[180px]">
        Game already
        <br />
        started
        <br />
        Wait for
        <br />
        round end.
      </p>
    </div>
  )
}
