// Achievements interactivity
document.addEventListener("DOMContentLoaded", () => {
    console.log("Achievements loaded");
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
