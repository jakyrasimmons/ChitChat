import { useState } from "react";
import "./App.css";

function App() {
  // Stores all messages
  const [messages, setMessages] = useState([]);

  // Stores what is currently typed in the input
  const [input, setInput] = useState("");

  // Keeps track of which user is sending
  const [currentUser, setCurrentUser] = useState("User 1");

  // Sends a message
  function sendMessage() {
    if (input.trim() === "") {
      return;
    }

    const newMessage = {
      user: currentUser,
      text: input,
    };

    setMessages([...messages, newMessage]);

    // Clears the input after sending
    setInput("");
  }

  // Switches between User 1 and User 2
  function switchUser() {
    if (currentUser === "User 1") {
      setCurrentUser("User 2");
    } else {
      setCurrentUser("User 1");
    }
  }

  return (
    <div className="chat-container">
      <h1>ChitChat</h1>

      <p>Currently chatting as: {currentUser}</p>

      <button onClick={switchUser}>
        Switch User
      </button>

      <div className="message-box">
        {messages.map((message, index) => (
          <p key={index}>
            <strong>{message.user}:</strong> {message.text}
          </p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a message..."
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

export default App;