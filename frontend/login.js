const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    try {
        const apiUrl = ((window.location.port === "5500") ? "http://127.0.0.1:8000" : window.location.origin) + "/login";
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Save student credentials & profile object
            const studentName = data.name || "Student";
            localStorage.setItem("studentId", data.user_id);
            localStorage.setItem("studentName", studentName);
            localStorage.setItem("studentEmail", email);
            localStorage.setItem("studentCourse", data.course || "");
            localStorage.setItem("user", JSON.stringify({
                id: data.user_id,
                full_name: studentName,
                name: studentName,
                email: email,
                course: data.course || ""
            }));

            window.location.href = "dashboard.html";
        } else {
            alert(data.message || "Login failed.");
        }
    } catch (error) {
        alert("Unable to connect to the server. Please ensure the backend is running.");
        console.error(error);
    }
});
