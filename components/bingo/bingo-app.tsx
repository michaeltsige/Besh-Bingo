"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useGameSocket } from "@/hooks/useGameSocket";   // new hook
import { BottomNav } from "@/components/bingo/bottom-nav";
import { HomeScreen } from "@/components/bingo/screens/home-screen";
import { GameScreen } from "@/components/bingo/screens/game-screen";
import { ScoresScreen } from "@/components/bingo/screens/scores-screen";
import { HistoryScreen } from "@/components/bingo/screens/history-screen";
import { WalletScreen } from "@/components/bingo/screens/wallet-screen";
import { ProfileScreen } from "@/components/bingo/screens/profile-screen";
import { RulesScreen } from "@/components/bingo/screens/rules-screen";
import { CartelaSelectionScreen } from "@/components/bingo/screens/cartela-selection-screen";
import { LoadingOverlay } from "@/components/bingo/loading-overlay";
import { WinModal } from "@/components/bingo/win-modal";

const isDev = process.env.NODE_ENV === "development";

export function BingoApp() {
  // Local UI state
  const [activeTab, setActiveTab] = useState<"game" | "scores" | "history" | "wallet" | "profile" | "rules">("game");
  const [selectedStake, setSelectedStake] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [automatic, setAutomatic] = useState(true);
  const [loading, setLoading] = useState(false);

  // Connect to backend
  const game = useGameSocket(selectedStake);

  // Derived UI states from the live game data
  const showHome = game.phase === "lobby" && activeTab === "game";
  const showSelection = game.phase === "selecting" && activeTab === "game";
  const showGame = game.phase === "active" && activeTab === "game";
  const showRules = activeTab === "rules";
  const showHeader = showHome;

  const handleBackFromRules = () => setActiveTab("game");

  // When user clicks Play, store the stake and the hook will auto‑join the room
  const handlePlayClick = (stake: number) => {
    setLoading(true);
    setSelectedStake(stake);
    // simulate slight delay for loading overlay
    setTimeout(() => setLoading(false), 800);
  };

  // Leave the game and go back to lobby
  const handleLeaveGame = () => {
    setSelectedStake(null);
    setActiveTab("game");
  };

  // Cartela selection screen
  if (showSelection) {
    return (
      <div className="flex flex-col h-dvh w-full bg-bingo-deep-purple font-sans select-none max-w-[430px] mx-auto overflow-hidden relative border-x border-white/5">
        <CartelaSelectionScreen
          onBack={() => {
            setSelectedStake(null);
            setActiveTab("game");
          }}
          stake={selectedStake!}
          playBalance={80}        // eventually from backend
          mainBalance={2}
          cartelaStatuses={game.cartelaStatuses || []}
          selectedIds={game.selectedCartelaIds || []}
          timer={game.timer}
          onSelectCartela={game.selectCartela}
        />
      </div>
    );
  }

  // Rules screen
  if (showRules) {
    return (
      <div className="flex flex-col h-screen w-full bg-bingo-deep-purple font-sans select-none max-w-[430px] mx-auto overflow-hidden relative border-x border-white/5">
        <RulesScreen onBack={handleBackFromRules} />
      </div>
    );
  }

  // Main view with tab navigation and animations
  return (
    <div className="flex flex-col h-dvh w-full bg-bingo-deep-purple font-sans select-none max-w-[430px] mx-auto overflow-hidden relative border-x border-white/5">
      {showHeader && (
        <header className="px-6 pt-5 pb-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-extrabold tracking-wide text-white">
              BESH BINGO
            </h1>
            {isDev && (
              <button
                onClick={() => console.log("Dev mode active")}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-bingo-green/20 text-bingo-green border border-bingo-green/30"
              >
                DEV
              </button>
            )}
          </div>
          <button
            onClick={() => setActiveTab("rules")}
            className="bg-white/5 px-4 py-1.5 rounded-full text-xs font-semibold border border-white/10 backdrop-blur-md text-gray-100 hover:bg-white/10 transition-colors"
          >
            Rules
          </button>
        </header>
      )}

      <AnimatePresence mode="wait">
        {showHome && (
          <HomeScreen
            key="home"
            onPlay={handlePlayClick}
            walletBalance={80}
          />
        )}

        {showGame && (
          <GameScreen
            key="game"
            card={game.myCartelaCards[0]?.card} // for backwards compatibility
            cartelas={game.myCartelaCards}
            activeCartelaIndex={0}
            onSwitchCartela={(idx) => {}} // if you want to keep switching, we can add later
            calledNumbers={game.calledNumbers}
            gameStats={{
              gameId: game.gameId || "---",
              players: 0,
              bet: selectedStake || 10,
              derash: 0,
              calledCount: game.calledNumbers.length,
            }}
            automatic={automatic}
            soundEnabled={soundEnabled}
            isWatching={false}
            onToggleAutomatic={() => setAutomatic(!automatic)}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onCellClick={() => {}}           // server auto‑marks
            onLeave={handleLeaveGame}
            onRefresh={() => {}}
            onNextNumber={() => {}}          // server calls numbers
          />
        )}

        {activeTab === "scores" && (
          <ScoresScreen
            key="scores"
            scoreFilter={"daily"}
            onScoreFilterChange={() => {}}
          />
        )}

        {activeTab === "history" && <HistoryScreen key="history" />}

        {activeTab === "wallet" && <WalletScreen key="wallet" />}

        {activeTab === "profile" && (
          <ProfileScreen
            key="profile"
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onLogout={() => {
              setSelectedStake(null);
              setActiveTab("game");
            }}
          />
        )}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      <LoadingOverlay visible={loading} />

      <WinModal
        visible={false}   // replace with real win state later
        winningCartela={null}
        timer={5}
        onBackToLobby={() => {}}
      />
    </div>
  );
}