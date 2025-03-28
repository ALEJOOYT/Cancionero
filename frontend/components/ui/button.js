import React from 'react';
import { Platform } from 'react-native';

/**
 * Button component for user interactions that works on both web and React Native
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Button style variant (default, outline, ghost, link)
 * @param {string} [props.size='default'] - Button size (small, default, large)
 * @param {function} props.onPress - Function to call when button is pressed (React Native)
 * @param {function} props.onClick - Function to call when button is clicked (Web)
 * @param {React.ReactNode} props.children - Button content
 * @param {Object} [props.style] - Additional styles for the button (React Native)
 * @param {string} [props.className] - Additional CSS classes for the button (Web)
 */

// Detect if we're running in a web environment
const isWeb = Platform.OS === 'web';

let ButtonComponent;

if (isWeb) {
  // Web implementation
  ButtonComponent = ({ 
    variant = 'default',
    size = 'default',
    onClick,
    onPress, // For compatibility
    children,
    className = '',
    disabled = false,
    ...props
  }) => {
    const variantClasses = {
      default: 'bg-slate-900 text-white border border-slate-900 hover:bg-slate-800',
      outline: 'bg-transparent text-slate-900 border border-slate-900 hover:bg-slate-100',
      ghost: 'bg-transparent text-slate-900 hover:bg-slate-100',
      link: 'bg-transparent text-slate-900 underline hover:text-slate-700',
    };

    const sizeClasses = {
      small: 'py-2 px-3 text-sm',
      default: 'py-2.5 px-4 text-base',
      large: 'py-3 px-5 text-lg',
    };

    const baseClasses = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2';
    const disabledClasses = 'bg-slate-300 border-slate-300 text-slate-500 opacity-50 cursor-not-allowed';

    const buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant] || variantClasses.default}
      ${sizeClasses[size] || sizeClasses.default}
      ${disabled ? disabledClasses : ''}
      ${className}
    `;

    // Use the provided onClick or onPress for compatibility
    const handleClick = onClick || onPress;

    return (
      <button 
        className={buttonClasses}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  };
} else {
  // React Native implementation
  const { Pressable, Text, StyleSheet } = require('react-native');
  
  ButtonComponent = ({ 
    variant = 'default',
    size = 'default',
    onPress,
    onClick, // For compatibility
    children,
    style,
    disabled = false,
    ...props
  }) => {
    const getVariantStyle = () => {
      switch (variant) {
        case 'outline':
          return styles.outline;
        case 'ghost':
          return styles.ghost;
        case 'link':
          return styles.link;
        default:
          return styles.default;
      }
    };

    const getSizeStyle = () => {
      switch (size) {
        case 'small':
          return styles.small;
        case 'large':
          return styles.large;
        default:
          return styles.medium;
      }
    };

    const getTextStyle = () => {
      switch (variant) {
        case 'outline':
        case 'ghost':
        case 'link':
          return styles.textAlternate;
        default:
          return styles.text;
      }
    };

    // Use the provided onPress or onClick for compatibility
    const handlePress = onPress || onClick;

    return (
      <Pressable
        onPress={handlePress}
        style={({pressed}) => [
          styles.button,
          getVariantStyle(),
          getSizeStyle(),
          pressed && styles.pressed,
          disabled && styles.disabled,
          style
        ]}
        disabled={disabled}
        {...props}
      >
        {typeof children === 'string' ? (
          <Text style={[getTextStyle(), disabled && styles.disabledText]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  };

  const styles = StyleSheet.create({
    button: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    default: {
      backgroundColor: '#0f172a', // slate-900
      borderWidth: 1,
      borderColor: '#0f172a',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#0f172a',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    link: {
      backgroundColor: 'transparent',
    },
    small: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    medium: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    large: {
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    text: {
      color: '#ffffff',
      fontWeight: '500',
      fontSize: 16,
    },
    textAlternate: {
      color: '#0f172a',
      fontWeight: '500',
      fontSize: 16,
    },
    pressed: {
      opacity: 0.7,
    },
    disabled: {
      backgroundColor: '#cbd5e1', // slate-300
      borderColor: '#cbd5e1',
      opacity: 0.5,
    },
    disabledText: {
      color: '#64748b', // slate-500
    },
  });
}

// Add CSS for web
if (isWeb) {
  // This injects the required CSS for web
  const style = document.createElement('style');
  style.textContent = `
    /* Additional button styles that might be needed for web */
    button:focus {
      outline: none;
    }
    button {
      cursor: pointer;
      font-family: inherit;
    }
  `;
  document.head.appendChild(style);
}

const Button = ButtonComponent;

export { Button };

