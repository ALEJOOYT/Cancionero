import React from 'react';
import { Platform } from 'react-native';

// Determine if we're in a web or native environment
const isWeb = Platform.OS === 'web';

// Import components based on platform
let View, Text, StyleSheet;
if (!isWeb) {
  // React Native imports
  const ReactNative = require('react-native');
  View = ReactNative.View;
  Text = ReactNative.Text;
  StyleSheet = ReactNative.StyleSheet;
}

const Card = ({ style, className, children, ...props }) => {
  if (isWeb) {
    return (
      <div className={`card ${className || ''}`} {...props}>
        {children}
      </div>
    );
  }
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const CardHeader = ({ style, className, children, ...props }) => {
  if (isWeb) {
    return (
      <div className={`card-header ${className || ''}`} {...props}>
        {children}
      </div>
    );
  }
  return (
    <View style={[styles.cardHeader, style]} {...props}>
      {children}
    </View>
  );
};

const CardTitle = ({ style, className, children, ...props }) => {
  if (isWeb) {
    return (
      <h3 className={`card-title ${className || ''}`} {...props}>
        {children}
      </h3>
    );
  }
  return (
    <Text style={[styles.cardTitle, style]} {...props}>
      {children}
    </Text>
  );
};

const CardDescription = ({ style, className, children, ...props }) => {
  if (isWeb) {
    return (
      <p className={`card-description ${className || ''}`} {...props}>
        {children}
      </p>
    );
  }
  return (
    <Text style={[styles.cardDescription, style]} {...props}>
      {children}
    </Text>
  );
};

const CardContent = ({ style, className, children, ...props }) => {
  if (isWeb) {
    return (
      <div className={`card-content ${className || ''}`} {...props}>
        {children}
      </div>
    );
  }
  return (
    <View style={[styles.cardContent, style]} {...props}>
      {children}
    </View>
  );
};

const CardFooter = ({ style, className, children, ...props }) => {
  if (isWeb) {
    return (
      <div className={`card-footer ${className || ''}`} {...props}>
        {children}
      </div>
    );
  }
  return (
    <View style={[styles.cardFooter, style]} {...props}>
      {children}
    </View>
  );
};

// React Native styles
const styles = !isWeb ? StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}) : null;

// Add CSS styles for web
if (isWeb) {
  // Add global CSS styles for card components
  const style = document.createElement('style');
  style.textContent = `
    .card {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin: 10px;
      overflow: hidden;
      border: 1px solid #f0f0f0;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: box-shadow 0.3s ease, transform 0.2s ease;
    }
    
    .card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
    
    .card-header {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .card-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 0;
    }
    
    .card-description {
      font-size: 14px;
      color: #666;
      margin-top: 4px;
      margin-bottom: 0;
    }
    
    .card-content {
      padding: 16px;
    }
    
    .card-footer {
      padding: 16px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: flex-end;
    }
  `;
  
  // Check if we're in a browser environment
  if (typeof document !== 'undefined') {
    document.head.appendChild(style);
  }
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
