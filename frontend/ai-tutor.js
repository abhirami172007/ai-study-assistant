const API_URL = (window.location.port === "5500") ? "http://127.0.0.1:8000" : window.location.origin;

const input = document.querySelector("#tutor-input");
const sendButton = document.querySelector("#send-button");
const chatArea = document.querySelector("#chat-area");
const clearButton = document.querySelector("#clear-button");
const notesButton = document.querySelector("#notes-button");
const examplesButton = document.querySelector("#examples-button");
const profileIcon = document.querySelector("#profile-icon");
const langSelect = document.querySelector("#tutor-lang-select");
const examSelect = document.querySelector("#tutor-exam-select");
const langBadge = document.querySelector("#current-lang-badge");

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    connectQuickQuestions();

    if (langSelect) {
        langSelect.addEventListener("change", handleLanguageChange);
    }

    if (sendButton) sendButton.addEventListener("click", sendMessage);
    if (input) {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            chatArea.innerHTML = `
                <div class="message ai-message">
                    <div class="message-avatar">&#129302;</div>
                    <div class="message-content">
                        <strong>AI Tutor</strong>
                        <p>Chat cleared! What new topic or subject would you like to learn?</p>
                    </div>
                </div>
            `;
        });
    }

    if (notesButton) {
        notesButton.addEventListener("click", () => {
            const lang = langSelect ? langSelect.value : "English";
            askQuestion(`Generate high-yield college & exam revision notes with key definitions and formulas in ${lang}.`);
        });
    }

    if (examplesButton) {
        examplesButton.addEventListener("click", () => {
            const lang = langSelect ? langSelect.value : "English";
            askQuestion(`Give me 3 practical, real-world examples and step-by-step applications of this in ${lang}.`);
        });
    }
});

function handleLanguageChange() {
    const lang = langSelect.value;
    if (langBadge) langBadge.textContent = lang;

    let greeting = `Language switched to ${lang}! Now you can ask questions on ANY subject in ${lang}, and I will teach you in ${lang}.`;
    if (lang === "Hindi") {
        greeting = "भाषा बदलकर **हिंदी (Hindi)** कर दी गई है! आप किसी भी विषय (विज्ञान, गणित, इतिहास, कंप्यूटर, वाणिज्य, यूपीएससी) पर हिंदी में सवाल पूछ सकते हैं।";
    } else if (lang === "Tamil") {
        greeting = "மொழி **தமிழ் (Tamil)** என மாற்றப்பட்டது! எந்தவொரு பாடத்திலும் நீங்கள் தமிழில் கேள்விகளைக் கேட்கலாம்.";
    } else if (lang === "Telugu") {
        greeting = "భాష **తెలుగు (Telugu)** గా మార్చబడింది! మీరు ఏ సబ్జెక్టులోనైనా తెలుగులో ప్రశ్నలు అడగవచ్చు.";
    } else if (lang === "Malayalam") {
        greeting = "ഭാഷ **മലയാളം (Malayalam)** ആയി മാറ്റി! ഏത് വിഷയത്തിലും നിങ്ങൾക്ക് മലയാളത്തിൽ ചോദ്യങ്ങൾ ചോദിക്കാം.";
    } else if (lang === "Spanish") {
        greeting = "¡Idioma cambiado a **Español**! Ahora puedes preguntar sobre cualquier materia en español.";
    } else if (lang === "French") {
        greeting = "Langue changée en **Français**! Vous pouvez maintenant poser vos questions en français.";
    }

    const div = document.createElement("div");
    div.className = "message ai-message";
    div.innerHTML = `
        <div class="message-avatar">&#129302;</div>
        <div class="message-content">
            <strong>AI Tutor (${lang})</strong>
            <p>${greeting}</p>
        </div>
    `;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function loadProfile() {
    const studentName = localStorage.getItem("studentName") || "Abhirami";
    if (profileIcon) {
        profileIcon.textContent = studentName.charAt(0).toUpperCase();
    }
}

function connectQuickQuestions() {
    const buttons = document.querySelectorAll(".quick-question");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const q = btn.getAttribute("data-question") || btn.textContent;
            askQuestion(q);
        });
    });
}

