let questions = {};
let usedQuestions = {}; // เก็บคำถามที่ใช้ไปแล้วแต่ละหมวด
let currentQuestion = ""; // เก็บคำถามที่สุ่มได้ล่าสุด

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
            usedQuestions[category] = new Set(); // สร้าง Set ไว้เก็บคำถามที่ใช้ไปแล้ว
        } else if (line !== "") {
            questions[category].push(line);
        }
    });
}

// ฟังก์ชันนี้ทำหน้าที่สุ่มคำถามโดยไม่ให้ซ้ำ
function pickQuestion() {
    const category = document.getElementById('category').value;

    if (!questions[category] || questions[category].length === 0) {
        currentQuestion = "ไม่มีคำถามในหมวดนี้";
    } else {
        let availableQuestions = questions[category].filter(q => !usedQuestions[category].has(q));

        if (availableQuestions.length === 0) {
            // ถ้าคำถามใช้หมดแล้ว ให้รีเซ็ตและสุ่มใหม่
            usedQuestions[category].clear();
            availableQuestions = [...questions[category]];
        }

        // สุ่มคำถามจากที่ยังไม่ใช้
        currentQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        usedQuestions[category].add(currentQuestion); // บันทึกว่าถูกใช้แล้ว
    }

    document.getElementById('question').textContent = currentQuestion;
}

// ฟังก์ชันนี้ทำหน้าที่พลิกไพ่อย่างเดียว
function flipCard() {
    const card = document.querySelector('.card');
    card.classList.toggle('flipped');

    // ถ้าเปิดไพ่ ให้สุ่มคำถามใหม่ แต่ถ้าปิดไพ่ ไม่ต้องสุ่ม
    if (card.classList.contains('flipped')) {
        pickQuestion();
    }
}

// โหลดคำถามก่อน
loadQuestions();
