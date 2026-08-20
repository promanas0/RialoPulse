import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Official MetaMask Fox SVG Vector Logo
 */
export const MetaMaskLogo: React.FC<IconProps> = ({ className = 'w-7 h-7', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 318.6 318.6"
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M274.1 35.5L174.6 109.4L193 65.8L274.1 35.5Z"
      fill="#E2761B"
      stroke="#E2761B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M44.4 35.5L143.9 109.4L125.5 65.8L44.4 35.5Z"
      fill="#E4761B"
      stroke="#E4761B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M238.3 206.8L209.9 249.4L266.8 264.9L283.4 207.6L238.3 206.8Z"
      fill="#E4761B"
      stroke="#E4761B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35.2 207.6L51.8 264.9L108.6 249.4L80.3 206.8L35.2 207.6Z"
      fill="#E4761B"
      stroke="#E4761B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M103.6 138.2L87.4 162.5L144.1 165.7L142.3 105.1L103.6 138.2Z"
      fill="#E4761B"
      stroke="#E4761B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M214.9 138.2L175.8 104.4L174.4 165.7L231.1 162.5L214.9 138.2Z"
      fill="#E4761B"
      stroke="#E4761B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M108.6 249.4L139.8 234.3L113.8 208.5L108.6 249.4Z"
      fill="#D7C1B3"
      stroke="#D7C1B3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M178.8 234.3L209.9 249.4L204.8 208.5L178.8 234.3Z"
      fill="#D7C1B3"
      stroke="#D7C1B3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M140.2 234.5L144.1 278.4L144.6 245.9L140.2 234.5Z"
      fill="#233447"
      stroke="#233447"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M178.4 234.5L174 245.8L174.4 278.4L178.4 234.5Z"
      fill="#233447"
      stroke="#233447"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M144.1 278.4L140.2 234.5L108.6 249.4L144.1 278.4Z"
      fill="#CD6116"
      stroke="#CD6116"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M178.4 234.5L174.4 278.4L209.9 249.4L178.4 234.5Z"
      fill="#CD6116"
      stroke="#CD6116"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M204.8 208.5L209.9 249.4L238.3 206.8L204.8 208.5Z"
      fill="#E4751F"
      stroke="#E4751F"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M80.3 206.8L108.6 249.4L113.8 208.5L80.3 206.8Z"
      fill="#E4751F"
      stroke="#E4751F"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M87.4 162.5L103.6 138.2L80.3 206.8L87.4 162.5Z"
      fill="#F6851B"
      stroke="#F6851B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M214.9 138.2L231.1 162.5L238.3 206.8L214.9 138.2Z"
      fill="#F6851B"
      stroke="#F6851B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M174.4 165.7L175.8 104.4L193 65.8L174.4 165.7Z"
      fill="#F6851B"
      stroke="#F6851B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M125.5 65.8L142.7 104.4L144.1 165.7L125.5 65.8Z"
      fill="#F6851B"
      stroke="#F6851B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M174.4 165.7L144.1 165.7L140.2 234.5L178.4 234.5L174.4 165.7Z"
      fill="#F6851B"
      stroke="#F6851B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Official Phantom Ghost SVG Vector Logo
 */
export const PhantomLogo: React.FC<IconProps> = ({ className = 'w-7 h-7', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="128" height="128" rx="28" fill="url(#phantom_grad)" />
    <path
      d="M101.3 67.2C99.6 44.5 80.9 28 58.2 28C34.1 28 14.5 47.6 14.5 71.7C14.5 83.2 18.9 93.6 26.2 101.4C28.2 103.5 31.4 104.1 34.1 102.9C36.7 101.8 38.3 99.2 38.3 96.3V78.7C38.3 75.4 41 72.7 44.3 72.7C47.6 72.7 50.3 75.4 50.3 78.7V96.3C50.3 99.2 51.9 101.8 54.5 102.9C57.2 104.1 60.4 103.5 62.4 101.4C64.3 99.4 65.4 96.7 65.4 93.9V78.7C65.4 75.4 68.1 72.7 71.4 72.7C74.7 72.7 77.4 75.4 77.4 78.7V93.9C77.4 96.7 78.5 99.4 80.4 101.4C82.4 103.5 85.6 104.1 88.2 102.9C90.9 101.8 92.5 99.2 92.5 96.3V78.7C92.5 75.4 95.2 72.7 98.5 72.7C99.9 72.7 101.1 73.8 101.3 75.2L101.3 67.2Z"
      fill="white"
    />
    <circle cx="76" cy="54" r="5" fill="#53457D" />
    <circle cx="92" cy="54" r="5" fill="#53457D" />
    <defs>
      <linearGradient id="phantom_grad" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
        <stop stopColor="#53457D" />
        <stop offset="1" stopColor="#413564" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Official Coinbase Wallet SVG Vector Logo
 */
export const CoinbaseLogo: React.FC<IconProps> = ({ className = 'w-7 h-7', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="128" height="128" rx="28" fill="#0052FF" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M64 26C43.0132 26 26 43.0132 26 64C26 84.9868 43.0132 102 64 102C84.9868 102 102 84.9868 102 64C102 43.0132 84.9868 26 64 26ZM52 50H76C77.1046 50 78 50.8954 78 52V76C78 77.1046 77.1046 78 76 78H52C50.8954 78 50 77.1046 50 76V52C50 50.8954 50.8954 50 52 50Z"
      fill="white"
    />
  </svg>
);

/**
 * Standard Injected / Web3 Ethereum Diamond Vector Logo
 */
export const Web3InjectedLogo: React.FC<IconProps> = ({ className = 'w-7 h-7', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="128" height="128" rx="28" fill="#1C1C1A" stroke="#383832" strokeWidth="2" />
    <path d="M64 22L63.5 23.7V79.2L64 79.7L90 64.3L64 22Z" fill="#34D399" fillOpacity="0.9" />
    <path d="M64 22L38 64.3L64 79.7V52.8V22Z" fill="#34D399" fillOpacity="0.6" />
    <path d="M64 87.2L63.7 87.6V105.7L64 106.5L90 70.1L64 87.2Z" fill="#34D399" fillOpacity="0.9" />
    <path d="M64 106.5V87.2L38 70.1L64 106.5Z" fill="#34D399" fillOpacity="0.6" />
  </svg>
);

/**
 * Instant Reviewer Sandbox Wallet High-Tech Hexagon Badge
 */
export const SandboxReviewerLogo: React.FC<IconProps> = ({ className = 'w-7 h-7', size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="128" height="128" rx="28" fill="#C85A27" fillOpacity="0.15" stroke="#C85A27" strokeWidth="2" />
    <polygon points="64,30 94,47 94,81 64,98 34,81 34,47" fill="none" stroke="#C85A27" strokeWidth="4" />
    <circle cx="64" cy="64" r="12" fill="#C85A27" />
    <circle cx="64" cy="64" r="6" fill="#FFF" />
  </svg>
);
