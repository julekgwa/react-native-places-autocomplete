import type { ViewStyle, TextStyle } from 'react-native';

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

export interface QueryOptions {
  [key: string]: string | number | boolean;
}

// TomTom Search API types
export interface TomTomAutocompleteResponse {
  summary: {
    query: string;
    queryType: string;
    queryTime: number;
    numResults: number;
    offset: number;
    totalResults: number;
    fuzzyLevel: number;
    queryIntent: unknown[];
  };
  results: TomTomResult[];
}

export interface TomTomResult {
  type: string; // e.g., "Geography", "POI", "Street"
  id: string;
  score: number;
  entityType?: string;
  info?: string;
  poi?: TomTomPOI;
  address: TomTomAddress;
  position: TomTomPosition;
  viewport?: TomTomViewport;
  boundingBox?: TomTomBoundingBox;
  entryPoints?: TomTomEntryPoint[];
  dataSources?: {
    geometry?: {
      id: string;
    };
  };
}

export interface TomTomPOI {
  name: string;
  categorySet?: { id: number }[];
  categories?: string[];
  classifications?: {
    code: string;
    names: {
      nameLocale: string;
      name: string;
    }[];
  }[];
}

export interface TomTomAddress {
  streetNumber?: string;
  streetName?: string;
  municipality?: string;
  municipalitySubdivision?: string;
  neighbourhood?: string;
  countrySecondarySubdivision?: string;
  countrySubdivision?: string;
  countrySubdivisionName?: string;
  countrySubdivisionCode?: string;
  postalCode?: string;
  extendedPostalCode?: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  localName?: string;
}

export interface TomTomPosition {
  lat: number;
  lon: number;
}

export interface TomTomViewport {
  topLeftPoint: TomTomPosition;
  btmRightPoint: TomTomPosition;
}

export interface TomTomBoundingBox {
  topLeftPoint: TomTomPosition;
  btmRightPoint: TomTomPosition;
}

export interface TomTomEntryPoint {
  type: string; // e.g., "main"
  position: TomTomPosition;
}

// Geoapify Autocomplete API types (FeatureCollection)
export interface GeoapifyAutocompleteResponse {
  type: 'FeatureCollection';
  features: GeoapifyFeature[];
  query?: {
    text?: string;
    parsed?: {
      city?: string;
      expected_type?: string;
      [k: string]: unknown;
    };
    categories?: string[];
    [k: string]: unknown;
  };
}

export interface GeoapifyFeature {
  type: 'Feature';
  properties: GeoapifyProperties;
  geometry: GeoapifyGeometry;
  bbox?: [number, number, number, number];
}

export interface GeoapifyProperties {
  datasource?: GeoapifyDatasource;
  // Common addressing fields returned by Geoapify
  country?: string;
  country_code?: string;
  region?: string;
  state?: string;
  state_code?: string;
  county?: string;
  county_code?: string;
  city?: string;
  village?: string;
  municipality?: string;
  suburb?: string;
  neighbourhood?: string;
  postcode?: string;
  iso3166_2?: string;
  iso3166_2_sublevel?: string;
  // Coordinates also appear in properties for convenience
  lon?: number;
  lat?: number;
  // Result descriptors
  name?: string;
  result_type?: string; // e.g., 'city', 'state', 'postcode'
  category?: string; // e.g., 'populated_place', 'administrative'
  formatted?: string; // pre-formatted label
  address_line1?: string;
  address_line2?: string;
  // Plus codes
  plus_code?: string;
  plus_code_short?: string;
  // Timezone info
  timezone?: GeoapifyTimezone;
  // Ranking
  rank?: GeoapifyRank;
  // Identifier
  place_id?: string;
  // Allow additional provider-specific props
  [k: string]: unknown;
}

export interface GeoapifyDatasource {
  sourcename?: string; // 'openstreetmap'
  attribution?: string; // '© OpenStreetMap contributors'
  license?: string; // 'Open Database License'
  url?: string;
  [k: string]: unknown;
}

