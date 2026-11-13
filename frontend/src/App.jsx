//remeber data that can change (messages)
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
  
  //store messages in the chat (replaces this: document.querySelector("#otherMsg").innerHTML = data)
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

  //testing purposes
  console.log(messages)
  console.log('Socket connected:', socket.connected)
  
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
  <div className="chat-container">
    <Header />
    <ChatMessages messages={messages} />
    <MessageInput sendMessage={sendMessage} />
  </div>
)
}
//availale to other files
export default App
