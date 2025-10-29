import type { LocationSuggestion } from '../../types';

/**
 * Query options for the Mapbox Geocoding API (Autocomplete / Forward Geocoding).
 */
export interface MapboxQueryOptions {
  /**
   * ISO language code for the results. Defaults to English if not provided.
   * Example: "en"
   */
  language?: string;

  /**
   * Maximum number of results to return. Up to 10.
   * Default: 10
   */
  limit?: number;

  /**
   * Bias results to favor locations closer to a specific point.
   * Provide either "ip" to use the user's IP location,
   * or two comma-separated coordinates in longitude,latitude order.
   * Example: "13.388860,52.517037"
   */
  proximity?: string;

  /**
   * Restrict results to a bounding box.
   * Four comma-separated numbers: minLongitude,minLatitude,maxLongitude,maxLatitude
   * Example: "13.08836,52.33812,13.761,52.6755"
   * Note: The bounding box cannot cross the 180th meridian.
   */
  bbox?: string;

  /**
   * Restrict results to specific countries.
   * Comma-separated list of ISO 3166-1 alpha-2 country codes.
   * Example: "US,CA,GB"
   */
  country?: string;

  /**
   * Limit results to specific types of features.
   * Comma-separated list.
   * Available types: country, region, postcode, district, place, city, locality,
   * neighborhood, street, address, poi, category
   * Example: "city,postcode"
   */
  types?: string;

  /**
   * Limit results to specific POI categories.
   * Comma-separated list of canonical category names.
   * Example: "restaurant,bank"
   */
  poi_category?: string;

  /**
   * Exclude specific POI categories from results.
   * Comma-separated list of canonical category names.
   * Example: "atm,parking"
   */
  poi_category_exclusions?: string;

  /**
   * Enable Estimate Time Arrival (ETA) calculation.
   * Only allowed value is "navigation".
   * Requires `navigationProfile` and either `origin` or `proximity` to be provided.
   */
  eta_type?: 'navigation';

  /**
   * Navigation routing profile for ETA calculation.
   * Available profiles: driving, walking, cycling
   * Required if `etaType` is enabled.
   */
  navigation_profile?: 'driving' | 'walking' | 'cycling';

  /**
   * Origin location for ETA calculation.
   * Coordinates in longitude,latitude order.
   * When both `proximity` and `origin` are provided, `origin` is the route target,
   * while `proximity` indicates the current user location.
   * Example: "13.388860,52.517037"
   */
  origin?: string;

  /**
   * Customer-provided session token to group multiple requests together for billing.
   * UUIDv4 recommended.
   * Example: "550e8400-e29b-41d4-a716-446655440000"
   */
  session_token?: string;
}

export interface MapboxResponse {
  suggestions: MapboxSuggestion[];
  attribution?: string;
  response_id?: string;
  [key: string]: unknown;
}

export interface MapboxSuggestion {
  name: string;
  mapbox_id: string;
  feature_type?: string;
  address?: string;
  full_address?: string;
  place_formatted?: string;
  context?: MapboxContext;
  language?: string;
  maki?: string;
  poi_category?: string[];
  poi_category_ids?: string[];
  external_ids?: Record<string, string>;
  metadata?: Record<string, unknown>;
  distance?: number;
  [key: string]: unknown;
}

export interface MapboxContext {
  country?: CountryContext;
  region?: RegionContext;
  postcode?: IdNameContext;
  place?: IdNameContext;
  neighborhood?: IdNameContext;
  address?: AddressContext;
  street?: { name?: string };
  [key: string]: unknown;
}

export interface CountryContext {
  name?: string;
  country_code?: string; // e.g. "US"
  country_code_alpha_3?: string; // e.g. "USA"
  [key: string]: unknown;
}

export interface RegionContext {
  name?: string;
  region_code?: string; // e.g. "MI"
  region_code_full?: string; // e.g. "US-MI"
  [key: string]: unknown;
}

export interface IdNameContext {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface AddressContext {
  name?: string;
  address_number?: string;
  street_name?: string;
  [key: string]: unknown;
}

export const normalizeMapboxResult = <T extends MapboxSuggestion>(
  item: T
): LocationSuggestion<T> => ({
  place_id: item.mapbox_id || Math.random().toString(),
  display_name: item.place_formatted || item.address || 'Unknown location',
  lat: '0',
  lon: '0',
  type: item.feature_type || 'unknown',
  importance: 0.5,
  raw: item,
});
