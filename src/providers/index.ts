import type {
  LocationSuggestion,
  ProviderConfig,
  QueryOptions,
  ProviderResultMap,
  ProviderItemMap,
} from '../types';
import { fetcher } from '../utils/fetcher';
import { normalizeGoogleResult } from './google';
import { normalizeOpenStreetMapResult } from './openstreetmap';
import { normalizeHereResult } from './here';
import { normalizeGeoapifyResult } from './geoapify';
import { normalizeLocationIQResult } from './locationiq';
import { normalizeMapboxResult } from './mapbox';
import { normalizeOpenCageResult } from './opencage';
import { normalizeTomTomResult } from './tomtom';

const normalizers: {
  [P in keyof ProviderItemMap]: (
    item: ProviderItemMap[P]
  ) => LocationSuggestion<ProviderItemMap[P]>;
} = {
  openstreetmap: (item) => normalizeOpenStreetMapResult(item),
  here: (item) => normalizeHereResult(item),
  geoapify: (item) => normalizeGeoapifyResult(item),
  locationiq: (item) => normalizeLocationIQResult(item),
  mapbox: (item) => normalizeMapboxResult(item),
  opencage: (item) => normalizeOpenCageResult(item),
  google: (item) => normalizeGoogleResult(item),
  tomtom: (item) => normalizeTomTomResult(item),
};

function mapProviderResult<P extends keyof ProviderItemMap>(
  provider: P,
  item: ProviderItemMap[P]
): LocationSuggestion<ProviderItemMap[P]> {
  const normalize = normalizers[provider];
  return normalize(item);
}

export const createBuiltInFetchSuggestions = <
  P extends keyof ProviderResultMap,
>(
  provider: P,
  config: ProviderConfig = {},
  queryOptions?: QueryOptions<P>
): ((query: string) => Promise<LocationSuggestion<ProviderItemMap[P]>[]>) => {
  return async (
    query: string
  ): Promise<LocationSuggestion<ProviderItemMap[P]>[]> => {
    if (!query.trim()) {
      return [];
    }

    try {
      const { data, status } = await fetcher(
        query,
        provider,
        config,
        queryOptions
      );

      if (status !== 200) {
        throw new Error(`HTTP error! status ${status}`);
      }

      return (data ?? []).map((item) =>
        mapProviderResult(provider, item as ProviderItemMap[P])
      );
    } catch (error) {
      console.error(`Error fetching suggestions from ${provider}:`, error);
      throw error;
    }
  };
};
