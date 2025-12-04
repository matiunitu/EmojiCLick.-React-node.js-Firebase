import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/db';
import { useNavigate } from 'react-router-dom';

export function Leaderboard() {
    const [maxLevelData, setMaxLevelData] = useState([]);
    const [speedrunData, setSpeedrunData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const levels = await getLeaderboard('maxLevel', 10);
            const times = await getLeaderboard('speedrunTime', 10);
            setMaxLevelData(levels);
            setSpeedrunData(times);
            setLoading(false);
        }
        fetchData();
    }, []);

    const getRankStyle = (index) => {
        if (index === 0) return 'rank-1';
        if (index === 1) return 'rank-2';
        if (index === 2) return 'rank-3';
        return 'rank-other';
    };

    const getRankIcon = (index) => {
        if (index === 0) return '👑';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    if (loading) return (
        <div className="leaderboard-page loading">
            <div className="loader">Loading...</div>
        </div>
    );

    return (
        <div className="leaderboard-page">
            <header className="leaderboard-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    ← Back to Game
                </button>
                <h1>🏆 Hall of Fame 🏆</h1>
            </header>

            <div className="leaderboard-grid">
                <div className="leaderboard-card">
                    <div className="card-header">
                        <h3>⚔️ Highest Levels</h3>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maxLevelData.map((user, index) => (
                                    <tr key={user.id} className={getRankStyle(index)}>
                                        <td className="rank-cell">{getRankIcon(index)}</td>
                                        <td className="user-cell">{user.username || 'Anonymous'}</td>
                                        <td className="score-cell">
                                            <span className="lvl-num">{user.maxLevel % 10 || 10}</span>
                                            <span className="evo-tag">Evo {Math.ceil(user.maxLevel / 10)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="leaderboard-card">
                    <div className="card-header">
                        <h3>⚡ Fastest Speedruns</h3>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {speedrunData.map((user, index) => (
                                    <tr key={user.id} className={getRankStyle(index)}>
                                        <td className="rank-cell">{getRankIcon(index)}</td>
                                        <td className="user-cell">{user.username || 'Anonymous'}</td>
                                        <td className="score-cell time-cell">
                                            {user.speedrunTime ? `${user.speedrunTime.toFixed(2)}s` : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
