<h1 align="center">
  react-native-places-autocomplete
</h1>

A provider-agnostic React Native autocomplete component for searching addresses and places. Supports multiple geocoding providers including Google Places, OpenStreetMap (Nominatim), LocationIQ, Mapbox, OpenCage, Geoapify, or any custom API. Easy to integrate, fully customizable, and lightweight.

<p align="center">
  <a href="https://www.npmjs.com/package/@julekgwa/react-native-places-autocomplete">
    <img src="https://img.shields.io/npm/v/@julekgwa/react-native-places-autocomplete.svg" alt="npm version"/>
  </a>
  <a href="https://www.npmjs.com/package/@julekgwa/react-native-places-autocomplete">
    <img src="https://img.shields.io/npm/dm/@julekgwa/react-native-places-autocomplete.svg" alt="npm downloads"/>
  </a>
  <a href="https://github.com/julekgwa/react-native-places-autocomplete/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@julekgwa/react-native-places-autocomplete.svg" alt="license"/>
  </a>
  <a href="https://github.com/julekgwa/react-native-places-autocomplete">
    <img src="https://img.shields.io/github/stars/julekgwa/react-native-places-autocomplete.svg?style=social" alt="stars"/>
  </a>
</p>

## ✨ Features

- 🌍 **Provider Agnostic** - Works with any geocoding API
- 🎨 **Fully Customizable** - Complete theme and styling control
- 📱 **React Native Ready** - Built specifically for React Native apps
- 🔍 **Recent Searches** - Built-in recent searches functionality
- ⚡ **Debounced Requests** - Optimized API calls with configurable debouncing
- 🎯 **TypeScript Support** - Full TypeScript support with type definitions
- 📦 **Lightweight** - Minimal dependencies
- 🔧 **Flexible** - Extensive configuration options

## 📦 Installation

```bash
npm install @julekgwa/react-native-places-autocomplete react-native-svg
```

### Additional Setup

Since the component uses SVG icons, you'll need to install `react-native-svg`:

For Expo projects:
```bash
expo install react-native-svg
```

For bare React Native projects, follow the [react-native-svg installation guide](https://github.com/software-mansion/react-native-svg#installation).

## 🚀 Quick Start

```typescript
import React from 'react';
import { LocationAutocomplete } from '@julekgwa/react-native-places-autocomplete';
import type { LocationSuggestion } from '@julekgwa/react-native-places-autocomplete';

const App = () => {
  const fetchSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
    // Your API implementation here
    const response = await fetch(`https://your-api.com/search?q=${query}`);
    const data = await response.json();

    // Transform your API response to match LocationSuggestion interface
    return data.results.map(item => ({
      place_id: item.id,
      display_name: item.name,
      lat: item.latitude.toString(),
      lon: item.longitude.toString(),
      type: item.type,
      importance: item.relevance || 0.5
    }));
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    console.log('Selected:', location);
  };

  return (
    <LocationAutocomplete
      placeholder="Search for a location..."
      fetchSuggestions={fetchSuggestions}
      onLocationSelect={handleLocationSelect}
      showRecentSearches={true}
    />
  );
};
```

## 🌐 Supported Providers

The library is provider-agnostic, but here are examples for popular geocoding services:

### 1. OpenCage Data

<img src="./misc/opencage-logo.white.png" alt="OpenCage" width="200"/>

```typescript
const fetchOpenCageSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  const API_KEY = 'your-opencage-api-key';
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${API_KEY}&limit=5`
  );
  const data = await response.json();

  return data.results.map((item: any) => ({
    place_id: `opencage-${item.geometry.lat}-${item.geometry.lng}`,
    display_name: item.formatted,
    lat: item.geometry.lat.toString(),
    lon: item.geometry.lng.toString(),
    type: item.components._type || 'unknown',
    importance: item.confidence || 0.5
  }));
};
```

### 2. LocationIQ

