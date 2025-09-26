// Mock react-native-svg for testing
import React from 'react';

// Mock Svg component
export const Svg = ({ children, ...props }) => {
  return React.createElement(
    'View',
    { testID: 'mock-svg', ...props },
    children
  );
};

// Mock Path component
export const Path = (props) => {
  return React.createElement('View', { testID: 'mock-path', ...props });
};

// Mock Circle component
export const Circle = (props) => {
  return React.createElement('View', { testID: 'mock-circle', ...props });
};

// Default export
export default Svg;
