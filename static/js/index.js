let currentConversationId = null;

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const newChatBtn = document.getElementById("new-chat-btn");
const chatLoader = document.getElementById("chat-loader");
const historyToggle = document.getElementById("history-toggle");
const chatHistoryList = document.getElementById("chat-history-list");

// Helper: highlight active chat
function highlightActiveChat() {
  Array.from(chatHistoryList.children).forEach((li) => {
    if (li.dataset.id === currentConversationId) {
      li.classList.add("active-chat");
    } else {
      li.classList.remove("active-chat");
    }
  });
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = userInput.value.trim();
  if (!msg) return;

  appendMessage(msg, "user");
  userInput.value = "";

  chatLoader.style.display = "block";

  const botResult = await callBotAPI(msg);

  chatLoader.style.display = "none";

  appendMessage(botResult.reply, "bot", botResult.think);

  // Optionally, scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
});

// "New chat" button
newChatBtn.addEventListener("click", async () => {
  const res = await fetch("/new_chat", { method: "POST" });
  const data = await res.json();
  currentConversationId = data.conversation_id;
  chatBox.innerHTML = "";
  userInput.value = "";
  userInput.focus();
  await loadSidebarHistory();
  highlightActiveChat();
});

// Append message to chat
function appendMessage(text, sender, think = null) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `${sender} message animate-in`;

  if (sender === "bot") {
    // Render Markdown for bot replies
    msgDiv.innerHTML = marked.parse(text);
  } else {
    msgDiv.textContent = text;
  }

  if (think) {
    const details = document.createElement("details");
    details.className = "think-toggle";
    const summary = document.createElement("summary");
    summary.textContent = "🤔 Show SafeBot's reasoning";
    summary.className = "think-summary";
    const thinkText = document.createElement("div");
    thinkText.textContent = think;
    thinkText.className = "think-content";
    details.appendChild(summary);
    details.appendChild(thinkText);
    msgDiv.appendChild(details);
  }

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    msgDiv.classList.remove("animate-in");
  }, 400);
}

// Call bot API, always uses current conversation
async function callBotAPI(message) {
  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (data.think) {
      return {
        reply: data.reply || "Something went wrong!",
        think: data.think,
      };
    }
    return { reply: data.reply || "Something went wrong!" };
  } catch {
    return { reply: "Something went wrong!" };
  }
}

// Load all chat-boxes (conversations) in sidebar
async function loadSidebarHistory() {
  const res = await fetch("/all_histories");
  const histories = await res.json();
  chatHistoryList.innerHTML = "";
  histories.forEach((conv, idx) => {
    const li = document.createElement("li");
    li.textContent = conv.preview || `Conversation ${idx + 1}`;
    li.title = conv.preview;
    li.dataset.id = conv.id;
    if (conv.id === currentConversationId) li.classList.add("active-chat");
    li.onclick = async () => {
      currentConversationId = conv.id;
      await fetch("/set_conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conv.id }),
      });
      // Load messages for this conversation
      const res = await fetch(`/history?conversation_id=${conv.id}`);
      const messages = await res.json();
      chatBox.innerHTML = "";
      messages.forEach((msg) => appendMessage(msg.message, msg.sender));
      highlightActiveChat();
    };
    chatHistoryList.appendChild(li);
  });
  highlightActiveChat();
}

// Load sidebar history when toggled open
historyToggle.addEventListener("toggle", () => {
  if (historyToggle.open) loadSidebarHistory();
});

// On page load: get current conversation and load its messages
window.addEventListener("DOMContentLoaded", async () => {
  // Get current conversation id (from server session)
  const res = await fetch("/history");
  const history = await res.json();
  // Try to get the conversation id from the first message, fallback to null
  if (history.length > 0 && history[0].conversation_id) {
    currentConversationId = history[0].conversation_id;
  }
  chatBox.innerHTML = "";
  history.forEach((msg) => appendMessage(msg.message, msg.sender));
  await loadSidebarHistory();
  highlightActiveChat();
});
