"use client";

import { cn } from "@/lib/utils";
import type { ScoreFilter } from "@/lib/bingo/types";
import {
  MOCK_TOP_PLAYERS_DAILY,
  MOCK_TOP_PLAYERS_WEEKLY,
} from "@/lib/bingo/constants";
import { ScreenWrapper } from "@/components/bingo/screen-wrapper";

interface ScoresScreenProps {
  scoreFilter: ScoreFilter;
  onScoreFilterChange: (filter: ScoreFilter) => void;
}

export function ScoresScreen({
  scoreFilter,
  onScoreFilterChange,
}: ScoresScreenProps) {
  const players =
    scoreFilter === "daily" ? MOCK_TOP_PLAYERS_DAILY : MOCK_TOP_PLAYERS_WEEKLY;

  return (
    <ScreenWrapper screenKey="scores">
      <h2 className="text-xl font-display font-bold mb-6">Top Players</h2>

      <div className="bg-gradient-to-r from-bingo-accent to-indigo-600 p-4 rounded-2xl mb-6 flex items-center justify-between border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold">-</span>
          </div>
          <div>
            <p className="text-[10px] text-white/60 font-bold uppercase">
              My Rank
            </p>
            <p className="text-white font-bold">@Mock User</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/60 font-bold uppercase">Wins</p>
          <p className="text-white font-bold">0</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/5">
        <button
          onClick={() => onScoreFilterChange("daily")}
          className={cn(
            "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all",
            scoreFilter === "daily"
              ? "bg-white/10 text-white"
              : "text-white/40",
          )}
        >
          DAILY
        </button>
        <button
          onClick={() => onScoreFilterChange("weekly")}
          className={cn(
            "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all",
            scoreFilter === "weekly"
              ? "bg-white/10 text-white"
              : "text-white/40",
          )}
        >
          WEEKLY
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {players.map((player, i) => (
          <div
            key={player.name}
            className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
                  i === 0
                    ? "bg-bingo-gold text-black"
                    : i === 1
                      ? "bg-gray-300 text-black"
                      : i === 2
                        ? "bg-orange-600 text-white"
                        : "bg-white/10 text-white/40",
                )}
              >
                {i + 1}
              </div>
              <span className="text-sm font-bold text-gray-200">
                {player.name}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-mono font-bold text-bingo-gold">
                {player.wins}
              </span>
              <span className="text-[8px] text-gray-500 font-bold uppercase">
                games won
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScreenWrapper>
  );
}
