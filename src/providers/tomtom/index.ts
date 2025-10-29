import type { LocationSuggestion } from '../../types';

/**
 * TomTom Search / Autocomplete API query options
 */
export interface TomTomQueryOptions {
  /**
   * Base URL for calling the API.
   * Example: "api.tomtom.com" or "kr-api.tomtom.com"
   */
  baseURL?: string;

  /**
   * Service version.
   * Example: "2"
   */
  versionNumber?: string;

  /**
   * Response format.
   * Allowed values: "json", "jsonp", "js", "xml"
   */
  ext?: 'json' | 'jsonp' | 'js' | 'xml';

  /**
   * API Key valid for the requested service
   */
  key?: string;

  /**
   * The query string. Must be URL-encoded.
   * Can include coordinates or mapcodes directly.
   * Example: "Berlin Pariser 20"
   */
  query?: string;

  /**
   * Enable predictive mode for partial input.
   * Default: false
   */
  typeahead?: boolean;

  /**
   * Maximum number of responses.
   * Default: 10, Max: 100
   */
  limit?: number;

  /**
   * Result offset within the full result set.
   * Default: 0
   */
  ofs?: number;

  /**
   * Comma-separated ISO 3166-1 alpha-2 or alpha-3 country codes to limit search.
   * Example: "FR,ES" or "FRA,ESP"
   */
  countrySet?: string;

  /**
   * Location bias: "point:lat,lon" or "rectangle:topLeftLat,topLeftLon,btmRightLat,btmRightLon".
   * Point takes precedence over bounding box.
   */
  geoBias?: string;

  /** Latitude for point-radius bias */
  lat?: number;

  /** Longitude for point-radius bias */
  lon?: number;

  /** Radius in meters for filtering around lat/lon */
  radius?: number;

  /** Bounding box top-left coordinates as "lat,lon" */
  topLeft?: string;

  /** Bounding box bottom-right coordinates as "lat,lon" */
  btmRight?: string;

  /** Language in which search results should be returned (IETF language tag) */
  language?: string;

  /** Comma-separated indexes for which extended postal codes should be included. Example: "POI,PAD" */
  extendedPostalCodesFor?: string;

  /** Minimum fuzziness level (1–4). Default: 1 */
  minFuzzyLevel?: number;

  /** Maximum fuzziness level (1–4). Default: 2 */
  maxFuzzyLevel?: number;

  /** Comma-separated list of indexes to be used for search. Example: "POI,PAD,Str" */
  idxSet?: string;

  /** Comma-separated list of POI category identifiers. Example: "7315,7315017" */
  categorySet?: string;

  /** Comma-separated list of brand names. Example: "TomTom,Foobar" */
  brandSet?: string;

  /** Comma-separated list of connector types (for EV stations). Example: "IEC62196Type2CableAttached" */
  connectorSet?: string;

  /** Minimum power (kW) for EV stations. Example: 22.2 */
  minPowerKW?: number;

  /** Maximum power (kW) for EV stations. Example: 43.2 */
  maxPowerKW?: number;

  /** Comma-separated list of fuel types. Example: "Diesel,Petrol" */
  fuelSet?: string;

  /** Comma-separated list of vehicle types. Example: "Car,Truck" */
  vehicleTypeSet?: string;

  /** Geopolitical view context. Default: "Unified" or country-specific. Example: "AR, CN, IN" */
  view?: string;

  /** POI opening hours mode. Example: "nextSevenDays" */
  openingHours?: string;

  /** Timezone mode. Example: "iana" */
  timeZone?: string;

  /** Comma-separated list of mapcodes to return. Example: "Local,Alternative" */
  mapcodes?: string;

  /** Related POIs to include: "off", "child", "parent", "all" */
  relatedPois?: 'off' | 'child' | 'parent' | 'all';

  /** Comma-separated list of entity types for filtering. Example: "Municipality,Neighbourhood" */
  entityTypeSet?: string;
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

export const normalizeTomTomResult = <T extends TomTomResult>(
  item: T
): LocationSuggestion<T> => ({
  place_id: item.id || Math.random().toString(),
  display_name:
    item.poi?.name ||
    item.address?.freeformAddress ||
    item.address?.streetName ||
    'Unknown location',
  lat: item.position?.lat?.toString() || '0',
  lon: item.position?.lon?.toString() || '0',
  type: item.type || item.poi?.categories?.[0] || item.entityType || 'unknown',
  importance: item.score ? item.score / 3 : 0.5, // Normalize TomTom's score to 0-1 range
  raw: item,
});
