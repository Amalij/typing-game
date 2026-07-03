 # 🤖 AI Word-Association Challenge (Typing Game)

An interactive, fast-paced typing and voice-controlled word association game built with vanilla HTML, CSS, and JavaScript. Challenge your brain against an "AI Ghost" that simulates quick-thinking word triggers before your timer runs out!

---

## 🌐 Live Demo
Click the badge below to play the game directly in your browser:

[![Play Game](https://img.shields.io/badge/🎮%20Play%20Now-Live%20Demo-brightgreen?style=for-the-badge&logo=vercel)](https://amalij.github.io/typing-game/)

---

## 🎮 Game Modes & Features

- **Double Input Setup:** Play using your standard keyboard or switch to full **Voice Mode** (powered by the Web Speech Recognition API).
- **Adaptive AI Competitor:** An AI Ghost runs an active simulation in the background, trying to guess words matching the target letter before you do.
- **Dynamic Difficulties:** 
  - **Easy:** Limits alphabet pool and grants 5 seconds per letter.
  - **Medium:** Expanded alphabet pool with 4 seconds per letter.
  - **Hard:** Fast-paced chaos with only 2.5 seconds per letter and a highly aggressive AI.
- **Combo Streak Mechanics:** Get 3 correct answers in a row to activate the high-voltage **Glow Effect** and push your limits.
- **Local Persistence:** Tracks and saves your high scores locally via browser `localStorage`.

---

## 🛠️ Built With

- **HTML5:** Semantic architecture for layout, metrics tracking, and modal overlays.
- **CSS3:** Premium deep-space aesthetic featuring modern gradients, clean grid alignments, and custom scale animations.
- **Pure JavaScript:** Core game loops, intervals, event listeners, and voice processing.
- **Web Speech Recognition API:** Configured with `en-LK` locale optimization for live stream transcript processing.

---

## 🚀 Quick Start / How to Play

1. Clone or download this repository.
2. Open the `index.html` file directly in any modern web browser (Google Chrome or Microsoft Edge recommended for voice capabilities).
3. **Select Difficulty:** Choose between Easy, Medium, or Hard.
4. **Choose Input Mode:** Leave voice mode off to use your keyboard, or click `🎤 Voice Mode: OFF` to switch it to `ON`.
5. Click **🎮 Start Game**.
6. Type or say a word starting with the massive letter displayed on the screen before the AI strikes or time runs out!

---

## 📂 Project Structure

```text
├── index.html       # Game structure, controls, and premium overlays
├── style.css        # Space-dark gradients, layout structure, animations, and glow effects
├── script.js        # AI mechanics, speech engine, timers, and application state loops
└── README.md        # Documentation
