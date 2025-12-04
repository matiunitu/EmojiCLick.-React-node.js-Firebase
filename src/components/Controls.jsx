import React from 'react';

export function Controls({ actions, gameState }) {
    const strengthCost = (gameState.strength - 10) * 2 + 30;
    const healthCost = (gameState.maxHealth - 100) / 2 + 30;
    const recoverCost = "free";

    return (
        <div className="controls-panel">
            <button
                className="btn upgrade-btn"
                onClick={actions.upgradeStrength}
                disabled={gameState.gold < strengthCost}
            >
                <span className="icon">💪</span>
                <div className="btn-text">
                    <span>+Strength</span>
                    <span className="cost">💰 {strengthCost}</span>
                </div>
            </button>

            <button
                className="btn upgrade-btn"
                onClick={actions.upgradeHealth}
                disabled={gameState.gold < healthCost}
            >
                <span className="icon">❤️</span>
                <div className="btn-text">
                    <span>+Health</span>
                    <span className="cost">💰 {healthCost}</span>
                </div>
            </button>

            <button
                className="btn recover-btn"
                onClick={actions.recoverEnergy}
                disabled={gameState.gold < recoverCost}
            >
                <span className="icon">⚡</span>
                <div className="btn-text">
                    <span>Recover</span>
                    <span className="cost">💰 {recoverCost}</span>
                </div>
            </button>
        </div>
    );
}
