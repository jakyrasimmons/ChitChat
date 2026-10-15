import { useState } from 'react'

function MessageInput( {sendMessage} ) {
  
    //stores whats typed in textbox
    const [message, setMessage] = useState('')

    //if send button is clcked show messgae and clear textbox
    const handleSend = () => {
      if (!message.trim()) return;
        sendMessage(message);
        setMessage('');
    };

    const handleKeyDown = (e) => {

      if (e.key === 'Enter') {
        handleSend();
      }
    };
  
    return (
    <div>
      {/* keeps track of whats being typed */}
      <input 
        type="text" 
        placeholder="Type a message..." 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        onKeyDown={handleKeyDown}
      />
      {/* makes send button work */}
      <button onClick={handleSend} disabled={!message.trim()}>Send</button>
    </div>
  );
}

export default MessageInput