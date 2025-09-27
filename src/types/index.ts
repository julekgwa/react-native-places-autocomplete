import type { ViewStyle, TextStyle } from 'react-native';

export interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

export interface LocationAutocompleteRef {
  clear: () => void;
  focus: () => void;
  blur: () => void;
  getQuery: () => string;
  setQuery: (query: string) => void;
}

type FontWeight = TextStyle['fontWeight'];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface LocationAutocompleteTheme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    onSurface: string;
    onSurfaceVariant: string;
    outline: string;
    error: string;
    onError: string;
    shadow: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    // Icon-specific spacing
    iconMargin: number; // Spacing around icons (search, mapPin, clock)
    iconPadding: number; // Padding for touchable icon areas (clear button)
    // Loader spacing
    loaderMargin: number; // Margin for the loading indicator
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    body: {
      fontSize: number;
      fontWeight: FontWeight;
    };
    bodySmall: {
      fontSize: number;
      fontWeight: FontWeight;
    };
    titleMedium: {
      fontSize: number;
      fontWeight: FontWeight;
    };
  };
  icons: {
    search: {
      size: number;
      color?: string;
    };
    mapPin: {
      size: number;
      color?: string;
    };
    clock: {
      size: number;
      color?: string;
    };
    clear: {
      size: number;
      color?: string;
    };
  };
}

export type LocationProvider =
  | 'openstreetmap'
  | 'mapbox'
  | 'google'
  | 'geoapify'
  | 'locationiq'
  | 'here'
  | 'tomtom'
  | 'opencage';

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface QueryOptions {
  [key: string]: string | number | boolean;
}

export interface LocationAutocompleteProps {
  placeholder?: string;
  onLocationSelect?: (location: LocationSuggestion) => void;
  onQueryChange?: (query: string) => void;
  fetchSuggestions?: (query: string) => Promise<LocationSuggestion[]>;
  provider?: LocationProvider;
  providerConfig?: ProviderConfig;
  queryOptions?: QueryOptions;
  debounceMs?: number;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  suggestionStyle?: ViewStyle;
  textStyle?: TextStyle;
  showRecentSearches?: boolean;
  recentSearches?: string[];
  onRecentSearchesChange?: (searches: string[]) => void;
  maxRecentSearches?: number;
  attribution?: React.ComponentType | React.ReactElement | null;
  theme?: DeepPartial<LocationAutocompleteTheme>;
  ref?: React.RefObject<LocationAutocompleteRef>;
}
