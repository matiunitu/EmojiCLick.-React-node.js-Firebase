import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { useGame } from './hooks/useGame';
import { Enemy } from './components/Enemy';
import { Stats } from './components/Stats';
import { Controls } from './components/Controls';
import './index.css';

import { Profile } from './components/Profile';
import { Leaderboard } from './components/Leaderboard';
import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';

function Game() {
    const { gameState, currentLevelData, actions } = useGame();
    const { logout, currentUser } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    if (gameState.gameStatus === 'victory') {
        return (
            <div className="game-container victory">
                <h1>🎉 Victory! 🎉</h1>
                <p>You have defeated all 10 levels and 5 Evolutions!</p>
                <button className="btn" onClick={actions.restartGame}>Play Again</button>
                <button className="btn logout-btn" onClick={logout}>Sign Out</button>
            </div>
        );
    }

    if (gameState.gameStatus === 'gameover') {
        return (
            <div className="game-container gameover">
                <h1>💀 Game Over 💀</h1>
                <p>You ran out of health.</p>
                <button className="btn" onClick={actions.restartGame}>Try Again</button>
                <button className="btn logout-btn" onClick={logout}>Sign Out</button>
            </div>
        );
    }

    return (
        <div className="game-container">
            {showProfile && <Profile onClose={() => setShowProfile(false)} />}
            <header className="game-header">
                <h1>Emoji Clicker</h1>
                <div className="user-info">
                    <span>{currentUser.isAnonymous ? 'Anonymous' : currentUser.email}</span>
                    <button className="btn-small" onClick={() => navigate('/leaderboard')}>🏆</button>
                    <button className="btn-small" onClick={() => setShowProfile(true)}>Profile</button>
                    <button className="btn-small" onClick={logout}>Sign Out</button>
                </div>
            </header>

            <main className="game-main">
                <Stats
                    health={gameState.health}
                    maxHealth={gameState.maxHealth}
                    energy={gameState.energy}
                    maxEnergy={gameState.maxEnergy}
                    gold={gameState.gold}
                    level={gameState.level}
                    evolution={gameState.evolution}
                />

                <Enemy
                    emoji={currentLevelData.emoji}
                    hp={gameState.enemyHP}
                    maxHp={gameState.maxEnemyHP}
                    onClick={actions.clickEnemy}
                />

                <Controls
                    actions={actions}
                    gameState={gameState}
                />
            </main>
        </div>
    );
}

function AppContent() {
    const { currentUser } = useAuth();
    return currentUser ? (
        <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
    ) : <Auth />;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
