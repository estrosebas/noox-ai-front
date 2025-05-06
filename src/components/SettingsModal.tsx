import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useStore from '../store/useStore';

const themes = [
  {
    name: 'Dark',
    primary: '#1a1a2e',
    secondary: '#16213e',
    background: '#0f0f1a',
    text: '#ffffff'
  },
  {
    name: 'Cyberpunk',
    primary: '#2a0845',
    secondary: '#6441A5',
    background: '#000000',
    text: '#ffffff'
  },
  {
    name: 'Ocean',
    primary: '#1a2a6c',
    secondary: '#2d3436',
    background: '#0c1016',
    text: '#ffffff'
  }
];

const SettingsModal: React.FC = () => {
  const { isSettingsOpen, toggleSettings, theme, setTheme } = useStore();

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="modal-header">
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Settings
              </motion.h2>
              <motion.button 
                className="close-button" 
                onClick={toggleSettings}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="icon" />
              </motion.button>
            </div>
            
            <motion.div 
              className="modal-content"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Theme
              </motion.h3>
              <div className="theme-grid">
                {themes.map((t, index) => (
                  <motion.button
                    key={t.name}
                    className={`theme-button ${theme.name === t.name ? 'active' : ''}`}
                    onClick={() => setTheme(t)}
                    style={{
                      background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;