<img src="./misc/locationiq-logo.png" alt="LocationIQ" width="200"/>

```typescript
const fetchLocationIQSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  const API_KEY = 'your-locationiq-api-key';
  const response = await fetch(
    `https://eu1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(query)}&format=json&limit=5`
  );
  const data = await response.json();

  return data.map((item: any) => ({
    place_id: item.place_id,
    display_name: item.display_name,
    lat: item.lat,
    lon: item.lon,
    type: item.type,
    importance: parseFloat(item.importance) || 0.5
  }));
};
```

### 3. Mapbox

<img src="./misc/mapbox-logo-white.png" alt="Mapbox" width="200"/>

```typescript
const fetchMapboxSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  const API_KEY = 'your-mapbox-api-key';
  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query)}&access_token=${API_KEY}&limit=5`
  );
  const data = await response.json();

  return data.suggestions.map((item: any) => ({
    place_id: item.mapbox_id,
    display_name: item.full_address || item.name,
    lat: item.context?.coordinates?.latitude?.toString() || '0',
    lon: item.context?.coordinates?.longitude?.toString() || '0',
    type: item.feature_type,
    importance: 1 - (item.distance || 0) / 10000000 // Convert distance to importance
  }));
};
```

### 4. Geoapify

<img src="./misc/geoapify.png" alt="Geoapify" width="200"/>

```typescript
const fetchGeoapifySuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  const API_KEY = 'your-geoapify-api-key';
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${API_KEY}&limit=5`
  );
  const data = await response.json();

  return data.results.map((item: any) => ({
    place_id: item.place_id,
    display_name: item.formatted,
    lat: item.lat.toString(),
    lon: item.lon.toString(),
    type: item.result_type,
    importance: item.rank?.importance || 0.5
  }));
};
```

### 5. Google Places API

```typescript
const fetchGooglePlacesSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  const API_KEY = 'your-google-places-api-key';
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${API_KEY}`
  );
  const data = await response.json();

  // Note: Google Places requires additional API call to get coordinates
  return data.predictions.map((item: any) => ({
    place_id: item.place_id,
    display_name: item.description,
    lat: '0', // Would need Place Details API call
    lon: '0', // Would need Place Details API call
    type: item.types[0] || 'unknown',
    importance: 0.5
  }));
};
```

## 📝 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fetchSuggestions` | `(query: string) => Promise<LocationSuggestion[]>` | **Required** | Function to fetch location suggestions |
| `onLocationSelect` | `(location: LocationSuggestion) => void` | `undefined` | Callback when a location is selected |
| `onQueryChange` | `(query: string) => void` | `undefined` | Callback when search query changes |
| `placeholder` | `string` | `"Search for a location..."` | Input placeholder text |
| `debounceMs` | `number` | `300` | Debounce delay for API calls in milliseconds |
| `showRecentSearches` | `boolean` | `true` | Show recent searches when input is empty |
| `recentSearches` | `string[]` | `[]` | Array of recent search terms |
| `onRecentSearchesChange` | `(searches: string[]) => void` | `undefined` | Callback when recent searches update |
| `maxRecentSearches` | `number` | `5` | Maximum number of recent searches to keep |
| `containerStyle` | `ViewStyle` | `undefined` | Style for the main container |
| `inputStyle` | `ViewStyle` | `undefined` | Style for the input container |
| `suggestionStyle` | `ViewStyle` | `undefined` | Style for suggestion items |
| `textStyle` | `TextStyle` | `undefined` | Style for text elements |
| `theme` | `DeepPartial<LocationAutocompleteTheme>` | `{}` | Custom theme configuration |
| `attribution` | `React.ComponentType \| React.ReactElement` | `null` | Attribution component for your provider |

### Types

```typescript
interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

interface LocationAutocompleteRef {
  clear: () => void;
  focus: () => void;
  blur: () => void;
  getQuery: () => string;
  setQuery: (query: string) => void;
}
```

