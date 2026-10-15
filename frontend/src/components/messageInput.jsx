import { useState } from 'react'

function MessageInput( {sendMessage} ) {
  
    //stores whats typed in textbox
    const [message, setMessage] = useState('')

    //if send button is clcked show messgae and clear textbox
    const handleSend = () => {
        sendMessage(message)
        setMessage('')
    }
  
    return (
    <div>
      {/* keeps track of whats being typed */}
      <input type="text" placeholder="Type a message..." value={message} onChange={(event) => setMessage(event.target.value)}/>
      {/* makes send button work */}
      <button onClick={handleSend}>Send</button>
    </div>
  )
}

export default MessageInput