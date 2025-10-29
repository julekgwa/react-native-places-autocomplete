import type { LocationSuggestion } from '../../types';

/**
 * Query options for the OpenCage Geocoding / Autocomplete API.
 */
export interface OpenCageQueryOptions {
  /**
   * Restrict results to a bounding box.
   * Provide two coordinate points forming the south-west and north-east corners:
   * minLongitude, minLatitude, maxLongitude, maxLatitude
   * Example: "-0.563160,51.280430,0.278970,51.683979"
   */
  bounds?: string;

  /**
   * Restrict results to a specific country/territory.
   * Two-letter ISO 3166-1 Alpha 2 code (lowercase).
   * Example: "gb", "fr", "us"
   */
  countrycode?: string;

  /**
   * Language to display results in.
   * Two-letter code (de, en, es, fr) or "native" for local language.
   * Defaults to "en".
   */
  language?: 'de' | 'en' | 'es' | 'fr' | 'native';

  /**
   * Maximum number of results to display.
   * Default: 5. Maximum: 10
   */
  limit?: number;

  /**
   * Label to display when the API returns no results (for i18n).
   * Default: "No results."
   */
  noResults?: string;
}

export interface OpenCageResponse {
  documentation?: string;
  licenses?: OpenCageLicense[];
  results: OpenCageResult[];
  status?: OpenCageStatus;
  stay_informed?: OpenCageStayInformed;
  thanks?: string;
  timestamp?: OpenCageTimestamp;
  total_results?: number;
  [k: string]: unknown;
}

export interface OpenCageLicense {
  name?: string;
  url?: string;
  [k: string]: unknown;
}

export interface OpenCageResult {
  formatted: string;
  geometry: OpenCageGeometry;
  name?: string;
  bounds?: OpenCageBounds;
  components?: Record<string, unknown>;
  annotations?: Record<string, unknown>;
  [k: string]: unknown;
}

export interface OpenCageGeometry {
  lat: string;
  lng: string;
  [k: string]: unknown;
}

export interface OpenCageBounds {
  northeast: OpenCageGeometry;
  southwest: OpenCageGeometry;
  [k: string]: unknown;
}

export interface OpenCageStatus {
  code?: number;
  message?: string;
  [k: string]: unknown;
}

export interface OpenCageStayInformed {
  blog?: string;
  mastodon?: string;
  [k: string]: unknown;
}

export interface OpenCageTimestamp {
  created_http?: string;
  created_unix?: number;
  [k: string]: unknown;
}

export const normalizeOpenCageResult = <T extends OpenCageResult>(
  item: T
): LocationSuggestion<T> => ({
  place_id: Math.random().toString(),
  display_name: item.formatted || 'Unknown location',
  lat: item.geometry?.lat?.toString() || '0',
  lon: item.geometry?.lng?.toString() || '0',
  type: 'location',
  importance: 0.5,
  raw: item,
});
