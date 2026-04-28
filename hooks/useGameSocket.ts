// ============================================================
// FILE: hooks/useGameSocket.ts
// Minimal changes: typed context, safe defaults
// ============================================================

"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { SocketContext } from "@/contexts/SocketContext";

interface CartelaStatus {
  id: number;
  status: string;
  isMine: boolean;
  isTaken: boolean;
  isAvailable: boolean;
}

interface CartelaCard {
  id: number;
  cardData: any;
  status: string;
}

export function useGameSocket(stake: number | null) {
  const { socket, userId } = useContext(SocketContext);

  const [phase, setPhase] = useState<
    "lobby" | "selecting" | "active" | "ended"
  >("lobby");
  const [gameId, setGameId] = useState<string | null>(null);
  const [cartelaStatuses, setCartelaStatuses] = useState<CartelaStatus[]>([]);
  const [selectedCartelaIds, setSelectedCartelaIds] = useState<number[]>([]);
  const [timer, setTimer] = useState(30);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [myCartelaCards, setMyCartelaCards] = useState<CartelaCard[]>([]);

  // ── Join game room when stake changes ──
  useEffect(() => {
    if (!socket || !stake || !userId) return;

    socket.emit("game:join", { stake, userId });
  }, [socket, stake, userId]);

  // ── Socket event listeners ──
  useEffect(() => {
    if (!socket) return;

    const handleGameState = (data: {
      gameId: string;
      status: string;
      stake: number;
      cartelas: CartelaStatus[];
      calledNumbers?: number[];
    }) => {
      setGameId(data.gameId);

      if (data.status === "selecting") setPhase("selecting");
      else if (data.status === "active") setPhase("active");
      else if (data.status === "ended") setPhase("ended");

      setCartelaStatuses(data.cartelas || []);

      const myIds = (data.cartelas || [])
        .filter((c: CartelaStatus) => c.isMine)
        .map((c: CartelaStatus) => c.id);
      setSelectedCartelaIds(myIds);

      if (data.calledNumbers) {
        setCalledNumbers(data.calledNumbers);
      }
    };

    const handleTimerSync = (data: { secondsLeft: number }) => {
      setTimer(data.secondsLeft);
    };

    const handleCartelaUpdate = (data: {
      cartelaId: number;
      status: string;
      userId: string;
    }) => {
      setCartelaStatuses((prev) =>
        prev.map((c) => {
          if (c.id === data.cartelaId) {
            const isMine = data.userId === userId;
            return {
              ...c,
              status: data.status,
              isMine: isMine || c.isMine,
              isTaken: !isMine,
              isAvailable: false,
            };
          }
          return c;
        }),
      );

      if (data.userId === userId) {
        setSelectedCartelaIds((prev) => {
          if (!prev.includes(data.cartelaId)) {
            return [...prev, data.cartelaId];
          }
          return prev;
        });
      }
    };

    const handleCartelaConfirmed = (data: {
      cartelaId: number;
      cardData: any;
    }) => {
      setMyCartelaCards((prev) => {
        if (prev.find((c) => c.id === data.cartelaId)) return prev;
        return [
          ...prev,
          { id: data.cartelaId, cardData: data.cardData, status: "selected" },
        ];
      });
    };

    const handleCartelaError = (data: {
      cartelaId: number;
      message: string;
    }) => {
      console.warn("[useGameSocket] cartela:error", data.message);
    };

    const handleGamePhase = (data: { phase: string }) => {
      if (data.phase === "active") {
        setPhase("active");
        if (gameId && userId) {
          socket.emit(
            "game:get-my-cartelas",
            { gameId, userId },
            (response: { success: boolean; cartelas: CartelaCard[] }) => {
              if (response.success && response.cartelas.length > 0) {
                setMyCartelaCards(response.cartelas);
              }
            },
          );
        }
      } else if (data.phase === "ended") {
        setPhase("ended");
      }
    };

    const handleNumberCalled = (data: {
      number: number;
      calledNumbers: number[];
    }) => {
      setCalledNumbers(data.calledNumbers);
    };

    const handleGameNew = (data: {
      gameId: string;
      stake: number;
      status: string;
    }) => {
      setGameId(data.gameId);
      setPhase("selecting");
      setCartelaStatuses([]);
      setSelectedCartelaIds([]);
      setTimer(30);
      setCalledNumbers([]);
      setMyCartelaCards([]);

      if (stake && userId) {
        socket.emit("game:join", { stake, userId });
      }
    };

    socket.on("game:state", handleGameState);
    socket.on("timer:sync", handleTimerSync);
    socket.on("cartela:update", handleCartelaUpdate);
    socket.on("cartela:confirmed", handleCartelaConfirmed);
    socket.on("cartela:error", handleCartelaError);
    socket.on("game:phase", handleGamePhase);
    socket.on("number:called", handleNumberCalled);
    socket.on("game:new", handleGameNew);

    return () => {
      socket.off("game:state", handleGameState);
      socket.off("timer:sync", handleTimerSync);
      socket.off("cartela:update", handleCartelaUpdate);
      socket.off("cartela:confirmed", handleCartelaConfirmed);
      socket.off("cartela:error", handleCartelaError);
      socket.off("game:phase", handleGamePhase);
      socket.off("number:called", handleNumberCalled);
      socket.off("game:new", handleGameNew);
    };
  }, [socket, userId, gameId, stake]);

  const selectCartela = useCallback(
    (cartelaId: number) => {
      if (!socket || !gameId || !userId) return;
      socket.emit("cartela:select", { gameId, cartelaId, userId });
    },
    [socket, gameId, userId],
  );

  return {
    phase,
    gameId,
    cartelaStatuses,
    selectedCartelaIds,
    timer,
    calledNumbers,
    myCartelaCards,
    selectCartela,
  };
}