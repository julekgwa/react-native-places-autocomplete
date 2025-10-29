import type { LocationSuggestion } from '../../types';

/**
 * Query options for the HERE Autocomplete API.
 */
export interface HereQueryOptions {
  /**
   * Specify the center of the search context as coordinates.
   * Format: {latitude},{longitude}
   * Example: "-13.163068,-72.545128" (Machu Picchu, Peru)
   */
  at?: string;

  /**
   * Restrict search within a geographic area. This is a hard filter.
   * Only one of `at`, `inCircle`, or `inBbox` can be used.
   * - Country codes: ISO 3166-1 alpha-3, uppercase
   * - Circle: "circle:{lat},{lng};r={radius}" (radius in meters)
   * - Bounding box: "bbox:{west},{south},{east},{north}"
   */
  in?: string;

  /**
   * Options to return multiple results when a postal code spans multiple areas.
   * - "cityLookup": returns all city combinations for the postal code
   * - "districtLookup": returns all district + city combinations
   */
  postalCodeMode?: 'cityLookup' | 'districtLookup';

  /**
   * Limit results to certain types.
   * Supported values: "area", "city", "postalCode"
   */
  types?: Array<'area' | 'city' | 'postalCode'>;

  /**
   * Preferred languages for the response, as BCP-47 codes.
   */
  lang?: string[];

  /**
   * Maximum number of results to return. Defaults to 5, max 20.
   */
  limit?: number;

  /**
   * Toggle the political view for a specific country.
   * ISO 3166-1 alpha-3 code in uppercase.
   * Supported examples: "ARG", "EGY", "IND", "KEN", "MAR", "PAK", "RUS", "SDN", "SRB", "SUR", "SYR", "TUR", "TZA", "URY", "VNM"
   */
  politicalView?: string;

  /**
   * Select additional fields to include in the response.
   * Supported values:
   * - "streetInfo": renders decomposed street name parts
   * - "hasRelatedMPA": Boolean flag for Micro Point Addresses (houseNumberType: pointAddress)
   */
  show?: Array<'streetInfo' | 'hasRelatedMPA'>;
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

export const normalizeHereResult = <T extends HereAutocompleteItem>(
  item: T
): LocationSuggestion<T> => ({
  place_id: item.id || Math.random().toString(),
  display_name: item.title || item.address?.label || 'Unknown location',
  lat: '0',
  lon: '0',
  type: item.resultType || 'unknown',
  importance: 0.5,
  raw: item,
});
