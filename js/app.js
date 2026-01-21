// CONFIGURATION
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbweuGSm91tluoG1qbnuWJLFFrF4R-yZ1Isk9JhMzktatD26MviTyMKzPm4ZaKx7DSY2Tw/exec"; // User to fill this
// Client-side API Key removed for security. Backend handles AI calls.

// STATE
let currentState = {
    step: 0, // 0 to 9
    subStep: 'self', // 'self' or 'quiz'
    selfScores: new Array(10).fill(0),
    actualScores: new Array(10).fill(0),
    user: null,
    startTime: null,
    endTime: null
};

// CHART INSTANCE
let radarChart = null;

// DOM ELEMENTS
const views = {
    login: document.getElementById('view-login'),
    intro: document.getElementById('view-intro'),
    selfAssess: document.getElementById('view-self-assess'),
    quiz: document.getElementById('view-quiz'),
    result: document.getElementById('view-result')
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    setupEventListeners();

    // Check if user is already logged in (Mock)
    // In real app, check localStorage or Session
});

function setupEventListeners() {
    // Login
    document.getElementById('btn-login').addEventListener('click', handleLogin);

    // Start Test
    document.getElementById('btn-start').addEventListener('click', startTest);

    // Self Assessment Buttons
    document.querySelectorAll('#view-self-assess .rating-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const score = parseInt(btn.dataset.score);
            handleSelfAssess(score);
        });
    });
}

function initChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ASPECTS.map((a, i) => `${i + 1}. ${a.name}`),
            datasets: [{
                label: 'Tự đánh giá',
                data: currentState.selfScores,
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10b981',
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#10b981'
            }, {
                label: 'Thực tế',
                data: currentState.actualScores,
                fill: true,
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                borderColor: '#f59e0b',
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#f59e0b',
                hidden: false // Show initially so legend is not strikethrough
            }]
        },
        options: {
            elements: {
                line: { borderWidth: 3 }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: {
                        color: (context) => {
                            // Highlight current aspect
                            if (currentState.user && context.index === currentState.step) {
                                return '#10b981'; // Green highlight
                            }
                            return '#94a3b8'; // Muted
                        },
                        font: {
                            size: 14, // Increased size
                            weight: 'bold', // Bold
                            family: "'Inter', sans-serif"
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1,
                        display: false // Hide numbers for cleaner look
                    }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                }
            }
        }
    });
}

// LOGIC FLOW

function handleLogin() {
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');

    if (!nameInput.value || !emailInput.value) {
        alert("Vui lòng nhập đầy đủ tên và email để bắt đầu.");
        return;
    }

    const realUser = {
        name: nameInput.value,
        email: emailInput.value,
        photo: ""
    };

    currentState.user = realUser;

    // Switch View
    switchView('intro');
    document.getElementById('user-name-display').innerText = currentState.user.name;
}

function startTest() {
    currentState.startTime = new Date();
    currentState.step = 0;
    currentState.subStep = 'self';

    // Show Actual dataset now
    // radarChart.data.datasets[1].hidden = false; // it is already visible now
    radarChart.update();

    loadStep();
}

function loadStep() {
    const aspect = ASPECTS[currentState.step];

    // Highlight Chart Axis
    radarChart.options.scales.r.pointLabels.color = (context) => {
        return context.index === currentState.step ? '#faa90e' : 'rgba(255,255,255,0.5)';
    };
    radarChart.options.scales.r.pointLabels.font = (context) => {
        return context.index === currentState.step ? { size: 14, weight: 'bold' } : { size: 11 };
    };
    radarChart.update();

    if (currentState.subStep === 'self') {
        // Show Self Assess View
        switchView('selfAssess');
        document.getElementById('current-aspect-num').innerText = currentState.step + 1;
        document.getElementById('current-aspect-name').innerText = aspect.name;

        // Reset buttons
        document.querySelectorAll('.rating-btn').forEach(btn => btn.style.background = '');

    } else {
        // Show Quiz View
        switchView('quiz');
        document.getElementById('quiz-aspect-num').innerText = currentState.step + 1;
        document.getElementById('quiz-aspect-name').innerText = aspect.name;
        document.getElementById('quiz-question').innerText = aspect.question;

        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';

        aspect.options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.innerHTML = `
                <span>${opt.text}</span>
                <span class="option-score">+${opt.score}</span>
            `;
            btn.onclick = () => handleQuizAnswer(opt.score);
            optionsContainer.appendChild(btn);
        });
    }
}

function handleSelfAssess(score) {
    currentState.selfScores[currentState.step] = score;

    // Update Chart Realtime
    radarChart.data.datasets[0].data = currentState.selfScores;
    radarChart.update();

    // Move to next sub-step after brief delay
    setTimeout(() => {
        currentState.subStep = 'quiz';
        loadStep();
    }, 300);
}

function handleQuizAnswer(score) {
    currentState.actualScores[currentState.step] = score;

    // Update Chart Realtime
    radarChart.data.datasets[1].data = currentState.actualScores;
    radarChart.update();

    // Check if next step exists
    if (currentState.step < 9) {
        currentState.step++;
        currentState.subStep = 'self';
        setTimeout(() => loadStep(), 300);
    } else {
        finishTest();
    }
}

function finishTest() {
    currentState.endTime = new Date();
    switchView('result');
    renderResults();
    saveToSheet(); // Async
}

