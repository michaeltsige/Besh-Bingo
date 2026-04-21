"use client"

import { useCallback, useEffect, useState } from "react"
import type { BingoCell, GameStats, ScoreFilter, TabType, Cartela, GameMode } from "@/lib/bingo/types"
import { INITIAL_GAME_STATS } from "@/lib/bingo/constants"
import { checkBingo, cloneCard, generateBingoCard } from "@/lib/bingo/logic"

export function useBingoGame() {
  const [activeTab, setActiveTab] = useState<TabType>("game")
  const [gameMode, setGameMode] = useState<GameMode>("lobby")
  const [cartelas, setCartelas] = useState<Cartela[]>([])
  const [activeCartelaIndex, setActiveCartelaIndex] = useState(0)
  const [calledNumbers, setCalledNumbers] = useState<number[]>([])
  const [gameStats, setGameStats] = useState<GameStats>(INITIAL_GAME_STATS)
  const [automatic, setAutomatic] = useState(true)
  const [showWinModal, setShowWinModal] = useState(false)
  const [winningCartela, setWinningCartela] = useState<Cartela | null>(null) // Add this
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [timer] = useState(1)
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("daily")
  const [wallet] = useState({ mainBalance: 2, playBalance: 80 })
  const [stake, setStake] = useState(10)

  const activeCard = cartelas[activeCartelaIndex]?.card || []

  const handlePlayClick = useCallback((selectedStake?: number) => {
    if (selectedStake) {
      setStake(selectedStake)
    }
    setGameMode("selecting")
  }, [])

  const handleSelectCartelas = useCallback((selected: Cartela[]) => {
    setCartelas(selected)
    setGameMode("playing")
    setCalledNumbers([])
    setGameStats(prev => ({ ...prev, calledCount: 0 }))
  }, [])

  const handleBackFromSelection = useCallback(() => {
    setGameMode("lobby")
  }, [])

  const handleWatchGame = useCallback(() => {
    setGameMode("watching")
    setCalledNumbers([])
    setGameStats(prev => ({ ...prev, calledCount: 0 }))
  }, [])

  const resetGameState = useCallback(() => {
    setCartelas([])
    setActiveCartelaIndex(0)
    setCalledNumbers([])
    setGameStats(prev => ({ ...prev, calledCount: 0 }))
    setShowWinModal(false)
    setWinningCartela(null) // Reset winning cartela
  }, [])

  const handleCellClick = useCallback(
    (r: number, c: number, cartelaIndex: number = activeCartelaIndex) => {
      if (gameMode !== "playing") return
      
      const targetCartela = cartelas[cartelaIndex]
      if (!targetCartela) return
      
      const currentCard = targetCartela.card
      if (!currentCard) return
      
      const cell = currentCard[r]?.[c]
      if (!cell || cell.number === "FREE") return

      const newCartelas = [...cartelas]
      const newCard = cloneCard(currentCard)
      newCard[r][c].marked = !newCard[r][c].marked
      newCartelas[cartelaIndex] = { ...targetCartela, card: newCard }
      setCartelas(newCartelas)

      // Check each cartela for bingo
      for (const cartela of newCartelas) {
        if (checkBingo(cartela.card)) {
          setWinningCartela(cartela) // Set the winning cartela
          setShowWinModal(true)
          break
        }
      }
    },
    [cartelas, activeCartelaIndex, gameMode],
  )

  const switchCartela = useCallback((index: number) => {
    if (index >= 0 && index < cartelas.length) {
      setActiveCartelaIndex(index)
    }
  }, [cartelas.length])

  const callNextNumber = useCallback(() => {
    if (gameMode !== "playing" && gameMode !== "watching") return
    if (calledNumbers.length >= 75) return

    let nextNum: number
    do {
      nextNum = Math.floor(Math.random() * 75) + 1
    } while (calledNumbers.includes(nextNum))

    const newCalled = [nextNum, ...calledNumbers]
    setCalledNumbers(newCalled)
    setGameStats(prev => ({ ...prev, calledCount: prev.calledCount + 1 }))

    if (automatic && gameMode === "playing") {
      const newCartelas = [...cartelas]
      
      newCartelas.forEach((cartela, idx) => {
        const newCard = cloneCard(cartela.card)
        let markedAny = false
        newCard.forEach((row) => {
          row.forEach((cell) => {
            if (cell.number === nextNum) {
              cell.marked = true
              markedAny = true
            }
          })
        })
        if (markedAny) {
          newCartelas[idx] = { ...cartela, card: newCard }
        }
      })
      
      if (newCartelas.some((c, i) => c.card !== cartelas[i].card)) {
        setCartelas(newCartelas)
        
        // Check for bingo after auto-marking
        for (const cartela of newCartelas) {
          if (checkBingo(cartela.card)) {
            setWinningCartela(cartela) // Set the winning cartela
            setShowWinModal(true)
            break
          }
        }
      }
    }
  }, [automatic, calledNumbers, cartelas, gameMode])

  const refreshCalled = useCallback(() => {
    if (gameMode !== "playing" && gameMode !== "watching") return
    setCalledNumbers([])
    setGameStats(prev => ({ ...prev, calledCount: 0 }))
  }, [gameMode])

  const leaveGame = useCallback(() => {
    setGameMode("lobby")
    resetGameState()
  }, [resetGameState])

  const closeWinAndReturnToLobby = useCallback(() => {
    setShowWinModal(false)
    setGameMode("lobby")
    resetGameState()
  }, [resetGameState])

  const logout = useCallback(() => {
    setGameMode("lobby")
    resetGameState()
    setActiveTab("game")
  }, [resetGameState])

  const isPlaying = gameMode === "playing"
  const isWatching = gameMode === "watching"

  return {
    // State
    activeTab,
    gameMode,
    isPlaying,
    isWatching,
    cartelas,
    activeCartelaIndex,
    card: activeCard,
    calledNumbers,
    gameStats,
    automatic,
    showWinModal,
    winningCartela, // Export winning cartela
    soundEnabled,
    loading,
    timer,
    scoreFilter,
    wallet,
    stake,

    // Setters
    setActiveTab,
    setAutomatic,
    setSoundEnabled,
    setScoreFilter,

    // Actions
    handlePlayClick,
    handleSelectCartelas,
    handleBackFromSelection,
    handleWatchGame,
    handleCellClick,
    switchCartela,
    callNextNumber,
    refreshCalled,
    leaveGame,
    closeWinAndReturnToLobby,
    logout,
  }
}

export type UseBingoGame = ReturnType<typeof useBingoGame>