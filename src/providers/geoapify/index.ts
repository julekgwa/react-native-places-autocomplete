import type { LocationSuggestion } from '../../types';

/**
 * Options for the Geoapify Autocomplete API.
 */
export interface GeoapifyQueryOptions {
  /**
   * Your Geoapify API key.
   * Required.
   * Example: "c3da27885e3573e09e550d044bc55e22"
   */
  apiKey: string;

  /**
   * The address or part of the address to search for.
   * Required.
   * Example: "Auts"
   */
  text: string;

  /**
   * Location type to restrict results.
   * Optional.
   * Possible values:
   * - 'country'
   * - 'state'
   * - 'city'
   * - 'postcode'
   * - 'street'
   * - 'amenity'
   * - 'locality'
   *
   * Example: 'locality'
   */
  type?:
    | 'country'
    | 'state'
    | 'city'
    | 'postcode'
    | 'street'
    | 'amenity'
    | 'locality';

  /**
   * Result language using 2-character ISO 639-1 code.
   * Optional.
   * Example: 'de'
   */
  lang?: string;

  /**
   * Filter the results by country, boundary, or circle.
   * Optional.
   * Format examples:
   * - rectangle: "rect:-122.569140,37.936672,-122.5324795,37.9588474"
   */
  filter?: string;

  /**
   * Bias search results toward a specific location.
   * Optional.
   * Format examples:
   * - proximity: "proximity:-122.52985959,37.95335060"
   */
  bias?: string;

  /**
   * Response format.
   * Optional. Defaults to 'geojson'.
   * Possible values: 'json', 'xml', 'geojson'
   */
  format?: 'json' | 'xml' | 'geojson';
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

export const normalizeGeoapifyResult = <T extends GeoapifyFeature>(
  item: T
): LocationSuggestion<T> => ({
  place_id: item.properties.place_id || Math.random().toString(),
  display_name: item.properties.formatted || 'Unknown location',
  lat: String(item.properties.lat) || '0',
  lon: String(item.properties.lon) || '0',
  type: item.properties.result_type || 'unknown',
  importance: item.properties.rank?.importance || 0.5,
  raw: item,
});
