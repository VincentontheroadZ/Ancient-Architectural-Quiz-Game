document.addEventListener("DOMContentLoaded", () => {
    const choicesContainer = document.getElementById("choices");
    const choiceButtons = Array.from(choicesContainer.getElementsByClassName("choice-button"));
    const scoreElement = document.getElementById("score");
    const satelliteElement = document.querySelector(".satellite");
    satelliteElement.style.transformOrigin = innerWidth / 100 * 1.5 + 'px ' + innerWidth * 0.115 + 'px ';
    satelliteElement.style.top = 'calc(48% - 11.5vw)';
    satelliteElement.style.left = 'calc(26% - 1.5vw)';
    const laserScanElement = document.querySelector(".laser-scan");
    laserScanElement.style.transformOrigin = innerWidth / 100 * 1 + 'px ' + innerWidth * 65 / 1000 + 'px ';
    laserScanElement.style.top = 'calc(48% - 6.5vw)';
    laserScanElement.style.left = 'calc(26% - 1vw)';

    let currentDegree = 0;

    function getDeg(ele) {
        let a = ele.style.transform || '';
        if (a.indexOf('rotate') === -1) return '0';
        return a.substring(a.indexOf('rotate') + 7, a.indexOf('deg'));
    }

    function animateInQuarter() {
        currentDegree = getDeg(satelliteElement);
        if (currentQuestionIndex == 0 && currentDegree == '-90') {
            updateElementPosition(satelliteElement, '0deg');
            updateElementPosition(laserScanElement, '0deg');
        } else if (currentQuestionIndex == 0 && currentDegree == '0') {
            updateElementPosition(satelliteElement, '-90deg');
            updateElementPosition(laserScanElement, '-90deg');
        }
        if (currentQuestionIndex == 1 && currentDegree == '0') {
            updateElementPosition(satelliteElement, '90deg');
            updateElementPosition(laserScanElement, '90deg');
        } else if (currentQuestionIndex == 1 && currentDegree == '90') {
            updateElementPosition(satelliteElement, '0deg');
            updateElementPosition(laserScanElement, '0deg');
        }
        if (currentQuestionIndex == 2 && currentDegree == '90') {
            updateElementPosition(satelliteElement, '180deg');
            updateElementPosition(laserScanElement, '180deg');
        } else if (currentQuestionIndex == 2 && currentDegree == '180') {
            updateElementPosition(satelliteElement, '90deg');
            updateElementPosition(laserScanElement, '90deg');
        }
        if (currentQuestionIndex == 3 && currentDegree == '180') {
            updateElementPosition(satelliteElement, '270deg');
            updateElementPosition(laserScanElement, '270deg');
        } else if (currentQuestionIndex == 3 && currentDegree == '270') {
            updateElementPosition(satelliteElement, '180deg');
            updateElementPosition(laserScanElement, '180deg');
        }
    }

    // 遊戲開始：0.5秒後啟動第一次掃描
    setTimeout(() => {
        animateInQuarter();
        scanInterval = setInterval(animateInQuarter, 5000);
    }, 500);

    let score = 0;
    let currentQuestionIndex = 0;
    let scanInterval = null;   // 用來儲存定時器
    const gameOverText = document.getElementById("gameover-text");
    const restartButton = document.getElementById("restart-button");
    const homeButton = document.getElementById("home-button");
    gameOverText.style.display = "none";
    restartButton.style.display = "none";

    const questionsOrder = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
    const Rotation = ['0deg', '90deg', '180deg', '270deg'];

    const terrains = [
        { id: 'pyramid', text: 'Pyramid' },
        { id: 'colosseum', text: 'Colosseum' },
        { id: 'parthenon', text: 'Parthenon' },
        { id: 'stonehenge', text: 'Stonehenge' }
    ];

    const architectureIntro = {
        pyramid: {
            name: 'Pyramid',
            intro: 'The Great Pyramid of Giza, built around 2580–2560 BC for Pharaoh Khufu, is the largest of the three pyramids. Constructed from 2.3 million stone blocks, it was the tallest man-made structure for 3,800 years and remains the only surviving Wonder of the Ancient World.'
        },
        colosseum: {
            name: 'Colosseum',
            intro: 'Completed in 80 AD under Emperor Titus, this oval amphitheatre in Rome could hold 50,000–80,000 spectators. Famous for gladiatorial contests and public spectacles, it features 80 arched entrances and an ingenious underground system called the hypogeum.'
        },
        parthenon: {
            name: 'Parthenon',
            intro: 'Built 447–432 BC on the Acropolis of Athens, dedicated to Athena. This Doric temple represents the pinnacle of classical Greek architecture with perfect optical refinements: slightly curved stylobate, inward-leaning columns, and the famous golden ratio proportions.'
        },
        stonehenge: {
            name: 'Stonehenge',
            intro: 'Constructed 3000–2000 BC in England, this prehistoric ring of standing stones weighs up to 50 tons each. Precisely aligned with solstices, it served as a ceremonial site for burial and astronomical observation, demonstrating remarkable Neolithic engineering.'
        }
    };

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const shuffledTerrains = shuffleArray(terrains);
    const correctAnswers = {};
    shuffledTerrains.forEach((terrain, index) => {
        correctAnswers[questionsOrder[index]] = terrain.id;
    });

    const answerMap = {
        'Pyramid': 'pyramid',
        'Colosseum': 'colosseum',
        'Parthenon': 'parthenon',
        'Stonehenge': 'stonehenge'
    };

    const initialShuffled = shuffleArray([...choiceButtons]);
    choicesContainer.innerHTML = "";
    initialShuffled.forEach(btn => choicesContainer.appendChild(btn));

    function updateTerrainImage(terrainId) {
        const terrainImage = document.getElementById("terrain-image");
        terrainImage.src = `pics/pattern-${terrainId}.png`;
        terrainImage.style.display = 'block';
    }

    // ==================== 弹窗系统 ====================
    const modal = document.getElementById('feedback-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalName = document.getElementById('modal-name');
    const modalIntro = document.getElementById('modal-intro');
    const continueBtn = document.getElementById('continue-btn');

    function showFeedback(isCorrect, terrainId) {
        const info = architectureIntro[terrainId];
        modalTitle.textContent = isCorrect ? 'Correct!' : 'Wrong!';
        modalTitle.className = isCorrect ? 'correct' : 'wrong';
        modalName.textContent = info.name;
        modalIntro.textContent = info.intro;

        if (currentQuestionIndex + 1 >= 4) {
            continueBtn.textContent = 'View Final Score →';
        } else {
            continueBtn.textContent = 'Next Question →';
        }

        currentQuestionIndex++;  // 先加1，讓 Rotation[currentQuestionIndex] 變成下一題
        satelliteElement.style.transition = laserScanElement.style.transition = 'transform 0s';
        updateElementPosition(satelliteElement, Rotation[currentQuestionIndex]);
        updateElementPosition(laserScanElement, Rotation[currentQuestionIndex]);
        setTimeout(() => {
            satelliteElement.style.transition = laserScanElement.style.transition = 'transform 5s';
        }, 100);

        modal.style.display = 'block';
    }

    function closeAndContinue() {
        modal.style.display = 'none';
        askNextQuestion();
    }

    // 點擊黑色背景關閉彈窗
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {  // 只有點到最外層才關閉
            closeAndContinue();
        }
    });
    // 點擊按鈕也關閉
    continueBtn.addEventListener('click', () => {
        closeAndContinue();
    });

    function handleQuestionAnswer(button) {
        const selectedText = button.textContent.trim();
        const selectedAnswer = answerMap[selectedText];
        const correctAnswer = correctAnswers[questionsOrder[currentQuestionIndex]];

        const isCorrect = selectedAnswer === correctAnswer;

        if (isCorrect) {
            score += 25;
            scoreElement.textContent = score;
        }

        showFeedback(isCorrect, correctAnswer);
    }

    function askNextQuestion() {
        if (currentQuestionIndex >= questionsOrder.length) {
            document.getElementById("choices").style.display = 'none';
            document.getElementById("terrain-image").style.display = 'none';
            document.getElementById("question-text").style.display = 'none';
            document.getElementById("radar").style.display = 'none';
            document.querySelector('.planet-circle').style.display = 'none';     // 地球
            document.querySelector('.satellite').style.display = 'none';         // 衛星本體
            document.querySelector('.laser-scan').style.display = 'none';        // 雷射掃描線
            document.querySelector('#hint-text').style.display = 'none';
            gameOverText.style.display = "block";
            restartButton.style.display = "block";

            gameIsOver = true;   // ← 這行讓所有翻卡事件直接失效

            document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));

            const msgs = ["再接再厲！", "再來一輪！", "繼續努力！", "優秀探險家！", "滿分古建大師！"];
            gameOverText.innerHTML = msgs[Math.floor(score / 25)];
            return;
        }

        // 彈窗遮住衛星的瞬間 → 直接瞬移到新題目起始角度（玩家完全看不見過程）
        satelliteElement.style.transition = laserScanElement.style.transition = 'transform 0s'; // 關閉過渡
        updateElementPosition(satelliteElement, Rotation[currentQuestionIndex]);
        updateElementPosition(laserScanElement, Rotation[currentQuestionIndex]);

        // 瞬移完畢後立刻恢復平滑動畫，供後續掃描使用
        setTimeout(() => {
            satelliteElement.style.transition = laserScanElement.style.transition = 'transform 5s';
        }, 100);

        const currentTerrainId = correctAnswers[questionsOrder[currentQuestionIndex]];
        updateTerrainImage(currentTerrainId);

        const newShuffled = shuffleArray([...document.getElementsByClassName("choice-button")]);
        choicesContainer.innerHTML = "";
        newShuffled.forEach(btn => choicesContainer.appendChild(btn));
        document.querySelectorAll('.choice-button').forEach(btn => {
            btn.onclick = () => handleQuestionAnswer(btn);
        });
    }

    function updateElementPosition(element, position) {
        element.style.transform = `rotate(${position})`;
    }

    askNextQuestion();

    let currentlyFlippedCard = null;
    let gameIsOver = false;   // ← 新增這行旗標
    document.querySelectorAll('.hint-image').forEach(hintImage => {
        hintImage.addEventListener('click', () => {
            // ←←← 關鍵！遊戲結束後直接 return，什麼都不做
            if (gameIsOver) return;

            const card = hintImage.querySelector('.card');
            if (currentlyFlippedCard && currentlyFlippedCard !== card) {
                currentlyFlippedCard.classList.remove('flipped');
            }
            card.classList.toggle('flipped');
            currentlyFlippedCard = card.classList.contains('flipped') ? card : null;
        });
    });

    restartButton.addEventListener("click", () => location.reload());
    homeButton.addEventListener('click', () => window.location.href = '../index.html');
});