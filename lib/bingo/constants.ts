import type { RecentGame, TopPlayer } from "./types"

export const BINGO_COLUMNS: Record<string, [number, number]> = {
  B: [1, 15],
  I: [16, 30],
  N: [31, 45],
  G: [46, 60],
  O: [61, 75],
}

export const MOCK_RECENT_GAMES: RecentGame[] = [
  {
    id: "DBYJNWQ1",
    date: "4/16/2026, 7:34:34 PM",
    stake: 10,
    cards: 410,
    prize: 4640,
    winners: 1,
    status: "Lost",
  },
  {
    id: "DBYJNWQ2",
    date: "4/15/2026, 8:12:10 PM",
    stake: 20,
    cards: 102,
    prize: 1840,
    winners: 1,
    status: "Win",
  },
]

export const MOCK_TOP_PLAYERS_DAILY: TopPlayer[] = [
  { name: "@ABEBE", wins: 24 },
  { name: "@KEBEDE", wins: 19 },
  { name: "@ALEMU", wins: 18 },
  { name: "@BRUK", wins: 15 },
  { name: "@GEORGE", wins: 12 },
  { name: "@TOLOSA", wins: 10 },
]

export const MOCK_TOP_PLAYERS_WEEKLY: TopPlayer[] = [
  { name: "@KING", wins: 1420 },
  { name: "@LUCKY", wins: 1240 },
  { name: "@MIK", wins: 1100 },
  { name: "@NATI", wins: 980 },
  { name: "@ALEMU", wins: 850 },
  { name: "@KEBE", wins: 720 },
]

export const INITIAL_GAME_STATS = {
  gameId: "DBSVQOLB",
  players: 334,
  bet: 10,
  derash: 2672,
  calledCount: 0,
}

// Mock active game state - toggle this to simulate game in progress
export const MOCK_HAS_ACTIVE_GAME = true