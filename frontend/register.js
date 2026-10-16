const registerForm = document.querySelector("#register-form");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const course = document.querySelector("#course").value.trim();
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please re-enter.");
        return;
    }

    try {
        const apiUrl = ((window.location.port === "5500") ? "http://127.0.0.1:8000" : window.location.origin) + "/register";
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, course, password })
        });

        const data = await response.json();

        if (data.success) {
            const studentName = data.name || name;
            const studentId = data.user_id || 1;
            const studentCourse = data.course || course || "";

            // Save user profile into local storage
            localStorage.setItem("studentId", studentId);
            localStorage.setItem("studentName", studentName);
            localStorage.setItem("studentEmail", email);
            localStorage.setItem("studentCourse", studentCourse);
            localStorage.setItem("user", JSON.stringify({
                id: studentId,
                full_name: studentName,
                name: studentName,
                email: email,
                course: studentCourse
            }));

            alert(`Welcome to AI Study Assistant, ${studentName}! Account created successfully.`);
            window.location.href = "dashboard.html";
        } else {
            alert(data.message || "Registration failed.");
        }
    } catch (error) {
        alert("Unable to connect to the server. Please ensure the backend is running.");
        console.error(error);
    }
});
