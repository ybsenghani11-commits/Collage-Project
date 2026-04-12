
let currentIndex = 0;
let userAnswers = [];

// NAVIGATION
function openPanel(panel) {
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('student-panel').classList.add('hidden');
    document.getElementById(panel + '-panel').classList.remove('hidden');

    if (panel === 'admin') renderAdminList();
    if (panel === 'student') startQuiz();
}

function goHome() {
    location.reload();
}

// ADMIN LOGIC
function handleSave() {
    const txt = document.getElementById('q-text').value.trim();
    const o1 = document.getElementById('opt-1').value.trim();
    const o2 = document.getElementById('opt-2').value.trim();
    const o3 = document.getElementById('opt-3').value.trim();
    const o4 = document.getElementById('opt-4').value.trim();
    const ans = document.getElementById('correct-ans').value.trim();
    const editIdx = parseInt(document.getElementById('edit-index').value);

    if (!txt || !o1 || !o2 || !o3 || !o4 || !ans) {
        alert("Alert: All fields must be filled!");
        return;
    }

    let data = JSON.parse(localStorage.getItem('quizData')) || [];
    const newQ = { text: txt, options: [o1, o2, o3, o4], answer: ans };

    if (editIdx === -1) {
        data.push(newQ);
    } else {
        data[editIdx] = newQ;
        document.getElementById('edit-index').value = "-1";
        document.getElementById('save-btn').innerText = "Add Question";
    }

    localStorage.setItem('quizData', JSON.stringify(data));
    clearInputs();
    renderAdminList();
    alert("Saved successfully!");
}

function renderAdminList() {
    const list = document.getElementById('admin-q-list');
    const data = JSON.parse(localStorage.getItem('quizData')) || [];
    list.innerHTML = "<h4>Question List</h4>";
    data.forEach((q, i) => {
        list.innerHTML += `
            <div class="q-item">
                <span>${i+1}. ${q.text}</span>
                <div>
                    <button class="primary-btn" onclick="editQ(${i})">Edit</button>
                    <button class="danger-btn" onclick="deleteQ(${i})">Del</button>
                </div>
            </div>`;
    });
}

function editQ(i) {
    const data = JSON.parse(localStorage.getItem('quizData'));
    const q = data[i];
    document.getElementById('q-text').value = q.text;
    document.getElementById('opt-1').value = q.options[0];
    document.getElementById('opt-2').value = q.options[1];
    document.getElementById('opt-3').value = q.options[2];
    document.getElementById('opt-4').value = q.options[3];
    document.getElementById('correct-ans').value = q.answer;
    document.getElementById('edit-index').value = i;
    document.getElementById('save-btn').innerText = "Update Question";
}

function deleteQ(i) {
    let data = JSON.parse(localStorage.getItem('quizData'));
    data.splice(i, 1);
    localStorage.setItem('quizData', JSON.stringify(data));
    renderAdminList();
}

function clearAll() {
    if(confirm("Delete all questions?")) {
        localStorage.removeItem('quizData');
        renderAdminList();
    }
}

function clearInputs() {
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.getElementById('edit-index').value = "-1";
}

// STUDENT LOGIC
function startQuiz() {
    const data = JSON.parse(localStorage.getItem('quizData')) || [];
    currentIndex = 0;
    userAnswers = new Array(data.length).fill(null);
    document.getElementById('quiz-box').classList.remove('hidden');
    document.getElementById('result-box').classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    const data = JSON.parse(localStorage.getItem('quizData')) || [];
    if (data.length === 0) {
        document.getElementById('display-q').innerText = "No questions available.";
        return;
    }

    const q = data[currentIndex];
    document.getElementById('display-q').innerText = `Q${currentIndex+1}: ${q.text}`;
    const optDiv = document.getElementById('display-opts');
    optDiv.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = (userAnswers[currentIndex] === opt) ? "option-btn selected" : "option-btn";
        btn.onclick = () => {
            userAnswers[currentIndex] = opt;
            showQuestion();
        };
        optDiv.appendChild(btn);
    });

    // Navigation toggles
    document.getElementById('prev-btn').classList.toggle('hidden', currentIndex === 0);
    const isLast = currentIndex === data.length - 1;
    document.getElementById('next-btn').classList.toggle('hidden', isLast);
    document.getElementById('submit-btn').classList.toggle('hidden', !isLast);
}

function changeQuestion(step) {
    currentIndex += step;
    showQuestion();
}

function submitQuiz() {
    const data = JSON.parse(localStorage.getItem('quizData')) || [];
    let score = 0;
    data.forEach((q, i) => {
        if (userAnswers[i] === q.answer) score++;
    });
    document.getElementById('quiz-box').classList.add('hidden');
    document.getElementById('result-box').classList.remove('hidden');
    document.getElementById('final-score').innerText = `Your Score: ${score} / ${data.length}`;
}