### Theme Customization

The component supports extensive theming:

```typescript
const customTheme = {
  colors: {
    primary: '#007AFF',
    surface: '#FFFFFF',
    onSurface: '#000000',
    onSurfaceVariant: '#666666',
    outline: '#E0E0E0',
    shadow: '#000000'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    iconMargin: 12,     // Spacing around icons
    iconPadding: 4,     // Padding for touchable icons
    loaderMargin: 8     // Margin for loading indicator
  },
  borderRadius: {
    lg: 12
  },
  typography: {
    body: { fontSize: 16, fontWeight: '500' },
    bodySmall: { fontSize: 14, fontWeight: '400' },
    titleMedium: { fontSize: 16, fontWeight: '600' }
  },
  icons: {
    search: { size: 20, color: '#007AFF' },
    mapPin: { size: 18, color: '#FF3B30' },
    clock: { size: 18, color: '#FF9500' },
    clear: { size: 16, color: '#8E8E93' }
  }
};

<LocationAutocomplete theme={customTheme} />
```

## 📱 Examples

### Basic Usage

```typescript
import React, { useState } from 'react';
import { LocationAutocomplete } from '@julekgwa/react-native-places-autocomplete';

const BasicExample = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const fetchSuggestions = async (query) => {
    // Your implementation
  };

  return (
    <LocationAutocomplete
      fetchSuggestions={fetchSuggestions}
      onLocationSelect={setSelectedLocation}
      placeholder="Where are you going?"
    />
  );
};
```

### With Recent Searches

```typescript
const WithRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState(['New York', 'London']);

  return (
    <LocationAutocomplete
      fetchSuggestions={fetchSuggestions}
      showRecentSearches={true}
      recentSearches={recentSearches}
      onRecentSearchesChange={setRecentSearches}
      maxRecentSearches={10}
    />
  );
};
```

### Custom Styling

```typescript
const StyledExample = () => (
  <LocationAutocomplete
    fetchSuggestions={fetchSuggestions}
    containerStyle={{
      margin: 16,
      backgroundColor: '#f5f5f5'
    }}
    theme={{
      colors: {
        primary: '#FF6B6B',
        surface: '#FFFFFF'
      },
      spacing: {
        lg: 20,
        iconMargin: 16
      }
    }}
  />
);
```

## 🔧 Advanced Usage

### Custom Attribution

```typescript
const Attribution = () => (
  <Text style={{ padding: 8, fontSize: 10, color: '#666' }}>
    © 2024 Your Geocoding Provider
  </Text>
);

<LocationAutocomplete
  fetchSuggestions={fetchSuggestions}
  attribution={Attribution}
/>
```

### Using Refs

```typescript
const MyComponent = () => {
  const autocompleteRef = useRef();

  const clearSearch = () => {
    autocompleteRef.current?.clear();
  };

  return (
    <>
      <LocationAutocomplete
        ref={autocompleteRef}
        fetchSuggestions={fetchSuggestions}
      />
      <Button title="Clear" onPress={clearSearch} />
    </>
  );
};
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [julekgwa](https://github.com/julekgwa)

## 🙏 Acknowledgments

- Built with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
- Icons powered by [react-native-svg](https://github.com/software-mansion/react-native-svg)
- Inspired by the React Native community

---

### Provider Attribution Requirements

When using geocoding services, make sure to comply with their attribution requirements:

- **OpenCage**: [Attribution Guide](https://opencagedata.com/credits)
- **LocationIQ**: [Attribution Requirements](https://locationiq.com/attribution)
- **Mapbox**: [Attribution Requirements](https://docs.mapbox.com/help/dive-deeper/attribution/#mapbox-logo)
- **Geoapify**: [Attribution Requirements](https://www.geoapify.com/pricing/)
- **Google**: [Google Maps Platform Terms](https://cloud.google.com/maps-platform/terms)
