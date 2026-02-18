import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Cross Icon SVG */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 192 192"
          style={{ marginBottom: '40px' }}
        >
          <defs>
            <linearGradient id="cross" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#e2b96f' }} />
              <stop offset="100%" style={{ stopColor: '#d4a85c' }} />
            </linearGradient>
          </defs>
          <path
            d="M96 40 L96 152 M60 76 L132 76"
            stroke="url(#cross)"
            strokeWidth="16"
            strokeLinecap="round"
          />
        </svg>

        {/* Title */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#ffffff',
            margin: '0 0 20px 0',
            letterSpacing: '-2px',
          }}
        >
          Prayer Board
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '32px',
            color: '#a0aec0',
            margin: '0',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Share prayer requests and pray for one another
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
