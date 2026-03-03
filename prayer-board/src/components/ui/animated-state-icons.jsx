"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

/* ─── 2. MENU → CLOSE ─── hamburger morphs to X */
export function MenuCloseIcon({ size = 40, color = "currentColor", className = "", isOpen = false }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className} style={{ width: size, height: size }}>
            <motion.line x1="10" x2="30" stroke={color} strokeWidth={2.5} strokeLinecap="round"
                animate={isOpen
                    ? { y1: 20, y2: 20, rotate: 45 }
                    : { y1: 12, y2: 12, rotate: 0 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                style={{ transformOrigin: "20px 20px" }}
            />
            <motion.line x1="10" y1="20" x2="30" y2="20" stroke={color} strokeWidth={2.5} strokeLinecap="round"
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                style={{ transformOrigin: "20px 20px" }}
            />
            <motion.line x1="10" x2="30" stroke={color} strokeWidth={2.5} strokeLinecap="round"
                animate={isOpen
                    ? { y1: 20, y2: 20, rotate: -45 }
                    : { y1: 28, y2: 28, rotate: 0 }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                style={{ transformOrigin: "20px 20px" }}
            />
        </svg>
    );
}

/* ─── 7. HEART → FILLED ─── heart fills with bounce */
export function HeartIcon({ size = 40, color = "currentColor", className = "", isFilled = false }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className} style={{ width: size, height: size }}>
            <motion.path
                d="M20 34s-12-7.5-12-16a7.5 7.5 0 0112-6 7.5 7.5 0 0112 6c0 8.5-12 16-12 16z"
                stroke={isFilled ? "#EF4444" : color}
                strokeWidth={2}
                fill={isFilled ? "#EF4444" : "none"}
                animate={isFilled ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                style={{ transformOrigin: "20px 22px" }}
            />
        </svg>
    );
}

/* ─── 9. SEND ─── paper plane flies off then resets */
export function SendIcon({ size = 40, color = "currentColor", className = "", isSent = false }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className} style={{ width: size, height: size }}>
            <motion.g
                animate={isSent
                    ? { x: 30, y: -30, opacity: 0, scale: 0.5 }
                    : { x: 0, y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}>
                <path d="M34 6L16 20l-6-2L34 6z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
                <path d="M34 6L22 34l-6-14" stroke={color} strokeWidth={2} strokeLinejoin="round" />
                <line x1="16" y1="20" x2="22" y2="34" stroke={color} strokeWidth={2} />
            </motion.g>
        </svg>
    );
}

/* ─── 11. EYE → HIDDEN ─── eye opens/closes with slash */
export function EyeToggleIcon({ size = 40, color = "currentColor", className = "", isHidden = false }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className} style={{ width: size, height: size }}>
            <motion.path d="M4 20s6-10 16-10 16 10 16 10-6 10-16 10S4 20 4 20z"
                stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                animate={isHidden ? { opacity: 0.3 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
            <motion.circle cx="20" cy="20" r="5" stroke={color} strokeWidth={2}
                animate={isHidden ? { scale: 0.6, opacity: 0.2 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
            <motion.line x1="6" y1="34" x2="34" y2="6" stroke={color} strokeWidth={2.5} strokeLinecap="round"
                animate={isHidden ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.25 }}
            />
        </svg>
    );
}