export interface GeoapifyTimezone {
  name?: string; // e.g., 'Europe/Moscow'
  name_alt?: string;
  offset_STD?: string; // e.g., '+03:00'
  offset_STD_seconds?: number;
  offset_DST?: string;
  offset_DST_seconds?: number;
  abbreviation_STD?: string;
  abbreviation_DST?: string;
  [k: string]: any;
}

export interface GeoapifyRank {
  importance?: number; // 0..1
  confidence?: number; // 0..1
  confidence_city_level?: number;
  match_type?: string; // e.g., 'full_match'
  [k: string]: any;
}

export interface GeoapifyGeometry {
  type: 'Point';
  coordinates: [number, number]; // [lon, lat]
}

// LocationIQ Search API types
export type LocationIQResponse = LocationIQSearchResult[];

export interface LocationIQSearchResult {
  place_id: string; // e.g., "322169966452"
  osm_id?: string; // e.g., "25503669"
  osm_type?: 'node' | 'way' | 'relation' | string;
  licence?: string; // attribution URL
  lat: string; // stringified latitude
  lon: string; // stringified longitude
  boundingbox?: [string, string, string, string]; // [south, north, west, east]
  class?: string; // e.g., 'place', 'amenity', 'leisure', 'tourism'
  type?: string; // e.g., 'city', 'university', 'garden'
  display_name: string;
  display_place?: string;
  display_address?: string;
  address?: LocationIQAddress;
  [k: string]: unknown;
}

export interface LocationIQAddress {
  name?: string;
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  state_district?: string;
  postcode?: string;
  country?: string;
  country_code?: string; // ISO 3166-1 alpha-2 (e.g., 'za')
  [k: string]: unknown;
}

// Mapbox Geocoding API types (FeatureCollection)
export interface MapboxGeocodingResponse {
  type: 'FeatureCollection';
  query: Array<string | number>;
  features: MapboxFeature[];
  attribution?: string;
  [k: string]: unknown;
}

export interface MapboxFeature {
  id: string; // e.g., 'address.7685729342680196'
  type: 'Feature';
  place_type: string[]; // e.g., ['address', 'place', 'locality']
  relevance: number;
  properties: MapboxProperties;
  text: string; // short label, e.g., 'Garden Road' or 'Pretoria'
  place_name: string; // full label
  center: [number, number]; // [lon, lat]
  geometry: MapboxGeometry;
  address?: string; // for address features
  matching_text?: string;
  matching_place_name?: string;
  bbox?: [number, number, number, number];
  context?: MapboxContextItem[];
  [k: string]: unknown;
}

export interface MapboxProperties {
  'accuracy'?: 'point' | 'street' | 'interpolated' | string;
  'override:postcode'?: string;
  'mapbox_id'?: string; // stable identifier
  'wikidata'?: string;
  [k: string]: unknown;
}

export interface MapboxGeometry {
  type: 'Point';
  coordinates: [number, number]; // [lon, lat]
  interpolated?: boolean;
  omitted?: boolean;
  [k: string]: unknown;
}

export interface MapboxContextItem {
  id: string; // e.g., 'region.42238', 'country.8958'
  mapbox_id?: string;
  text: string; // label
  short_code?: string; // e.g., 'ZA-GP' or 'za'
  wikidata?: string;
  [k: string]: unknown;
}

// HERE Autocomplete API types
export interface HereAutocompleteResponse {
  items: HereAutocompleteItem[];
  [k: string]: unknown;
}

export type HereResultType =
  | 'place'
  | 'locality'
  | 'street'
  | 'intersection'
  | 'houseNumber'
  | 'category'
  | 'chain'
  | 'query'
  | string;

export type HereHouseNumberType = 'PA' | 'Interpolated' | string;

export interface HereAutocompleteItem {
  title: string;
  id: string; // e.g., "here:af:streetsection:..."
  language?: string; // e.g., 'en'
  resultType: HereResultType; // e.g., 'houseNumber'
  houseNumberType?: HereHouseNumberType; // e.g., 'PA'
  address?: HereAddress;
  highlights?: HereHighlights;
  [k: string]: unknown;
}

