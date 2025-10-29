import type { ViewStyle, TextStyle } from 'react-native';
import type {
  GooglePlacesAutocompleteResponse,
  GooglePlaceSuggestion,
  GoogleQueryOptions,
} from '../providers/google';
import type {
  OpenStreetMapQueryOptions,
  OpenStreetMapResponse,
  OpenStreetMapResult,
} from '../providers/openstreetmap';
import type {
  HereAutocompleteItem,
  HereAutocompleteResponse,
  HereQueryOptions,
} from '../providers/here';
import type {
  GeoapifyAutocompleteResponse,
  GeoapifyFeature,
  GeoapifyQueryOptions,
} from '../providers/geoapify';
import type {
  LocationIQQueryOptions,
  LocationIQResponse,
  LocationIQSearchResult,
} from '../providers/locationiq';
import type {
  OpenCageQueryOptions,
  OpenCageResponse,
  OpenCageResult,
} from '../providers/opencage';
import type {
  TomTomAutocompleteResponse,
  TomTomQueryOptions,
  TomTomResult,
} from '../providers/tomtom';
import type {
  MapboxQueryOptions,
  MapboxResponse,
  MapboxSuggestion,
} from '../providers/mapbox';

export interface LocationSuggestion<Raw = unknown> {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  raw?: Raw;
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

export type ProviderResultMap = {
  openstreetmap: OpenStreetMapResponse;
  here: HereAutocompleteResponse;
  geoapify: GeoapifyAutocompleteResponse;
  locationiq: LocationIQResponse;
  mapbox: MapboxResponse;
  opencage: OpenCageResponse;
  google: GooglePlacesAutocompleteResponse;
  tomtom: TomTomAutocompleteResponse;
};

export type ProviderItemMap = {
  openstreetmap: OpenStreetMapResult;
  here: HereAutocompleteItem;
  geoapify: GeoapifyFeature;
  locationiq: LocationIQSearchResult;
  mapbox: MapboxSuggestion;
  opencage: OpenCageResult;
  google: GooglePlaceSuggestion;
  tomtom: TomTomResult;
};

export interface ProviderQueryOptionsMap {
  google: GoogleQueryOptions;
  geoapify: GeoapifyQueryOptions;
  locationiq: LocationIQQueryOptions;
  openstreetmap: OpenStreetMapQueryOptions;
  here: HereQueryOptions;
  mapbox: MapboxQueryOptions;
  opencage: OpenCageQueryOptions;
  tomtom: TomTomQueryOptions;
}

export type QueryOptions<P> = P extends keyof ProviderQueryOptionsMap
  ? ProviderQueryOptionsMap[P]
  : Record<string, unknown>;

export interface LocationAutocompleteProps<
  T extends keyof ProviderItemMap | object = keyof ProviderItemMap,
> {
  placeholder?: string;
  onLocationSelect?: (
    location: LocationSuggestion<
      T extends keyof ProviderItemMap ? ProviderItemMap[T] : T
    >
  ) => void;
  onQueryChange?: (query: string) => void;
  onError?: (error: Error) => void;

  fetchSuggestions?: (
    query: string
  ) => Promise<
    LocationSuggestion<
      T extends keyof ProviderItemMap ? ProviderItemMap[T] : T
    >[]
  >;

  provider?: T;
  providerConfig?: ProviderConfig;
  queryOptions?: QueryOptions<T>;
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
