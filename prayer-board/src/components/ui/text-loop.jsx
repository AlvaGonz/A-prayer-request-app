import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, Children } from 'react';
import './text-loop.css';

export function TextLoop({
    children,
    className = '',
    interval = 2.5,
    transition = { duration: 0.4, ease: "easeInOut" },
    variants,
    onIndexChange,
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const items = Children.toArray(children);

    useEffect(() => {
        const intervalMs = interval * 1000;

        const timer = setInterval(() => {
            setCurrentIndex((current) => {
                const next = (current + 1) % items.length;
                if (onIndexChange) onIndexChange(next);
                return next;
            });
        }, intervalMs);
        return () => clearInterval(timer);
    }, [items.length, interval, onIndexChange]);

    const motionVariants = {
        initial: { y: 20, opacity: 0, scale: 0.95 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: -20, opacity: 0, scale: 1.05 },
    };

    return (
        <div className={`text-loop-wrapper ${className}`}>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={currentIndex}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transition}
                    variants={variants || motionVariants}
                    className="text-loop-item"
                >
                    {items[currentIndex]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
