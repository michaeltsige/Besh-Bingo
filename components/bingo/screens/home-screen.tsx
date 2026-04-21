"use client"

import { Play } from "lucide-react"
import { useState } from "react"
import { ScreenWrapper } from "@/components/bingo/screen-wrapper"
import { cn } from "@/lib/utils"

interface HomeScreenProps {
  onPlay: (stake: number) => void
  onWatch?: () => void
  walletBalance?: number
}

export function HomeScreen({ onPlay, onWatch, walletBalance = 0 }: HomeScreenProps) {
  const [selectedStake, setSelectedStake] = useState<10 | 20>(10)

  return (
    <ScreenWrapper screenKey="home">
      <div className="flex-1 flex flex-col items-center justify-center px-2 pb-20 -mt-8">
        {/* Welcome block */}
        <div className="text-center mb-8">
          <p className="text-gray-300 text-base mb-2 font-medium">Welcome to</p>
          <h2 className="text-5xl font-display font-black text-bingo-gold tracking-wide text-balance">BESH BINGO</h2>
        </div>

        {/* Stake card */}
        <div className="w-full bg-white/[0.04] px-6 py-8 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center gap-5 shadow-[0_0_60px_-20px_rgba(139,92,246,0.35)]">
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-200 text-[11px] font-bold uppercase tracking-[0.25em]">Choose Your Stake</p>
            <div className="h-[2px] w-12 bg-bingo-gold/70 rounded-full" />
          </div>

          {/* Stake Selection */}
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setSelectedStake(10)}
              className={cn(
                "flex-1 py-3 rounded-xl font-bold text-lg transition-all",
                selectedStake === 10
                  ? "bg-bingo-gold text-black shadow-lg shadow-bingo-gold/30"
                  : "bg-white/5 text-gray-400 border border-white/10"
              )}
            >
              10 ETB
            </button>
            <button
              onClick={() => setSelectedStake(20)}
              className={cn(
                "flex-1 py-3 rounded-xl font-bold text-lg transition-all",
                selectedStake === 20
                  ? "bg-bingo-gold text-black shadow-lg shadow-bingo-gold/30"
                  : "bg-white/5 text-gray-400 border border-white/10"
              )}
            >
              20 ETB
            </button>
          </div>

          <button
            onClick={() => onPlay(selectedStake)}
            className="w-full bg-bingo-green py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-lg tracking-wide shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)] active:scale-[0.98] transition-transform"
          >
            <Play size={20} fill="currentColor" />
            <span>PLAY {selectedStake}</span>
          </button>

          <div className="flex flex-col items-center mt-2">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">Wallet Balance</p>
            <p className="text-white font-mono text-2xl font-bold">{walletBalance}</p>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  )
}