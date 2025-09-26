import type { LocationAutocompleteTheme } from '../types';

export const defaultTheme: LocationAutocompleteTheme = {
  colors: {
    background: '#f8f9fa',
    surface: '#ffffff',
    primary: '#667eea',
    onSurface: '#333333',
    onSurfaceVariant: '#666666',
    outline: '#f0f0f0',
    error: '#856404',
    onError: '#fff3cd',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    // Icon-specific spacing
    iconMargin: 12, // Spacing around icons (search, mapPin, clock)
    iconPadding: 4, // Padding for touchable icon areas (clear button)
    // Loader spacing
    loaderMargin: 8, // Margin for the loading indicator
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 15,
  },
  typography: {
    body: {
      fontSize: 16,
      fontWeight: '500',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
    },
    titleMedium: {
      fontSize: 16,
      fontWeight: '600',
    },
  },
  icons: {
    search: {
      size: 20,
    },
    mapPin: {
      size: 18,
    },
    clock: {
      size: 18,
    },
    clear: {
      size: 18,
    },
  },
};
