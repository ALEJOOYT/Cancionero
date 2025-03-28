import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

// Determine if we're in a web or native environment
const isWeb = Platform.OS === 'web';

// Import components based on platform
let View, Text, Modal, TouchableOpacity, StyleSheet;
if (!isWeb) {
  // React Native imports
  const ReactNative = require('react-native');
  View = ReactNative.View;
  Text = ReactNative.Text;
  Modal = ReactNative.Modal;
  TouchableOpacity = ReactNative.TouchableOpacity;
  StyleSheet = ReactNative.StyleSheet;
}

const Dialog = ({ children, open: propOpen, onOpenChange }) => {
  // Internal state for open status if not controlled externally
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Determine if using internal or external state
  const isControlled = propOpen !== undefined;
  const open = isControlled ? propOpen : internalOpen;
  
  // Safe onOpenChange handler with fallback
  const handleOpenChange = (newValue) => {
    if (onOpenChange) {
      onOpenChange(newValue);
    } else if (!isControlled) {
      setInternalOpen(newValue);
    }
  };

  // Web implementation
  if (isWeb) {
    return (
      <div className="dialog-wrapper">
        {open && (
          <div className="dialog-overlay" onClick={() => handleOpenChange(false)}>
            <div className="dialog-container">
              <div className="dialog" onClick={(e) => e.stopPropagation()}>
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // React Native implementation
  return (
    <Modal
      transparent={true}
      visible={open}
      animationType="fade"
      onRequestClose={() => handleOpenChange(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => handleOpenChange(false)}
      >
        <View style={styles.dialogContainer}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.dialog}>{children}</View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const DialogTrigger = ({ children, onPress, onClick, asChild }) => {
  // Determine the right event handler based on platform and provided props
  const handleEvent = (e) => {
    if (isWeb) {
      // On web, prefer onClick if provided, otherwise use onPress
      if (onClick) {
        onClick(e);
      } else if (onPress) {
        onPress(e);
      }
    } else {
      // On React Native, use onPress
      if (onPress) {
        onPress(e);
      }
    }
  };

  // Handle custom child components
  if (isWeb) {
    if (asChild && React.isValidElement(children)) {
      // Clone child element and add onClick handler
      return React.cloneElement(children, {
        onClick: (e) => {
          // Preserve existing onClick if it exists
          if (children.props.onClick) {
            children.props.onClick(e);
          }
          handleEvent(e);
        }
      });
    }
    
    // Regular web button if not using asChild
    return (
      <div 
        className="dialog-trigger" 
        onClick={handleEvent}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>
    );
  }
  
  // React Native implementation
  return (
    <TouchableOpacity onPress={handleEvent}>
      {children}
    </TouchableOpacity>
  );
};

const DialogContent = ({ children, className, ...props }) => {
  if (isWeb) {
    return <div className={`dialog-content ${className || ''}`} {...props}>{children}</div>;
  }
  return <View style={styles.content}>{children}</View>;
};

const DialogHeader = ({ children, className, ...props }) => {
  if (isWeb) {
    return <div className={`dialog-header ${className || ''}`} {...props}>{children}</div>;
  }
  return <View style={styles.header}>{children}</View>;
};

const DialogTitle = ({ children, className, ...props }) => {
  if (isWeb) {
    return <h2 className={`dialog-title ${className || ''}`} {...props}>{children}</h2>;
  }
  return <Text style={styles.title}>{children}</Text>;
};

// React Native styles
const styles = !isWeb ? StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '80%',
    maxWidth: 500,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}) : null;

// Add CSS styles for web
if (isWeb) {
  // Add global CSS styles for dialog components
  const style = document.createElement('style');
  style.textContent = `
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .dialog-container {
      width: 80%;
      max-width: 500px;
    }
    
    .dialog {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
    }
    
    .dialog-content {
      padding: 16px;
    }
    
    .dialog-header {
      padding: 16px;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .dialog-title {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
    }
  `;
  
  // Check if we're in a browser environment
  if (typeof document !== 'undefined') {
    document.head.appendChild(style);
  }
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
};

