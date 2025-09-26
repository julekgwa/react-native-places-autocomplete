import { useState } from 'react';
import { View, StyleSheet, Text, Alert, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  LocationAutocomplete,
  type LocationSuggestion,
} from '@julekgwa/react-native-places-autocomplete';

// mock
const mockFetchSuggestions = async (
  query: string
): Promise<LocationSuggestion[]> => {
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
    {
      place_id: '3',
      display_name: 'Paris, France',
      lat: '48.8566',
      lon: '2.3522',
      type: 'city',
      importance: 0.8,
    },
    {
      place_id: '4',
      display_name: 'Tokyo, Japan',
      lat: '35.6762',
      lon: '139.6503',
      type: 'city',
      importance: 0.7,
    },
    {
      place_id: '5',
      display_name: 'Sydney, Australia',
      lat: '-33.8688',
      lon: '151.2093',
      type: 'city',
      importance: 0.7,
    },
  ];

  // Filter results based on query
  return mockLocations.filter((location) =>
    location.display_name.toLowerCase().includes(query.toLowerCase())
  );
};

export default function App() {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Paris',
    'London',
  ]);

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    Alert.alert(
      'Location Selected',
      `You selected: ${location.display_name}\nCoordinates: ${location.lat}, ${location.lon}`
    );
  };

  const handleQueryChange = (query: string) => {
    console.log('Query changed:', query);
  };

  const handleRecentSearchesChange = (searches: string[]) => {
    setRecentSearches(searches);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.content}>
        <Text style={styles.title}>Location Autocomplete Example</Text>
        <Text style={styles.subtitle}>
          Start typing to search for locations
        </Text>

        <LocationAutocomplete
          placeholder="Search for a location..."
          fetchSuggestions={mockFetchSuggestions}
          onLocationSelect={handleLocationSelect}
          onQueryChange={handleQueryChange}
          showRecentSearches={true}
          recentSearches={recentSearches}
          onRecentSearchesChange={handleRecentSearchesChange}
          maxRecentSearches={5}
          debounceMs={300}
          containerStyle={styles.autocomplete}
          theme={{
            colors: {
              primary: '#007AFF',
              surface: '#FFFFFF',
              background: '#F2F2F7',
              onSurface: '#000000',
              onSurfaceVariant: '#8E8E93',
              outline: '#E5E5EA',
            },
            spacing: {
              lg: 16,
              md: 12,
              sm: 8,
            },
            borderRadius: {
              lg: 12,
            },
            icons: {
              search: {
                size: 22,
                color: '#007AFF',
              },
              mapPin: {
                size: 20,
                color: '#FF3B30',
              },
              clock: {
                size: 18,
                color: '#FF9500',
              },
              clear: {
                size: 16,
                color: '#8E8E93',
              },
            },
          }}
        />

        {selectedLocation && (
          <View style={styles.selectedLocation}>
            <Text style={styles.selectedTitle}>Selected Location:</Text>
            <Text style={styles.selectedText}>
              {selectedLocation.display_name}
            </Text>
            <Text style={styles.coordinates}>
              Lat: {selectedLocation.lat}, Lon: {selectedLocation.lon}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 20,
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
    marginBottom: 30,
    color: '#666',
  },
  autocomplete: {
    marginBottom: 20,
  },
  selectedLocation: {
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
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  selectedText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  coordinates: {
    fontSize: 12,
    color: '#666',
  },
});
