// chatbot.js

let stage = 0;
let formData = {
  message: '',
  email: '',
  wantsResume: false,
  address: ''
};

const mouth = document.querySelector('.mouth');
const leftArm = document.querySelector('.left-arm');
const rightArm = document.querySelector('.right-arm');

function animateBassbotTalking() {
  mouth.style.transform = 'scaleY(1.5)';
  leftArm.style.transform = 'rotate(-20deg)';
  rightArm.style.transform = 'rotate(20deg)';
  setTimeout(() => {
    mouth.style.transform = 'scaleY(1)';
    leftArm.style.transform = 'rotate(0deg)';
    rightArm.style.transform = 'rotate(0deg)';
  }, 500);
}

function addMessage(text, sender = 'bot') {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  document.getElementById('chat-log').appendChild(msg);
  msg.scrollIntoView();

  if (sender === 'bot') animateBassbotTalking();
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';
  
  setTimeout(() => botResponse(text), 500);
}

function botResponse(input) {
  switch (stage) {
    case 0:
      formData.message = input;
      addMessage("Thank you! Whats your email address?");
      stage++;
      break;
    case 1:
      formData.email = input;
      addMessage("Awesome! Any additional feedback?(yes/no)");
      stage++;
      break;
    case 2:
      if (input.toLowerCase().includes("yes")) {
        formData.wantsResume = true;
        addMessage("Lets hear it!");
        stage++;
      } else {
        formData.wantsResume = false;
        submitForm();
      }
      break;
    case 3:
      formData.address = input;
      submitForm();
      break;
    default:
      addMessage("Appreciate you stopping by!");
  }
}

function submitForm() {
  fetch("https://bassbot-server.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then(() => {
      addMessage("Thanks for that!");
    })
    .catch(() => {
      addMessage("Ugh, server glitch. Try again later.");
    });
}
