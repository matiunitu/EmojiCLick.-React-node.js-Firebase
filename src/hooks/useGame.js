import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveUserProfile } from '../services/db';

const LEVELS = Array.from({ length: 10 }, (_, i) => ({
  level: i + 1,
  enemyHP: 100 * Math.pow(1.5, i),
  enemyDamage: 5 * Math.pow(1.2, i),
  goldReward: 20 * Math.pow(1.3, i),
  emoji: ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐐', '🐵', '🐔'][i]
}));

const EVO_MULTIPLIERS = {
  1: 1,      // Easy
  2: 2,      // Easy-Intermediate
  3: 6,      // Intermediate
  4: 20,     // Hard
  5: 100     // SUPER HARD
};

export function useGame() {
  const { currentUser } = useAuth();
  const [startTime] = useState(Date.now());
  const [gameState, setGameState] = useState({
    gold: 0,
    level: 1,
    maxLevel: 1,
    evolution: 1,
    health: 100,
    maxHealth: 100,
    strength: 10,
    energy: 100,
    maxEnergy: 100,
    enemyHP: LEVELS[0].enemyHP,
    maxEnemyHP: LEVELS[0].enemyHP,
    gameStatus: 'playing', // playing, gameover, victory
  });

  const currentLevelData = LEVELS[gameState.level - 1];

  // Energy Regen
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        energy: Math.min(prev.energy + 5, prev.maxEnergy)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.gameStatus, gameState.maxEnergy]);

  // Enemy Attack
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      setGameState(prev => {
        const evoMultiplier = EVO_MULTIPLIERS[prev.evolution] || Math.pow(2, prev.evolution - 1);
        const damage = currentLevelData.enemyDamage * evoMultiplier;
        const newHealth = prev.health - damage;
        if (newHealth <= 0) {
          return { ...prev, health: 0, gameStatus: 'gameover' };
        }
        return { ...prev, health: newHealth };
      });
    }, 2000); // Attack every 2 seconds
    return () => clearInterval(interval);
  }, [gameState.gameStatus, gameState.level, gameState.evolution]);

  const clickEnemy = useCallback(() => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.energy < 5) return; // Not enough energy

    setGameState(prev => {
      const newEnergy = prev.energy - 5;
      const newEnemyHP = prev.enemyHP - prev.strength;

      if (newEnemyHP <= 0) {
        // Enemy Defeated
        let nextLevel = prev.level + 1;
        let nextEvolution = prev.evolution;
        let victory = false;

        if (prev.level === 10) {
          if (prev.evolution === 5) {
            victory = true;
          } else {
            nextLevel = 1;
            nextEvolution = prev.evolution + 1;
          }
        }

        if (victory) {
          const timeTaken = (Date.now() - startTime) / 1000; // seconds
          if (currentUser && !currentUser.isGuest) {
            saveUserProfile(currentUser.uid, { speedrunTime: timeTaken });
          }
          return { ...prev, enemyHP: 0, gameStatus: 'victory' };
        }

        // Save Max Level
        const currentMaxLevel = (prev.evolution - 1) * 10 + prev.level;
        const newMaxLevel = (nextEvolution - 1) * 10 + nextLevel;

        if (newMaxLevel > prev.maxLevel) {
          if (currentUser && !currentUser.isGuest) {
            saveUserProfile(currentUser.uid, { maxLevel: newMaxLevel });
          }
        }

        const nextLevelData = LEVELS[nextLevel - 1];
        const evoMultiplier = EVO_MULTIPLIERS[nextEvolution] || Math.pow(2, nextEvolution - 1);
        const nextMaxHP = nextLevelData.enemyHP * evoMultiplier;

        return {
          ...prev,
          gold: prev.gold + currentLevelData.goldReward * evoMultiplier,
          level: nextLevel,
          maxLevel: Math.max(prev.maxLevel, newMaxLevel),
          evolution: nextEvolution,
          enemyHP: nextMaxHP,
          maxEnemyHP: nextMaxHP,
          energy: newEnergy,
          health: Math.min(prev.health + 20, prev.maxHealth) // Small heal on kill
        };
      }

      return {
        ...prev,
        energy: newEnergy,
        enemyHP: newEnemyHP
      };
    });
  }, [gameState, currentLevelData, currentUser, startTime]);

  const upgradeStrength = () => {
    // Strength starts at 10. Upgrades add 5.
    // Base cost 30.
    // Formula: (CurrentStrength - 10) * 2 + 30
    const cost = (gameState.strength - 10) * 2 + 30;
    if (gameState.gold >= cost) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - cost,
        strength: prev.strength + 5
      }));
    }
  };

  const upgradeHealth = () => {
    // Health starts at 100. Upgrades add 20.
    // Base cost 30.
    // Formula: (CurrentHealth - 100) / 2 + 30
    const cost = (gameState.maxHealth - 100) / 2 + 30;
    if (gameState.gold >= cost) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - cost,
        maxHealth: prev.maxHealth + 20,
        health: prev.maxHealth + 20 // Full heal on upgrade
      }));
    }
  };

  const recoverEnergy = () => {
    const cost = 50;
    if (gameState.gold >= cost) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - cost,
        energy: prev.maxEnergy
      }));
    }
  };

  return {
    gameState,
    currentLevelData,
    actions: {
      clickEnemy,
      upgradeStrength,
      upgradeHealth,
      recoverEnergy,
      restartGame
    }
  };
}
