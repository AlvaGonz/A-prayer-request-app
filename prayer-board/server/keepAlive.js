/**
 * Keep-Alive Script — Prevents Render free tier from hibernating
 * 
 * This script pings `/api/health` every 10 minutes to keep the server alive.
 * 
 * ==========================================
 * OPTION 1: External Cron Service (RECOMMENDED)
 * ==========================================
 * Use a free service like UptimeRobot or cron-job.org:
 *   - URL:      https://prayer-board-api.onrender.com/api/health
 *   - Method:   GET
 *   - Interval: Every 10 minutes
 * 
 * UptimeRobot: https://uptimerobot.com (free plan = 50 monitors, 5-min interval)
 * cron-job.org: https://cron-job.org    (free plan = unlimited, 1-min interval)
 * 
 * ==========================================
 * OPTION 2: Self-ping (this script)
 * ==========================================
 * Import this module in server.js after the server starts:
 *   require('./keepAlive');
 * 
 * Note: Self-ping only works while the server is running. If the server
 * hibernates, the self-ping stops too. Use Option 1 for reliability.
 */

const HEALTH_URL = process.env.RENDER_EXTERNAL_URL
    ? `${process.env.RENDER_EXTERNAL_URL}/api/health`
    : 'https://prayer-board-api.onrender.com/api/health';

// Randomized interval between 7–12 minutes to avoid predictable patterns
const getRandomInterval = () => {
    const minMs = 7 * 60 * 1000;
    const maxMs = 12 * 60 * 1000;
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
};

const ping = async () => {
    try {
        const res = await fetch(HEALTH_URL);
        const data = await res.json();
        console.log(`[Keep-Alive] Ping OK at ${data.timestamp}`);
    } catch (err) {
        console.warn(`[Keep-Alive] Ping failed: ${err.message}`);
    }
};

const schedulePing = () => {
    const interval = getRandomInterval();
    console.log(`[Keep-Alive] Next ping in ${(interval / 60000).toFixed(1)} minutes`);
    setTimeout(() => {
        ping().then(schedulePing);
    }, interval);
};

// Start pinging after a short delay (let server fully boot first)
setTimeout(() => {
    console.log(`[Keep-Alive] Starting self-ping (7–12 min random interval) → ${HEALTH_URL}`);
    ping(); // Initial ping
    schedulePing();
}, 5000);

module.exports = { ping, HEALTH_URL };
