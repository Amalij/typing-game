const display = document.getElementById("display");
const correct = document.getElementById("correct");
const wrong = document.getElementById("wrong");
const comboDisplay = document.getElementById("combo");
const timerDisplay = document.getElementById("timer");
const highScoreDisplay = document.getElementById("highScore");
const gameSection = document.getElementById("game_section");
const aiScoreDisplay = document.getElementById("aiScore");
const aiMessage = document.getElementById("aiMessage");
const comboToast = document.getElementById("combo_toast");
const voiceToggleBtn = document.getElementById("voiceToggleBtn");
const voicePreviewBox = document.getElementById("voice-preview-box");
const heardWordDisplay = document.getElementById("heard-word");

// Alert Modal References
const customAlert = document.getElementById("customAlert");
const modalUserScore = document.getElementById("modal-user-score");
const modalAiScore = document.getElementById("modal-ai-score");
const modalVerdict = document.getElementById("modal-verdict");

let currentLetter = "";
let time = 30;
let timer;
let isGameRunning = false;
let currentCombo = 0;
let isVoiceMode = false; 

// AI & Word Challenge
let aiScore = 0;
let aiTimer;
let aiThinkingInterval;
let wordGuessTimeout; 
let secondsPerLetter = 4;
let currentLetterTimer = secondsPerLetter;
let recognition;

// 🤖 AI එක හිතනවා පෙන්වන්න විවිධ අකුරු වලට අදාළ වචන ලිස්ට් එකක් (Fake AI Brain)
const aiBrainWords = {
    A: ["Apple", "Ant", "Airplane", "Arrow"], B: ["Ball", "Banana", "Book", "Bear"],
    C: ["Cat", "Car", "Computer", "Cake"], D: ["Dog", "Door", "Desk", "Duck"],
    E: ["Egg", "Elephant", "Eagle", "Earth"], F: ["Fish", "Frog", "Fan", "Fox"],
    G: ["Goat", "Grapes", "Girl", "Game"], H: ["Hat", "House", "Horse", "Hand"],
    I: ["Ice", "Ink", "Island", "Iron"], J: ["Jar", "Jeep", "Juice", "Jet"],
    K: ["Kite", "King", "Key", "Kiwi"], L: ["Lion", "Lamp", "Leaf", "Lemon"],
    M: ["Monkey", "Moon", "Milk", "Mouse"], N: ["Nest", "Net", "Nut", "Nail"],
    O: ["Owl", "Orange", "Ocean", "Onion"], P: ["Pen", "Panda", "Pig", "Phone"],
    Q: ["Queen", "Quiz", "Quiet", "Quack"], R: ["Rat", "Rose", "Ring", "Robot"],
    S: ["Sun", "Star", "Ship", "Snake"], T: ["Tree", "Tiger", "Train", "Table"],
    U: ["Umbrella", "Uncle", "Unit", "UFO"], V: ["Van", "Vase", "Violin", "Voice"],
    W: ["Watch", "Water", "Window", "Wolf"], X: ["Xylophone", "X-ray", "Xenon"],
    Y: ["Yo-yo", "Yak", "Yellow", "Yacht"], Z: ["Zebra", "Zero", "Zoo", "Zone"]
};

// Load high score
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.innerText = highScore;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    
    // 💡 ලංකාවේ උච්චාරණයට වඩාත් ගැලපෙන ලෙස සැකසීම
    recognition.lang = 'en-LK'; 
    recognition.interimResults = true; // Live ඇහෙන දේ බලාගන්න true කලා

    recognition.onresult = (event) => {
        if (!isGameRunning || !isVoiceMode) return;
        
        let spokenWord = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            spokenWord += event.results[i][0].transcript;
        }
        
        spokenWord = spokenWord.trim().toLowerCase();
        heardWordDisplay.innerText = spokenWord; // Live display what is heard

        const requiredLetter = display.innerText.toLowerCase();
        
        // 💡 Better Matching Logic: වචන කිහිපයක් ඇහුණත්, ඒ අතරේ නිවැරදි අකුරෙන් පටන් ගන්නා වචනයක් තිබේ නම් සාර්ථක ලෙස ගනියි.
        const wordsArray = spokenWord.split(" ");
        const hasCorrectWord = wordsArray.some(word => word.startsWith(requiredLetter) && word.length > 1);

        if (hasCorrectWord) {
            aiMessage.innerText = `🎯 Correct! You said it first!`;
            aiMessage.style.color = "#4CAF50";
            handleInput(true);
        }
    };
}

function toggleVoiceMode() {
    isVoiceMode = !isVoiceMode;
    voiceToggleBtn.innerText = isVoiceMode ? "🎤 Voice Mode: ON" : "🎤 Voice Mode: OFF";
    voiceToggleBtn.style.backgroundColor = isVoiceMode ? "#00ffcc" : "#ff9800";
    voiceToggleBtn.style.color = isVoiceMode ? "black" : "white";
    voicePreviewBox.style.display = isVoiceMode ? "block" : "none";
}

function randomLetter(difficulty) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let maxIndex = 25;
    if (difficulty === "easy") maxIndex = 7;
    if (difficulty === "medium") maxIndex = 15;
    return alphabet[Math.floor(Math.random() * (maxIndex + 1))].toUpperCase();
}

function startGame() {
    time = 30;
    correct.innerText = 0;
    wrong.innerText = 0;
    aiScore = 0;
    currentCombo = 0;
    comboDisplay.innerText = 0;
    aiScoreDisplay.innerText = 0;
    heardWordDisplay.innerText = "...";
    isGameRunning = true;
    gameSection.style.display = "block";
    
    const difficulty = document.getElementById("difficulty").value;
    display.innerText = randomLetter(difficulty);

    if (isVoiceMode && recognition) {
        try { recognition.start(); } catch(e){}
    }

    timerDisplay.innerText = "Time: " + time;
    clearInterval(timer);
    timer = setInterval(() => {
        time--;
        timerDisplay.innerText = "Time: " + time;
        if (time <= 0) endGame();
    }, 1000);

    nextRound();
}

