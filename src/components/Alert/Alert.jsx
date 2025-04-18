// components/Alert.js
import React, { useEffect, useState } from 'react';

const Alert = ({ message, duration = 3000, bgColor='blue' }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div style={{...styles.alert, backgroundColor: bgColor}}>
      {message}
    </div>
  );
};

const styles = {
  alert: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    transition: 'opacity 0.5s ease-in-out',
    fontWeight: 'bold',
    
  }
};

export default Alert;
