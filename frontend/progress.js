const API_BASE = (window.location.port === "5500") ? "http://127.0.0.1:8000" : window.location.origin;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch(`${API_BASE}/progress/1`);
        if (res.ok) {
            const data = await res.json();
            if (data.average_accuracy !== undefined) {
                document.getElementById("stat-accuracy").textContent = `${Math.round(data.average_accuracy)}%`;
            }
        }
    } catch(e) {}
});

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
