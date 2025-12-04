import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/db';

export function Profile({ onClose }) {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            if (currentUser && !currentUser.isGuest) {
                const data = await getUserProfile(currentUser.uid);
                setProfile(data);
            }
            setLoading(false);
        }
        fetchProfile();
    }, [currentUser]);

    if (loading) return <div className="profile-modal">Loading...</div>;

    return (
        <div className="profile-overlay">
            <div className="profile-modal">
                <div className="profile-header">
                    <h2>Profile</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="profile-content">
                    <div className="profile-item">
                        <span className="label">Username:</span>
                        <span className="value">{currentUser.displayName || currentUser.email}</span>
                    </div>

                    <div className="profile-item">
                        <span className="label">Max Level Reached:</span>
                        <span className="value">
                            {profile?.maxLevel ? `Level ${profile.maxLevel % 10 || 10} Evo ${Math.ceil(profile.maxLevel / 10)}` : 'None'}
                        </span>
                    </div>

                    <div className="profile-item">
                        <span className="label">Best Speedrun:</span>
                        <span className="value">
                            {profile?.speedrunTime ? `${profile.speedrunTime.toFixed(2)}s` : 'Not completed'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
