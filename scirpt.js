function toggleChat() {
  const chatbox = document.querySelector('.chatbox');
  chatbox.style.display = chatbox.style.display === 'none' ? 'block' : 'none';
}


function showLogin() {
  document.getElementById("login").style.display = "block";
  document.getElementById("register").style.display = "none";
}

function showRegister() {
  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "block";
}

// Track user activity
const userActivity = [];

function trackActivity(action, details = '') {
    const timestamp = new Date().toLocaleString();
    userActivity.push({ timestamp, action, details });
}

// Function to log in
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    trackActivity('Login Attempt', `Email: ${email}`);
    
    // Assuming login is successful
    trackActivity('Login Success', `Email: ${email}`);
    alert("Logged in successfully!");
}

// Function to register
async function register() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;

    trackActivity('Registration Attempt', `Email: ${email}, Name: ${firstName} ${lastName}`);
    
    // Assuming registration is successful
    trackActivity('Registration Success', `Email: ${email}`);
    alert("Registered successfully!");
}

// Function to handle chat messages
function sendMessage() {
    const userMessage = document.getElementById('userMessage').value;
    if (userMessage.trim() !== '') {
        trackActivity('Chat Message', `Message: ${userMessage}`);
        document.getElementById('userMessage').value = ''; // Clear input
    }
}

// Function to generate and download report
function generateReport() {
    let reportContent = 'Timestamp, Action, Details\n';
    userActivity.forEach(entry => {
        reportContent += `${entry.timestamp}, ${entry.action}, ${entry.details}\n`;
    });

    const blob = new Blob([reportContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'user_activity_report.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


function checkEnter(event) {
  if (event.key === 'Enter') {
      sendMessage();
  }
}

function sendMessage() {
  const userInput = document.getElementById('userMessage');
  const userMessage = userInput.value;

  if (userMessage.trim() === '') return;

  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML += `<div class="user-message">${userMessage}</div>`;
  
  // Here you can add your logic for generating a bot response
  const botResponse = getBotResponse(userMessage);
  chatMessages.innerHTML += `<div class="bot-response">${botResponse}</div>`;
  
  userInput.value = ''; // Clear the input
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll to the latest message
}

function getBotResponse(userMessage) {
  // Basic responses based on user input
  if (userMessage.includes("hello")) {
      return "Hello! How can I help you today?";
  } else if (userMessage.includes("help")) {
      return "Sure! What do you need help with?";
  } else {
      return "I'm here to assist you! Can you please specify?";
  }
}
