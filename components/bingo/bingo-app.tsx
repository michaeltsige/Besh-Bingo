"use client"

import { AnimatePresence } from "motion/react"
import { useState } from "react"
import { useBingoGame } from "@/hooks/use-bingo-game"
import { BottomNav } from "@/components/bingo/bottom-nav"
import { HomeScreen } from "@/components/bingo/screens/home-screen"
import { GameScreen } from "@/components/bingo/screens/game-screen"
import { ScoresScreen } from "@/components/bingo/screens/scores-screen"
import { HistoryScreen } from "@/components/bingo/screens/history-screen"
import { WalletScreen } from "@/components/bingo/screens/wallet-screen"
import { ProfileScreen } from "@/components/bingo/screens/profile-screen"
import { RulesScreen } from "@/components/bingo/screens/rules-screen"
import { CartelaSelectionScreen } from "@/components/bingo/screens/cartela-selection-screen"
import { LoadingOverlay } from "@/components/bingo/loading-overlay"
import { WinModal } from "@/components/bingo/win-modal"

// Dev mode detection
const isDev = process.env.NODE_ENV === "development"

export function BingoApp() {
  const game = useBingoGame()
  
  // Dev toggle for testing active game state (optional)
  const [devActiveGame] = useState(false)

  const showGame = (game.gameMode === "playing" || game.gameMode === "watching") && game.activeTab === "game"
  const showHome = game.gameMode === "lobby" && game.activeTab === "game"
  const showSelection = game.gameMode === "selecting" && game.activeTab === "game"
  const showRules = game.activeTab === "rules"
  const showHeader = showHome

  const handleBackFromRules = () => {
    game.setActiveTab("game")
  }

  // Cartela Selection Screen
  if (showSelection) {
    return (
      <div className="flex flex-col h-dvh w-full bg-bingo-deep-purple font-sans select-none max-w-[430px] mx-auto overflow-hidden relative border-x border-white/5">
        <CartelaSelectionScreen
          onBack={game.handleBackFromSelection}
          onConfirm={game.handleSelectCartelas}
          stake={game.stake}
          playBalance={game.wallet.playBalance}
          mainBalance={game.wallet.mainBalance}
        />
      </div>
    )
  }

  // Rules Screen
  if (showRules) {
    return (
      <div className="flex flex-col h-screen w-full bg-bingo-deep-purple font-sans select-none max-w-[430px] mx-auto overflow-hidden relative border-x border-white/5">
        <RulesScreen onBack={handleBackFromRules} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-dvh w-full bg-bingo-deep-purple font-sans select-none max-w-[430px] mx-auto overflow-hidden relative border-x border-white/5">
      {showHeader && (
        <header className="px-6 pt-5 pb-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-extrabold tracking-wide text-white">BESH BINGO</h1>
            
            {/* Dev Toggle - Only shows in development */}
            {isDev && (
              <button
                onClick={() => {
                  // Toggle for testing - you can expand this later
                  console.log("Dev mode active")
                }}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-bingo-green/20 text-bingo-green border border-bingo-green/30"
              >
                {/*DEV Incdicator*/}
              </button>
            )}
          </div>
          
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
            onPlay={game.handlePlayClick} 
            onWatch={game.handleWatchGame}
            walletBalance={game.wallet.playBalance}
          />
        )}

{showGame && (
  <GameScreen
    key="game"
    card={game.card}
    cartelas={game.cartelas}
    activeCartelaIndex={game.activeCartelaIndex}
    onSwitchCartela={game.switchCartela}
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

        {game.activeTab === "history" && (
          <HistoryScreen key="history" />
        )}

        {game.activeTab === "wallet" && (
          <WalletScreen key="wallet" />
        )}

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
        winningCartela={game.winningCartela}
        timer={game.timer}
        onBackToLobby={game.closeWinAndReturnToLobby}
      />
    </div>
  )
}