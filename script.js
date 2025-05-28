const display = document.getElementById("display");
        const correct = document.getElementById("correct");
        const wrong = document.getElementById("wrong");
        const timerDisplay = document.getElementById("timer");
        const highScoreDisplay = document.getElementById("highScore");
        const gameSection = document.getElementById("game_section");

        let currentLetter = "";
        let time = 30;
        let timer;
        let isGameRunning = false;

        // Load high score from local storage
        let highScore = localStorage.getItem("highScore") || 0;
        highScoreDisplay.innerText = highScore;

        function randomLetter(difficulty) {
            const alphabet = "abcdefghijklmnopqrstuvwxyz";
            let maxIndex = 25;

            if (difficulty === "easy") maxIndex = 5;
            if (difficulty === "medium") maxIndex = 15;
            // Hard: full alphabet

            const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
            return alphabet[randomIndex];
        }

        function startGame() {
            // Reset
            time = 30;
            correct.innerText = 0;
            wrong.innerText = 0;
            isGameRunning = true;
            gameSection.style.display = "block";
            const difficulty = document.getElementById("difficulty").value;
            display.innerText = randomLetter(difficulty);

            // Timer
            timerDisplay.innerText = "Time: " + time;
            clearInterval(timer);
            timer = setInterval(() => {
                time--;
                timerDisplay.innerText = "Time: " + time;
                if (time <= 0) {
                    clearInterval(timer);
                    isGameRunning = false;
                    endGame();
                }
            }, 1000);
        }

        function endGame() {
            alert("Game Over! Your Score: " + correct.innerText);

            if (parseInt(correct.innerText) > parseInt(highScore)) {
                highScore = correct.innerText;
                localStorage.setItem("highScore", highScore);
                highScoreDisplay.innerText = highScore;
                alert("🎉 New High Score!");
            }
        }

        document.addEventListener('keyup', function (e) {
            if (!isGameRunning) return;

            const difficulty = document.getElementById("difficulty").value;
            if (display.innerText === e.key) {
                correct.innerText = parseInt(correct.innerText) + 1;
            } else {
                wrong.innerText = parseInt(wrong.innerText) + 1;
            }
            display.innerText = randomLetter(difficulty);
        });