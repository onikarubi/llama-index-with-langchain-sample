import React, { useState, FC, FormEvent, KeyboardEvent } from 'react';
import axios from 'axios';

const ChatApp: FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      postMessage(newMessage)
      setMessages([...messages, newMessage.trim()]);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const postMessage = async (message: string) => {
    const response = await axios.post('/api', { message });
    console.log(response.data.message);
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
      <div className="flex flex-col space-y-2">
        {messages.map((message, index) => (
          <div key={index} className="self-end text-gray-700 text-lg border rounded-xl p-4 bg-blue-100 max-w-md break-word">
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow border rounded-xl p-2"
          placeholder="Type a message"
          rows={2}
        />
        <button type="submit" className="bg-blue-500 text-white rounded-xl p-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatApp;
