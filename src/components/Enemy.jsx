import React, { useState } from 'react';

export function Enemy({ emoji, hp, maxHp, onClick }) {
    const [isShaking, setIsShaking] = useState(false);

    const handleClick = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 100);
        onClick();
    };

    const hpPercentage = Math.max(0, (hp / maxHp) * 100);

    return (
        <div className="enemy-container">
            <div className="hp-bar-container">
                <div
                    className="hp-bar-fill enemy-hp"
                    style={{ width: `${hpPercentage}%` }}
                />
            </div>
            <div
                className={`enemy-emoji ${isShaking ? 'shake' : ''}`}
                onClick={handleClick}
            >
                {emoji}
            </div>
            <div className="enemy-stats">
                {Math.ceil(hp)} / {Math.ceil(maxHp)} HP
            </div>
        </div>
    );
}
