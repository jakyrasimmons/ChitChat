
 //remember data that can change (messages)
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

//imports functions from their components
import Header from './components/header'
import ChatMessages from './components/chatMessages'
import MessageInput from './components/messageInput'
import './App.css'

//imports npm cookies lib
import Cookies from "js-cookie";

//from jesus's index.html
const socket = io('http://localhost:8080', {withCredentials: true})

//DATETIME
const dt = new Date();
console.log(dt.toLocaleString());
console.log(timeStamp(dt));
function timeStamp(dateObj) {
    return `${dateObj.getFullYear()}${dateObj.getMonth()+1}${dateObj.getDate()}${dateObj.getHours()}${dateObj.getMinutes()}${dateObj.getSeconds()}`
}
//DATETIME

//holds app interface
function App() {

  //store messages in the chat
  const [messages, setMessages] = useState([])

  if (Cookies.get('birth') === undefined) {
    const currentTime = timeStamp(dt);
    Cookies.set('birth', currentTime, { 
        expires: 7, 
        secure: true, 
        sameSite: 'strict' 
      });
    console.log(`New cookie set for client.`);
  }
  else {
    console.log(`Cookie already exists for client.`);
  }

  //store user's display name
  const [displayName, setDisplayName] = useState('')

  //stores name typed in textbox
  const [nameInput, setNameInput] = useState('')

  socket.on('returning_user', (name) => {
    console.log("A name matches client's cookie!");
    setDisplayName(name.username);
  });

  //testing purposes
  console.log(messages)
  console.log('Socket connected:', socket.connected)
  
  //listens for messages from the server
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
    socket.emit('name_to_try', nameInput.trim());
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

  //screen that users see when joining the chat
  if (!displayName) {
    return (
      <div className="name-setup">
        <h2>Welcome to ChitChat!</h2>

        {/* asks for a name and sets nameInput variable to it*/}
        <input
          type="text"
          placeholder="Enter your display name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              saveDisplayName()
            }
          }}
        />

        {/* when user clicks "join chat" button it saves the displayname*/}
        <button onClick={saveDisplayName}>
          Join Chat
        </button>
      </div>
    )
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
