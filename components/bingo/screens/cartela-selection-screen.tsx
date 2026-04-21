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
    <div className="flex flex-col h-dvh w-full bg-bingo-deep-purple max-w-[430px] mx-auto overflow-hidden">
      {/* Header */}
      <header className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/10 flex-shrink-0">
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

      {/* Wallet & Stake Info - Compact */}
      <div className="px-4 py-2 grid grid-cols-3 gap-2 flex-shrink-0">
        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
          <p className="text-gray-400 text-[9px] uppercase font-bold">Main</p>
          <p className="text-white font-mono text-base font-bold">{mainBalance}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
          <p className="text-gray-400 text-[9px] uppercase font-bold">Play</p>
          <p className="text-white font-mono text-base font-bold">{playBalance}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
          <p className="text-gray-400 text-[9px] uppercase font-bold">Stake</p>
          <p className="text-bingo-gold font-mono text-base font-bold">{stake}</p>
        </div>
      </div>

      {/* Timer and Selection Status - Compact */}
      <div className="px-4 py-1 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-xs font-medium">
            Selected: <span className="text-bingo-gold font-bold">{selectedCartelas.length}</span>/{maxCartelas}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Time:</span>
          <span className={cn(
            "font-mono text-base font-bold",
            timeLeft <= 5 ? "text-bingo-red" : "text-bingo-gold"
          )}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Available Cartelas Label */}
      <div className="px-4 py-1 flex-shrink-0">
        <p className="text-gray-400 text-[9px] uppercase font-bold">
          Available Cartelas (1-500)
        </p>
      </div>

      {/* Scrollable Cartela Numbers Grid - Takes remaining space */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-1 min-h-0"
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
                      "aspect-square rounded-md flex items-center justify-center text-[11px] font-bold transition-all",
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

      {/* Selected Cartelas Preview - Compact */}
      {selectedCartelas.length > 0 && (
        <div className="px-4 py-1.5 border-t border-white/10 flex-shrink-0">
          {/* <p className="text-gray-400 text-[8px] uppercase font-bold mb-0.5">Your Cartelas</p> */}
          <div className={cn(
            "flex gap-1.5",
            selectedCartelas.length === 1 ? "justify-center" : "justify-between"
          )}>
            {selectedCartelas.map((cartela) => (
              <div 
                key={cartela.id} 
                className={cn(
                  "bg-bingo-green/10 rounded-md p-1 border border-bingo-green/30",
                  selectedCartelas.length === 1 ? "w-32" : "w-[48%]"
                )}
              >
                <p className="text-bingo-green text-[8px] font-bold mb-0.5 text-center">
                  #{cartela.id}
                </p>
                <TinyCartelaCard card={cartela.card} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action - Compact */}
      <div className="p-3 border-t border-white/10 flex-shrink-0 pb-safe">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs">Total Cost:</span>
          <span className={cn(
            "font-mono text-lg font-bold",
            canAfford ? "text-bingo-green" : "text-bingo-red"
          )}>
            {totalCost} ETB
          </span>
        </div>
        <button
          onClick={() => selectedCartelas.length > 0 && canAfford && onConfirm(selectedCartelas)}
          disabled={selectedCartelas.length === 0 || !canAfford}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-base transition-all",
            selectedCartelas.length > 0 && canAfford
              ? "bg-bingo-green text-white shadow-lg shadow-bingo-green/20 hover:bg-bingo-green/90"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          )}
        >
          {selectedCartelas.length === 0 
            ? "Select at least 1 Cartela" 
            : !canAfford 
              ? "Insufficient Balance" 
              : `Confirm (${totalCost} ETB)`
          }
        </button>
      </div>
    </div>
  )
}

// TINY version of cartela card - Even smaller for preview
function TinyCartelaCard({ card }: { card: any[][] }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-0.5">
        {["B", "I", "N", "G", "O"].map((l) => (
          <div
            key={l}
            className="aspect-square bg-blue-600 rounded-sm flex items-center justify-center text-[6px] font-black text-white leading-none"
          >
            {l}
          </div>
        ))}
        {card.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className="aspect-square rounded-sm flex items-center justify-center text-[6px] font-bold bg-white/10 text-white border border-white/5 leading-none"
            >
              {cell.number === "FREE" ? "★" : cell.number}
            </div>
          ))
        )}
      </div>
    </div>
  )
}