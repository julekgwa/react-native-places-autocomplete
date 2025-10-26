import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  LocationAutocomplete,
  type LocationSuggestion,
  type LocationProvider,
} from '@julekgwa/react-native-places-autocomplete';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock function for demonstration (when not using built-in providers)
const mockFetchSuggestions = async (
  query: string
): Promise<LocationSuggestion<unknown>[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data based on query
  const mockLocations: LocationSuggestion[] = [
    {
      place_id: '1',
      display_name: 'New York, NY, United States',
      lat: '40.7128',
      lon: '-74.0060',
      type: 'city',
      importance: 0.9,
    },
    {
      place_id: '2',
      display_name: 'London, England, United Kingdom',
      lat: '51.5074',
      lon: '-0.1278',
      type: 'city',
      importance: 0.8,
    },
  ];

  return mockLocations.filter((location) =>
    location.display_name.toLowerCase().includes(query.toLowerCase())
  );
};

export default function App() {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [currentProvider, setCurrentProvider] = useState<
    LocationProvider | 'custom'
  >('openstreetmap');

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    Alert.alert(
      'Location Selected',
      `${location.display_name}\nLat: ${location.lat}, Lon: ${location.lon}`
    );
  };

  const providers: Array<{ key: LocationProvider | 'custom'; label: string }> =
    [
      { key: 'openstreetmap', label: 'OpenStreetMap (No API)' },
      { key: 'opencage', label: 'OpenCage (Requires API Key)' },
      { key: 'mapbox', label: 'Mapbox (Requires API Key)' },
      { key: 'google', label: 'Google Places (Requires API Key)' },
      { key: 'geoapify', label: 'Geoapify (Requires API Key)' },
      { key: 'locationiq', label: 'LocationIQ (Requires API Key)' },
      { key: 'here', label: 'HERE (Requires API Key)' },
      { key: 'tomtom', label: 'TomTom (Requires API Key)' },
      { key: 'custom', label: 'Custom Function' },
    ];

  const renderProviderExample = () => {
    const commonProps = {
      placeholder: `Search using ${currentProvider}...`,
      onLocationSelect: handleLocationSelect,
      showRecentSearches: true,
      recentSearches,
      onRecentSearchesChange: setRecentSearches,
      containerStyle: styles.autocompleteContainer,
    };

    if (currentProvider === 'custom') {
      return (
        <LocationAutocomplete
          {...commonProps}
          // @ts-ignore
          fetchSuggestions={mockFetchSuggestions}
        />
      );
    }

    if (currentProvider === 'openstreetmap') {
      return (
        <LocationAutocomplete
          {...commonProps}
          provider="openstreetmap"
          queryOptions={{
            countrycodes: 'us,ca,gb',
            limit: 8,
          }}
        />
      );
    }

    // For providers that require API keys, show a placeholder message
    return (
      <View style={styles.apiKeyRequired}>
        <Text style={styles.apiKeyText}>
          {currentProvider.toUpperCase()} requires an API key.
        </Text>
        <Text style={styles.apiKeySubtext}>
          Add your API key to providerConfig prop to use this provider.
        </Text>
        <View style={styles.codeExample}>
          <Text style={styles.codeText}>
            {`<LocationAutocomplete\n  provider="${currentProvider}"\n  providerConfig={{\n    apiKey: "YOUR_API_KEY"\n  }}\n  queryOptions={{\n    // Provider-specific options\n  }}\n/>`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>React Native Places Autocomplete</Text>
        <Text style={styles.subtitle}>Built-in Providers Demo</Text>

        {/* Provider Selection - Fixed at top */}
        <View style={styles.providersContainer}>
          <Text style={styles.sectionTitle}>Select Provider:</Text>
          <FlatList
            data={providers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.providerList}
            renderItem={({ item: provider }) => (
              <TouchableOpacity
                style={[
                  styles.providerButton,
                  currentProvider === provider.key &&
                    styles.providerButtonActive,
                ]}
                onPress={() => setCurrentProvider(provider.key)}
              >
                <Text
                  style={[
                    styles.providerButtonText,
                    currentProvider === provider.key &&
                      styles.providerButtonTextActive,
                  ]}
                >
                  {provider.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Autocomplete Example */}
        <View style={styles.exampleContainer}>
          <Text style={styles.sectionTitle}>Search Example:</Text>
          {renderProviderExample()}
        </View>

        {/* Selected Location Display */}
        {selectedLocation && (
          <View style={styles.selectedContainer}>
            <Text style={styles.sectionTitle}>Selected Location:</Text>
            <Text style={styles.locationText}>
              {selectedLocation.display_name}
            </Text>
            <Text style={styles.coordinatesText}>
              Coordinates: {selectedLocation.lat}, {selectedLocation.lon}
            </Text>
          </View>
        )}

        {/* Usage Examples */}
        <View style={styles.usageContainer}>
          <Text style={styles.sectionTitle}>Usage Examples:</Text>

          <View style={styles.exampleBlock}>
            <Text style={styles.exampleTitle}>OpenStreetMap (Free)</Text>
            <View style={styles.codeBlock}>
              <Text style={styles.code}>
                {`<LocationAutocomplete
  provider="openstreetmap"
  queryOptions={{
    countrycodes: "us,ca,gb",
    limit: 8
  }}
  onLocationSelect={handleSelect}
/>`}
              </Text>
            </View>
          </View>

          <View style={styles.exampleBlock}>
            <Text style={styles.exampleTitle}>Mapbox</Text>
            <View style={styles.codeBlock}>
              <Text style={styles.code}>
                {`<LocationAutocomplete
  provider="mapbox"
  providerConfig={{
    apiKey: 'YOUR_MAPBOX_TOKEN',
  }}
  queryOptions={{
    country: 'us',
    types: 'place,address',
  }}
  onLocationSelect={handleSelect}
/>;`}
              </Text>
            </View>
          </View>

          <View style={styles.exampleBlock}>
            <Text style={styles.exampleTitle}>Custom Function</Text>
            <View style={styles.codeBlock}>
              <Text style={styles.code}>
                {`<LocationAutocomplete
  fetchSuggestions={customFetchFunction}
  onLocationSelect={handleSelect}
/>`}
              </Text>
            </View>
          </View>
        </View>

        {/* Add bottom padding for better UX */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E6',
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  providersContainer: {
    marginBottom: 0, // Reduced since it's in header now
  },
  providerList: {
    paddingVertical: 10,
  },
  providerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#E1E1E6',
    marginRight: 10,
    marginLeft: 5,
  },
  providerButtonActive: {
    backgroundColor: '#007AFF',
  },
  providerButtonText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  providerButtonTextActive: {
    color: '#FFFFFF',
  },
  exampleContainer: {
    marginBottom: 30,
  },
  autocompleteContainer: {
    marginTop: 10,
  },
  selectedContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  coordinatesText: {
    fontSize: 14,
    color: '#333',
  },
  usageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  exampleBlock: {
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  codeBlock: {
    backgroundColor: '#F8F8FA',
    borderRadius: 8,
    padding: 12,
    overflow: 'hidden',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
  },
  apiKeyRequired: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFEEBA',
    marginTop: 10,
  },
  apiKeyText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#856404',
  },
  apiKeySubtext: {
    fontSize: 12,
    marginBottom: 10,
    color: '#856404',
  },
  codeExample: {
    backgroundColor: '#F8F8FA',
    borderRadius: 8,
    padding: 12,
    overflow: 'hidden',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
  },
  bottomPadding: {
    height: 20,
  },
});
