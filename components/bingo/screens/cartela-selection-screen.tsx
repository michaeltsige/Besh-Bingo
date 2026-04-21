"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Cartela } from "@/lib/bingo/types"
import { generateBingoCard } from "@/lib/bingo/logic"

interface CartelaSelectionScreenProps {
  onBack: () => void
  onConfirm: (selectedCartelas: Cartela[]) => void
  stake: number
  playBalance: number
  mainBalance: number
  onRefresh?: () => void
}

// Generate 500 cartelas for selection
const generateAllCartelas = (): Cartela[] => {
  return Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    card: generateBingoCard(),
    selectedByOthers: Math.random() < 0.3,
  }))
}

export function CartelaSelectionScreen({
  onBack,
  onConfirm,
  stake,
  playBalance,
  mainBalance,
  onRefresh,
}: CartelaSelectionScreenProps) {
  const [allCartelas] = useState<Cartela[]>(() => generateAllCartelas())
  const [selectedCartelas, setSelectedCartelas] = useState<Cartela[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const maxCartelas = 2
  const totalCost = selectedCartelas.length * stake
  const canAfford = playBalance >= totalCost

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      if (selectedCartelas.length > 0) {
        onConfirm(selectedCartelas)
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, selectedCartelas, onConfirm])

  const handleSelectCartela = (cartela: Cartela) => {
    if (cartela.selectedByOthers) return

    const isSelected = selectedCartelas.some(c => c.id === cartela.id)
    
    if (isSelected) {
      setSelectedCartelas(prev => prev.filter(c => c.id !== cartela.id))
    } else if (selectedCartelas.length < maxCartelas) {
      setSelectedCartelas(prev => [...prev, cartela])
    }
  }

  const handleRefresh = () => {
    onRefresh?.()
    window.location.reload()
  }

  const getCartelaStatus = (cartela: Cartela) => {
    const isSelectedByMe = selectedCartelas.some(c => c.id === cartela.id)
    const isSelectedByOthers = cartela.selectedByOthers
    
    return {
      isSelectedByMe,
      isSelectedByOthers,
      isAvailable: !isSelectedByMe && !isSelectedByOthers
    }
  }

  const getCartelaStyle = (cartela: Cartela) => {
    const { isSelectedByMe, isSelectedByOthers } = getCartelaStatus(cartela)
    
    if (isSelectedByMe) {
      return "bg-bingo-green border-bingo-green shadow-lg shadow-bingo-green/30 text-white"
    }
    if (isSelectedByOthers) {
      return "bg-orange-500 border-orange-500 text-white opacity-60"
    }
    return "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
  }

  // Create rows of 8 cartelas each
  const rows: Cartela[][] = []
  for (let i = 0; i < allCartelas.length; i += 8) {
    rows.push(allCartelas.slice(i, i + 8))
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bingo-deep-purple">
      {/* Header */}
      <header className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/10">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
        <h1 className="text-lg font-display font-bold text-white">Select Cartelas</h1>
        <button 
          onClick={handleRefresh}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={18} className="text-gray-300" />
        </button>
      </header>

      {/* Wallet & Stake Info */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <p className="text-gray-400 text-[10px] uppercase font-bold">Main Wallet</p>
          <p className="text-white font-mono text-lg font-bold">{mainBalance}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <p className="text-gray-400 text-[10px] uppercase font-bold">Play Wallet</p>
          <p className="text-white font-mono text-lg font-bold">{playBalance}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <p className="text-gray-400 text-[10px] uppercase font-bold">Stake</p>
          <p className="text-bingo-gold font-mono text-lg font-bold">{stake}</p>
        </div>
      </div>

      {/* Timer and Selection Status */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">
            Selected: <span className="text-bingo-gold font-bold">{selectedCartelas.length}</span>/{maxCartelas}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Time left:</span>
          <span className={cn(
            "font-mono text-xl font-bold",
            timeLeft <= 5 ? "text-bingo-red" : "text-bingo-gold"
          )}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Available Cartelas Label */}
      <div className="px-4 py-1">
        <p className="text-gray-400 text-[10px] uppercase font-bold">
          Available Cartelas (1-500)
        </p>
      </div>

      {/* Scrollable Cartela Numbers Grid */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-2 min-h-0"
      >
        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-8 gap-1 mb-1 last:mb-0">
              {row.map((cartela) => {
                const { isSelectedByOthers } = getCartelaStatus(cartela)
                
                return (
                  <button
                    key={cartela.id}
                    onClick={() => handleSelectCartela(cartela)}
                    disabled={isSelectedByOthers}
                    className={cn(
                      "aspect-square rounded-md flex items-center justify-center text-xs font-bold transition-all",
                      "border-2",
                      getCartelaStyle(cartela),
                      isSelectedByOthers && "cursor-not-allowed"
                    )}
                  >
                    {cartela.id}
                  </button>
                )
              })}
              {row.length < 8 && Array.from({ length: 8 - row.length }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 flex items-center justify-center gap-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-bingo-green border border-bingo-green"></div>
          <span className="text-gray-400 text-xs">Your selection</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500 border border-orange-500"></div>
          <span className="text-gray-400 text-xs">Taken</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/10 border border-white/20"></div>
          <span className="text-gray-400 text-xs">Available</span>
        </div>
      </div>

      {/* Selected Cartelas Preview - Fixed size, side by side */}
      {selectedCartelas.length > 0 && (
        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-gray-400 text-[10px] uppercase font-bold mb-2">Your Cartelas</p>
          <div className={cn(
            "grid gap-3",
            selectedCartelas.length === 1 ? "grid-cols-1 max-w-[280px] mx-auto" : "grid-cols-2"
          )}>
            {selectedCartelas.map((cartela) => (
              <div key={cartela.id}>
                <div className="bg-bingo-green/10 rounded-xl p-2 border border-bingo-green/30">
                  <p className="text-bingo-green text-xs font-bold mb-1 text-center">
                    CARTELA #{cartela.id}
                  </p>
                  <MiniCartelaCard card={cartela.card} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">Total Cost:</span>
          <span className={cn(
            "font-mono text-xl font-bold",
            canAfford ? "text-bingo-green" : "text-bingo-red"
          )}>
            {totalCost} ETB
          </span>
        </div>
        <button
          onClick={() => selectedCartelas.length > 0 && canAfford && onConfirm(selectedCartelas)}
          disabled={selectedCartelas.length === 0 || !canAfford}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-lg transition-all",
            selectedCartelas.length > 0 && canAfford
              ? "bg-bingo-green text-white shadow-lg shadow-bingo-green/20 hover:bg-bingo-green/90"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          )}
        >
          {selectedCartelas.length === 0 
            ? "Select at least 1 Cartela" 
            : !canAfford 
              ? "Insufficient Balance" 
              : `Confirm Selection (${totalCost} ETB)`
          }
        </button>
      </div>
    </div>
  )
}

// Mini version of cartela card for preview - CONSISTENT SIZE
function MiniCartelaCard({ card }: { card: any[][] }) {
  return (
    <div className="w-full max-w-[200px] mx-auto">
      <div className="grid grid-cols-5 gap-0.5">
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
            <div
              key={`${r}-${c}`}
              className="aspect-square rounded flex items-center justify-center text-[9px] font-bold bg-white/10 text-white border border-white/5"
            >
              {cell.number === "FREE" ? "★" : cell.number}
            </div>
          ))
        )}
      </div>
    </div>
  )
}