import React from 'react';
import { m } from 'framer-motion';
import './AnimatedCandle.css';

const AnimatedCandle = ({ size = 64, className = '' }) => {
    return (
        <div className={`animated-candle-container ${className}`} style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="animated-candle-svg"
            >
                {/* Glow behind the candle */}
                <m.circle
                    cx="50"
                    cy="30"
                    initial={{ r: 25, opacity: 0.15 }}
                    animate={{
                        r: [23, 27, 24, 28, 25],
                        opacity: [0.1, 0.2, 0.15, 0.25, 0.15]
                    }}
                    transition={{
                        duration: 4,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "mirror"
                    }}
                    fill="var(--color-accent-gold)"
                    filter="blur(10px)"
                />

                {/* Candle Body */}
                <rect x="42" y="55" width="16" height="40" rx="2" fill="#EAEAEA" />

                {/* Candle Top detail */}
                <ellipse cx="50" cy="55" rx="8" ry="3" fill="#F5F5F5" />
                <ellipse cx="50" cy="95" rx="8" ry="3" fill="#D4D4D4" />

                {/* Wick */}
                <path d="M50 55 Q52 50 50 48" stroke="#333" strokeWidth="1.5" fill="none" />

                {/* The Flame (Animated SVG Path with Framer Motion) */}
                <m.path
                    initial={{ d: "M50 48 Q42 35 50 20 Q58 35 50 48 Z" }}
                    animate={{
                        d: [
                            "M50 48 Q42 35 50 20 Q58 35 50 48 Z",
                            "M50 48 Q45 35 53 18 Q59 36 50 48 Z",
                            "M50 48 Q41 36 48 19 Q57 34 50 48 Z",
                            "M50 48 Q43 35 51 21 Q58 36 50 48 Z",
                        ]
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "mirror"
                    }}
                    fill="url(#flameGradient)"
                />

                {/* Inner Flame (Brighter core) */}
                <m.path
                    initial={{ d: "M50 48 Q46 40 50 30 Q54 40 50 48 Z" }}
                    animate={{
                        d: [
                            "M50 48 Q46 40 50 30 Q54 40 50 48 Z",
                            "M50 48 Q47 40 52 28 Q55 40 50 48 Z",
                            "M50 48 Q45 40 48 29 Q53 40 50 48 Z"
                        ]
                    }}
                    transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "mirror"
                    }}
                    fill="#FFF9E6"
                />

                {/* Definitions for gradients */}
                <defs>
                    <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#FFAA00" />
                        <stop offset="50%" stopColor="#FFCC00" />
                        <stop offset="100%" stopColor="#FFEE88" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default AnimatedCandle;
