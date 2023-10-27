import React, { useState, FC, FormEvent, KeyboardEvent } from 'react';
import axios from 'axios';

interface MessageType {
  message: string;
  role: 'user' | 'assistant';
}

const ChatApp: FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNewMessage('');
    const sendNewMessage = newMessage.trim();

    if (sendNewMessage && !isSubmitting) {
      setIsSubmitting(true);
      const sentMessage: MessageType = { message: sendNewMessage, role: 'user' };
      setMessages(prevMessages => [...prevMessages, sentMessage]);  // Update the state immediately with the user's message

      try {
        const res = await postMessage(sendNewMessage);
        if (res) {
          const receivedMessage: MessageType = { message: res, role: 'assistant' };
          setMessages(prevMessages => [...prevMessages, receivedMessage]);  // Update the state again with the assistant's message
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const postMessage = async (message: string): Promise<string> => {
    try {
      // await delay(3000)
      const response = await axios.post('/api', { message });
      return response.data.message;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.response?.data?.error || 'Failed to post message');
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4" style={{ width: '500px' }}>
      <div className="flex flex-col space-y-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`
              self-${message.role === 'user' ? 'start' : 'end'}
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
