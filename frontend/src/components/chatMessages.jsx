
 //passing the messages list from App.jsx
function ChatMessages({ messages }) {
  return (
    <main>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.sender}`}
        >

          {/* shows display name above message */}
          <strong className="display-name">
            {message.displayName}
          </strong>

          {/* shows message text */}
          <p>{message.text}</p>

        </div>
      ))}
    </main>
  )
}

export default ChatMessages
