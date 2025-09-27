import type {
  LocationSuggestion,
  LocationProvider,
  ProviderConfig,
  QueryOptions,
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

const normalizeOpenStreetMapResult = (item: any): LocationSuggestion => ({
  place_id:
    item.place_id?.toString() ||
    item.osm_id?.toString() ||
    Math.random().toString(),
  display_name: item.display_name || item.name || 'Unknown location',
  lat: item.lat || item.latitude || '0',
  lon: item.lon || item.longitude || '0',
  type: item.type || item.class || 'unknown',
  importance: item.importance || 0.5,
});

const normalizeMapboxResult = (item: any): LocationSuggestion => ({
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
});

const normalizeGoogleResult = (item: any): LocationSuggestion => ({
  place_id: item.place_id || Math.random().toString(),
  display_name:
    item.description || item.formatted_address || 'Unknown location',
  lat: item.geometry?.location?.lat?.toString() || '0',
  lon: item.geometry?.location?.lng?.toString() || '0',
  type: item.types?.[0] || 'unknown',
  importance: 0.5,
});

const normalizeGeoapifyResult = (item: any): LocationSuggestion => ({
  place_id:
    item.place_id || item.osm_id?.toString() || Math.random().toString(),
  display_name: item.formatted || item.address_line1 || 'Unknown location',
  lat: item.lat?.toString() || '0',
  lon: item.lon?.toString() || '0',
  type: item.result_type || item.category || 'unknown',
  importance: item.rank?.importance || 0.5,
});

const normalizeLocationIQResult = (item: any): LocationSuggestion => ({
  place_id:
    item.place_id || item.osm_id?.toString() || Math.random().toString(),
  display_name: item.display_name || 'Unknown location',
  lat: item.lat || '0',
  lon: item.lon || '0',
  type: item.type || item.class || 'unknown',
  importance: item.importance || 0.5,
});

const normalizeHereResult = (item: any): LocationSuggestion => ({
  place_id: item.id || Math.random().toString(),
  display_name: item.title || item.address?.label || 'Unknown location',
  lat: item.position?.lat?.toString() || '0',
  lon: item.position?.lng?.toString() || '0',
  type: item.resultType || item.localityType || 'unknown',
  importance: item.scoring?.queryScore || 0.5,
});

const normalizeTomTomResult = (item: any): LocationSuggestion => ({
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
});

const normalizeOpenCageResult = (item: any): LocationSuggestion => ({
  place_id: item.name || Math.random().toString(),
  display_name: item.formatted || 'Unknown location',
  lat: item.geometry?.lat?.toString() || '0',
  lon: item.geometry?.lng?.toString() || '0',
  type: 'location',
  importance: 0.5,
});

export const createBuiltInFetchSuggestions = (
  provider: LocationProvider,
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

      const data = await response.json();

      // Handle different response structures
      let results: any[];

      if (provider === 'mapbox') {
        results = data.features || [];
      } else if (provider === 'google') {
        results = data.predictions || [];
      } else if (provider === 'geoapify') {
        results = data.features || [];
      } else if (provider === 'here') {
        results = data.items || [];
      } else if (provider === 'tomtom') {
        results = data.results || [];
      } else if (provider === 'opencage') {
        results = data.results || [];
      } else {
        results = Array.isArray(data) ? data : [];
      }

      // Normalize results based on provider
      switch (provider) {
        case 'openstreetmap':
          return results.map(normalizeOpenStreetMapResult);

        case 'mapbox':
          return results.map(normalizeMapboxResult);

        case 'google':
          return results.map(normalizeGoogleResult);

        case 'geoapify':
          return results.map((item: any) =>
            normalizeGeoapifyResult(item.properties || item)
          );

        case 'locationiq':
          return results.map(normalizeLocationIQResult);

        case 'here':
          return results.map(normalizeHereResult);

        case 'tomtom':
          return results.map(normalizeTomTomResult);

        case 'opencage':
          return results.map(normalizeOpenCageResult);

        default:
          return results.map(normalizeOpenStreetMapResult);
      }
    } catch (error) {
      console.error(`Error fetching suggestions from ${provider}:`, error);
      throw error;
    }
  };
};
