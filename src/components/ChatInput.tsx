import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDisabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="chat-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Noox AI anything..."
        disabled={isDisabled}
        className="chat-input"
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <motion.button
        type="submit"
        disabled={isDisabled || !message.trim()}
        className="send-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Send size={20} />
      </motion.button>
    </motion.form>
  );
};

export default ChatInput;