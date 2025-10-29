import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import { Clock, MapPin, Search, X } from './icons';
import { createStyles } from './styles/createStyles';
import { createBuiltInFetchSuggestions } from './providers';
import type {
  LocationSuggestion,
  LocationAutocompleteProps,
  ProviderItemMap,
} from './types';
import { mergeTheme } from './utils/themeUtils';

type FetchSuggestionsType<T extends keyof ProviderItemMap | object> = (
  query: string
) => Promise<
  LocationSuggestion<T extends keyof ProviderItemMap ? ProviderItemMap[T] : T>[]
>;

export const LocationAutocomplete = <
  T extends keyof ProviderItemMap | object = 'openstreetmap',
>({
  placeholder = 'Search for a location...',
  onLocationSelect,
  onQueryChange,
  onError,
  fetchSuggestions,
  provider,
  providerConfig = {},
  queryOptions,
  debounceMs = 300,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  suggestionStyle,
  textStyle,
  showRecentSearches = true,
  recentSearches = [],
  onRecentSearchesChange,
  maxRecentSearches = 5,
  attribution,
  theme = {},
  ref,
}: LocationAutocompleteProps<T>) => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<
    LocationSuggestion<
      T extends keyof ProviderItemMap ? ProviderItemMap[T] : T
    >[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [internalRecentSearches, setInternalRecentSearches] =
    useState<string[]>(recentSearches);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Merge provided theme with the default theme
  const mergedTheme = React.useMemo(() => mergeTheme(theme), [theme]);

  // Create dynamic styles based on a theme
  const dynamicStyles = React.useMemo(
    () => createStyles(mergedTheme),
    [mergedTheme]
  );

  const { apiKey, baseUrl } = providerConfig || {};

  const getFetchFunction = React.useMemo<FetchSuggestionsType<T>>(() => {
    if (fetchSuggestions) {
      return fetchSuggestions;
    }

    return createBuiltInFetchSuggestions(
      (provider ?? 'openstreetmap') as keyof ProviderItemMap,
      { apiKey, baseUrl },
      queryOptions
    ) as FetchSuggestionsType<T>;
  }, [fetchSuggestions, provider, apiKey, baseUrl, queryOptions]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (query.trim()) {
        try {
          setIsLoading(true);
          setError('');

          const results = await getFetchFunction(query);
          setSuggestions(results);
        } catch (err) {
          const fetchError =
            err instanceof Error ? err : new Error('Unable to api suggestions');
          setError(fetchError.message);
          setSuggestions([]);
          onError?.(fetchError);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debounceMs, getFetchFunction, onError]);

  const handleInputChange = (text: string) => {
    if (text.length > 100) return;
    setQuery(text);
    setShowSuggestions(true);
    onQueryChange?.(text);
  };

  const handleSuggestionPress = (
    suggestion: LocationSuggestion<
      T extends keyof ProviderItemMap ? ProviderItemMap[T] : T
    >
  ) => {
    const locationName = suggestion.display_name.split(',')[0] || '';
    setQuery(locationName);
    setShowSuggestions(false);

    // Update recent searches
    if (showRecentSearches) {
      const updatedRecent = [
        locationName,
        ...internalRecentSearches.filter((item) => item !== locationName),
      ].slice(0, maxRecentSearches);

      setInternalRecentSearches(updatedRecent);
      onRecentSearchesChange?.(updatedRecent);
    }

    onLocationSelect?.(suggestion);
    onQueryChange?.(locationName);
    Keyboard.dismiss();
  };

  const handleRecentPress = (recent: string) => {
    if (!recent.trim() || recent.length > 100) return;
    setQuery(recent);
    setShowSuggestions(false);
    onQueryChange?.(recent);
    Keyboard.dismiss();
  };

  const clearSearch = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError('');
    onQueryChange?.('');
    inputRef.current?.focus();
  }, [onQueryChange]);

  useImperativeHandle(
    ref,
    () => ({
      clear: () => clearSearch(),
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      getQuery: () => query,
      setQuery: (newQuery: string) => {
        if (newQuery.length > 100) return;
        setQuery(newQuery);
        onQueryChange?.(newQuery);
      },
    }),
    [clearSearch, onQueryChange, query]
  );

  const renderAttribution = () => {
    if (!attribution) return null;

    // If it's a React element, render it directly
    if (React.isValidElement(attribution)) {
      return attribution;
    }

    // If it's a component type, render it
    if (typeof attribution === 'function') {
      const AttributionComponent = attribution;
      return <AttributionComponent />;
    }

    return null;
  };

  return (
    <View style={[dynamicStyles.container, containerStyle]}>
      <View style={[dynamicStyles.searchInputContainer, inputContainerStyle]}>
        <Search
          size={mergedTheme.icons.search.size}
          color={
            mergedTheme.icons.search.color ||
            mergedTheme.colors.onSurfaceVariant
          }
        />

        <TextInput
          ref={inputRef}
          style={[dynamicStyles.searchInput, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={mergedTheme.colors.onSurfaceVariant}
          value={query}
          onChangeText={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {query.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch}
            style={dynamicStyles.clearButton}
          >
            <X
              size={mergedTheme.icons.clear.size}
              color={
                mergedTheme.icons.clear.color ||
                mergedTheme.colors.onSurfaceVariant
              }
            />
          </TouchableOpacity>
        )}
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={mergedTheme.colors.primary}
            style={dynamicStyles.loadingIndicator}
          />
        )}
      </View>

      {showSuggestions && (
        <View style={dynamicStyles.suggestionsContainer}>
          {query.length === 0 &&
          showRecentSearches &&
          internalRecentSearches.length > 0 ? (
            <View>
              <Text style={[dynamicStyles.sectionTitle, textStyle]}>
                Recent Searches
              </Text>
              <ScrollView
                style={dynamicStyles.suggestionsList}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {internalRecentSearches.map((item, index) => (
                  <TouchableOpacity
                    key={`recent-${index}`}
                    style={[dynamicStyles.suggestionItem, suggestionStyle]}
                    onPress={() => handleRecentPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={dynamicStyles.suggestionIcon}>
                      <Clock
                        size={mergedTheme.icons.clock.size}
                        color={
                          mergedTheme.icons.clock.color ||
                          mergedTheme.colors.onSurfaceVariant
                        }
                      />
                    </View>

                    <View style={dynamicStyles.suggestionContent}>
                      <Text style={[dynamicStyles.suggestionTitle, textStyle]}>
                        {item}
                      </Text>
                      <Text
                        style={[dynamicStyles.suggestionSubtitle, textStyle]}
                      >
                        Recent search
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {renderAttribution()}
              </ScrollView>
            </View>
          ) : (
            <View>
              {error ? (
                <View style={dynamicStyles.errorContainer}>
                  <Text style={[dynamicStyles.errorText, textStyle]}>
                    {error}
                  </Text>
                </View>
              ) : null}
              {suggestions.length > 0 && (
                <ScrollView
                  style={dynamicStyles.suggestionsList}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                >
                  {suggestions.map((item) => (
                    <TouchableOpacity
                      key={item.place_id}
                      style={[dynamicStyles.suggestionItem, suggestionStyle]}
                      onPress={() => handleSuggestionPress(item)}
                      activeOpacity={0.7}
                    >
                      <View style={dynamicStyles.suggestionIcon}>
                        <MapPin
                          size={mergedTheme.icons.mapPin.size}
                          color={
                            mergedTheme.icons.mapPin.color ||
                            mergedTheme.colors.onSurfaceVariant
                          }
                        />
                      </View>
                      <View style={dynamicStyles.suggestionContent}>
                        <Text
                          style={[dynamicStyles.suggestionTitle, textStyle]}
                          numberOfLines={1}
                        >
                          {item.display_name.split(',')[0]}
                        </Text>
                        <Text
                          style={[dynamicStyles.suggestionSubtitle, textStyle]}
                          numberOfLines={1}
                        >
                          {item.display_name
                            .split(',')
                            .slice(1)
                            .join(',')
                            .trim()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {renderAttribution()}
                </ScrollView>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

LocationAutocomplete.displayName = 'LocationAutocomplete';

// Re-export types and theme for easier imports
export type {
  LocationSuggestion,
  LocationAutocompleteProps,
  LocationAutocompleteRef,
  LocationAutocompleteTheme,
  DeepPartial,
  LocationProvider,
  ProviderConfig,
  QueryOptions,
} from './types';

export { defaultTheme } from './theme/defaultTheme';
