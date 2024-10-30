let timerInterval;
let remainingTime = 0; // Store remaining time in seconds
let isPaused = false; // Track if timer is paused
let alarmTimeout;
let videoStream;

// Show available games
function showGames() {
    const gamesDiv = document.getElementById('games');
    gamesDiv.style.display = gamesDiv.style.display === 'none' ? 'block' : 'none';
}

// Toggle exercise poses visibility
function toggleExercisePoses() {
    const exercisePosesDiv = document.getElementById('exercise-poses');
    exercisePosesDiv.style.display = exercisePosesDiv.style.display === 'none' ? 'block' : 'none';
}

// Toggle health tracking visibility
function toggleHealthTracking() {
    const healthTrackingDiv = document.getElementById('health-tracking');
    healthTrackingDiv.style.display = healthTrackingDiv.style.display === 'none' ? 'block' : 'none';
    if (healthTrackingDiv.style.display === 'block') {
        startVideo();
    } else {
        stopVideo();
    }
}

// Start the exercise timer
function startExercise() {
    const startTime = document.getElementById('start-time').value;
    const stopTime = document.getElementById('stop-time').value;

    if (!startTime || !stopTime) {
        alert("Please enter both start and stop times.");
        return;
    }

    let startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    let stopMinutes = parseInt(stopTime.split(':')[0]) * 60 + parseInt(stopTime.split(':')[1]);

    if (isNaN(startMinutes) || isNaN(stopMinutes) || startMinutes >= stopMinutes) {
        alert("Please enter valid start and stop times.");
        return;
    }

    document.getElementById('timer').style.display = 'block';
    document.getElementById('pause-button').style.display = 'inline';
    document.getElementById('resume-button').style.display = 'none';
    isPaused = false;

    let totalTime = (stopMinutes - startMinutes) * 60; // Total time in seconds
    remainingTime = totalTime;

    timerInterval = setInterval(() => {
        if (!isPaused) {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            document.getElementById('time-display').textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            remainingTime--;

            if (remainingTime < 0) {
                clearInterval(timerInterval);
                alert("Time's up!");
                document.getElementById('timer').style.display = 'none';
                resetTimer();
                detectMood(); // Detect mood at the end of the timer
            }
        }
    }, 1000);
}

// Pause the timer
function pauseExercise() {
    isPaused = true;
    document.getElementById('pause-button').style.display = 'none';
    document.getElementById('resume-button').style.display = 'inline';
}

// Resume the timer
function resumeExercise() {
    isPaused = false;
    document.getElementById('pause-button').style.display = 'inline';
    document.getElementById('resume-button').style.display = 'none';
}

// Reset the timer
function resetTimer() {
    remainingTime = 0;
    document.getElementById('time-display').textContent = '00:00';
    clearInterval(timerInterval);
    document.getElementById('pause-button').style.display = 'none';
    document.getElementById('resume-button').style.display = 'none';
}

// Set alarms based on user input
async function setAlarms() {
    const alarmTime = document.getElementById('alarm-time').value;
    const alarmSeconds = parseInt(document.getElementById('alarm-seconds').value);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const reminders = Array.from(checkboxes).map(checkbox => checkbox.value);

    if (!alarmTime || reminders.length === 0) {
        alert("Please select an alarm time and at least one reminder.");
        return;
    }

    const alarmDate = new Date();
    const [hours, minutes] = alarmTime.split(':');
    alarmDate.setHours(hours);
    alarmDate.setMinutes(minutes);
    alarmDate.setSeconds(alarmSeconds); // Set seconds from input

    const now = new Date();
    const timeUntilAlarm = alarmDate.getTime() - now.getTime();

    if (timeUntilAlarm > 0) {
        alarmTimeout = setTimeout(async () => {
            const message = `Time to ${reminders.join(', ')}!`;
            alert(message);
            document.getElementById('alarm-message').style.display = 'block';
            document.getElementById('alarm-time-display').textContent = alarmTime + `:${alarmSeconds}`;
            speakMessage(message); // Speak the alarm message
            
            await detectMood(); // Capture photo and recognize mood when alarm goes off
        }, timeUntilAlarm);
    } else {
        alert("Please set a time in the future.");
    }
}

// Function to start the video stream
function startVideo() {
    const video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoStream = stream;
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Error accessing the webcam: ", err);
        });
}

// Function to stop the video stream
function stopVideo() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
}

// Capture photo and recognize mood
async function processPhoto(dataUrl) {
    const mood = await recognizeMood(dataUrl);
    document.getElementById('mood-display').textContent = `Detected mood: ${mood}`;
}

// Mock function for mood recognition (replace with actual model)
async function recognizeMood(dataUrl) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mood = Math.random() > 0.5 ? 'happy' : 'sad'; // Simulate mood
            resolve(mood);
        }, 1000);
    });
}

// Capture photo function
async function capturePhoto() {
    await detectMood(); // Call detectMood to handle photo capture and mood detection
}

// Detect mood by capturing the current video frame
async function detectMood() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('photo-canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png'); // Get image data

    await processPhoto(dataUrl); // Process the captured photo
}

// Function to send message from the user
function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    // Display user message
    addMessageToChatLog('You: ' + userInput);

    // Clear input field
    document.getElementById('user-input').value = '';

    // Get chatbot response
    const botResponse = getChatbotResponse(userInput);
    addMessageToChatLog('Chatbot: ' + botResponse);
}

// Function to add messages to the chat log
function addMessageToChatLog(message) {
    const chatLog = document.getElementById('chat-log');
    chatLog.innerHTML += message + '<br>';
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the bottom
}

// Improved chatbot response generation
function getChatbotResponse(input) {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('exercise')) {
        return 'Exercise is important for health! Can I suggest some activities?';
    } else if (lowerInput.includes('health')) {
        return 'Make sure to stay hydrated and take your medications on time!';
    } else if (lowerInput.includes('games')) {
        return 'Check out some uplifting games in the gaming section!';
    } else if (lowerInput.includes('thoughtful therapy')) {
        return 'Thoughtful Therapy is designed to support mental well-being through various activities and tools.';
    } else {
        return 'I\'m here to help with anything you need! Just ask me a question.';
    }
}

// Function to speak a message
function speakMessage(message) {
    const speech = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(speech);
}

// Function to toggle the chatbot section
function toggleChatbot() {
    const chatbotDiv = document.getElementById('chatbot');
    chatbotDiv.style.display = chatbotDiv.style.display === 'none' ? 'block' : 'none';
}
