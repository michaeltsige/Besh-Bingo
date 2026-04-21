"use client"

import { Gamepad2, History, Trophy, User, Wallet } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { TabType } from "@/lib/bingo/types"

interface NavTab {
  id: TabType
  icon: ReactNode
  label: string
}

const NAV_TABS: NavTab[] = [
  { id: "game", icon: <Gamepad2 size={24} />, label: "GAME" },
  { id: "scores", icon: <Trophy size={24} />, label: "SCORES" },
  { id: "history", icon: <History size={24} />, label: "HISTORY" },
  { id: "wallet", icon: <Wallet size={24} />, label: "WALLET" },
  { id: "profile", icon: <User size={24} />, label: "PROFILE" },
]

interface BottomNavProps {
  activeTab: TabType
  onChange: (tab: TabType) => void
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="absolute bottom-0 w-full bg-bingo-purple/90 backdrop-blur-2xl border-t border-white/10 px-4 py-2 flex justify-between items-center z-40"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      {NAV_TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-14 transition-all",
              isActive ? "text-bingo-green scale-110" : "text-gray-500",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <div className={cn("transition-all", isActive && "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]")}>
              {tab.icon}
            </div>
            <span className="text-[7px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
