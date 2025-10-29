import type {
  ProviderConfig,
  ProviderQueryOptionsMap,
  ProviderResultMap,
  QueryOptions,
} from '../types';
import { Api } from '../api/api';

const buildQueryString = (
  params: Record<string, string | number | boolean | undefined | null>
): string => {
  return Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    ) // skip empty
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&');
};

export function todayYYYYMMDD(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export async function fetcher<P extends keyof ProviderQueryOptionsMap>(
  query: string,
  provider: P,
  config: ProviderConfig,
  queryOptions?: QueryOptions<P>
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const baseParams = {
    q: query,
    format: 'json',
  };

  switch (provider) {
    case 'openstreetmap': {
      const options = queryOptions as ProviderQueryOptionsMap['openstreetmap'];
      const params = buildQueryString({
        ...baseParams,
        format: options?.format || 'jsonv2',
        limit: options.limit || 10,
        addressdetails: 1,
      });
      const url = `${
        config.baseUrl || 'https://nominatim.openstreetmap.org/search'
      }?${params}`;

      return Api.request<ProviderResultMap['openstreetmap']>(url, {
        headers,
      }).then(({ response, status }) => ({ data: response, status }));
    }
    case 'mapbox': {
      if (!config.apiKey) {
        throw new Error('Mapbox requires an API key in providerConfig.apiKey');
      }

      const options = queryOptions as ProviderQueryOptionsMap['mapbox'];
      const params = buildQueryString({
        ...(options || {}),
        access_token: config.apiKey,
        limit: options.limit || 10,
        q: query,
        session_token: 3,
      });
      const url = `${
        config.baseUrl || 'https://api.mapbox.com/search/searchbox/v1/suggest'
      }?${params}`;

      return Api.request<ProviderResultMap['mapbox']>(url, {
        headers,
      }).then(({ response, status }) => ({
        data: response.suggestions,
        status,
      }));
    }
    case 'google': {
      if (!config.apiKey) {
        throw new Error('Google requires an API key in providerConfig.apiKey');
      }
      const options = queryOptions as ProviderQueryOptionsMap['google'];
      const { fieldMask } = options || {};
      const params = {
        input: query,
        ...(options || {}),
      };

      headers['X-Goog-Api-Key'] = config.apiKey;
      if (fieldMask) {
        headers['X-Goog-FieldMask'] = fieldMask;
      }

      const url = `${
        config.baseUrl || 'https://places.googleapis.com/v1/places:autocomplete'
      }`;
      return Api.request<ProviderResultMap['google']>(url, {
        headers,
        method: 'POST',
        body: JSON.stringify(params),
      }).then(({ response, status }) => ({
        data: response.suggestions,
        status,
      }));
    }

    case 'geoapify': {
      if (!config.apiKey) {
        throw new Error(
          'Geoapify requires an API key in providerConfig.apiKey'
        );
      }
      const options = queryOptions as ProviderQueryOptionsMap['geoapify'];
      const params = buildQueryString({
        ...(options || {}),
        text: query,
        apiKey: config.apiKey,
      });
      const url = `${
        config.baseUrl || 'https://api.geoapify.com/v1/geocode/autocomplete'
      }?${params}`;
      return Api.request<ProviderResultMap['geoapify']>(url, {
        headers,
      }).then(({ response, status }) => ({ data: response.features, status }));
    }
    case 'locationiq': {
      if (!config.apiKey) {
        throw new Error(
          'LocationIQ requires an API key in providerConfig.apiKey'
        );
      }
      const options = queryOptions as ProviderQueryOptionsMap['locationiq'];
      const params = buildQueryString({
        ...baseParams,
        ...(options || {}),
        key: config.apiKey,
      });
      const url = `${
        config.baseUrl || 'https://us1.locationiq.com/v1/search.php'
      }?${params}`;
      return Api.request<ProviderResultMap['locationiq']>(url, {
        headers,
      }).then(({ response, status }) => ({ data: response, status }));
    }
    case 'here': {
      if (!config.apiKey) {
        throw new Error('HERE requires an API key in providerConfig.apiKey');
      }
      const options = queryOptions as ProviderQueryOptionsMap['here'];
      const params = buildQueryString({
        ...(options || {}),
        q: query,
        apiKey: config.apiKey,
        limit: options.limit || 10,
        types: options.types?.join(',') || '',
        show: options.show?.join(',') || '',
        lang: options.lang?.join(',') || '',
      });
      const url = `${
        config.baseUrl ||
        'https://autocomplete.search.hereapi.com/v1/autocomplete'
      }?${params}`;
      return Api.request<ProviderResultMap['here']>(url, {
        headers,
      }).then(({ response, status }) => ({ data: response.items, status }));
    }
    case 'tomtom': {
      if (!config.apiKey) {
        throw new Error('TomTom requires an API key in providerConfig.apiKey');
      }
      const options = queryOptions as ProviderQueryOptionsMap['tomtom'];
      const params = buildQueryString({
        ...(options || {}),
        key: config.apiKey,
        typeahead: true,
        limit: options.limit,
      });

      const ext = options.ext || 'json';
      const version = options.versionNumber || 2;

      const url = `${
        config.baseUrl || `https://api.tomtom.com/search/${version}/search`
      }/${encodeURIComponent(query)}.${ext}?${params}`;
      return Api.request<ProviderResultMap['tomtom']>(url, {
        headers,
      }).then(({ response, status }) => ({ data: response.results, status }));
    }
    case 'opencage': {
      if (!config.apiKey) {
        throw new Error(
          'OpenCage requires an API key in providerConfig.apiKey'
        );
      }
      const options = queryOptions as ProviderQueryOptionsMap['opencage'];
      const params = buildQueryString({
        ...(options || {}),
        q: query,
        key: config.apiKey,
        limit: options.limit,
        language: 'en',
      });
      const url = `${
        config.baseUrl || 'https://api.opencagedata.com/geosearch'
      }?${params}`;
      return Api.request<ProviderResultMap['opencage']>(url, {
        headers,
      }).then(({ response, status }) => ({ data: response.results, status }));
    }
  }
}
