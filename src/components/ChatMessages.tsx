import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types/chatTypes';
import LoadingDots from './LoadingDots';

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="chat-messages">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`message-container ${message.role}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div 
              className={`message-bubble ${message.role}`}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {message.loading ? (
                <LoadingDots />
              ) : (
                <motion.div 
                  className="message-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.content}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;