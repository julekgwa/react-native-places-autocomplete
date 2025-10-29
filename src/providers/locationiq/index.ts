import type { LocationSuggestion } from '../../types';

/**
 * Query options for the LocationIQ Autocomplete API.
 */
export interface LocationIQQueryOptions {
  /**
   * Maximum number of results to return.
   * Optional. Default: 10. Allowed range: 1–20.
   */
  'limit'?: number;

  /**
   * Limit search to specific countries.
   * Optional. Comma-separated list of ISO 3166-1 alpha-2 country codes (uppercase).
   * Example: "US,CA,GB"
   */
  'countrycodes'?: string;

  /**
   * Normalize the city field if missing in the response.
   * 0 = disable (default), 1 = enable normalization.
   * If enabled, the next available element in the following order will be used as the city:
   * city_district, locality, town, borough, municipality, village, hamlet, quarter, neighbourhood
   */
  'normalizecity'?: 0 | 1;

  /**
   * Preferred language for the search results.
   * Optional. Default: 'en'.
   * Only a single 2-character ISO 639-1 language code is supported.
   * Supported: "en", "cs", "nl", "fr", "de", "id", "it", "no", "pl", "es", "ru", "sv", "uk"
   */
  'accept-language'?: string;
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

export const normalizeLocationIQResult = <T extends LocationIQSearchResult>(
  item: T
): LocationSuggestion<T> => ({
  place_id:
    item.place_id || item.osm_id?.toString() || Math.random().toString(),
  display_name: item.display_name || 'Unknown location',
  lat: item.lat || '0',
  lon: item.lon || '0',
  type: item.type || item.class || 'unknown',
  importance: 0.5,
  raw: item,
});
