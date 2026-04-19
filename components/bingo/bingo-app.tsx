"use client";

import { AnimatePresence } from "motion/react";
import { useBingoGame } from "@/hooks/use-bingo-game";
import { BottomNav } from "@/components/bingo/bottom-nav";
import { HomeScreen } from "@/components/bingo/screens/home-screen";
import { GameScreen } from "@/components/bingo/screens/game-screen";
import { ScoresScreen } from "@/components/bingo/screens/scores-screen";
import { HistoryScreen } from "@/components/bingo/screens/history-screen";
import { WalletScreen } from "@/components/bingo/screens/wallet-screen";
import { ProfileScreen } from "@/components/bingo/screens/profile-screen";
import { RulesScreen } from "@/components/bingo/screens/rules-screen";
import { LoadingOverlay } from "@/components/bingo/loading-overlay";
import { WinModal } from "@/components/bingo/win-modal";

export function BingoApp() {
  const game = useBingoGame();

  const showGame = game.isPlaying && game.activeTab === "game";
  const showHome = !game.isPlaying && game.activeTab === "game";
  const showRules = game.activeTab === "rules";
  const showHeader = showHome;

  const handleBackFromRules = () => {
    game.setActiveTab("game");
  };

  // Rules screen takes over the entire view
  if (showRules) {
    return (
      <div className="flex flex-col h-screen w-full bg-bingo-deep-purple font-sans select-none max-w-[430px] mx-auto overflow-hidden relative border-x border-white/5">
        <RulesScreen onBack={handleBackFromRules} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-bingo-deep-purple font-sans select-none max-w-[430px] mx-auto overflow-hidden relative border-x border-white/5">
      {showHeader && (
        <header className="px-6 pt-5 pb-2 flex justify-between items-center">
          <h1 className="text-xl font-display font-extrabold tracking-wide text-white">
            BESH BINGO
          </h1>
          <button
            onClick={() => game.setActiveTab("rules")}
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
            onPlay={game.handleStartGame}
            onWatch={game.handleWatchGame}
          />
        )}

        {showGame && (
          <GameScreen
            key="game"
            card={game.card}
            calledNumbers={game.calledNumbers}
            gameStats={game.gameStats}
            automatic={game.automatic}
            soundEnabled={game.soundEnabled}
            isWatching={game.isWatching}
            onToggleAutomatic={() => game.setAutomatic(!game.automatic)}
            onToggleSound={() => game.setSoundEnabled(!game.soundEnabled)}
            onCellClick={game.handleCellClick}
            onLeave={game.leaveGame}
            onRefresh={game.refreshCalled}
            onNextNumber={game.callNextNumber}
          />
        )}

        {game.activeTab === "scores" && (
          <ScoresScreen
            key="scores"
            scoreFilter={game.scoreFilter}
            onScoreFilterChange={game.setScoreFilter}
          />
        )}

        {game.activeTab === "history" && <HistoryScreen key="history" />}

        {game.activeTab === "wallet" && <WalletScreen key="wallet" />}

        {game.activeTab === "profile" && (
          <ProfileScreen
            key="profile"
            soundEnabled={game.soundEnabled}
            onToggleSound={() => game.setSoundEnabled(!game.soundEnabled)}
            onLogout={game.logout}
          />
        )}
      </AnimatePresence>

      <BottomNav activeTab={game.activeTab} onChange={game.setActiveTab} />

      <LoadingOverlay visible={game.loading} />
      <WinModal
        visible={game.showWinModal}
        card={game.card}
        timer={game.timer}
        onBackToLobby={game.closeWinAndReturnToLobby}
      />
    </div>
  );
}
