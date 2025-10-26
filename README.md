<h1 align="center">
  react-native-places-autocomplete
</h1>

A provider-agnostic React Native autocomplete component for searching addresses and places. Supports multiple **built-in geocoding providers** including OpenStreetMap (free), OpenCage, Google Places, Mapbox, LocationIQ, Geoapify, HERE, and TomTom, or use any custom API. Easy to integrate, fully customizable, and lightweight.

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

<p align="center">
  <img src="./misc/providers.png" alt="Supported Providers" width="600"/>
</p>

<p align="center">
  <a href="https://snack.expo.dev/@lekgwaraj/react-native-places-autocomplete">
    <img src="https://img.shields.io/badge/Try%20it%20on-Expo%20Snack-4630EB.svg?style=for-the-badge&logo=expo&labelColor=FFF&logoColor=000" alt="Try it on Expo Snack"/>
  </a>
</p>

## ✨ Features

- 🌍 **Built-in Providers** - OpenStreetMap (free), OpenCage, Google Places, Mapbox, LocationIQ, Geoapify, HERE, TomTom
- 🔧 **Provider Agnostic** - Works with any geocoding API or use built-in providers
- 🎨 **Fully Customizable** - Complete theme and styling control
- 📱 **React Native + Web Ready** - Built specifically for React Native apps
- 🔍 **Recent Searches** - Built-in recent searches functionality
- ⚡ **Debounced Requests** - Optimized API calls with configurable debouncing
- 🎯 **TypeScript Support** - Full TypeScript support with type definitions
- 📦 **Lightweight** - Minimal dependencies
- 🔤 **Query Options** - Customize API requests with provider-specific parameters

<picture>
  <source srcset="https://img.shields.io/badge/docs-places--autocomplete-00a76f?style=for-the-badge" media="(prefers-color-scheme: light)">
  <img src="https://img.shields.io/badge/docs-places--autocomplete-0f172a?style=for-the-badge" alt="Docs">
</picture>


## 📦 Installation

```bash
npm install @julekgwa/react-native-places-autocomplete
```

### Additional Setup

Since the component uses SVG icons, you'll need to install `react-native-svg`:

For Expo projects:
```bash
expo install react-native-svg
```

For bare React Native projects, follow the [react-native-svg installation guide](https://github.com/software-mansion/react-native-svg#installation).

## 🚀 Quick Start

### Using Built-in Providers (Recommended)

The easiest way to get started is using one of the built-in providers:

```typescript
import React from 'react';
import { LocationAutocomplete } from '@julekgwa/react-native-places-autocomplete';
import type { LocationSuggestion } from '@julekgwa/react-native-places-autocomplete';

const App = () => {
  const handleLocationSelect = (location: LocationSuggestion) => {
    console.log('Selected:', location);
  };

  return (
    <LocationAutocomplete
      // Use OpenStreetMap (completely free, no API key required)
      provider="openstreetmap"
      queryOptions={{
        countrycodes: "us,ca,gb", // Limit to specific countries
        limit: 8
      }}
      placeholder="Search for a location..."
      onLocationSelect={handleLocationSelect}
      showRecentSearches={true}
    />
  );
};
```

### Using Built-in Providers with API Keys

```typescript
// Mapbox example
<LocationAutocomplete
  provider="mapbox"
  providerConfig={{
    apiKey: "YOUR_MAPBOX_TOKEN"
  }}
  queryOptions={{
    country: "us",
    types: "place,address"
  }}
  onLocationSelect={handleLocationSelect}
/>

// Google Places example
<LocationAutocomplete
  provider="google"
  providerConfig={{
    apiKey: "YOUR_GOOGLE_API_KEY"
  }}
  queryOptions={{
    components: "country:us",
    types: "geocode"
  }}
  onLocationSelect={handleLocationSelect}
/>
```


## 📝 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fetchSuggestions` | `(query: string) => Promise<LocationSuggestion[]>` | `undefined` | Function to fetch location suggestions (optional when using `provider`) |
| `provider` | `LocationProvider` | `openstreetmap` | Built-in provider: `'openstreetmap'`, `'mapbox'`, `'google'`, `'geoapify'`, `'locationiq'` |
| `providerConfig` | `ProviderConfig` | `{}` | Configuration for built-in providers (API keys, base URLs) |
| `queryOptions` | `QueryOptions` | `{}` | Provider-specific query parameters |
| `onLocationSelect` | `(location: LocationSuggestion) => void` | `undefined` | Callback when a location is selected |
| `onQueryChange` | `(query: string) => void` | `undefined` | Callback when search query changes |
| `placeholder` | `string` | `"Search for a location..."` | Input placeholder text |
| `debounceMs` | `number` | `300` | Debounce delay for API calls in milliseconds |
| `showRecentSearches` | `boolean` | `true` | Show recent searches when input is empty |
| `recentSearches` | `string[]` | `[]` | Array of recent search terms |
| `onRecentSearchesChange` | `(searches: string[]) => void` | `undefined` | Callback when recent searches update |
| `maxRecentSearches` | `number` | `5` | Maximum number of recent searches to keep |
| `containerStyle` | `ViewStyle` | `undefined` | Style for the main wrapper container |
| `inputContainerStyle` | `ViewStyle` | `undefined` | Style for the input container (with search icon, input, clear button) |
| `inputStyle` | `TextStyle` | `undefined` | Style for the TextInput field itself |
| `suggestionStyle` | `ViewStyle` | `undefined` | Style for individual suggestion items |
| `textStyle` | `TextStyle` | `undefined` | Style for text elements (titles, labels) |
| `theme` | `DeepPartial<LocationAutocompleteTheme>` | `{}` | Custom theme configuration |
| `attribution` | `React.ComponentType \| React.ReactElement` | `null` | Attribution component for your provider |

## Documentation

You can view the live docs site at: [https://juniusl.space/places-autocomplete](https://juniusl.space/places-autocomplete)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [julekgwa](https://github.com/julekgwa)

## 🙏 Acknowledgments

- Built with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
- Icons powered by [react-native-svg](https://github.com/software-mansion/react-native-svg)
- Inspired by the React Native community
