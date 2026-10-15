//remeber data that can change (messages)
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

//imports functions from their components
import Header from './components/header'
import ChatMessages from './components/chatMessages'
import MessageInput from './components/messageInput'
import './App.css'

//from jesus's index.html
const socket = io('http://localhost:8080')

//holds app interface
function App() {
  
  //store messages in the chat (replaces this: document.querySelector("#otherMsg").innerHTML = data)
  const [messages, setMessages] = useState([])
  
  //testing purposes
  console.log(messages)

  //alistens for messages from the server
  useEffect(() => {
  socket.on('message', (data) => {
    //add new messages (data) to end of the list (sender: 'other' distinguishes between sender and receiver on computer)
    setMessages((previousMessages) => [
    ...previousMessages,
    { text: data, sender: 'other' }
    ])
  })

  return () => {
    socket.off('message')
  }
  }, [])

  //replaces this: socket.emit('message', message)
  const sendMessage = (message) => {
    socket.emit('message', message)

    //add new messages (message) to end of the list (sender: 'self' distinguishes between sender and receiver on computer)
    setMessages((previousMessages) => [
    ...previousMessages,
    { text: message, sender: 'self' }
    ])
  }

  //whats displayed on the page (components)
  return (
    <div>
      {/* displays header */}
      <Header />

      {/* displays chat messages */}
      <ChatMessages messages={messages} />

      {/* textbox and send button */}
      <MessageInput sendMessage={sendMessage} />
    </div>
  )
}
//availale to other files
export default App