export interface HereAddress {
  label?: string;
  countryCode?: string; // 3-letter, e.g., 'GBR', 'USA'
  countryName?: string; // e.g., 'United Kingdom'
  state?: string; // e.g., 'England'
  stateCode?: string; // e.g., 'NJ'
  countyCode?: string; // e.g., 'ESX'
  county?: string; // e.g., 'East Sussex'
  city?: string; // e.g., 'Eastbourne'
  district?: string; // e.g., 'Eastbourne'
  street?: string; // e.g., 'Garden Road'
  postalCode?: string; // e.g., 'BN20 8HF'
  houseNumber?: string; // e.g., '44'
  [k: string]: unknown;
}

export interface HereHighlights {
  title?: HereHighlightRange[];
  address?: HereAddressHighlights;
  [k: string]: unknown;
}

export type HereAddressHighlights = Partial<
  Record<
    | 'label'
    | 'countryName'
    | 'state'
    | 'county'
    | 'city'
    | 'district'
    | 'street'
    | 'postalCode'
    | 'houseNumber',
    HereHighlightRange[]
  >
> & { [k: string]: unknown };

export interface HereHighlightRange {
  start: number;
  end: number;
}

// OpenCage Geocoding API types
export interface OpenCageGeocodingResponse {
  documentation?: string;
  licenses?: { name: string; url?: string }[];
  rate?: { limit: number; remaining: number; reset: number };
  results: OpenCageResult[];
  status: { code: number; message: string };
  stay_informed?: { blog?: string; mastodon?: string };
  thanks?: string;
  timestamp?: { created_http?: string; created_unix?: number };
  total_results?: number;
  [k: string]: unknown;
}

export interface OpenCageResult {
  annotations?: OpenCageAnnotations;
  bounds?: OpenCageBounds;
  components?: OpenCageComponents;
  confidence?: number; // 0..10 in samples
  formatted?: string;
  geometry: OpenCageGeometry;
  [k: string]: unknown;
}

