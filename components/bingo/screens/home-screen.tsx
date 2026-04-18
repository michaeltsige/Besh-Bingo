"use client";

import { Play } from "lucide-react";
import { ScreenWrapper } from "@/components/bingo/screen-wrapper";

interface HomeScreenProps {
  onPlay: () => void;
  /** Kept for future UI (watch-only mode is still supported by the hook). */
  onWatch?: () => void;
  walletBalance?: number;
  stake?: number;
}

export function HomeScreen({
  onPlay,
  walletBalance = 0,
  stake = 10,
}: HomeScreenProps) {
  return (
    <ScreenWrapper screenKey="home">
      <div className="flex-1 flex flex-col items-center justify-center px-2 pb-20 -mt-8">
        {/* Welcome block */}
        <div className="text-center mb-8">
          <p className="text-gray-300 text-base mb-2 font-medium">Welcome to</p>
          <h2 className="text-5xl font-display font-black text-bingo-gold tracking-wide text-balance">
            Besh BINGO
          </h2>
        </div>

        {/* Stake card */}
        <div className="w-full bg-white/[0.04] px-6 py-8 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col items-center gap-5 shadow-[0_0_60px_-20px_rgba(139,92,246,0.35)]">
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-200 text-[11px] font-bold uppercase tracking-[0.25em]">
              Choose Your Stake
            </p>
            <div className="h-[2px] w-12 bg-bingo-gold/70 rounded-full" />
          </div>

          <button
            onClick={onPlay}
            className="w-full bg-bingo-green py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-lg tracking-wide shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)] active:scale-[0.98] transition-transform"
          >
            <Play size={20} fill="currentColor" />
            <span>PLAY {stake}</span>
          </button>

          <div className="flex flex-col items-center mt-2">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-1">
              Wallet Balance
            </p>
            <p className="text-white font-mono text-2xl font-bold">
              {walletBalance}
            </p>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}
