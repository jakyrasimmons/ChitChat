
 //remember data that can change (messages)
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

  //store messages in the chat
  const [messages, setMessages] = useState([])

  //store user's display name
  const [displayName, setDisplayName] = useState('')

  //stores name typed in textbox
  const [nameInput, setNameInput] = useState('')

  //testing purposes
  console.log(messages)
  console.log('Socket connected:', socket.connected)
  
  //alistens for messages from the server
  useEffect(() => {
    const handleMessage = (data) => {

      //add new messages to end of list
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          text: data.text,
          displayName: data.displayName,
          sender: 'other'
        }
      ])
    }

    socket.on('message', handleMessage)

    return () => {
      socket.off('message', handleMessage)
    }
  }, [])

  //save display name
  const saveDisplayName = () => {
    if (!nameInput.trim()) return

    setDisplayName(nameInput.trim())
  }

  //send message with display name
  const sendMessage = (message) => {

    const newMessage = {
      text: message,
      displayName: displayName
    }

    socket.emit('message', newMessage)

    //add sent message to chat
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        ...newMessage,
        sender: 'self'
      }
    ])
  }

  //whats displayed on the page (components)
  return (
  <div className="chat-container">
    <Header />
    <ChatMessages messages={messages} />
    <MessageInput sendMessage={sendMessage} />
  </div>
)
}

//available to other files
export default App
