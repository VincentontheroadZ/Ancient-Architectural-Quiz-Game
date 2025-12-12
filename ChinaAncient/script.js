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
    let scanInterval = null;
    const gameOverText = document.getElementById("gameover-text");
    const restartButton = document.getElementById("restart-button");
    const homeButton = document.getElementById("home-button");
    gameOverText.style.display = "none";
    restartButton.style.display = "none";

    const questionsOrder = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

    const terrains = [
        { id: 'changcheng', text: '長城' },
        { id: 'gugong', text: '故宮' },
        { id: 'dayanta', text: '大雁塔' },
        { id: 'dujiangyan', text: '都江堰' }
    ];

    const architectureIntro = {
        changcheng: { name: '長城', intro: '萬里長城始建於春秋戰國，秦統一後連接成「萬里長城」。明代重修加固，全長21196公里，是世界上最偉大的軍事防禦工程。依山勢蜿蜒，烽火台與敵樓相連，被譽為人類史上最宏偉的建築奇觀之一。' },
        gugong: { name: '故宮', intro: '北京故宮又稱紫禁城，明清兩代皇宮，始建於1406年，佔地72萬平方米，擁有9999間半房屋。以太和殿為中心，嚴格中軸對稱，是中國古代宮廷建築之巔峰，也是現存最大最完整的木結構古建築群。' },
        dayanta: { name: '大雁塔', intro: '大雁塔建於唐永徽三年（652年），為玄奘法師存放從印度帶回的經卷而建。七層方形磚塔，高64.5米，採用密檐式結構，每層均有仿木斗拱，是中國唐代佛教建築的經典代表作。' },
        dujiangyan: { name: '都江堰', intro: '都江堰由秦國李冰父子於公元前256年主持修建，至今仍發揮灌溉與防洪作用。無壩引水、魚嘴分水、飛沙堰溢洪、寶瓶口進水四大工程，體現「道法自然」的中國古代水利智慧，被譽為「世界水利文化的鼻祖」。' }
    };

    const Rotation = ['0deg', '90deg', '180deg', '270deg'];

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
        '長城': 'changcheng',
        '故宮': 'gugong',
        '大雁塔': 'dayanta',
        '都江堰': 'dujiangyan'
    };

    // 初始洗牌
    const initialShuffled = shuffleArray([...choiceButtons]);
    choicesContainer.innerHTML = "";
    initialShuffled.forEach(btn => choicesContainer.appendChild(btn));

    function updateTerrainImage(terrainId) {
        const terrainImage = document.getElementById("terrain-image");
        terrainImage.src = `pics/pattern-${terrainId}.png`;
        terrainImage.style.display = 'block';
    }

    // ==================== 弹窗系统（仅新增） ====================
    const modal = document.getElementById('feedback-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalName = document.getElementById('modal-name');
    const modalIntro = document.getElementById('modal-intro');
    const continueBtn = document.getElementById('continue-btn');

    function showFeedback(isCorrect, terrainId) {
        const info = architectureIntro[terrainId];
        modalTitle.textContent = isCorrect ? '正確！' : '錯誤！';
        modalTitle.className = isCorrect ? 'correct' : 'wrong';
        modalName.textContent = info.name;
        modalIntro.textContent = info.intro;

        // 关键：如果这是第四题（答完后 currentQuestionIndex 会变成 4）
        if (currentQuestionIndex + 1 >= 4) {
            continueBtn.textContent = '查看最終得分 →';   // 改文字
            continueBtn.style.fontSize = '1.6vw';         // 可选：稍微大一点更醒目
        } else {
            continueBtn.textContent = '繼續下一題 →';      // 正常显示
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
        askNextQuestion();   // 繼續遊戲（你原本就有的）
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

    // ==================== 核心修改：只改这里 ====================
    function handleQuestionAnswer(button) {
        const selectedText = button.textContent.trim();
        const selectedAnswer = answerMap[selectedText];
        const correctAnswer = correctAnswers[questionsOrder[currentQuestionIndex]];

        const isCorrect = selectedAnswer === correctAnswer;

        if (isCorrect) {
            score += 25;
            scoreElement.textContent = score;
        }

        // 先弹窗
        showFeedback(isCorrect, correctAnswer);

        // 注意：不在这里洗牌和askNextQuestion，等弹窗关闭再继续
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

        // 重新洗牌 + 重新绑定事件
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