export interface OpenCageAnnotations {
  DMS?: { lat?: string; lng?: string; [k: string]: unknown };
  MGRS?: string;
  Maidenhead?: string;
  Mercator?: { x?: number; y?: number; [k: string]: unknown };
  OSM?: {
    edit_url?: string;
    note_url?: string;
    url?: string;
    [k: string]: unknown;
  };
  UN_M49?: {
    regions?: Record<string, string>;
    statistical_groupings?: string[];
    [k: string]: unknown;
  };
  callingcode?: number;
  currency?: OpenCageCurrency;
  flag?: string; // emoji flag
  geohash?: string;
  qibla?: number;
  roadinfo?: {
    drive_on?: string;
    road?: string;
    road_type?: string;
    speed_in?: string;
    [k: string]: unknown;
  };
  sun?: {
    rise?: {
      apparent?: number;
      astronomical?: number;
      civil?: number;
      nautical?: number;
      [k: string]: unknown;
    };
    set?: {
      apparent?: number;
      astronomical?: number;
      civil?: number;
      nautical?: number;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  timezone?: {
    name?: string;
    now_in_dst?: 0 | 1 | boolean;
    offset_sec?: number;
    offset_string?: string;
    short_name?: string;
    [k: string]: unknown;
  };
  what3words?: { words?: string; [k: string]: unknown };
  [k: string]: unknown;
}

export interface OpenCageCurrency {
  alternate_symbols?: string[];
  decimal_mark?: string;
  html_entity?: string;
  iso_code?: string;
  iso_numeric?: string | number;
  name?: string;
  smallest_denomination?: number;
  subunit?: string;
  subunit_to_unit?: number;
  symbol?: string;
  symbol_first?: 0 | 1 | boolean;
  thousands_separator?: string;
  [k: string]: unknown;
}

export interface OpenCageBounds {
  northeast?: { lat?: number; lng?: number };
  southwest?: { lat?: number; lng?: number };
}

export interface OpenCageComponents {
  'ISO_3166-1_alpha-2'?: string;
  'ISO_3166-1_alpha-3'?: string;
  'ISO_3166-2'?: string[];
  '_category'?: string; // e.g., 'road', 'place'
  '_normalized_city'?: string;
  '_type'?: string; // e.g., 'road', 'city'
  'continent'?: string;
  'country'?: string;
  'country_code'?: string; // alpha-2
  'county'?: string;
  'local_administrative_area'?: string;
  'state'?: string;
  'state_code'?: string;
  'city'?: string;
  'town'?: string;
  'village'?: string;
  'suburb'?: string;
  'neighbourhood'?: string;
  'postcode'?: string;
  'road'?: string;
  'road_type'?: string;
  [k: string]: unknown;
}

export interface OpenCageGeometry {
  lat: number;
  lng: number;
}

// OpenStreetMap (Nominatim) Search API
export type OpenStreetMapResponse = OpenStreetMapResult[];

export interface OpenStreetMapResult {
  place_id: number | string;
  licence?: string;
  osm_type?: 'node' | 'way' | 'relation' | string;
  osm_id?: number | string;
  lat: string;
  lon: string;
  class?: string;
  type?: string;
  place_rank?: number;
  importance?: number;
  addresstype?: string;
  name?: string;
  display_name: string;
  address?: OpenStreetMapAddress;
  boundingbox?: [string, string, string, string];
  [k: string]: unknown;
}

export interface OpenStreetMapAddress {
  'road'?: string;
  'suburb'?: string;
  'city'?: string;
  'county'?: string;
  'state'?: string;
  'ISO3166-2-lvl4'?: string;
  'postcode'?: string;
  'country'?: string;
  'country_code'?: string;
  [k: string]: unknown;
}

// Google Places Autocomplete API types
export interface GooglePlacesAutocompleteResponse {
  suggestions: GooglePlaceSuggestion[];
  [k: string]: unknown;
}

export interface GooglePlaceSuggestion {
  placePrediction: GooglePlacePrediction;
  [k: string]: unknown;
}

export interface GooglePlacePrediction {
  place?: string; // e.g., "places/ChIJ..."
  placeId?: string; // e.g., "ChIJ..."
  text?: GooglePredictionText; // full display text
  structuredFormat?: GooglePredictionStructuredFormat; // main/secondary split
  types?: string[]; // e.g., ['geocode', 'street_address']
  [k: string]: unknown;
}

export interface GooglePredictionText {
  text: string;
  matches?: GooglePredictionTextMatch[];
}

export interface GooglePredictionStructuredFormat {
  mainText: GooglePredictionText;
  secondaryText?: GooglePredictionText;
}

export interface GooglePredictionTextMatch {
  startOffset?: number;
  endOffset: number;
}

export type ProviderResultMap = {
  openstreetmap: OpenStreetMapResponse;
  here: HereAutocompleteResponse;
  geoapify: GeoapifyAutocompleteResponse;
  locationiq: LocationIQResponse;
  mapbox: MapboxGeocodingResponse;
  opencage: OpenCageGeocodingResponse;
  google: GooglePlacesAutocompleteResponse;
  tomtom: TomTomAutocompleteResponse;
};

export type ProviderItemMap = {
  openstreetmap: OpenStreetMapResult;
  here: HereAutocompleteItem;
  geoapify: GeoapifyFeature;
  locationiq: LocationIQSearchResult;
  mapbox: MapboxFeature;
  opencage: OpenCageResult;
  google: GooglePlaceSuggestion;
  tomtom: TomTomResult;
};

export interface LocationAutocompleteProps {
  placeholder?: string;
  onLocationSelect?: (
    location: LocationSuggestion<ProviderItemMap[LocationProvider]>
  ) => void;
  onQueryChange?: (query: string) => void;
  fetchSuggestions?: (query: string) => Promise<LocationSuggestion[]>; // only for custom providers
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
