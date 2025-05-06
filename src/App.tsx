import React from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import useStore from './store/useStore';

function App() {
  const { theme } = useStore();

  return (
    <div 
      className="app-container"
      style={{
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.background} 100%)`
      }}
    >
      <Sidebar />
      <div className="chat-window">
        <ChatInterface />
      </div>
      <SettingsModal />
    </div>
  );
}

export default App;