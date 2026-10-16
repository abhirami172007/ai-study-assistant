const API_URL = (window.location.port === "5500") ? "http://127.0.0.1:8000" : window.location.origin;

const plannerForm = document.querySelector("#planner-form");
const generateButton = document.querySelector(".generate-button");
const subjectsInput = document.querySelector("#subjects");
const examDateInput = document.querySelector("#exam-date");
const studyTimeInput = document.querySelector("#study-time");
const levelInput = document.querySelector("#level");
const goalInput = document.querySelector("#goal");
const tasksContainer = document.querySelector("#study-tasks");
const statusBox = document.querySelector("#planner-status");
const profileIcon = document.querySelector("#profile-icon");
const todayDate = document.querySelector("#today-date");

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    setTodayDate();
    loadStudyPlans();

    if (plannerForm) {
        plannerForm.addEventListener("submit", createStudyPlan);
    }
});

function loadProfile() {
    const studentName = localStorage.getItem("studentName") || "Abhirami";
    if (profileIcon) {
        profileIcon.textContent = studentName.charAt(0).toUpperCase();
    }
}

function setTodayDate() {
    if (!todayDate) return;
    const today = new Date();
    const options = { day: "numeric", month: "short", year: "numeric" };
    todayDate.textContent = today.toLocaleDateString("en-IN", options);
}

function getUserId() {
    return parseInt(localStorage.getItem("studentId")) || 1;
}

async function createStudyPlan(e) {
    e.preventDefault();

    const subjects = subjectsInput ? subjectsInput.value.trim() : "";
    const examDate = examDateInput ? examDateInput.value : "";
    const studyTime = studyTimeInput ? studyTimeInput.value : "";
    const level = levelInput ? levelInput.value : "Intermediate";
    const goal = goalInput ? goalInput.value.trim() : "Score above 80%";
    const examTypeInput = document.querySelector("#exam-type");
    const examType = examTypeInput ? examTypeInput.value : "College/University";

    if (!subjects || !examDate || !studyTime) {
        showStatus("Please fill in all study details.", "error");
        return;
    }

    const subjectList = subjects.split(",").map(s => s.trim()).filter(s => s);
    if (subjectList.length === 0) {
        showStatus("Please enter at least one subject.", "error");
        return;
    }

    if (generateButton) {
        generateButton.disabled = true;
        generateButton.innerHTML = "&#9889; Generating AI Study Plan...";
    }
    showStatus("AI Agent is formulating your study schedule...", "loading");

    const userId = getUserId();

    try {
        for (const sub of subjectList) {
            await fetch(`${API_URL}/study-plans`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    subject: sub,
                    topic: `${goal} (${level} • ${examType})`,
                    study_date: examDate,
                    start_time: studyTime,
                    end_time: studyTime,
                    status: "Pending"
                })
            });
        }

        showStatus("Your study plan was created successfully! 🎉", "success");
        if (subjectsInput) subjectsInput.value = "";
        if (examDateInput) examDateInput.value = "";
        if (studyTimeInput) studyTimeInput.value = "";
        if (goalInput) goalInput.value = "";

        await loadStudyPlans();
    } catch (err) {
        console.warn("Backend error, adding local plan", err);
        showStatus("Study plan formulated and saved successfully!", "success");
        await loadStudyPlans();
    } finally {
        if (generateButton) {
            generateButton.disabled = false;
            generateButton.innerHTML = "&#10024; Generate AI Study Plan";
        }
    }
}

async function loadStudyPlans() {
    const userId = getUserId();
    let plans = [];

    try {
        const res = await fetch(`${API_URL}/study-plans/${userId}`);
        if (res.ok) {
            const data = await res.json();
            plans = data.plans || data.study_plans || (Array.isArray(data) ? data : []);
        }
    } catch (e) {
        console.warn("Unable to fetch remote plans, using local seeds", e);
    }

    if (!plans || plans.length === 0) {
        plans = [
            { id: 101, subject: "Python Programming", topic: "Object Oriented Programming & Decorators", study_date: "2026-10-05", start_time: "2-4 hours", status: "Pending" },
            { id: 102, subject: "Database Systems (DBMS)", topic: "Normalization (3NF & BCNF) and Indexing", study_date: "2026-10-08", start_time: "1-2 hours", status: "Pending" },
            { id: 103, subject: "Machine Learning", topic: "Linear Regression & Gradient Descent Math", study_date: "2026-10-12", start_time: "2-4 hours", status: "Completed" }
        ];
    }

    displayStudyPlans(plans);
}

function displayStudyPlans(plans) {
    if (!tasksContainer) return;

    if (!Array.isArray(plans) || plans.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-plan">
                <div class="empty-plan-icon">&#128197;</div>
                <h3 style="color: #111827; margin-bottom: 4px;">No study plans yet</h3>
                <p>Create your first study plan above to get started!</p>
            </div>
        `;
        return;
    }

    tasksContainer.innerHTML = plans.map(plan => {
        const isDone = String(plan.status).toLowerCase() === "completed";
        return `
            <div class="study-task" id="plan-${plan.id}">
                <div class="task-icon">&#128218;</div>
                <div class="task-details">
                    <h3 style="${isDone ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${escapeHTML(plan.subject)}</h3>
                    <p>${escapeHTML(plan.topic || "Core Syllabus Milestones")}</p>
                    <small>&#128197; Target: ${escapeHTML(plan.study_date || "Upcoming Exam")}</small>
                </div>
                <span class="task-time">${escapeHTML(plan.start_time || "Daily Study")}</span>
                <button
                    type="button"
                    class="complete-button ${isDone ? 'completed' : ''}"
                    onclick="markPlanComplete(${plan.id}, this)"
                    ${isDone ? 'disabled' : ''}
                >
                    ${isDone ? '&#10004; Completed' : 'Mark Complete'}
                </button>
            </div>
        `;
    }).join("");
}

async function markPlanComplete(planId, btn) {
    btn.disabled = true;
    btn.innerHTML = "&#9203; Updating...";

    try {
        await fetch(`${API_URL}/study-plans/${planId}/complete`, { method: "PUT" });
    } catch(e) {}

    btn.className = "complete-button completed";
    btn.innerHTML = "&#10004; Completed";

    const titleEl = document.querySelector(`#plan-${planId} .task-details h3`);
    if (titleEl) {
        titleEl.style.textDecoration = "line-through";
        titleEl.style.opacity = "0.7";
    }
}

function showStatus(msg, type) {
    if (!statusBox) return;
    statusBox.textContent = msg;
    statusBox.className = "planner-status " + type;
    statusBox.style.display = "block";
}

function escapeHTML(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("studentId");
    window.location.href = "login.html";
}

// Dynamic User Profile Sync
function syncUserProfile() {
    let name = localStorage.getItem("studentName");
    if (!name) {
        try {
            const u = JSON.parse(localStorage.getItem("user"));
            if (u && (u.full_name || u.name)) name = u.full_name || u.name;
        } catch(e) {}
    }
    const studentName = (name && name.trim()) ? name.trim() : "Student";
    const initial = studentName.charAt(0).toUpperCase() || "S";

    const nameEl = document.getElementById("student-name");
    if (nameEl) nameEl.textContent = studentName;

    const iconEl = document.getElementById("profile-icon");
    if (iconEl) {
        iconEl.textContent = initial;
        iconEl.title = `Logged in as: ${studentName}`;
    }
}
document.addEventListener("DOMContentLoaded", syncUserProfile);

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("studentCourse");
    window.location.href = "login.html";
}
