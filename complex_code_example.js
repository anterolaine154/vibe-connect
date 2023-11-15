/* 
 * Filename: complex_code_example.js
 * Description: This code is a complex implementation of a real-time chat application using JavaScript.
 */

// Constants
const SERVER_URL = "https://api.myserver.com/chat";
const MAX_MESSAGE_LENGTH = 200;
const MAX_USERNAME_LENGTH = 20;

// Global Variables
let chatMessages = [];
let activeChatroom = null;
let currentUser = null;

// Classes

// Chat Message Class
class ChatMessage {
  constructor(username, message, timestamp) {
    this.username = username;
    this.message = message;
    this.timestamp = timestamp;
  }
}

// User Class
class User {
  constructor(username) {
    this.username = username;
    this.chatrooms = [];
  }

  joinChatroom(chatroom) {
    this.chatrooms.push(chatroom);
  }
}

// Chatroom Class
class Chatroom {
  constructor(name) {
    this.name = name;
    this.messages = [];
    this.users = [];
  }

  sendMessage(message) {
    if (message.length > MAX_MESSAGE_LENGTH) {
      console.error("Message exceeds maximum length");
    } else {
      const timestamp = new Date().getTime();
      const chatMessage = new ChatMessage(currentUser.username, message, timestamp);
      this.messages.push(chatMessage);
      chatMessages.push(chatMessage);
      this.broadcastMessage(chatMessage);
    }
  }

  join(user) {
    if (user.username.length > MAX_USERNAME_LENGTH) {
      console.error("Username exceeds maximum length");
    } else {
      this.users.push(user);
      user.joinChatroom(this);
    }
  }

  leave(user) {
    const index = this.users.indexOf(user);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  broadcastMessage(message) {
    // Send message to the server
    const payload = {
      chatroom: this.name,
      username: message.username,
      message: message.message,
      timestamp: message.timestamp,
    };

    fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => console.log('Message broadcasted to server:', data))
      .catch(error => console.error('Error broadcasting message:', error));
  }
}

// Functions

// Initialize chat application
function initialize() {
  // Connect to server, retrieve chatrooms, and initialize UI
  connectToServer()
    .then(chatrooms => {
      // Create Chatroom instances
      chatrooms.forEach(chatroom => {
        const chatroomObj = new Chatroom(chatroom.name);
        // Join the chatroom automatically without a username
        chatroomObj.join(currentUser);
        activeChatroom = chatroomObj;
      });
      renderUI();
      setupEventListeners();
    })
    .catch(error => console.error('Error initializing chat application:', error));
}

// Connect to server and retrieve chatrooms
function connectToServer() {
  return fetch(SERVER_URL + "/chatrooms")
    .then(response => response.json())
    .then(data => data.chatrooms)
    .catch(error => console.error('Error connecting to server:', error));
}

// Render the UI
function renderUI() {
  // Clear existing UI elements
  const chatContainer = document.getElementById('chat-container');
  while (chatContainer.firstChild) {
    chatContainer.removeChild(chatContainer.firstChild);
  }

  // Render chatrooms
  const chatroomList = document.createElement('ul');
  chatroomList.id = 'chatroom-list';
  chatroomList.innerHTML = 'Chatrooms:';
  chatContainer.appendChild(chatroomList);

  activeChatrooms.forEach(chatroom => {
    const chatroomItem = document.createElement('li');
    chatroomItem.innerText = chatroom.name;
    chatroomList.appendChild(chatroomItem);
  });

  // Render chat messages
  const messageContainer = document.createElement('div');
  messageContainer.id = 'message-container';
  chatContainer.appendChild(messageContainer);

  chatMessages.forEach(message => {
    const messageItem = document.createElement('div');
    messageItem.innerHTML = `<span>${message.username}: </span><span>${message.message}</span>`;
    messageContainer.appendChild(messageItem);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Join Chatroom button
  const joinButton = document.getElementById('join-button');
  joinButton.addEventListener('click', joinChatroom);

  // Send Message button
  const sendButton = document.getElementById('send-button');
  sendButton.addEventListener('click', sendMessage);
}

// Join a chatroom
function joinChatroom() {
  const input = document.getElementById('chatroom-input');
  const chatroomName = input.value;
  if (chatroomName) {
    const newChatroom = new Chatroom(chatroomName);
    activeChatrooms.push(newChatroom);
    activeChatroom = newChatroom;
    currentUser.joinChatroom(newChatroom);

    // Clear input field
    input.value = "";

    renderUI();
  }
}

// Send a message in the active chatroom
function sendMessage() {
  const input = document.getElementById('message-input');
  const message = input.value;
  if (message) {
    activeChatroom.sendMessage(message);

    // Clear input field
    input.value = "";
  }
}

// Login and initialize the chat application
function login() {
  const input = document.getElementById('username-input');
  const username = input.value;
  if (username) {
    currentUser = new User(username);
    initialize();
  }
}

// Entry point
login();