function renderResults() {
    // 1. Calculate Totals
    const totalSelf = currentState.selfScores.reduce((a, b) => a + b, 0);
    const totalActual = currentState.actualScores.reduce((a, b) => a + b, 0);

    document.getElementById('final-self-score').innerText = totalSelf + '/50';
    document.getElementById('final-actual-score').innerText = totalActual + '/50';

    // 2. Identify Strengths (4-5) & Weaknesses (1-2)
    const strengths = [];
    const weaknesses = [];

    currentState.actualScores.forEach((score, index) => {
        if (score >= 4) strengths.push(`${ASPECTS[index].name} (${score}/5)`);
        if (score <= 2) weaknesses.push(`${ASPECTS[index].name} (${score}/5)`);
    });

    // 3. Render Strengths
    const praiseList = document.getElementById('praise-list');
    praiseList.innerHTML = '';
    if (strengths.length > 0) {
        const intro = document.createElement('p');
        intro.innerText = "Bạn làm rất tốt ở mảng:";
        praiseList.appendChild(intro);

        strengths.forEach(s => {
            const li = document.createElement('li');
            li.innerText = s;
            // style slightly to indent or making it clear acting as list item
            praiseList.appendChild(li);
        });

        const outro = document.createElement('p');
        outro.innerText = "Hãy tiếp tục phát huy!";
        outro.style.marginTop = "0.5rem";
        praiseList.appendChild(outro);
    } else {
        praiseList.innerHTML = '<li>Hãy cố gắng cải thiện từng chút một, hành trình vạn dặm bắt đầu từ bước chân đầu tiên.</li>';
    }

    // 4. Render Weaknesses
    const weakListDisplay = document.getElementById('weakness-list-display');
    weakListDisplay.innerHTML = '';

    if (weaknesses.length > 0) {
        const intro = document.createElement('p');
        intro.innerText = "Điểm chưa tốt:";
        weakListDisplay.appendChild(intro);

        weaknesses.forEach(w => {
            const li = document.createElement('li');
            li.innerText = w;
            weakListDisplay.appendChild(li);
        });

        const outro = document.createElement('p');
        outro.innerText = "Hãy cố gắng hoàn thiện.";
        outro.style.marginTop = "0.5rem";
        weakListDisplay.appendChild(outro);
    } else {
        weakListDisplay.innerHTML = '<li>Tuyệt vời! Bạn không có điểm yếu nghiêm trọng nào.</li>';
    }
}

async function callGeminiAnalysis(weaknesses) {
    const prompt = `
    Người dùng đang yếu ở các khía cạnh sức khỏe thu nhập sau: ${weaknesses.join(', ')}.
    Hãy đóng vai bác sĩ tài chính cá nhân và đưa ra:
    - Phân tích ngắn gọn gốc rễ hành vi
    - 2–3 hành động cụ thể, dễ làm trong 30 ngày
    - Ngôn ngữ không phán xét, mang tính hỗ trợ.
    Trả lời bằng HTML đơn giản (không thẻ html/body), dùng thẻ <p>, <ul>, <li>, <b>.
    `;

    // MOCK RESPONSE
    if (!GEMINI_API_KEY) {
        setTimeout(() => {
            document.getElementById('ai-response').innerHTML = `
                <p><b>Phân tích sơ bộ (Mô phỏng):</b></p>
                <p>Việc yếu ở các khía cạnh <b>${weaknesses.join(', ')}</b> thường xuất phát từ việc thiếu thói quen theo dõi sát sao hoặc chưa có công cụ hỗ trợ phù hợp.</p>
                <p><b>Gợi ý hành động:</b></p>
                <ul>
                    <li>Rà soát lại toàn bộ các nguồn thu nhập hiện tại của bạn.</li>
                    <li>Lên kế hoạch gia tăng thu nhập từ kỹ năng chuyên môn.</li>
                    <li>Tìm hiểu thêm về một kênh đầu tư hoặc nguồn thu phụ mới.</li>
                </ul>
                <p><i>(Lưu ý: Đây là phản hồi mẫu. Hãy cấu hình API Key để nhận tư vấn thực tế từ AI)</i></p>
            `;
        }, 1500);
        return;
    }

    // REAL CALL (If Key Provided)
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || response.statusText);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("AI không trả về kết quả (Có thể do bộ lọc an toàn).");
        }

        const text = data.candidates[0].content.parts[0].text;

        // Convert Markdown to basic HTML if needed or just display
        // Simple regex replace for bold
        const formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\* /g, '• ')
            .replace(/\n/g, '<br>');

        document.getElementById('ai-response').innerHTML = formatted;

    } catch (e) {
        console.error(e);
        document.getElementById('ai-response').innerHTML = `<span style="color: #ef4444;">Lỗi kết nối AI: ${e.message}</span>`;
    }
}

async function saveToSheet() {
    if (!GOOGLE_SCRIPT_URL) {
        console.log("No backend URL configured. Data not saved to sheet.");
        return;
    }

    const payload = {
        timestamp: new Date().toISOString(),
        email: currentState.user.email,
        name: currentState.user.name,
        selfScores: currentState.selfScores,
        actualScores: currentState.actualScores,
        totalSelf: currentState.selfScores.reduce((a, b) => a + b, 0),
        totalActual: currentState.actualScores.reduce((a, b) => a + b, 0)
    };

    try {
        // Use 'text/plain' to avoid CORS Preflight (OPTIONS) request which GAS doesn't handle
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });
        console.log("Data sent to sheet");
    } catch (e) {
        console.error("Save failed", e);
    }
}

// UTILS
function switchView(viewName) {
    // Hide all
    Object.values(views).forEach(el => el.classList.add('hidden'));
    // Show target
    views[viewName].classList.remove('hidden');

    // Animation reset
    views[viewName].style.animation = 'none';
    views[viewName].offsetHeight; /* trigger reflow */
    views[viewName].style.animation = 'fadeIn 0.5s ease-out';
}
