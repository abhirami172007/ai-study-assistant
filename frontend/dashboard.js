const API_BASE = (window.location.port === "5500") ? "http://127.0.0.1:8000" : window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
    loadUserData();
    loadDashboardData();
});

function loadUserData() {
    syncUserProfile();
} catch (e) {
            console.error("User parse error", e);
        }
    }
}

async function loadDashboardData() {
    const userStr = localStorage.getItem("user");
    let userId = 1;
    if (userStr) {
        try { userId = JSON.parse(userStr).id || 1; } catch (e) {}
    }

    try {
        const res = await fetch(`${API_BASE}/progress/${userId}`);
        if (res.ok) {
            const data = await res.json();
            renderStats(data);
            renderWeakAreas(data.weak_topics || []);
        } else {
            renderDefaultStats();
        }
    } catch (e) {
        renderDefaultStats();
    }

    renderTasks([
        { title: "Python Data Structures: Stacks & Queues", meta: "45 mins • Core Topic", done: true },
        { title: "Database Systems: Normalization (3NF & BCNF)", meta: "30 mins • High Priority", done: false },
        { title: "Machine Learning: Linear Regression Math", meta: "60 mins • Conceptual", done: false }
    ]);
}

function renderStats(data) {
    if (data.total_quizzes !== undefined) {
        document.getElementById("stat-quizzes").textContent = data.total_quizzes;
    }
    if (data.average_accuracy !== undefined) {
        document.getElementById("stat-mastery").textContent = `${Math.round(data.average_accuracy)}%`;
    }
    if (data.active_subjects) {
        document.getElementById("stat-subjects").textContent = data.active_subjects.length;
    }
    if (data.streak_days) {
        document.getElementById("stat-streak").textContent = `${data.streak_days} Days`;
    }
}

function renderDefaultStats() {
    document.getElementById("stat-subjects").textContent = "4";
    document.getElementById("stat-quizzes").textContent = "12";
    document.getElementById("stat-mastery").textContent = "78%";
    document.getElementById("stat-streak").textContent = "5 Days";
    renderWeakAreas([
        { topic: "SQL Subqueries", accuracy: 58, subject: "Database Systems" },
        { topic: "Dynamic Programming", accuracy: 62, subject: "Data Structures" },
        { topic: "Bayes Theorem", accuracy: 65, subject: "Machine Learning" }
    ]);
}

function renderTasks(tasks) {
    const container = document.getElementById("plan-tasks-list");
    if (!container) return;
    container.innerHTML = tasks.map(t => `
        <div class="task-item">
            <input type="checkbox" ${t.done ? "checked" : ""} onchange="this.parentElement.style.opacity = this.checked ? '0.6' : '1'">
            <div class="task-content">
                <div class="task-title" style="${t.done ? 'text-decoration: line-through;' : ''}">${t.title}</div>
                <div class="task-meta">${t.meta}</div>
            </div>
            <span style="font-size: 11.5px; background: ${t.done ? '#ecfdf5' : '#eeeaff'}; color: ${t.done ? '#059669' : '#5b4bdb'}; font-weight: 700; padding: 4px 10px; border-radius: 6px;">
                ${t.done ? "Completed" : "In Progress"}
            </span>
        </div>
    `).join("");
}

function renderWeakAreas(topics) {
    const container = document.getElementById("weak-areas-list");
    if (!container) return;
    if (!topics || topics.length === 0) {
        container.innerHTML = `<p style="font-size: 13.5px; color: #059669; background: #ecfdf5; padding: 12px; border-radius: 9px;">&#10004; Excellent! No weak areas detected below 70% accuracy.</p>`;
        return;
    }
    container.innerHTML = topics.map(item => `
        <div class="weak-topic-row">
            <div class="weak-topic-info">
                <strong>${item.topic}</strong>
                <span>${item.subject || "Academic"} • ${item.accuracy}% Accuracy</span>
            </div>
            <a href="ai-quiz.html?subject=${encodeURIComponent(item.subject || 'General')}&topic=${encodeURIComponent(item.topic)}" class="remedial-btn">
                &#9889; Practice Now
            </a>
        </div>
    `).join("");
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("studentCourse");
    window.location.href = "login.html";
}
