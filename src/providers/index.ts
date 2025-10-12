import type {
  LocationSuggestion,
  LocationProvider,
  ProviderConfig,
  QueryOptions,
  ProviderResultMap,
  OpenStreetMapResult,
  GeoapifyFeature,
  GooglePlacePrediction,
  LocationIQSearchResult,
  MapboxFeature,
  TomTomResult,
  HereAutocompleteItem,
  OpenCageResult,
  GeoapifyAutocompleteResponse,
  MapboxGeocodingResponse,
  GooglePlacesAutocompleteResponse,
  HereAutocompleteResponse,
  TomTomAutocompleteResponse,
  OpenCageGeocodingResponse,
  ProviderItemMap,
  GooglePlaceSuggestion,
} from '../types';

const buildQueryString = (
  params: Record<string, string | number | boolean>
): string => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&');
};

const normalizeOpenStreetMapResult = <T extends OpenStreetMapResult>(
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

const normalizeMapboxResult = <T extends MapboxFeature>(
  item: T
): LocationSuggestion<T> => ({
  place_id: item.id || Math.random().toString(),
  display_name: item.place_name || item.text || 'Unknown location',
  lat:
    item.center?.[1]?.toString() ||
    item.geometry?.coordinates?.[1]?.toString() ||
    '0',
  lon:
    item.center?.[0]?.toString() ||
    item.geometry?.coordinates?.[0]?.toString() ||
    '0',
  type: item.place_type?.[0] || 'unknown',
  importance: item.relevance || 0.5,
  raw: item,
});

const normalizeGoogleResult = <T extends GooglePlacePrediction>(
  item: T
): LocationSuggestion<T> => ({
  place_id: item.placeId || Math.random().toString(),
  display_name:
    item.text?.text ||
    item.structuredFormat?.mainText?.text ||
    'Unknown location',
  lat: '0',
  lon: '0',
  type: item.types?.[0] || 'unknown',
  importance: 0.5,
  raw: item,
});

const normalizeGeoapifyResult = <T extends GeoapifyFeature>(
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

const normalizeLocationIQResult = <T extends LocationIQSearchResult>(
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

const normalizeHereResult = <T extends HereAutocompleteItem>(
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

const normalizeTomTomResult = <T extends TomTomResult>(
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

const normalizeOpenCageResult = <T extends OpenCageResult>(
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

function mapProviderResult<P extends LocationProvider>(
  provider: P,
  item: ProviderItemMap[P]
) {
  switch (provider) {
    case 'openstreetmap':
      return normalizeOpenStreetMapResult(item as OpenStreetMapResult);

    case 'mapbox':
      return normalizeMapboxResult(item as MapboxFeature);

    case 'google':
      return normalizeGoogleResult(item as GooglePlacePrediction);

    case 'geoapify':
      return normalizeGeoapifyResult(item as GeoapifyFeature);

    case 'locationiq':
      return normalizeLocationIQResult(item as LocationIQSearchResult);

    case 'here':
      return normalizeHereResult(item as HereAutocompleteItem);

    case 'tomtom':
      return normalizeTomTomResult(item as TomTomResult);

    case 'opencage':
      return normalizeOpenCageResult(
        item as OpenCageResult
      ) as LocationSuggestion<
        ProviderResultMap[P] extends Array<infer R> ? R : unknown
      >;

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export const createBuiltInFetchSuggestions = <
  P extends keyof ProviderResultMap,
>(
  provider: P,
  config: ProviderConfig = {},
  queryOptions: QueryOptions = {}
) => {
  return async (query: string): Promise<LocationSuggestion[]> => {
    if (!query.trim()) {
      return [];
    }

    let url: string;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const baseParams = {
      q: query,
      format: 'json',
      limit: 10,
      ...queryOptions,
    };

    switch (provider) {
      case 'openstreetmap': {
        const params = buildQueryString({
          ...baseParams,
          format: queryOptions.format || 'jsonv2',
          addressdetails: 1,
        });
        url = `${
          config.baseUrl || 'https://nominatim.openstreetmap.org/search'
        }?${params}`;
        break;
      }

      case 'mapbox': {
        if (!config.apiKey) {
          throw new Error(
            'Mapbox requires an API key in providerConfig.apiKey'
          );
        }
        const params = buildQueryString({
          ...queryOptions,
          access_token: config.apiKey,
          limit: baseParams.limit,
        });
        url = `${
          config.baseUrl || 'https://api.mapbox.com/geocoding/v5/mapbox.places'
        }/${encodeURIComponent(query)}.json?${params}`;
        break;
      }

      case 'google': {
        if (!config.apiKey) {
          throw new Error(
            'Google requires an API key in providerConfig.apiKey'
          );
        }
        const params = buildQueryString({
          input: query,
          key: config.apiKey,
          ...queryOptions,
        });
        url = `${
          config.baseUrl ||
          'https://maps.googleapis.com/maps/api/place/autocomplete/json'
        }?${params}`;
        break;
      }

      case 'geoapify': {
        if (!config.apiKey) {
          throw new Error(
            'Geoapify requires an API key in providerConfig.apiKey'
          );
        }
        const params = buildQueryString({
          text: query,
          apiKey: config.apiKey,
          limit: baseParams.limit,
          ...queryOptions,
        });
        url = `${
          config.baseUrl || 'https://api.geoapify.com/v1/geocode/autocomplete'
        }?${params}`;
        break;
      }

      case 'locationiq': {
        if (!config.apiKey) {
          throw new Error(
            'LocationIQ requires an API key in providerConfig.apiKey'
          );
        }
        const params = buildQueryString({
          ...baseParams,
          key: config.apiKey,
        });
        url = `${
          config.baseUrl || 'https://us1.locationiq.com/v1/search.php'
        }?${params}`;
        break;
      }

      case 'here': {
        if (!config.apiKey) {
          throw new Error('HERE requires an API key in providerConfig.apiKey');
        }
        const params = buildQueryString({
          q: query,
          apiKey: config.apiKey,
          limit: baseParams.limit,
          ...queryOptions,
        });
        url = `${
          config.baseUrl ||
          'https://autocomplete.search.hereapi.com/v1/autocomplete'
        }?${params}`;
        break;
      }

      case 'tomtom': {
        if (!config.apiKey) {
          throw new Error(
            'TomTom requires an API key in providerConfig.apiKey'
          );
        }
        const params = buildQueryString({
          key: config.apiKey,
          typeahead: true,
          limit: baseParams.limit,
          ...queryOptions,
        });
        url = `${
          config.baseUrl || 'https://api.tomtom.com/search/2/search'
        }/${encodeURIComponent(query)}.json?${params}`;
        break;
      }

      case 'opencage': {
        if (!config.apiKey) {
          throw new Error(
            'OpenCage requires an API key in providerConfig.apiKey'
          );
        }
        const params = buildQueryString({
          q: query,
          key: config.apiKey,
          limit: baseParams.limit,
          language: 'en',
          ...queryOptions,
        });
        url = `${
          config.baseUrl || 'https://api.opencagedata.com/geocode/v1/json'
        }?${params}`;
        break;
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProviderResultMap[P] = await response.json();

      const results = (() => {
        switch (provider) {
          case 'mapbox':
            return (data as MapboxGeocodingResponse).features ?? [];
          case 'google':
            return (data as GooglePlacesAutocompleteResponse).predictions ?? [];
          case 'geoapify':
            return (data as GeoapifyAutocompleteResponse).features ?? [];
          case 'here':
            return (data as HereAutocompleteResponse).items ?? [];
          case 'tomtom':
            return (data as TomTomAutocompleteResponse).results ?? [];
          case 'opencage':
            return (data as OpenCageGeocodingResponse).results ?? [];
          default:
            return Array.isArray(data) ? data : [];
        }
      })() as unknown[];

      // Normalize results based on the provider
      switch (provider) {
        case 'mapbox':
          return results.map((item) =>
            mapProviderResult('mapbox', item as MapboxFeature)
          );

        case 'google':
          return results.map((item) =>
            mapProviderResult('google', item as GooglePlaceSuggestion)
          );

        case 'geoapify':
          return results.map((item) =>
            mapProviderResult('geoapify', item as GeoapifyFeature)
          );

        case 'locationiq':
          return results.map((item) =>
            mapProviderResult('locationiq', item as LocationIQSearchResult)
          );

        case 'here':
          return results.map((item) =>
            mapProviderResult('here', item as HereAutocompleteItem)
          );

        case 'tomtom':
          return results.map((item) =>
            mapProviderResult('tomtom', item as TomTomResult)
          );

        case 'opencage':
          return results.map((item) =>
            mapProviderResult('opencage', item as OpenCageResult)
          );

        default:
          return results.map((item) =>
            mapProviderResult('openstreetmap', item as OpenStreetMapResult)
          );
      }
    } catch (error) {
      console.error(`Error fetching suggestions from ${provider}:`, error);
      throw error;
    }
  };
};
