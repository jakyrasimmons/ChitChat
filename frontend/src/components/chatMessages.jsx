//passing the messgaes list from App.jsx
function ChatMessages({ messages }) {
  return (
    <main>
      {messages.map((message, index) => (
        <p key={index} className={message.sender}>{message.text}</p>
      ))}
    </main>
  )
}

export default ChatMessages
