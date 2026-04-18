"use client"

import { Gamepad2, History, Trophy } from "lucide-react"
import { ScreenWrapper } from "@/components/bingo/screen-wrapper"

interface WalletScreenProps {
  phone?: string
  mainBalance?: number
  playBalance?: number
  activityCount?: number
}

export function WalletScreen({
  phone = "918015052740",
  mainBalance = 0,
  playBalance = 0,
  activityCount = 0,
}: WalletScreenProps) {
  const total = mainBalance + playBalance

  return (
    <ScreenWrapper screenKey="wallet">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 px-1">
        <div>
          <h2 className="text-xl font-display font-extrabold text-white tracking-wide">MY WALLET</h2>
          <p className="text-[11px] font-mono text-gray-500 mt-0.5">{phone}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/5 text-bingo-accent text-[10px] font-black uppercase tracking-widest border border-white/10">
          Verified
        </span>
      </div>

      {/* Two wallet cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <WalletCard
          label="Main Wallet"
          value={mainBalance}
          accent="text-bingo-green"
          ring="ring-bingo-green/30"
          icon={<Trophy size={14} className="text-bingo-green" />}
        />
        <WalletCard
          label="Play Wallet"
          value={playBalance}
          accent="text-bingo-accent"
          ring="ring-bingo-accent/30"
          icon={<Gamepad2 size={14} className="text-bingo-accent" />}
        />
      </div>

      {/* Total available */}
      <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 mb-6">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Available</span>
        <span className="text-white font-mono font-bold">
          {total} <span className="text-gray-500 text-xs">ETB</span>
        </span>
      </div>

      {/* Recent activity */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Recent Activity</span>
        <span className="text-[10px] font-black text-bingo-accent uppercase tracking-widest">
          {activityCount} Total
        </span>
      </div>
      <div className="border-t border-white/5 mb-8" />

      {/* Empty state */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-30">
        <History size={72} className="text-gray-500" strokeWidth={1.5} />
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">No Activity Found</p>
      </div>

      <p className="text-center text-[10px] font-semibold text-gray-500 uppercase tracking-widest pb-6 pt-4">
        Manage your funds in the Telegram bot chat
      </p>
    </ScreenWrapper>
  )
}

interface WalletCardProps {
  label: string
  value: number
  accent: string
  ring: string
  icon: React.ReactNode
}

function WalletCard({ label, value, accent, ring, icon }: WalletCardProps) {
  return (
    <div className={`bg-white/[0.03] rounded-2xl border border-white/5 p-3 ring-1 ${ring}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">{icon}</span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${accent}`}>{label}</span>
      </div>
      <p className="text-white font-mono text-2xl font-extrabold leading-none">
        {value} <span className={`text-xs font-bold ${accent}`}>ETB</span>
      </p>
    </div>
  )
}
