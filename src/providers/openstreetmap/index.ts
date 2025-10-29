import type { LocationSuggestion } from '@julekgwa/react-native-places-autocomplete';

export interface OpenStreetMapQueryOptions {
  /**
   * Maximum number of results to return.
   * Default: 10
   */
  'limit'?: number;

  /**
   * Return results in GeoJSON polygon format.
   * Default: false
   */
  'polygon_geojson'?: boolean;

  /**
   * Apply a bounding box restriction to results.
   * Should be provided as: [left, top, right, bottom]
   */
  'viewbox'?: [number, number, number, number];

  /**
   * Restrict results to the viewbox area.
   * Default: false
   */
  'bounded'?: boolean;

  /**
   * Preferred language for the results.
   * Example: "en"
   */
  'accept-language'?: string;

  /**
   * Limit results to specific country codes (ISO 3166-1 alpha2).
   * Example: "de,gb"
   */
  'countrycodes'?: string;

  /**
   * Restrict results to a specific layer.
   * Example: "address,poi,railway"
   */
  'layer'?: string;

  /**
   * Polygon simplification threshold.
   * Example: 0.003
   */
  'polygon_threshold'?: number;

  /**
   * Result offset within the full result set.
   * Default: 0
   */
  'offset'?: number;

  /**
   * Format of the response.
   * Default: "json"
   * Possible values: "json", "xml", "jsonv2", "geojson", "geocodejson"
   */
  'format'?: 'json' | 'xml' | 'jsonv2' | 'geojson' | 'geocodejson';
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

export const normalizeOpenStreetMapResult = <T extends OpenStreetMapResult>(
  item: T
): LocationSuggestion<T> => ({
  place_id:
    item.place_id?.toString() ||
    item.osm_id?.toString() ||
    Math.random().toString(),
  display_name: item.display_name || item.name || 'Unknown location',
  lat: item.lat || '0',
  lon: item.lon || '0',
  type: item.type || item.class || 'unknown',
  importance: item.importance || 0.5,
  raw: item,
});
