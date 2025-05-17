let questions = {};
let usedQuestions = {};
let currentQuestion = ""; 

async function loadQuestions() {
    try {
        const response = await fetch('questions.txt'); 
        const text = await response.text();
        parseQuestions(text);
        console.log("✅ คำถามถูกโหลด:", questions); 
    } catch (error) {
        console.error("❌ โหลดคำถามไม่สำเร็จ", error);
    }
}

function parseQuestions(text) {
    const lines = text.split("\n");
    let category = ""; 

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith("[") && line.endsWith("]")) {
            category = line.slice(1, -1);
            questions[category] = [];
            usedQuestions[category] = new Set();
        } else if (line !== "") {
            questions[category].push(line);
        }
    });
}

function pickQuestion() {
    const category = document.getElementById('category').value;

    if (!questions[category] || questions[category].length === 0) {
        currentQuestion = "ไม่มีคำถามในหมวดนี้";
    } else {
        let availableQuestions = questions[category].filter(q => !usedQuestions[category].has(q));

        if (availableQuestions.length === 0) {
            usedQuestions[category].clear();
            availableQuestions = [...questions[category]];
        }

        currentQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        usedQuestions[category].add(currentQuestion);
    }

    document.getElementById('question').textContent = currentQuestion;
}

function flipCard() {
    const card = document.querySelector('.card');
    card.classList.toggle('flipped');
    if (card.classList.contains('flipped')) {
        pickQuestion();
    }
}

loadQuestions();