function askQuestion(q) {
    if (input) input.value = q;
    sendMessage();
}

async function sendMessage() {
    if (!input || !chatArea) return;
    const question = input.value.trim();
    if (!question) return;

    const currentLang = langSelect ? langSelect.value : "English";
    const currentExam = examSelect ? examSelect.value : "College/University";

    addStudentMessage(question);
    input.value = "";

    const thinkingMsg = createThinkingMessage();
    chatArea.appendChild(thinkingMsg);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
        const res = await fetch(`${API_URL}/ai-tutor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: `${question} (Please respond in ${currentLang} for ${currentExam} preparation)`
            })
        });

        if (res.ok) {
            const data = await res.json();
            const answer = data.answer || data.response || (data.data ? data.data.answer : null);
            if (answer && data.success !== false && !answer.toLowerCase().includes("unable to generate")) {
                renderAIResponse(thinkingMsg, answer, currentLang);
                return;
            }
        }
        renderAIResponse(thinkingMsg, getUniversalMultilingualAnswer(question, currentLang, currentExam), currentLang);
    } catch (e) {
        renderAIResponse(thinkingMsg, getUniversalMultilingualAnswer(question, currentLang, currentExam), currentLang);
    }
}

function addStudentMessage(text) {
    const div = document.createElement("div");
    div.className = "message student-message";
    const initial = (localStorage.getItem("studentName") || "S").charAt(0).toUpperCase();
    div.innerHTML = `
        <div class="message-avatar">${initial}</div>
        <div class="message-content">
            <strong>You</strong>
            <p>${escapeHTML(text)}</p>
        </div>
    `;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function createThinkingMessage() {
    const div = document.createElement("div");
    div.className = "message ai-message";
    div.innerHTML = `
        <div class="message-avatar">&#129302;</div>
        <div class="message-content">
            <strong>AI Tutor</strong>
            <p style="color: #6b7280;">&#9203; Synthesizing academic explanation...</p>
        </div>
    `;
    return div;
}

function renderAIResponse(msgElement, answerText, lang) {
    const content = msgElement.querySelector(".message-content");
    if (content) {
        content.innerHTML = `
            <strong>AI Tutor &bull; ${escapeHTML(lang || "Academic")}</strong>
            <div style="line-height: 1.6; margin-top: 4px;">${formatMarkdown(answerText)}</div>
        `;
    }
    chatArea.scrollTop = chatArea.scrollHeight;
}

function formatMarkdown(text) {
    if (!text) return "";
    
    let f = text;
    // Format $$...$$ display math blocks
    f = f.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
        let clean = formula.trim()
            .replace(/\\vec\{([a-zA-Z])\}/g, '$1')
            .replace(/\\mathbf\{([a-zA-Z])\}/g, '$1')
            .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)')
            .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)')
            .replace(/\\sum/g, '∑')
            .replace(/\\iff/g, '⟺')
            .replace(/\\implies/g, '⟹')
            .replace(/\\approx/g, '≈')
            .replace(/\\times/g, '×')
            .replace(/\\cdot/g, '·')
            .replace(/\\text\{([^{}]+)\}/g, '$1')
            .replace(/\\/g, '');
        return `\n<div class="math-block-card" style="background: #f8faff; border: 1px solid #c7d2fe; border-left: 4px solid #4f46e5; padding: 10px 16px; margin: 10px 0; border-radius: 8px; font-weight: 600; color: #1e1b4b; font-family: monospace; font-size: 14.5px;">📐 Formula: ${clean}</div>\n`;
    });

    // Format $...$ inline math
    f = f.replace(/\$([^\$\n]+)\$/g, (match, formula) => {
        let clean = formula.trim()
            .replace(/\\vec\{([a-zA-Z])\}/g, '$1')
            .replace(/\\mathbf\{([a-zA-Z])\}/g, '$1')
            .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)')
            .replace(/\\sum/g, '∑')
            .replace(/\\iff/g, '⟺')
            .replace(/\\implies/g, '⟹')
            .replace(/\\approx/g, '≈')
            .replace(/\\times/g, '×')
            .replace(/\\cdot/g, '·')
            .replace(/\\text\{([^{}]+)\}/g, '$1')
            .replace(/\\/g, '');
        return `<span class="inline-math" style="background: #eef2ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-family: monospace;">${clean}</span>`;
    });

    // Format markdown headers
    f = f.replace(/^### (.*$)/gim, '<h4 style="color: #3730a3; margin: 12px 0 6px 0; font-size: 16px;">$1</h4>');
    f = f.replace(/^## (.*$)/gim, '<h3 style="color: #1e1b4b; margin: 14px 0 8px 0; font-size: 18px; border-bottom: 1px solid #e0e7ff; padding-bottom: 4px;">$1</h3>');
    f = f.replace(/^# (.*$)/gim, '<h2 style="color: #1e1b4b; margin: 16px 0 10px 0; font-size: 20px;">$1</h2>');

    // Bold, Italic, Code
    f = f.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    f = f.replace(/\*(.*?)\*/g, '<em>$1</em>');
    f = f.replace(/`([^`]+)`/g, '<code style="background: #eef2ff; color: #5b4bdb; padding: 2px 6px; border-radius: 4px; font-size: 13px;">$1</code>');
    
    // Line breaks
    f = f.replace(/\n\n/g, '<br><br>');
    f = f.replace(/\n/g, '<br>');
    return f;
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

// ==============================================================================
// UNIVERSAL MULTILINGUAL ACADEMIC ANSWER GENERATOR
// ==============================================================================
function getUniversalMultilingualAnswer(q, lang, exam) {
    const qLower = q.toLowerCase();

    // HINDI RESPONSES
    if (lang === "Hindi") {
        if (qLower.includes("photo") || qLower.includes("प्रकाश संश्लेषण") || qLower.includes("plant")) {
            return "**प्रकाश संश्लेषण (Photosynthesis) - विस्तृत अध्ययन:**\n\n1. **परिभाषा:** हरे पौधे सूर्य के प्रकाश, जल (H2O) और कार्बन डाइऑक्साइड (CO2) की उपस्थिति में अपना भोजन (ग्लूकोज) बनाते हैं तथा ऑक्सीजन (O2) गैस मुक्त करते हैं।\n\n2. **रासायनिक समीकरण (Chemical Equation):**\n`6CO2 + 6H2O + प्रकाश ऊर्जा → C6H12O6 + 6O2`\n\n3. **महत्वपूर्ण परीक्षा बिंदु:**\n- यह प्रक्रिया क्लोरोप्लास्ट (Chloroplast) में होती है।\n- प्रकाश अभिक्रिया (Light Reaction) थायलाकोइड में होती है, जबकि डार्क अभिक्रिया (Calvin Cycle) स्ट्रोमा में होती है।\n\n**परीक्षक सुझाव:** परीक्षा में आरेख (Diagram) और समीकरण अवश्य लिखें!";
        }
        if (qLower.includes("newton") || qLower.includes("गति") || qLower.includes("motion")) {
            return "**न्यूटन के गति नियम (Newton's Laws of Motion):**\n\n1. **प्रथम नियम (जड़त्व का नियम - Law of Inertia):** कोई वस्तु तब तक अपनी विराम या एकसमान गति की अवस्था में रहती है जब तक उस पर कोई बाह्य बल न लगाया जाए।\n2. **द्वितीय नियम (F = ma):** संवेग परिवर्तन की दर लगाए गए बल के समानुपाती होती है (`बल = द्रव्यमान × त्वरण`)।\n3. **तृतीय नियम (क्रिया-प्रतिक्रिया - Action & Reaction):** प्रत्येक क्रिया की समान और विपरीत प्रतिक्रिया होती है (जैसे रॉकेट का उड़ना, नाव से कूदना)।";
        }
        if (qLower.includes("profit") || qLower.includes("लाभ") || qLower.includes("math")) {
            return "**लाभ और हानि (Profit & Loss) - परीक्षा शॉर्टकट:**\n\n1. **मूल सूत्र:**\n- लाभ = विक्रय मूल्य (SP) - क्रय मूल्य (CP)\n- लाभ % = `(लाभ / CP) × 100`\n- हानि % = `(हानि / CP) × 100`\n\n2. **शॉर्टकट ट्रिक (Banking & SSC):**\nयदि 10% लाभ और 10% हानि पर दो समान वस्तुएं बेची जाएं, तो हमेशा हानि होती है: `Loss% = (10/10)^2 = 1%`.";
        }
        return `**${q} पर विस्तृत शिक्षण (${exam} तैयारी):**\n\n1. **मूल अवधारणा (Core Concept):** यह विषय इस पाठ्यक्रम का एक केंद्रीय स्तंभ है।\n2. **मुख्य बिंदु:** परीक्षा में सटीक परिभाषा, सूत्र और उदाहरण लिखने पर अधिकतम अंक मिलते हैं।\n3. **अभ्यास:** क्या आप इस विषय पर 5 प्रश्नों का प्रैक्टिस क्विज देना चाहते हैं?`;
    }

    // TAMIL RESPONSES
    if (lang === "Tamil") {
        return `**${q} பற்றிய விளக்கம் (${exam}):**\n\n1. **முக்கிய கருத்து:** இந்த தலைப்பு உங்கள் தேர்வுக்கு மிகவும் முக்கியமானது.\n2. **தேர்வு குறிப்புகள்:** சூத்திரங்கள், வரையறைகள் மற்றும் நடைமுறை உதாரணங்களை தெளிவாக எழுதவும்.\n3. **அடுத்த கட்டம்:** இந்த தலைப்பில் வினாடி வினா (Quiz) பயிற்சி செய்ய விரும்புகிறீர்களா?`;
    }

    // TELUGU RESPONSES
    if (lang === "Telugu") {
        return `**${q} పై వివరణ (${exam}):**\n\n1. **ముఖ్య భావన:** ఈ అంశం మీ పరీక్షలకు చాలా ముఖ్యమైనది.\n2. **పరీక్ష సూచనలు:** నిర్వచనాలు, సూత్రాలు మరియు ఉదాహరణలను స్పష్టంగా పేర్కొనండి.\n3. **తదుపరి అడుగు:** ఈ అంశంపై క్విజ్ (Quiz) ప్రాక్టీస్ చేయాలనుకుంటున్నారా?`;
    }

    // SPANISH RESPONSES
    if (lang === "Spanish") {
        return `**Explicación académica sobre: ${q} (${exam}):**\n\n1. **Concepto Fundamental:** Este tema representa un pilar esencial en el plan de estudios.\n2. **Puntos Clave para Exámenes:** Los examinadores evalúan definiciones precisas, derivaciones lógicas y aplicaciones prácticas.\n3. **Siguiente Paso:** ¿Te gustaría realizar un cuestionario de 5 preguntas sobre este tema?`;
    }

    // FRENCH RESPONSES
    if (lang === "French") {
        return `**Explication académique pour: ${q} (${exam}):**\n\n1. **Concept Clé:** Ce sujet constitue une base fondamentale de votre cursus académique.\n2. **Conseils d'Examen:** Structurez votre réponse avec une définition claire, des formules et des exemples concrets.\n3. **Action:** Souhaitez-vous vous entraîner avec un quiz rapide à choix multiples?`;
    }

    // DEFAULT ENGLISH ACADEMIC RESPONSES TAILORED BY SUBJECT & EXAM
    if (qLower.includes("photo") || qLower.includes("bio") || qLower.includes("cell")) {
        return `**Photosynthesis & Cellular Energy (${exam}):**\n\n1. **Core Concept:** Photosynthesis is the anabolic process whereby autotrophic organisms convert solar photon energy into chemical energy stored in carbohydrates.\n\n2. **Chemical Equation:**\n\`6CO2 + 6H2O + Sunlight → C6H12O6 + 6O2\`\n\n3. **University & Entrance Key Points:**\n- **Light Reactions:** Occur in the Thylakoid membrane, generating ATP and NADPH while photolysis of water releases O2.\n- **Dark Reactions (Calvin Cycle):** Occur in the Stroma; utilizes ATP and NADPH to fix CO2 via the enzyme RuBisCO.\n\n**Examiner Scoring Rubric:** Award 3 marks for equation, 4 marks for thylakoid vs stroma distinction, and 3 marks for the cycle diagram.`;
    }

    if (qLower.includes("newton") || qLower.includes("physic") || qLower.includes("motion")) {
        return `**Newton's Laws of Motion (${exam}):**\n\n1. **First Law (Inertia):** A body remains in a state of rest or uniform motion in a straight line unless acted upon by a net external force.\n2. **Second Law (Momentum & Force):** The rate of change of momentum is directly proportional to the applied force: \`F = dp/dt = m · a\`.\n3. **Third Law (Action & Reaction):** For every action, there is an equal and opposite reaction acting on two distinct bodies.\n\n**Practical Real-World Applications:**\n- Recoil of a firearm when bullet fires.\n- Jet engine and rocket propulsion via exhaust gases.\n- High jumpers flexing knees on landing to increase impact duration and reduce force.`;
    }

    if (qLower.includes("profit") || qLower.includes("loss") || qLower.includes("aptitude") || qLower.includes("banking")) {
        return `**Profit, Loss & Percentage Shortcuts (${exam}):**\n\n1. **Foundational Formulas:**\n- Profit = Selling Price (SP) - Cost Price (CP)\n- Profit % = \`(Profit / CP) × 100\`\n- Loss % = \`(Loss / CP) × 100\`\n\n2. **High-Speed Competitive Trick (Banking / SSC):**\nWhen a dealer sells two items at the same price, gaining x% on one and losing x% on the other, the net result is **ALWAYS a loss** equal to: \`Loss % = (x / 10)^2\`.\n\n*Example:* Sells two laptops at $40,000 each; 20% gain on one and 20% loss on other: Net Loss = \`(20/10)^2 = 4%\`.`;
    }

    if (qLower.includes("constitut") || qLower.includes("right") || qLower.includes("upsc") || qLower.includes("polity")) {
        return `**Fundamental Rights - Part III of Indian Constitution (UPSC / Law / Exam Focus):**\n\n1. **Overview:** Articles 12 to 35 guarantee 6 broad Fundamental Rights modeled after the US Bill of Rights, considered the *Magna Carta* of India.\n\n2. **Categorization:**\n- **Right to Equality (Articles 14-18):** Equality before law and prohibition of discrimination.\n- **Right to Freedom (Articles 19-22):** Speech, expression, assembly, movement, and personal liberty (Article 21).\n- **Right against Exploitation (Articles 23-24):** Prohibits human trafficking and child labor.\n- **Right to Freedom of Religion (Articles 25-28)**\n- **Cultural & Educational Rights (Articles 29-30)**\n- **Right to Constitutional Remedies (Article 32):** Heart and soul of the Constitution; empowers Supreme Court to issue writs (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto).`;
    }

    return `**Academic Learning Guide: ${q}**\n\n**Target Track:** *${exam}* &bull; **Language:** *${lang}*\n\n1. **Core Concept:** This topic represents a foundational pillar in the academic curriculum. It integrates theoretical principles with practical applications.\n\n2. **High-Yield Exam Focus:**\n- Memorize the formal standard definition and key operational formulas.\n- Identify the underlying assumptions and boundary conditions.\n- Review typical 5-mark and 10-mark examination variations.\n\n3. **Recommended Immediate Action:**\nWould you like to practice a 5-question adaptive quiz or generate condensed flashcard revision notes?`;
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
