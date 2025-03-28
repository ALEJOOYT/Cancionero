import React from 'react';
import { Platform } from 'react-native';

// Conditionally import components based on platform
const isWeb = Platform.OS === 'web';

// Import React Native components only if not web
const RN = isWeb ? {} : require('react-native');

// Web-specific styles
const webStyles = isWeb ? {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  scrollArea: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    scrollbarWidth: 'thin',
    msOverflowStyle: 'none', /* IE and Edge */
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    }
  },
  contentContainer: {
    minHeight: '100%',
  },
  scrollbar: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    position: 'absolute',
  },
  verticalScrollbar: {
    width: '4px',
    height: '100px',
    right: '2px',
    top: '0',
  },
  horizontalScrollbar: {
    height: '4px',
    width: '100px',
    bottom: '2px',
    left: '0',
  },
} : null;
const ScrollArea = ({ 
  children, 
  style, 
  contentContainerStyle,
  horizontal = false,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  className = '',
  ...props 
}) => {
  // Web version
  if (isWeb) {
    const containerStyle = {
      ...webStyles.container,
      ...(typeof style === 'object' ? style : {})
    };
    
    const scrollStyle = {
      ...webStyles.scrollArea,
      overflowX: horizontal ? 'auto' : 'hidden',
      overflowY: !horizontal ? 'auto' : 'hidden',
      ...(typeof contentContainerStyle === 'object' ? contentContainerStyle : {})
    };
    
    return (
      <div 
        style={containerStyle} 
        className={`scroll-area-container ${className}`}
      >
        <div 
          style={scrollStyle}
          className="scroll-area"
          {...props}
        >
          <div className="scroll-area-content">
            {children}
          </div>
        </div>
      </div>
    );
  }
  
  // React Native version
  return (
    <RN.View style={[styles.container, style]}>
      <RN.ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        {...props}
      >
        {children}
      </RN.ScrollView>
    </RN.View>
  );
};

const ScrollBar = ({ 
  orientation = "vertical", 
  style, 
  className = '',
  ...props 
}) => {
  // Web version
  if (isWeb) {
    const scrollbarStyle = {
      ...webStyles.scrollbar,
      ...(orientation === "horizontal" ? webStyles.horizontalScrollbar : webStyles.verticalScrollbar),
      ...(typeof style === 'object' ? style : {})
    };
    
    return (
      <div 
        style={scrollbarStyle}
        className={`scrollbar ${orientation === "horizontal" ? "horizontal" : "vertical"} ${className}`}
        {...props}
      />
    );
  }
  
  // React Native version
  return (
    <RN.View 
      style={[
        styles.scrollbar, 
        orientation === "horizontal" ? styles.horizontalScrollbar : styles.verticalScrollbar,
        style
      ]}
      {...props}
    />
  );
};

// Only create React Native styles if not on web
const styles = isWeb ? null : RN.StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  contentContainer: {
    flexGrow: 1,
  },
  scrollbar: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    position: 'absolute',
  },
  verticalScrollbar: {
    width: 4,
    height: 100,
    right: 2,
    top: 0,
  },
  horizontalScrollbar: {
    height: 4,
    width: 100,
    bottom: 2,
    left: 0,
  },
});

// Add global styles for web if we're in a web environment
if (isWeb && typeof document !== 'undefined') {
  // Create a style element to add CSS for our scroll components
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .scroll-area::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    .scroll-area::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .scroll-area::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }
    
    .scroll-area::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
    
    .scroll-area {
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    }
  `;
  
  // Check if the style hasn't been added yet
  if (!document.querySelector('style[data-scroll-area-styles]')) {
    styleEl.setAttribute('data-scroll-area-styles', 'true');
    document.head.appendChild(styleEl);
  }
}

export { ScrollArea, ScrollBar };

