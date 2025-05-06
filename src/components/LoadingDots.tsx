import React from 'react';
import { motion } from 'framer-motion';

const LoadingDots: React.FC = () => {
  return (
    <div className="loading-dots">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="dot"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default LoadingDots;