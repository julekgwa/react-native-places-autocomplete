import type { LocationSuggestion } from '../../types';

/**
 * Options for the Google Places Autocomplete API.
 */
export interface GoogleQueryOptions {
  /**
   * Comma-separated list specifying which fields to return in the response.
   * Optional.
   * Example: "name,geometry,formatted_address"
   */
  fieldMask?: string;

  /**
   * Restricts results to places matching one of up to five specified primary types.
   * Optional.
   * Example: ["restaurant", "cafe"]
   */
  includedPrimaryTypes?: string[];

  /**
   * If true, includes businesses without a physical location (service area businesses).
   * Defaults to false.
   */
  includePureServiceAreaBusinesses?: boolean;

  /**
   * If true, includes both place and query predictions in the response.
   * Defaults to false.
   */
  includeQueryPredictions?: boolean;

  /**
   * Array of up to 15 two-character country codes to restrict results to.
   * Optional.
   * Example: ["US", "CA"]
   */
  includedRegionCodes?: string[];

  /**
   * Zero-based Unicode character offset of the cursor position within the input string.
   * Influences predictions. Defaults to the length of the input.
   */
  inputOffset?: number;

  /**
   * Biases search results toward a specific location.
   * Cannot be used together with `locationRestriction`.
   */
  locationBias?: {
    /** Circle area bias */
    circle?: {
      center: { lat: number; lng: number };
      radius: number; // in meters
    };
    /** Rectangle area bias */
    rectangle?: {
      low: { lat: number; lng: number };
      high: { lat: number; lng: number };
    };
  };

  /**
   * Restricts search results within a specific area.
   * Cannot be used together with `locationBias`.
   */
  locationRestriction?: {
    circle?: {
      center: { lat: number; lng: number };
      radius: number; // in meters
    };
    rectangle?: {
      low: { lat: number; lng: number };
      high: { lat: number; lng: number };
    };
  };

  /**
   * Origin point used to calculate straight-line distance to predicted destinations.
   * Optional.
   */
  origin?: { lat: number; lng: number };

  /**
   * User-generated string to group Autocomplete calls into a session for billing purposes.
   * Optional.
   */
  sessionToken?: string;

  /**
   * Preferred language for the response, as BCP-47 codes.
   * Optional.
   * Example: "en"
   */
  languageCode?: string;
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

export const normalizeGoogleResult = <T extends GooglePlaceSuggestion>(
  item: T
): LocationSuggestion<T> => {
  return {
    place_id: item.placePrediction.placeId || Math.random().toString(),
    display_name:
      item.placePrediction.text?.text ||
      item.placePrediction.structuredFormat?.mainText?.text ||
      'Unknown location',
    lat: '0',
    lon: '0',
    type: (item.placePrediction.types ?? []).join(',') || 'unknown',
    importance: 0.5,
    raw: item,
  };
};
