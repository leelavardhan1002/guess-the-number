import { useState, useEffect } from "react";

export const useNumberTracker = (digitLength) => {
  const [crossedDigits, setCrossedDigits] = useState(
    Array(digitLength)
      .fill()
      .map(() => Array(10).fill(false))
  );
  const [remainingDigits, setRemainingDigits] = useState(
    Array(digitLength).fill("")
  );
  const [numberPadHistory, setNumberPadHistory] = useState([]);
  const [numberPadHistoryIndex, setNumberPadHistoryIndex] = useState(-1);

  useEffect(() => {
    setCrossedDigits(
      Array(digitLength)
        .fill()
        .map(() => Array(10).fill(false))
    );
    setRemainingDigits(Array(digitLength).fill(""));
    setNumberPadHistory([]);
    setNumberPadHistoryIndex(-1);
  }, [digitLength]);

  const updateRemainingDigits = (crossedState = crossedDigits) => {
    const newRemaining = [...remainingDigits];

    for (let col = 0; col < digitLength; col++) {
      const availableDigits = [];
      for (let digit = 0; digit <= 9; digit++) {
        if (!crossedState[col][digit]) {
          availableDigits.push(digit.toString());
        }
      }

      if (availableDigits.length === 1) {
        newRemaining[col] = availableDigits[0];
      } else {
        newRemaining[col] = "";
      }
    }

    setRemainingDigits(newRemaining);
  };

  const saveNumberPadState = () => {
    const currentState = {
      crossedDigits: crossedDigits.map((col) => [...col]),
      remainingDigits: [...remainingDigits],
    };

    const newHistory = numberPadHistory.slice(0, numberPadHistoryIndex + 1);
    newHistory.push(currentState);

    if (newHistory.length > 20) {
      newHistory.shift();
    } else {
      setNumberPadHistoryIndex((prev) => prev + 1);
    }

    setNumberPadHistory(newHistory);
  };

  const toggleDigitCross = (column, digit) => {
    const newCrossed = crossedDigits.map((col) => [...col]);
    newCrossed[column][digit] = !newCrossed[column][digit];

    saveNumberPadState();
    setCrossedDigits(newCrossed);
    updateRemainingDigits(newCrossed);
  };

  const undoNumberPad = () => {
    if (numberPadHistoryIndex > 0) {
      const prevIndex = numberPadHistoryIndex - 1;
      const prevState = numberPadHistory[prevIndex];

      setCrossedDigits(prevState.crossedDigits.map((col) => [...col]));
      setRemainingDigits([...prevState.remainingDigits]);
      setNumberPadHistoryIndex(prevIndex);
    }
  };

  const redoNumberPad = () => {
    if (numberPadHistoryIndex < numberPadHistory.length - 1) {
      const nextIndex = numberPadHistoryIndex + 1;
      const nextState = numberPadHistory[nextIndex];

      setCrossedDigits(nextState.crossedDigits.map((col) => [...col]));
      setRemainingDigits([...nextState.remainingDigits]);
      setNumberPadHistoryIndex(nextIndex);
    }
  };

  const resetNumberPad = () => {
    saveNumberPadState();
    const newCrossed = Array(digitLength)
      .fill()
      .map(() => Array(10).fill(false));
    setCrossedDigits(newCrossed);
    setRemainingDigits(Array(digitLength).fill(""));
  };

  return {
    crossedDigits,
    remainingDigits,
    numberPadHistory,
    numberPadHistoryIndex,
    toggleDigitCross,
    undoNumberPad,
    redoNumberPad,
    resetNumberPad,
    setCrossedDigits,
    setRemainingDigits,
    setNumberPadHistory,
    setNumberPadHistoryIndex,
  };
};
