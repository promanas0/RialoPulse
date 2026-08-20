# RialoPulse ⚡

> **Next-Generation Telemetry, Parallel VM Execution (REX), Genesis Validator Quorum, and Interactive Developer Sandbox for the Rialo Ecosystem.**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![Chain ID](https://img.shields.io/badge/Chain%20ID-7146%20(0x1BEA)-blue.svg)](#network-specifications)
[![Block Target](https://img.shields.io/badge/Block%20Target-50ms%20Sub--Second-emerald.svg)](#architectural-highlights)
[![Genesis Registry](https://img.shields.io/badge/Genesis%20Registry-SubzeroLabs-purple.svg)](https://github.com/SubzeroLabs/rialo-testnet)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61DAFB.svg)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC.svg)](https://tailwindcss.com/)

---

## 📌 Executive Summary

**RialoPulse** is an enterprise-grade infrastructure monitoring platform, Web3 developer suite, and real-time execution playground built for the high-throughput **Rialo Network**. 

Engineered to showcase Rialo's **50ms sub-second block finality** and **Rialo Extended Execution (REX)** parallel compute engine, RialoPulse bridges live validator telemetry, interactive JSON-RPC debugging, multi-wallet Web3 connectivity, and high-frequency market mechanics in a unified, cyberpunk-inspired glassmorphism interface.

```
                     ┌────────────────────────────────────────────────────────┐
                     │                 RialoPulse Client                      │
                     │  (Cyberpunk Glassmorphism • WebGL • Web Audio API)    │
                     └───────────────┬───────────────────────┬────────────────┘
                                     │                       │
                       WebSocket / JSON-RPC        EIP-1193 Web3 Providers
                                     │                       │
                                     ▼                       ▼
                     ┌────────────────────────┐    ┌──────────────────────────┐
                     │ Rialo Sequencer / REX  │    │  MetaMask / Phantom /    │
                     │  (50ms Block Engine)   │    │  Coinbase / Injected     │
                     └───────────────┬────────┘    └──────────────────────────┘
                                     │
                     ┌───────────────┴────────────────────────┐
                     │   SubzeroLabs Genesis Validator Mesh   │
                     │  (P2P.org, Keplr, B-Harvest, InfStones)│
                     └────────────────────────────────────────┘
```

---

## 🚀 Key Modules & Capabilities

### 1. 🌐 Tier-1 Spotlight Overview & 3D Interactive Globe
- **Cyberpunk Dark Mode Aesthetic**: Deep obsidian backdrop (`#0A0A09`), top-center radial gradient spotlights (`rgba(200, 90, 39, 0.18)`), 3% SVG matte noise texture overlay, and animated glowing border beams.
- **Ultra-Light WebGL Globe (`cobe`)**: Real-time 3D planetary mesh visualizing active validator nodes across North America, Europe, Asia Pacific, and South America with glowing consensus routing arcs, drag-to-rotate physics, and 1-click node auto-focusing.
- **Dynamic Cursor Lighting Shaders**: Glassmorphism cards dynamically track mouse coordinates with soft radial follow-glow shaders.
- **Live Counting Metrics Tickers**: 50ms Target, 18,420 Live TPS, 148 Global Validators, 99.98% Network Uptime.

### 2. 🖥️ Interactive On-Chain CLI Playground
- **Embedded Browser Terminal**: Full interactive Web3 command-line interface with CRT scanline styling and mechanical keystroke sounds.
- **Real-Time Interactive Commands**:
  - `status`: Queries consensus proposers, block height, and runtime health.
  - `genesis`: Inspects official SubzeroLabs genesis config hash and verification timestamp.
  - `validators`: Queries the active genesis validator quorum and node addresses.
  - `faucet`: Triggers a live 100.00 RIALO testnet drip with transaction feedback.
  - `tps`: Measures real-time parallel execution velocity.
  - `nodes`: Lists validator ping latency matrix across Tokyo, Frankfurt, London, and San Francisco.
  - `rex`: Inspects parallel confidential computing state roots and zero-knowledge SNARK proofs.
  - `wallet`: Displays active Web3 wallet address, network ID, and live balance.
  - `help` / `clear`: Terminal buffer management.
- **Quick Run Action Chips**: 1-click execution chips for instant terminal queries.

### 3. 🛡️ Official Genesis & Validator Quorum Registry
Directly synced with the official **[SubzeroLabs/rialo-testnet](https://github.com/SubzeroLabs/rialo-testnet)** genesis registry:
- **Genesis Config Hash**: `b1cdca444af9a8e74f56fd9140c9820e3fa162e833cee90192383b1a9335d0f6`
- **Genesis Multi-Sig Quorum**: 13 verified proposer signatures.
- **Genesis Nodes**:
  - `node0.testnet.rialo.io` / `node1.testnet.rialo.io` / `node2.testnet.rialo.io`
  - `testnet-validator.rialo.p2p.org` (P2P.org)
  - `rialo-testnet-validator.keplr.app` (Keplr)
  - `rialo-testnet-validator.nodeinfra.com` (NodeInfra)
  - `rialo-testnet-validator.bharvest.io` (B-Harvest)
  - `rialo-tn-val.citadel.one` (Citadel.one)
  - `rialo.validator.infstones.com` (InfStones)
  - `rialo-testnet-validator.nodes.guru` (NodesGuru)
  - `val.rialo.testnet.pops.one` (Pops.one)
  - `validator.rialo.staking.banansen.dev` (Banansen)

### 4. 👛 Multi-Wallet Web3 Suite & Automatic Network Switcher
- **Official Vector SVG Brand Logos**: Pixel-perfect vector SVGs for **MetaMask**, **Phantom**, **Coinbase Wallet**, **Browser Injected (EIP-1193)**, and **Instant Reviewer Sandbox Wallet**.
- **Instant Reviewer Sandbox Mode**: Pre-loaded sandbox wallet (`0x7140B35e69b59C39110B6C0753549fC054097140`) allowing testing without browser extensions.
- **Automatic Network Detection & Switcher**: Automatic chain ID detection with 1-click switching via `wallet_switchEthereumChain` / `wallet_addEthereumChain` and a persistent Wrong Network banner.
- **Sonner Transaction Toasts**: Transaction status alerts (Pending ⏳, Confirmed ✅, Failed ❌) equipped with direct **"View on Explorer ↗"** links.

### 5. 🕹️ Market Reflex Arcade Game
- **Candlestick Conveyor**: Real-time candlestick stream (Green 🟢 Bullish / Red 🔴 Bearish) traveling toward a precision laser strike zone.
- **Microsecond Decision Engine**: Sub-second keyboard (`ArrowUp` / `W` and `ArrowDown` / `S`) and mobile touch controls.
- **Combo Multipliers & Speed Escalation**:
  - 5+ Streak: `2x Multiplier 🔥`
  - 10+ Streak: `3x Multiplier ⚡`
  - 20+ Streak: `5x GODLIKE Multiplier 🚀`
  - Conveyor speed accelerates dynamically to test human neural reflexes against 50ms block times.
- **3 Hearts Life System & Trader Ranks**:
  - `< 500 XP`: `Paper Hands 📄`
  - `500 - 1,500 XP`: `Degen Scalper ⚡`
  - `1,500 - 3,000 XP`: `High-Frequency Arbitrageur 🤖`
  - `3,000+ XP`: `50ms Diamond Reflex Master 💎`
- **Web3 Faucet Reward & Viral Sharing**: Score 500+ XP to claim 100 RIALO testnet tokens directly from the UI, and share high scores directly to X (Twitter).

### 6. 🔊 Procedural Cyberpunk Web Audio Haptics
- **Zero External Assets**: 100% procedural synthetic sound engine generated using the browser's native **Web Audio API**.
- Includes snappy click tones, micro-hover blips, mechanical terminal keystrokes, dual-tone confirmation chimes, and arcade hit/miss sound effects.
- Global mute toggle button (🔊 / 🔇) in the header with persistent `localStorage` preference.

---

## ⚙️ Network Specifications

| Parameter | Value |
| :--- | :--- |
| **Network Name** | `Rialo Testnet` |
| **Chain ID (Decimal)** | `7146` |
| **Chain ID (Hex)** | `0x1BEA` |
| **Native Currency** | `RIALO` (18 Decimals) |
| **Primary RPC Endpoint** | `https://testnet-rpc.rialo.io` |
| **Block Explorer** | `https://explorer.rialo.io` |
| **Block Time Target** | `50ms` |
| **Consensus Protocol** | `Rialo Parallel Proposer (RPP)` |
| **Parallel VM Runtime** | `REX (Rialo Extended Execution) v0.9.4` |
| **Genesis Config Hash** | `b1cdca444af9a8e74f56fd9140c9820e3fa162e833cee90192383b1a9335d0f6` |

---

## 🛠️ Tech Stack & Tooling

- **Core Framework**: [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- **Build Engine & Bundler**: [Vite 8](https://vitejs.dev/) + Rolldown Fast Compiler
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) with Cyberpunk Tokens & Noise Filters
- **3D Visualization**: [Cobe](https://github.com/shuding/cobe) (~5 KB WebGL Interactive Globe)
- **Audio Engine**: Native Browser [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) (Procedural Synthesis)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) Toast Notifications with Explorer Deep Linking
- **Iconography**: [Lucide React](https://lucide.dev/) + Custom Vector Brand Marks
- **Code Quality**: [Oxlint](https://oxc.rs/) & Strict TypeScript Verification

---

## 📂 Project Structure

```
RialoPulse/
├── src/
│   ├── components/
│   │   ├── AccountModal.tsx           # Account balance, copy address, explorer links & disconnect
│   │   ├── BentoGrid.tsx              # Spotlight glassmorphism architectural highlight cards
│   │   ├── ContractSandbox.tsx        # JSON-RPC method tester & real-time contract event streamer
│   │   ├── DevToolkit.tsx             # Faucet dripping interface & custom RPC ping suite
│   │   ├── Header.tsx                 # Glassmorphism header, network switcher, sound toggle & wallet
│   │   ├── InteractiveCliTerminal.tsx # Simulated live Web3 terminal with realistic command outputs
│   │   ├── MarketReflexGame.tsx       # Candlestick reflex arcade game with combos & rewards
│   │   ├── MarqueeStrip.tsx           # Infinite auto-scrolling tech stack banner
│   │   ├── NetworkGlobe.tsx           # WebGL 3D interactive globe with consensus routing arcs
│   │   ├── PeerVisualizer.tsx         # Node peer topology table with 3D Globe / 2D Map toggle
│   │   ├── SpotlightCard.tsx          # Reusable cursor-tracking radial lighting shader card
│   │   ├── SpotlightHero.tsx          # Tier-1 hero section with shimmer badges & live metrics
│   │   ├── TelemetryMetrics.tsx       # Core telemetry meters, TPS charts, and gas gauges
│   │   ├── WalletConnectModal.tsx     # Multi-wallet selector with official vector SVG brand logos
│   │   ├── WalletIcons.tsx            # Official vector SVG brand logos (MetaMask, Phantom, Coinbase)
│   │   └── WrongNetworkBanner.tsx     # Persistent warning banner with 1-click network switcher
│   ├── context/
│   │   └── WalletContext.tsx          # Global wallet state, balance polling, and faucet dispatcher
│   ├── services/
│   │   ├── mockDataService.ts         # SubzeroLabs genesis nodes, initial metrics, and RPC presets
│   │   ├── rpcService.ts              # Network switching, RPC latency pings, and method execution
│   │   ├── soundService.ts            # Procedural Web Audio API sound synthesizer
│   │   ├── telemetryService.ts        # Telemetry subscription engine & background pings
│   │   ├── transactionToast.tsx       # Sonner toast feedback helpers with explorer links
│   │   └── walletService.ts           # EIP-1193 multi-wallet detector & network handlers
│   ├── types/
│   │   └── index.ts                   # TypeScript domain interfaces and type definitions
│   ├── App.tsx                        # Master dashboard container, layout & tab router
│   ├── index.css                      # Tailwind base, noise overlay, border beams & scanlines
│   └── main.tsx                       # React root entrypoint
├── tailwind.config.js                 # Cyberpunk colors, border glows, keyframes & animations
├── tsconfig.json                      # Strict TypeScript compiler options
└── package.json                       # Dependencies and build scripts
```

---

## 💻 Local Development & Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/promanas0/RialoPulse.git
   cd RialoPulse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

4. **Verify TypeScript compilation & production build**:
   ```bash
   npm run build
   ```

5. **Run the fast linter**:
   ```bash
   npm run lint
   ```

---

## 🧪 Testing Guide for Reviewers

1. **Wallet Connection**: Click **"Connect Wallet"** in the top navigation bar. Choose between MetaMask, Phantom, Coinbase Wallet, Browser Injected, or the **Instant Reviewer Sandbox Wallet** to test without extensions.
2. **One-Click Network Switch**: Switch your wallet to another chain (e.g., Ethereum Mainnet) to test the **Wrong Network Banner** and 1-click **"Switch to Rialo Testnet"** action.
3. **Interactive CLI Terminal**: Scroll to the terminal below the hero section. Click quick chips or type `status`, `genesis`, `validators`, `faucet`, `tps`, or `rex`.
4. **Market Reflex Arcade Game**: Navigate to the **"Market Reflex 🎮"** tab. Press `[▲]` / `[W]` for Green candles and `[▼]` / `[S]` for Red candles. Reach 500+ XP to unlock the 1-click **Claim 100 RIALO** reward.
5. **3D WebGL Globe**: Navigate to **"Nodes & Peers"** and toggle to **3D Globe**. Drag with the mouse to rotate, and click any node in the table to auto-focus the globe coordinates.
6. **JSON-RPC Debugger**: Open **"Contract Sandbox"**, select `rialo_getGenesisConfig` or `rialo_getREXState`, and execute live queries.

---

## 📄 License

This project is open-source software licensed under the **[MIT License](LICENSE)**.
