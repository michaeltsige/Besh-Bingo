"use client"

import { useCallback, useEffect, useState } from "react"
import type { BingoCell, GameStats, ScoreFilter, TabType } from "@/lib/bingo/types"
import { INITIAL_GAME_STATS } from "@/lib/bingo/constants"
import { checkBingo, cloneCard, generateBingoCard } from "@/lib/bingo/logic"

/**
 * Central game state hook.
 *
 * Keeps all game state + actions in one place so screens stay presentational
 * and so a real backend (API calls, sockets, etc.) can be swapped in later
 * without touching the UI components.
 */
export function useBingoGame() {
  const [activeTab, setActiveTab] = useState<TabType>("game")
  const [isPlaying, setIsPlaying] = useState(false)
  const [card, setCard] = useState<BingoCell[][]>([])
  const [calledNumbers, setCalledNumbers] = useState<number[]>([])
  const [gameStats, setGameStats] = useState<GameStats>(INITIAL_GAME_STATS)
  const [automatic, setAutomatic] = useState(true)
  const [showWinModal, setShowWinModal] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [timer] = useState(1)
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("daily")
  const [, setGameStarted] = useState(false)
  const [isWatching, setIsWatching] = useState(false)

  // Initialize the player's card on mount.
  useEffect(() => {
    setCard(generateBingoCard())
  }, [])

  const handleStartGame = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setIsPlaying(true)
      setGameStarted(true)
      setIsWatching(false)
      setLoading(false)
      setCalledNumbers([])
      setGameStats((prev) => ({ ...prev, calledCount: 0 }))
      setCard(generateBingoCard())
    }, 1000)
  }, [])

  const handleWatchGame = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setIsPlaying(true)
      setGameStarted(false)
      setIsWatching(true)
      setLoading(false)
      setCalledNumbers([])
      setGameStats((prev) => ({ ...prev, calledCount: 0 }))
    }, 500)
  }, [])

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (!isPlaying) return
      const cell = card[r]?.[c]
      if (!cell || cell.number === "FREE") return

      const newCard = cloneCard(card)
      newCard[r][c].marked = !newCard[r][c].marked
      setCard(newCard)

      if (checkBingo(newCard)) {
        setShowWinModal(true)
      }
    },
    [card, isPlaying],
  )

  const callNextNumber = useCallback(() => {
    if (calledNumbers.length >= 75) return

    let nextNum: number
    do {
      nextNum = Math.floor(Math.random() * 75) + 1
    } while (calledNumbers.includes(nextNum))

    const newCalled = [nextNum, ...calledNumbers]
    setCalledNumbers(newCalled)
    setGameStats((prev) => ({ ...prev, calledCount: prev.calledCount + 1 }))

    // Auto mark matching cells when enabled.
    if (automatic) {
      const newCard = cloneCard(card)
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
        setCard(newCard)
        if (checkBingo(newCard)) {
          setShowWinModal(true)
        }
      }
    }
  }, [automatic, calledNumbers, card])

  const refreshCalled = useCallback(() => {
    setCalledNumbers([])
    setGameStats((prev) => ({ ...prev, calledCount: 0 }))
  }, [])

  const leaveGame = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const closeWinAndReturnToLobby = useCallback(() => {
    setShowWinModal(false)
    setIsPlaying(false)
    setCard(generateBingoCard())
    setCalledNumbers([])
  }, [])

  const logout = useCallback(() => {
    setIsPlaying(false)
    setActiveTab("game")
  }, [])

  return {
    // State
    activeTab,
    isPlaying,
    card,
    calledNumbers,
    gameStats,
    automatic,
    showWinModal,
    soundEnabled,
    loading,
    timer,
    scoreFilter,
    isWatching,

    // Setters (granular)
    setActiveTab,
    setAutomatic,
    setSoundEnabled,
    setScoreFilter,

    // Actions
    handleStartGame,
    handleWatchGame,
    handleCellClick,
    callNextNumber,
    refreshCalled,
    leaveGame,
    closeWinAndReturnToLobby,
    logout,
  }
}

export type UseBingoGame = ReturnType<typeof useBingoGame>
