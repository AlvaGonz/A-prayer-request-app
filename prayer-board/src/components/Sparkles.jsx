import React from 'react';
import { m } from 'framer-motion';

const Sparkles = ({ isTriggered, onComplete }) => {
    if (!isTriggered) return null;

    // Generate 8 particles with random flight paths
    const particles = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        initialX: 0,
        initialY: 0,
        targetX: (Math.random() - 0.5) * 80, // spread horizontally
        targetY: -60 - Math.random() * 40,   // rise vertically upwards
        scale: 0.3 + Math.random() * 0.7,    // varying sizes
        rotation: Math.random() * 360,
        delay: Math.random() * 0.2
    }));

    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 10 }}>
            {particles.map((p) => (
                <m.svg
                    key={p.id}
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    initial={{
                        opacity: 1,
                        x: p.initialX,
                        y: p.initialY,
                        scale: 0,
                        rotate: 0
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        x: p.targetX,
                        y: p.targetY,
                        scale: [0, p.scale, 0.5 * p.scale],
                        rotate: p.rotation
                    }}
                    transition={{
                        duration: 0.8 + Math.random() * 0.4,
                        ease: "easeOut",
                        delay: p.delay
                    }}
                    onAnimationComplete={() => {
                        if (p.id === particles.length - 1 && onComplete) {
                            onComplete();
                        }
                    }}
                    style={{ position: 'absolute', fill: 'var(--color-accent-gold)' }}
                >
                    {/* Star/Sparkle shape */}
                    <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
                </m.svg>
            ))}
        </div>
    );
};

export default Sparkles;
