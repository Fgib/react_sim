# Gravity Simulator in React

An interactive gravity simulation built with React, TypeScript, and Canvas. Simulate planetary orbits and celestial mechanics in real-time.

![Gravity Simulator Preview](orbit.svg)

## ✨ Features

- **Interactive Solar System Simulation**
  - Real-time physics calculations using Newton's law of universal gravitation
  - Initial setup includes Sun, Mercury, Venus, Earth (with Moon), Mars, Jupiter, and Saturn
  - Accurate mass ratios and orbital velocities

- **Rich Interactive Controls**
  - Play/Pause simulation
  - Pan and zoom controls
  - Trajectory predictions
  - Body selection and tracking
  - Add/remove celestial bodies
  - Generate asteroid belts

- **Beautiful UI Components**
  - Built with shadcn/ui components
  - Clean and modern interface
  - Real-time FPS counter
  - Detailed body parameters editor

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 🛠️ Tech Stack

- [`React`](package.json) - UI framework
- [`TypeScript`](tsconfig.json) - Type safety
- [`Vite`](vite.config.ts) - Build tool
- [`TailwindCSS`](tailwind.config.js) - Styling
- `shadcn/ui` - UI components
- [`Canvas API`](src/sim.tsx) - Rendering

## 🎮 Controls

- **Pan**: Click and drag
- **Zoom**: Mouse wheel
- **Select Body**: Click on any celestial body
- **Add Body**: Click the '+' button
- **Generate Asteroid Belt**: Click 'Belt' button
- **Toggle Predictions**: Click the telescope button
- **Play/Pause**: Click the play/pause button

## 🌟 Key Components

- [`Sim`](src/sim.tsx) - Main simulation component

## 📝 License

This project is MIT licensed. Feel free to use and modify the code as you see fit.

---

Built with ❤️ using React and TypeScript. The simulation uses simplified physics models but maintains realistic mass ratios and orbital mechanics.
