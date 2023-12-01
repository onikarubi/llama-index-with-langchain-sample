import React, { useState, FC, FormEvent, KeyboardEvent, useEffect } from 'react';
import axios from 'axios';
interface MessageType {
  message: string;
  role: 'user' | 'assistant';
}

const ChatApp: FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessages(prevMessages => [...prevMessages, { message: newMessage, role: 'user' }]);
    await postMessage(newMessage);
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const postMessage = async (message: string) => {
    try {
      const response = await fetch('http://localhost:8000/stream_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ content: message })
      });

      if (response.body) {
        const reader = response.body.getReader();
        let finalContent = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const textChunk = new TextDecoder().decode(value);
          finalContent += textChunk;

          setMessages(prevMessages => {
            const updatedMessages = prevMessages.length > 0 && prevMessages[prevMessages.length - 1].role === 'assistant'
              ? prevMessages.slice(0, -1)
              : [...prevMessages];
            return [...updatedMessages, { message: finalContent, role: 'assistant' }];
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to post message');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4" style={{ width: '500px' }}>
      <div className="flex flex-col space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`
              ${message.role === 'assistant' && 'ml-auto'}
              rounded-xl
              p-4
              ${message.role === 'user' ? 'bg-green-200' : 'bg-blue-200'}
              w-72
              break-word
            `}
          >
            {message.message.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < message.message.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
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
          disabled={isSubmitting}
          style={{ resize: 'none', overflowY: 'auto' }}  // Prevents textarea from being resized
        />
        <button type="submit" className="bg-blue-500 text-white rounded-xl p-2" disabled={isSubmitting}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatApp;
