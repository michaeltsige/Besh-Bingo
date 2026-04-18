"use client";

import { motion } from "motion/react";
import { VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenWrapper } from "@/components/bingo/screen-wrapper";

interface ProfileScreenProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
  username?: string;
  initial?: string;
  mainBalance?: number;
  playBalance?: number;
  gameWin?: number;
  totalInvite?: number;
  totalEarned?: number;
}

export function ProfileScreen({
  soundEnabled,
  onToggleSound,
  username = "Mock User",
  initial = "M",
  mainBalance = 0,
  playBalance = 0,
  gameWin = 0,
  totalInvite = 0,
  totalEarned = 0,
}: ProfileScreenProps) {
  return (
    <ScreenWrapper screenKey="profile">
      {/* Avatar + username */}
      <div className="flex flex-col items-center mb-8 mt-2">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl bg-bingo-deep-purple border-2 border-bingo-accent flex items-center justify-center shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)]">
            <span className="text-3xl font-black text-white">{initial}</span>
          </div>
        </div>
        <h2 className="text-xl font-display font-extrabold text-white">
          @{username}
        </h2>
        <p className="text-bingo-accent text-[10px] font-black uppercase tracking-[0.25em] mt-1">
          Verified Player
        </p>
      </div>

      {/* Wallet cards */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <ProfileWalletCard
          label="Main Wallet"
          value={mainBalance}
          accent="text-bingo-green"
          subtitle="Withdrawable"
          subtitleColor="text-bingo-green"
        />
        <ProfileWalletCard
          label="Play Wallet"
          value={playBalance}
          accent="text-bingo-accent"
          subtitle="Game Credits"
          subtitleColor="text-bingo-accent"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Game Win" value={gameWin} color="text-bingo-gold" />
        <StatCard
          label="Total Invite"
          value={totalInvite}
          color="text-blue-400"
        />
        <StatCard
          label="Total Earned"
          value={totalEarned}
          color="text-bingo-green"
        />
      </div>

      {/* Sound Effects row */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bingo-red/15 flex items-center justify-center text-bingo-red">
            <VolumeX size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">SOUND EFFECTS</span>
            <span className="text-[10px] text-gray-500">Toggle game audio</span>
          </div>
        </div>
        <button
          onClick={onToggleSound}
          className={cn(
            "w-12 h-6 rounded-full relative transition-colors p-1",
            soundEnabled ? "bg-bingo-green" : "bg-gray-700",
          )}
          aria-label="Toggle sound effects"
          aria-pressed={soundEnabled}
        >
          <motion.div
            animate={{ x: soundEnabled ? 24 : 0 }}
            className="w-4 h-4 bg-white rounded-full"
          />
        </button>
      </div>
    </ScreenWrapper>
  );
}

function ProfileWalletCard({
  label,
  value,
  accent,
  subtitle,
  subtitleColor,
}: {
  label: string;
  value: number;
  accent: string;
  subtitle: string;
  subtitleColor: string;
}) {
  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-4 flex flex-col gap-1">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      <p className="text-white font-mono text-2xl font-extrabold leading-none mt-1">
        {value} <span className={`text-xs font-bold ${accent}`}>ETB</span>
      </p>
      <span className={`text-[10px] font-semibold mt-1 ${subtitleColor}`}>
        {subtitle}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/5 p-3 flex flex-col items-center gap-1">
      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
        {label}
      </span>
      <span className={`text-2xl font-mono font-extrabold ${color}`}>
        {value}
      </span>
    </div>
  );
}
