const toggle = document.getElementById('darkToggle');
const stored = localStorage.getItem('dark-mode');
const facebook = document.getElementById('facebook-link');
const github = document.getElementById('github-link');
const portfolio = document.getElementById('porfolio-link');
const meal = document.getElementById('mealmaster-link');
const bms = document.getElementById('bms-link');
const bmsyt = document.getElementById('bms-yt-link');
const pra = document.getElementById('pra-link');
const prayt = document.getElementById('pra-yt-link');
const linkedid = document.getElementById('linkedid-link');
const github2 = document.getElementById('github-link2');
const instagram = document.getElementById('instagram-link');
const email = document.getElementById('email-link');
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const chatForm = document.querySelector(".chat-form");
const chatbotToggler = document.querySelector("#chatbot-toggler");



(function setupDarkToggle(){

  function init(){
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = stored === '1' ? true : (stored === '0' ? false : prefersDark);
    if (initialDark) document.body.classList.add('dark-mode');
    if (toggle) toggle.checked = initialDark;

    if (!toggle) return;
    toggle.addEventListener('change', () => {
      const on = !!toggle.checked;
      document.body.classList.toggle('dark-mode', on);
      localStorage.setItem('dark-mode', on ? '1' : '0');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

document.addEventListener('DOMContentLoaded', function() {
    if (facebook) {
        facebook.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            
            if (url) {
                window.open(url); 
            }
        });
    }
    if(github){
      github.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
    }
    if(portfolio){
      portfolio.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
    }
    if(meal){
      meal.addEventListener('click', function(){
        const url = this.getAttribute('data-url');

        if(url){
          window.open(url);
        }
      });
    }
    if(bms){
      bms.addEventListener('click', function(){
        const url = this.getAttribute('data-url');

        if(url){
          window.open(url);
        }
      });
    }
    if(bmsyt){
      bmsyt.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
      }
    
    if(pra){
      pra.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(pra){
          window.open(url);
        }
      });
    }
    if(prayt){
      prayt.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
    }
    if(linkedid){
      linkedid.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(linkedid){
          window.open(url);
        }
      });
    }
    if(github2){
      github2.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        if(url){
          window.open(url);
        }
      });
    }
    if(instagram){
      instagram.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(instagram){
          window.open(url);
        }
      });
    }
    if(email){
      email.addEventListener('click', function(){
        const url = this.getAttribute('data-url');
        if(email){
           window.open(`mailto:${url}`)
        }
      });
    }
});

document.addEventListener("DOMContentLoaded", () => {

  const clickable = document.querySelectorAll(
    " .img, .button1, .project-divider, .proj-logo-divider-size, .tech-stack, .contact-icon, .contact-email, .button"
  );

  clickable.forEach(el => {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      this.classList.toggle("active");
    });
  });
});

const API_KEY =  "AIzaSyAA4GVvcq-ZbkgcSYPNVoDRQgLX1Q2b570";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
const userData = {
    message: null
}
const chatHistory = [];

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

const getCannedResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('girlfriend') || lowerMsg.includes('may jowa') || lowerMsg.includes('may girlfriend')) {
        return "wala pa e, pag may nanligaw na siguro sakin, di jk lng. Focus muna sa aral hehe";
    }
    return null;
};

const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    const cannedReply = getCannedResponse(userData.message);
    if (cannedReply) {
        messageElement.innerText = cannedReply;
        chatHistory.push({ role: "user", content: userData.message });
        chatHistory.push({ role: "assistant", content: cannedReply });
        incomingMessageDiv.classList.remove("thinking");
        return;
    }

    const historyContext = chatHistory.map(h => `${h.role === 'user' ? 'User' : 'Ron'}: ${h.content}`).join('\n');
    const portfolioInfo = `
About Me:
- Name: Ronmar Abalos
- Education: Bachelor of Science in Information Technology student at Central Luzon State University
- High School: STI College San Jose (where I started coding)
- Coding Experience: 3+ years, primarily backend development with Java
- Email: abalosronmar1@gmail.com

Tech Stack:
- Languages: Java (3 yrs), HTML (2 yrs), CSS (2 yrs), JavaScript (2 yrs)
- Databases: MySQL (1 yr experience)
- Frameworks: Firebase
- Tools: Git, GitHub, VS Code, Figma, Photoshop, Premiere Pro

Projects:
1. Portfolio Website - My personal portfolio showcasing my skills and projects
2. Buyer Monitoring System - Java & MySQL with JavaSwing UI (OOP subject project)
3. Meal Master - Android mobile app using Java & Firebase (3-month project with mentor Mark Jayson Lomboy)
4. Page Replacement Algorithm - Java project

Social Links:
- GitHub: https://github.com/Ronmar11
- LinkedIn: https://www.linkedin.com/in/ronmar-ezekiel-abalos-85462a396/
- Facebook: https://www.facebook.com/ronmar.abalos/
- Instagram: https://www.instagram.com/zekiii.ee
`;
    const prompt = `You are Ronmar Abalos, a Filipino IT student. Reply as "I" to the user like you're chatting with them. Be friendly, modest, use brief Taglish when natural. Keep it short. Use the following portfolio info to answer questions about your projects, skills, background, and experience.

${portfolioInfo}

Conversation history:
${historyContext}

User: ${userData.message}`;

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    }
    try{
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        const cleaned = apiResponseText.replace(/\*/g, '');
        messageElement.innerText = cleaned;
        
        chatHistory.push({ role: "user", content: userData.message });
        chatHistory.push({ role: "assistant", content: cleaned });
    } catch(error){
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally{
        incomingMessageDiv.classList.remove("thinking");
    }
}

const isMessageValid = () => messageInput && messageInput.value.trim().length > 0;

const updateSendButtonState = () => {
    if (!sendMessageButton) return;
    const valid = isMessageValid();
    sendMessageButton.disabled = !valid;
    sendMessageButton.setAttribute('aria-disabled', String(!valid));
};

const handleOutgoingMessage = (e) => {
    if (e) e.preventDefault();
    if (!isMessageValid()) return;

    userData.message = messageInput.value.trim();

    const messageContent = `<div class="message-text"></div>`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    messageInput.value = "";
    updateSendButtonState();

    setTimeout(() => {
        const messageContent = `<div class="ai-logo-name"><p class="chatbot-logo"></p><p class="name">Ronmar Abalos</p></div>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        generateBotResponse(incomingMessageDiv);
    }, 600);
}

if (messageInput) {
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (chatForm && typeof chatForm.requestSubmit === 'function') {
                chatForm.requestSubmit();
            } else {
                handleOutgoingMessage(e);
            }
        }
    });

    messageInput.addEventListener('input', updateSendButtonState);
}

if (chatForm) {
    chatForm.addEventListener('submit', handleOutgoingMessage);
}

if (sendMessageButton) {
    sendMessageButton.addEventListener('click', (e) => handleOutgoingMessage(e));
}

updateSendButtonState();

const closeChatbot = document.querySelector(".close-chatbot");

if (chatbotToggler) {
    chatbotToggler.addEventListener('click', () => {
        document.body.classList.toggle("show-chatbot");
    });
}

if (closeChatbot) {
    closeChatbot.addEventListener('click', () => {
        document.body.classList.remove("show-chatbot");
    });
}