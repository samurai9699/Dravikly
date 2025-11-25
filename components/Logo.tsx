export function Logo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            {/* Outer circle representing analysis/scanning */}
            <circle cx="20" cy="20" r="18" stroke="url(#logo-gradient)" strokeWidth="2" fill="none" opacity="0.3" />
            {/* Inner dynamic shape representing optimization/flow */}
            <path
                d="M 12 20 Q 16 12, 20 20 T 28 20"
                stroke="url(#logo-gradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
            />
            {/* Data points representing insights */}
            <circle cx="12" cy="20" r="2.5" fill="url(#logo-gradient)" />
            <circle cx="20" cy="20" r="2.5" fill="url(#logo-gradient)" />
            <circle cx="28" cy="20" r="2.5" fill="url(#logo-gradient)" />
            {/* Upward arrow representing conversion lift */}
            <path
                d="M 20 28 L 20 16 M 16 20 L 20 16 L 24 20"
                stroke="url(#logo-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
            />
        </svg>
    );
}
