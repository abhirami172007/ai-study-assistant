const API_BASE = (window.location.port === "5500") ? "http://127.0.0.1:8000" : window.location.origin;

let documents = [
    { id: 1, title: "Database Systems - Normalization & 3NF.pdf", subject: "DBMS", type: "pdf", date: "Yesterday", size: "2.4 MB" },
    { id: 2, title: "Python Advanced - Iterators & Generators.docx", subject: "Python", type: "docx", date: "3 days ago", size: "1.1 MB" },
    { id: 3, title: "Machine Learning - Supervised Regression.pdf", subject: "Machine Learning", type: "pdf", date: "Last week", size: "4.8 MB" }
];

document.addEventListener("DOMContentLoaded", () => {
    setupFileInput();
    renderDocuments();
});

function setupFileInput() {
    const fileInput = document.getElementById("file-input");
    const dropzone = document.getElementById("dropzone");
    const label = document.getElementById("drop-label");

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            const f = fileInput.files[0];
            label.textContent = `Selected: ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`;
            const titleInput = document.getElementById("doc-title");
            if (!titleInput.value) {
                titleInput.value = f.name.replace(/\.[^/.]+$/, "");
            }
        }
    });

    document.getElementById("upload-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("doc-title").value || "Untitled Document";
        const subject = document.getElementById("doc-subject").value;
        const file = fileInput.files[0];

        const btn = document.getElementById("upload-btn");
        btn.disabled = true;
        btn.innerHTML = "&#9889; Processing with AI OCR...";

        // Add to local state
        documents.unshift({
            id: Date.now(),
            title: title + (file ? `.${file.name.split('.').pop()}` : ".pdf"),
            subject: subject,
            type: file ? file.name.split('.').pop().toLowerCase() : "pdf",
            date: "Just now",
            size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "1.8 MB"
        });

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = "&#128228; Upload &amp; Analyze with AI";
            label.textContent = "Click or drag & drop files here to upload";
            fileInput.value = "";
            document.getElementById("doc-title").value = "";
            renderDocuments();
            showSummary(documents[0]);
        }, 1200);
    });
}

function renderDocuments() {
    const container = document.getElementById("materials-list");
    if (!container) return;

    container.innerHTML = documents.map(doc => `
        <div class="doc-item">
            <div class="doc-badge ${doc.type}">${doc.type}</div>
            <div class="doc-info">
                <div class="doc-title">${doc.title}</div>
                <div class="doc-meta">${doc.subject} • ${doc.size} • ${doc.date}</div>
            </div>
            <div class="doc-actions">
                <button class="doc-btn summary" onclick="showSummaryById(${doc.id})">&#128221; Summary</button>
                <button class="doc-btn quiz" onclick="quizFromDoc('${encodeURIComponent(doc.subject)}')">&#9889; Quiz Me</button>
            </div>
        </div>
    `).join("");
}

function showSummaryById(id) {
    const doc = documents.find(d => d.id === id);
    if (doc) showSummary(doc);
}

function showSummary(doc) {
    const card = document.getElementById("summary-card");
    const titleEl = document.getElementById("summary-title");
    const metaEl = document.getElementById("summary-meta");
    const contentEl = document.getElementById("summary-content");

    titleEl.textContent = `AI Summary: ${doc.title}`;
    metaEl.textContent = `Subject: ${doc.subject} • High-Yield Revision Points`;

    contentEl.innerHTML = `
        <h4 style="color: #5b4bdb; margin-bottom: 8px;">Key Exam Takeaways:</h4>
        <ul style="padding-left: 20px; margin-bottom: 14px;">
            <li><strong>Core Concept:</strong> Analyzed the foundational principles and structural hierarchies defined in this chapter.</li>
            <li><strong>Critical Definition:</strong> Normal forms eliminate anomalies (insertion, update, deletion) by ensuring attribute dependencies strictly reference candidate keys.</li>
            <li><strong>Exam Warning:</strong> Common mistake is failing to identify transitive dependencies between non-key attributes during 3NF decompositions.</li>
        </ul>
        <h4 style="color: #5b4bdb; margin-bottom: 8px;">Actionable Practice:</h4>
        <p>Your agent prepared a 5-question mock quiz based directly on the definitions in this document.</p>
        <button onclick="quizFromDoc('${encodeURIComponent(doc.subject)}')" class="primary-button" style="width: auto; margin-top: 10px; padding: 8px 16px; font-size: 13px;">&#9889; Take 5-Min Document Quiz</button>
    `;

    card.style.display = "block";
    card.scrollIntoView({ behavior: "smooth" });
}

function quizFromDoc(subject) {
    window.location.href = `ai-quiz.html?subject=${subject}`;
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
