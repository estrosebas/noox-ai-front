import React, { useState } from 'react';
import { Settings, Menu, Plus, Pencil, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const Sidebar: React.FC = () => {
  const { 
    chats, 
    currentChatId, 
    deleteChat, 
    setCurrentChat, 
    toggleSettings, 
    isSidebarOpen,
    addChat,
    updateChatTitle
  } = useStore();

  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleNewChat = () => {
    const initialMessage = { 
      id: '0', 
      content: 'Hello! I am Noox AI. How can I assist you today?', 
      role: 'assistant' as const, 
      loading: false 
    };
    addChat([initialMessage]);
  };

  const startEditing = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const saveTitle = () => {
    if (editingChatId && editingTitle.trim()) {
      updateChatTitle(editingChatId, editingTitle.trim());
      setEditingChatId(null);
      setEditingTitle('');
    }
  };

  return (
    <motion.div 
      className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
      initial={false}
      animate={{
        x: isSidebarOpen ? 0 : '-100%',
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      }}
    >
      <div className="sidebar-header">
        <motion.button 
          className="icon-button" 
          onClick={() => useStore.getState().toggleSidebar()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="icon" />
        </motion.button>
        <motion.button 
          className="new-chat-button" 
          onClick={handleNewChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="icon" />
          New Chat
        </motion.button>
        <motion.button 
          className="icon-button" 
          onClick={toggleSettings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="icon rotating" />
        </motion.button>
      </div>
      
      <div className="chats-list">
        <AnimatePresence>
          {chats.map((chat) => (
            <motion.div 
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              whileHover={{ scale: 1.02 }}
              className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
              onClick={() => setCurrentChat(chat.id)}
            >
              {editingChatId === chat.id ? (
                <div className="edit-title-container" onClick={(e) => e.stopPropagation()}>
                  <motion.input
                    initial={{ width: '100%' }}
                    animate={{ width: '100%' }}
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="edit-title-input"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveTitle();
                      }
                    }}
                  />
                  <motion.button 
                    className="edit-button"
                    onClick={saveTitle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Check className="icon" />
                  </motion.button>
                </div>
              ) : (
                <>
                  <span className="chat-title">{chat.title}</span>
                  <motion.div 
                    className="chat-actions"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.button 
                      className="edit-button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(chat.id, chat.title);
                      }}
                    >
                      <Pencil className="icon" />
                    </motion.button>
                    <motion.button 
                      className="delete-button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                    >
                      <Trash2 className="icon" />
                    </motion.button>
                  </motion.div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;