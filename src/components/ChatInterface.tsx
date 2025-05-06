import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import { Message } from '../types/chatTypes';
import { createChat, getResponse } from '../services/api';
import { Brain, Menu } from 'lucide-react';
import useStore from '../store/useStore';

const ChatInterface: React.FC = () => {
  const { toggleSidebar, currentChatId, chats, addChat, updateChat } = useStore();
  const currentChat = chats.find(chat => chat.id === currentChatId);
  
  const [messages, setMessages] = useState<Message[]>(
    currentChat?.messages || [
      { id: '0', content: 'Hello! I am Noox AI. How can I assist you today?', role: 'assistant', loading: false }
    ]
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages);
    } else {
      setMessages([
        { id: '0', content: 'Hello! I am Noox AI. How can I assist you today?', role: 'assistant', loading: false }
      ]);
    }
  }, [currentChatId, currentChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim() || isProcessing) return;

    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      content: prompt,
      role: 'user',
      loading: false
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    const assistantMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      loading: true
    };
    
    const updatedMessages = [...newMessages, loadingMessage];
    setMessages(updatedMessages);
    setIsProcessing(true);

    try {
      const chatData = await createChat(prompt);
      await new Promise(resolve => setTimeout(resolve, 8000));
      const responseData = await getResponse(chatData.chatId);
      
      const finalMessages = updatedMessages.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: responseData.raw, loading: false } 
          : msg
      );
      
      setMessages(finalMessages);
      
      if (!currentChatId) {
        addChat(finalMessages);
      } else {
        updateChat(currentChatId, finalMessages);
      }
    } catch (error) {
      const errorMessages = updatedMessages.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: 'Sorry, I encountered an error processing your request.', loading: false } 
          : msg
      );
      
      setMessages(errorMessages);
      
      if (!currentChatId) {
        addChat(errorMessages);
      } else {
        updateChat(currentChatId, errorMessages);
      }
      
      console.error('Error in chat flow:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      className="chat-interface"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="chat-header"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.button 
          className="icon-button mobile-menu" 
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="icon" />
        </motion.button>
        <motion.h1 
          className="chat-title"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Brain className="icon rotating" />
          <span>Noox AI</span>
        </motion.h1>
      </motion.div>
      
      <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
      
      <motion.div 
        className="chat-input-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ChatInput onSendMessage={handleSendMessage} isDisabled={isProcessing} />
      </motion.div>
    </motion.div>
  );
};

export default ChatInterface;