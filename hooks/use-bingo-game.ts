"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  BingoCell,
  GameStats,
  ScoreFilter,
  TabType,
} from "@/lib/bingo/types";
import { INITIAL_GAME_STATS } from "@/lib/bingo/constants";
import { checkBingo, cloneCard, generateBingoCard } from "@/lib/bingo/logic";

export function useBingoGame() {
  const [activeTab, setActiveTab] = useState<TabType>("game");
  const [isPlaying, setIsPlaying] = useState(false);
  const [card, setCard] = useState<BingoCell[][]>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>(INITIAL_GAME_STATS);
  const [automatic, setAutomatic] = useState(true);
  const [showWinModal, setShowWinModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [timer] = useState(1);
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("daily");
  const [gameStarted, setGameStarted] = useState(false);
  const [isWatching, setIsWatching] = useState(false);

  // Initialize the player's card on mount.
  useEffect(() => {
    setCard(generateBingoCard());
  }, []);

  const resetGameState = useCallback(() => {
    setCard(generateBingoCard());
    setCalledNumbers([]);
    setGameStats((prev) => ({ ...prev, calledCount: 0 }));
    setShowWinModal(false);
  }, []);

  const handleStartGame = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setIsPlaying(true);
      setGameStarted(true);
      setIsWatching(false);
      setLoading(false);
      resetGameState();
    }, 1000);
  }, [resetGameState]);

  const handleWatchGame = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setIsPlaying(true);
      setGameStarted(false);
      setIsWatching(true);
      setLoading(false);
      setCalledNumbers([]);
      setGameStats((prev) => ({ ...prev, calledCount: 0 }));
    }, 500);
  }, []);

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (!isPlaying || !gameStarted || isWatching) return;
      const cell = card[r]?.[c];
      if (!cell || cell.number === "FREE") return;

      const newCard = cloneCard(card);
      newCard[r][c].marked = !newCard[r][c].marked;
      setCard(newCard);

      if (checkBingo(newCard)) {
        setShowWinModal(true);
      }
    },
    [card, isPlaying, gameStarted, isWatching],
  );

  const callNextNumber = useCallback(() => {
    if (!gameStarted || isWatching) return;
    if (calledNumbers.length >= 75) return;

    let nextNum: number;
    do {
      nextNum = Math.floor(Math.random() * 75) + 1;
    } while (calledNumbers.includes(nextNum));

    const newCalled = [nextNum, ...calledNumbers];
    setCalledNumbers(newCalled);
    setGameStats((prev) => ({ ...prev, calledCount: prev.calledCount + 1 }));

    // Auto mark matching cells when enabled.
    if (automatic) {
      const newCard = cloneCard(card);
      let markedAny = false;
      newCard.forEach((row) => {
        row.forEach((cell) => {
          if (cell.number === nextNum) {
            cell.marked = true;
            markedAny = true;
          }
        });
      });
      if (markedAny) {
        setCard(newCard);
        if (checkBingo(newCard)) {
          setShowWinModal(true);
        }
      }
    }
  }, [automatic, calledNumbers, card, gameStarted, isWatching]);

  const refreshCalled = useCallback(() => {
    if (!gameStarted) return;
    setCalledNumbers([]);
    setGameStats((prev) => ({ ...prev, calledCount: 0 }));
  }, [gameStarted]);

  const leaveGame = useCallback(() => {
    setIsPlaying(false);
    setGameStarted(false);
    setIsWatching(false);
  }, []);

  const closeWinAndReturnToLobby = useCallback(() => {
    setShowWinModal(false);
    setIsPlaying(false);
    setGameStarted(false);
    setIsWatching(false);
    resetGameState();
  }, [resetGameState]);

  const logout = useCallback(() => {
    setIsPlaying(false);
    setGameStarted(false);
    setIsWatching(false);
    setActiveTab("game");
  }, []);

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
    gameStarted,

    // Setters
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
  };
}

export type UseBingoGame = ReturnType<typeof useBingoGame>;
