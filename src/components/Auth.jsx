import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { saveUserProfile } from '../services/db';

export function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup, loginWithGoogle, loginAnonymously } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                const userCredential = await signup(email, password);
                if (username) {
                    await updateProfile(userCredential.user, { displayName: username });
                    await saveUserProfile(userCredential.user.uid, { username: username });
                }
            }
        } catch (err) {
            setError('Failed to ' + (isLogin ? 'log in' : 'create account') + ': ' + err.message);
        }

        setLoading(false);
    }

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
        } catch (err) {
            setError('Failed to log in with Google: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleAnonymousLogin() {
        try {
            setError('');
            setLoading(true);
            await loginAnonymously();
        } catch (err) {
            setError('Failed to log in anonymously: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button disabled={loading} type="submit" className="btn auth-btn">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <button
                    disabled={loading}
                    onClick={handleGoogleLogin}
                    className="btn auth-btn"
                    style={{ marginTop: '10px', backgroundColor: '#4285F4' }}
                >
                    Sign in with Google
                </button>

                <button
                    disabled={loading}
                    onClick={handleAnonymousLogin}
                    className="btn auth-btn guest-btn"
                    style={{ marginTop: '10px' }}
                >
                    Play Anonymously
                </button>

                <div className="auth-toggle">
                    {isLogin ? "Need an account? " : "Already have an account? "}
                    <button
                        className="link-btn"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
}
