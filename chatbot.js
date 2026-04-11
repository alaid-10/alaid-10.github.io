const portfolioData = {
    bio: "I'm Aidan Anu Sam, an aspiring Computer Science Engineer and the current Chief Marketing Officer at Blue Sky WLL in Bahrain. I've spent 14 years at the Indian School Bahrain and am now heading towards a B.Tech in CSE at a top NIT in India.",
    skills: ["HTML5", "Vanilla CSS3", "JavaScript (ES6+)", "Java", "MySQL", "Git & GitHub", "Figma", "Photoshop", "Notion", "WordPress"],
    projects: [
        { name: "Vision API Explorer", tech: "Python, React", desc: "A web app to explore image recognition tech." },
        { name: "Algorithm Visualizer", tech: "JavaScript, HTML5", desc: "Interactive tool for sorting algorithm visualization." },
        { name: "Portfolio V1", tech: "HTML, CSS, JS", desc: "A custom-built agency-style portfolio with dark aesthetics." }
    ],
    experience: "Chief Marketing Officer at Blue Sky WLL, Bahrain. I steer digital strategy and brand growth.",
    education: "14 years at Indian School Bahrain. Currently pursuing B.Tech CSE at an NIT (National Institute of Technology) in India.",
    certificates: ["Introduction to Cybersecurity (Cisco)", "Python for Data Science (IBM)", "CS50: Introduction to Computer Science (Harvard)"],
    contact: {
        email: "aidananusam@gmail.com",
        linkedin: "linkedin.com/in/alaid/",
        whatsapp: "+973 33494353",
        website: "aidananusam.me"
    }
};

const intentMap = [
    {
        keywords: ["who", "about", "bio", "journey", "profile"],
        response: portfolioData.bio
    },
    {
        keywords: ["skill", "tech", "learning", "language", "code", "know"],
        response: `I'm proficient in ${portfolioData.skills.join(", ")}. I'm currently focused on sharpening my skills in web development and Java.`
    },
    {
        keywords: ["work", "project", "build", "create", "featured"],
        response: `Some of my featured projects include: ${portfolioData.projects.map(p => p.name).join(", ")}. Would you like to know more about a specific one?`
    },
    {
        keywords: ["job", "experience", "cmo", "blue sky"],
        response: portfolioData.experience
    },
    {
        keywords: ["study", "education", "school", "college", "nit", "btech", "degree"],
        response: portfolioData.education
    },
    {
        keywords: ["cert", "attainment", "achievement", "cs50", "cisco", "ibm"],
        response: `I hold several certifications including ${portfolioData.certificates.join(", ")}.`
    },
    {
        keywords: ["contact", "email", "linkedin", "reach", "hire", "message", "whatsapp"],
        response: `You can reach me via email at <a href="mailto:${portfolioData.contact.email}">${portfolioData.contact.email}</a>, on LinkedIn at <a href="https://${portfolioData.contact.linkedin}" target="_blank">in/alaid</a>, or via WhatsApp at <a href="https://wa.me/97333494353" target="_blank">${portfolioData.contact.whatsapp}</a>.`
    },
    {
        keywords: ["hello", "hi", "hey", "greetings"],
        response: "Hello! I'm alaid.AI, your guide to Aidan's portfolio. How can I help you today?"
    }
];

const fallbackResponse = "I'm specifically trained to answer questions about Aidan's portfolio, skills, and experience. For other topics, you might want to reach out to Aidan directly!";

document.addEventListener('DOMContentLoaded', () => {
    // Inject HTML
    const chatContainer = document.createElement('div');
    chatContainer.id = 'alaid-chatbot';
    chatContainer.innerHTML = `
        <button id="chatbot-toggle" class="chatbot-toggle">
            <span>Ask alaid.</span>
        </button>
        <div id="chatbot-window" class="chatbot-window">
            <div class="chatbot-header">
                <div class="bot-info">
                    <span class="bot-status"></span>
                    <h3>alaid.</h3>
                </div>
                <button id="chatbot-close">&times;</button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="message bot-message">Hello! I'm alaid. How can I help you explore Aidan's portfolio today?</div>
                <div class="quick-actions">
                    <button class="qa-btn" data-query="What are your skills?">What are your skills?</button>
                    <button class="qa-btn" data-query="Tell me about Blue Sky WLL.">Tell me about Blue Sky WLL</button>
                    <button class="qa-btn" data-query="How can I contact you?">How to contact?</button>
                </div>
            </div>
            <div class="chatbot-input">
                <input type="text" id="chatbot-input-field" placeholder="Ask about the portfolio...">
                <button id="chatbot-send">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);

    const toggle = document.getElementById('chatbot-toggle');
    const windowEl = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const inputField = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('chatbot-send');
    const messagesCont = document.getElementById('chatbot-messages');

    let isOpen = false;

    const toggleChat = () => {
        isOpen = !isOpen;
        windowEl.classList.toggle('active', isOpen);
        if (isOpen) {
            inputField.focus();
        }
    };

    toggle.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    const addMessage = (text, type) => {
        const msg = document.createElement('div');
        msg.className = `message ${type}-message`;
        if (type === 'bot') {
            msg.innerHTML = text; // Allow HTML for bot responses
        } else {
            msg.textContent = text; // Security: User messages stay plain text
        }
        messagesCont.appendChild(msg);
        messagesCont.scrollTop = messagesCont.scrollHeight;
    };

    const handleQuery = (query) => {
        if (!query.trim()) return;
        
        addMessage(query, 'user');
        inputField.value = '';

        // Typing indicator simulation
        const typingId = document.createElement('div');
        typingId.className = 'message bot-message typing';
        typingId.textContent = '...';
        messagesCont.appendChild(typingId);
        messagesCont.scrollTop = messagesCont.scrollHeight;

        setTimeout(() => {
            typingId.remove();
            const normalizedQuery = query.toLowerCase();
            let matched = false;

            for (const item of intentMap) {
                if (item.keywords.some(k => normalizedQuery.includes(k))) {
                    addMessage(item.response, 'bot');
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                addMessage(fallbackResponse, 'bot');
            }
        }, 600);
    };

    sendBtn.addEventListener('click', () => handleQuery(inputField.value));
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleQuery(inputField.value);
    });

    // Quick Actions
    const setupQuickActions = () => {
        document.querySelectorAll('.qa-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                handleQuery(btn.getAttribute('data-query'));
                btn.parentElement.remove(); // Hide quick actions after first use
            });
        });
    };
    setupQuickActions();

    // Handle appearance after splash screen
    const showBot = () => {
        chatContainer.classList.add('visible');
    };

    const splash = document.getElementById('splash-screen');
    if (!splash || splash.classList.contains('hide-splash')) {
        showBot();
    } else {
        // Observe when the splash screen is removed OR when it gets the hide-splash class
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const s = document.getElementById('splash-screen');
                if (!s || s.classList.contains('hide-splash')) {
                    setTimeout(showBot, 500); 
                    observer.disconnect();
                }
            });
        });
        observer.observe(document.body, { childList: true, attributes: true, subtree: true });
    }
});
