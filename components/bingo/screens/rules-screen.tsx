"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Info,
  Target,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface RulesScreenProps {
  onBack: () => void;
}

type RuleTab = "overview" | "howto" | "winning" | "penalty";

export function RulesScreen({ onBack }: RulesScreenProps) {
  const [activeTab, setActiveTab] = useState<RuleTab>("overview");

  const tabs = [
    { id: "overview" as RuleTab, label: "Overview", icon: Info },
    { id: "howto" as RuleTab, label: "How to Play", icon: HelpCircle },
    { id: "winning" as RuleTab, label: "Winning", icon: Target },
    { id: "penalty" as RuleTab, label: "Penalties", icon: AlertTriangle },
  ];

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header with Back Button */}
      <header className="px-4 pt-3 pb-2 flex items-center gap-3 border-b border-white/10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
        <h1 className="text-xl font-display font-bold text-white">
          Game Rules
        </h1>
      </header>

      {/* Tab Navigation */}
      <div className="px-4 pt-4">
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all flex flex-col items-center gap-1",
                  activeTab === tab.id
                    ? "bg-bingo-accent text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-200",
                )}
              >
                <Icon size={16} />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab key="overview" />}
          {activeTab === "howto" && <HowToPlayTab key="howto" />}
          {activeTab === "winning" && <WinningTab key="winning" />}
          {activeTab === "penalty" && <PenaltyTab key="penalty" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="bg-gradient-to-br from-bingo-accent/20 to-indigo-600/20 rounded-2xl p-5 border border-bingo-accent/30">
        <h2 className="text-bingo-gold font-bold text-lg mb-2">
          Welcome to Besh Bingo
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Besh Bingo is a classic 75-ball bingo game where players mark numbers
          on their cards as they are called. The first player to complete a
          winning pattern wins the prize pool!
        </p>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold text-base mb-3">Game Basics</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-bingo-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-bingo-accent text-xs font-bold">1</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                Choose Your Stake
              </p>
              <p className="text-gray-400 text-xs">
                Select PLAY 10 to join a game with 10 ETB stake
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-bingo-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-bingo-accent text-xs font-bold">2</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Get Your Card</p>
              <p className="text-gray-400 text-xs">
                Each player receives a unique 5x5 bingo card
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-bingo-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-bingo-accent text-xs font-bold">3</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                Mark Your Numbers
              </p>
              <p className="text-gray-400 text-xs">
                Numbers are called from 1-75. Mark matching numbers on your card
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-bingo-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-bingo-accent text-xs font-bold">4</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Call BINGO!</p>
              <p className="text-gray-400 text-xs">
                Complete a pattern and press the BINGO button to win
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold text-base mb-3">
          Prize Pool (Derash)
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          The prize pool is calculated based on the number of players and their
          stakes. Winners share the prize pool equally if multiple players win
          simultaneously.
        </p>
      </div>
    </motion.div>
  );
}

// How to Play Tab
function HowToPlayTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold text-base mb-3">Getting Started</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          When you join a game, you'll receive a card with a unique Cartela
          number. Each card contains 24 random numbers plus a FREE space in the
          center.
        </p>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold text-base mb-3">Number Calling</h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          Numbers from 1 to 75 are called randomly during the game. Each number
          belongs to a column:
        </p>
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { letter: "B", range: "1-15", color: "bg-blue-500" },
            { letter: "I", range: "16-30", color: "bg-bingo-accent" },
            { letter: "N", range: "31-45", color: "bg-pink-500" },
            { letter: "G", range: "46-60", color: "bg-bingo-green" },
            { letter: "O", range: "61-75", color: "bg-orange-500" },
          ].map((col) => (
            <div key={col.letter} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 ${col.color} rounded-lg flex items-center justify-center text-white font-bold text-sm mb-1`}
              >
                {col.letter}
              </div>
              <span className="text-gray-400 text-[10px]">{col.range}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold text-base mb-3">Marking Numbers</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-bingo-green/20 flex items-center justify-center flex-shrink-0">
              <span className="text-bingo-green text-lg">⚡</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                Automatic Mode (Recommended)
              </p>
              <p className="text-gray-400 text-xs">
                Numbers are marked automatically as they're called
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-bingo-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-bingo-accent text-lg">👆</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Manual Mode</p>
              <p className="text-gray-400 text-xs">
                Click numbers on your card to mark them manually
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Winning Tab
function WinningTab() {
  const patterns = [
    {
      name: "Horizontal Line",
      description: "Complete any row (5 numbers across)",
      icon: "→",
      example: "B-1 to O-1",
    },
    {
      name: "Vertical Line",
      description: "Complete any column (5 numbers down)",
      icon: "↓",
      example: "B-1 to B-15",
    },
    {
      name: "Diagonal Line",
      description: "Complete either diagonal (5 numbers)",
      icon: "↘",
      example: "Top-left to bottom-right or top-right to bottom-left",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="bg-gradient-to-br from-bingo-gold/20 to-yellow-600/20 rounded-2xl p-5 border border-bingo-gold/30">
        <h3 className="text-bingo-gold font-bold text-lg mb-2">How to Win</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          Complete any horizontal, vertical, or diagonal line of 5 marked
          numbers and press the BINGO button to claim your prize!
        </p>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold text-base mb-4">
          Winning Patterns
        </h3>
        <div className="space-y-3">
          {patterns.map((pattern, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-black/20 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-bingo-accent/20 flex items-center justify-center">
                <span className="text-bingo-accent text-xl font-bold">
                  {pattern.icon}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{pattern.name}</p>
                <p className="text-gray-400 text-xs">{pattern.description}</p>
                <p className="text-gray-500 text-[10px] mt-0.5">
                  {pattern.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold text-base mb-3">
          Multiple Winners
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          If two or more players achieve BINGO on the same called number, the
          prize pool (Derash) is split equally among all winners.
        </p>
      </div>

      <div className="bg-bingo-accent/10 rounded-2xl p-5 border border-bingo-accent/30">
        <h3 className="text-bingo-accent font-bold text-sm mb-2">💡 Pro Tip</h3>
        <p className="text-gray-300 text-xs leading-relaxed">
          The FREE space in the center of your card is automatically marked and
          counts toward any winning line that passes through it!
        </p>
      </div>
    </motion.div>
  );
}
// Penalty Tab
function PenaltyTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="bg-bingo-red/10 rounded-2xl p-5 border border-bingo-red/30">
        <h3 className="text-bingo-red font-bold text-lg mb-2">
          ⚠️ False BINGO Penalty
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          Pressing the BINGO button without having a valid winning pattern will
          result in penalties.
        </p>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold text-base mb-4">
          Penalty Consequences
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-bingo-red/5 rounded-xl border border-bingo-red/20">
            <div className="w-6 h-6 rounded bg-bingo-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-bingo-red text-sm">🚫</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                Immediate Disqualification
              </p>
              <p className="text-gray-400 text-xs">
                You will be removed from the current game
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-bingo-red/5 rounded-xl border border-bingo-red/20">
            <div className="w-6 h-6 rounded bg-bingo-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-bingo-red text-sm">💰</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Stake Forfeiture</p>
              <p className="text-gray-400 text-xs">
                Your stake will not be refunded
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h3 className="text-white font-bold text-base mb-3">
          Fair Play Reminder
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          Please ensure you have a valid winning pattern before pressing BINGO.
          False calls disrupt the game for other players and will not be
          tolerated.
        </p>
      </div>
    </motion.div>
  );
}
