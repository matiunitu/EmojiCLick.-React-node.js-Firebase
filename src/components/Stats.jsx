import React from 'react';

export function Stats({ health, maxHealth, energy, maxEnergy, gold, level, evolution }) {
    const healthPct = (health / maxHealth) * 100;
    const energyPct = (energy / maxEnergy) * 100;

    const toRoman = (num) => {
        const romans = ["", "I", "II", "III", "IV", "V"];
        return romans[num] || num;
    };

    return (
        <div className="stats-panel">
            <div className="top-bar">
                <div className="level-badge">
                    Level {level} <span className="evo-badge">Evo {toRoman(evolution)}</span>
                </div>
                <div className="gold-count">💰 {Math.floor(gold)}</div>
            </div>

            <div className="stat-row">
                <span>❤️ {Math.ceil(health)}/{maxHealth}</span>
                <div className="bar-container">
                    <div className="bar-fill health" style={{ width: `${healthPct}%` }} />
                </div>
            </div>

            <div className="stat-row">
                <span>⚡ {Math.floor(energy)}/{maxEnergy}</span>
                <div className="bar-container">
                    <div className="bar-fill energy" style={{ width: `${energyPct}%` }} />
                </div>
            </div>
        </div>
    );
}