function nextRound() {
    if (!isGameRunning) return;

    clearTimeout(wordGuessTimeout);
    clearInterval(aiTimer);
    clearInterval(aiThinkingInterval);

    const difficulty = document.getElementById("difficulty").value;
    if (difficulty === "easy") secondsPerLetter = 5;
    if (difficulty === "medium") secondsPerLetter = 4;
    if (difficulty === "hard") secondsPerLetter = 2.5;

    currentLetterTimer = secondsPerLetter;
    const currentLetter = display.innerText;

    // 🤖 1. AI Thinking Animation Engine (ස්ක්‍රීන් එකේ AI වචන මාරු වෙමින් හිතනවා පෙනෙයි)
    let wordsPool = aiBrainWords[currentLetter] || ["Thinking..."];
    let wordIndex = 0;
    
    aiThinkingInterval = setInterval(() => {
        let currentThinkingWord = wordsPool[wordIndex % wordsPool.length];
        aiMessage.innerText = `🤖 AI is thinking: "${currentThinkingWord}..." (${currentLetterTimer}s left)`;
        aiMessage.style.color = "#00ffcc";
        wordIndex++;
    }, 450); // හැම මිලි තත්පර 450කටම AI එක හිතන වචනය වෙනස් වේ

    // 🤖 2. AI Scoring Timer
    aiTimer = setInterval(() => {
        currentLetterTimer--;
        
        let aiChance = difficulty === "hard" ? 0.35 : 0.15;
        if (Math.random() < aiChance && currentLetterTimer > 0) {
            clearInterval(aiTimer);
            clearInterval(aiThinkingInterval);
            clearTimeout(wordGuessTimeout);
            
            aiScore++;
            aiScoreDisplay.innerText = aiScore;
            
            // AI එක ජයග්‍රහණය කල වචනය පෙන්වීම
            let finalAiWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
            aiMessage.innerText = `🤖 AI Ghost blurted out "${finalAiWord}" first! (+1 AI)`;
            aiMessage.style.color = "#ff9800";
            
            setTimeout(() => {
                display.innerText = randomLetter(difficulty);
                nextRound();
            }, 1200);
        }
    }, 1000);

    // 🚨 Time Out Handler
    wordGuessTimeout = setTimeout(() => {
        clearInterval(aiTimer);
        clearInterval(aiThinkingInterval);
        wrong.innerText = parseInt(wrong.innerText) + 1;
        currentCombo = 0;
        comboDisplay.innerText = 0;
        display.classList.remove("glow");
        comboToast.style.display = "none";
        
        aiMessage.innerText = "⏰ Too slow! No one guessed in time.";
        aiMessage.style.color = "#ff5252";

        setTimeout(() => {
            display.innerText = randomLetter(difficulty);
            nextRound();
        }, 1200);
    }, secondsPerLetter * 1000);
}

function handleInput(isCorrect) {
    clearInterval(aiTimer);
    clearInterval(aiThinkingInterval);
    clearTimeout(wordGuessTimeout);
    const difficulty = document.getElementById("difficulty").value;

    if (isCorrect) {
        correct.innerText = parseInt(correct.innerText) + 1;
        currentCombo++;
        comboDisplay.innerText = currentCombo;

        if (currentCombo >= 3) {
            display.classList.add("glow");
            comboToast.style.display = "block";
        }
    } else {
        wrong.innerText = parseInt(wrong.innerText) + 1;
        currentCombo = 0;
        comboDisplay.innerText = 0;
        display.classList.remove("glow");
        comboToast.style.display = "none";
    }

    setTimeout(() => {
        heardWordDisplay.innerText = "...";
        display.innerText = randomLetter(difficulty);
        nextRound();
    }, 1200);
}

// Keyboard typing (Voice Mode OFF නම් විතරයි වැඩ)
document.addEventListener('keyup', function (e) {
    if (!isGameRunning || isVoiceMode) return;
    
    if (display.innerText.toLowerCase() === e.key.toLowerCase()) {
        handleInput(true);
    } else {
        handleInput(false);
    }
});

function endGame() {
    clearInterval(timer);
    clearInterval(aiTimer);
    clearInterval(aiThinkingInterval);
    clearTimeout(wordGuessTimeout);
    isGameRunning = false;
    display.classList.remove("glow");
    comboToast.style.display = "none";
    if (recognition) { try { recognition.stop(); } catch(e){} }

    modalUserScore.innerText = correct.innerText;
    modalAiScore.innerText = aiScore;

    let userScoreInt = parseInt(correct.innerText);
    if (userScoreInt > aiScore) {
        modalVerdict.innerText = "🎉 YOU BEAT THE AI GHOST!";
        modalVerdict.style.color = "#00ffcc";
    } else if (userScoreInt === aiScore) {
        modalVerdict.innerText = "👔 IT'S A TIE!";
        modalVerdict.style.color = "#ffeb3b";
    } else {
        modalVerdict.innerText = "👻 GHOST WON! Try again!";
        modalVerdict.style.color = "#ff5252";
    }

    if (userScoreInt > parseInt(highScore)) {
        highScore = correct.innerText;
        localStorage.setItem("highScore", highScore);
        highScoreDisplay.innerText = highScore;
    }

    customAlert.classList.add("show");
}

function closeModal() {
    customAlert.classList.remove("show");
}