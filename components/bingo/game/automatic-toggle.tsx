"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface AutomaticToggleProps {
  automatic: boolean
  onToggle: () => void
}

export function AutomaticToggle({ automatic, onToggle }: AutomaticToggleProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle()
        }
      }}
      className="w-full bg-white/[0.04] px-4 py-2.5 rounded-full flex items-center justify-between border border-white/10 cursor-pointer"
      aria-pressed={automatic}
    >
      <span className="text-[11px] font-black text-white uppercase tracking-widest">Automatic</span>
      <div
        className={cn(
          "w-10 h-5 rounded-full relative transition-colors p-0.5",
          automatic ? "bg-bingo-green" : "bg-gray-700",
        )}
      >
        <motion.div animate={{ x: automatic ? 20 : 0 }} className="w-4 h-4 bg-white rounded-full shadow" />
      </div>
    </div>
  )
}
