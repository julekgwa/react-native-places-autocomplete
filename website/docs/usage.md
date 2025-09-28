---
id: usage
title: Usage
---

This page shows common usage patterns for `LocationAutocomplete`.

## Quick Start

Use a built-in provider or supply your own `fetchSuggestions` function.

- `provider` — choose a built-in provider (eg `openstreetmap`, `mapbox`, `google`, `tomtom`, etc.)
- `providerConfig` — pass provider-specific configuration such as `apiKey`
- `queryOptions` — additional query params forwarded to the provider request
- `fetchSuggestions` — optional: custom function that returns `LocationSuggestion[]`

Example (OpenStreetMap):

```tsx
<LocationAutocomplete
  provider="openstreetmap"
  queryOptions={{ countrycodes: 'us,ca,gb', limit: 8 }}
  onLocationSelect={(loc) => console.log('selected', loc)}
/>
```

Example (custom function):

```tsx
<LocationAutocomplete
  fetchSuggestions={async (query) => {
    const res = await fetch(`https://your-api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results.map((item: any) => ({
      place_id: item.id,
      display_name: item.name,
      lat: item.lat.toString(),
      lon: item.lon.toString(),
      type: item.type || 'unknown',
      importance: item.score || 0,
    }));
  }}
  onLocationSelect={console.log}
/>
```

### queryOptions

`queryOptions` allows passing provider-specific query parameters. It's merged into the request performed by the built-in providers. Example options:

- OpenStreetMap: `countrycodes`, `limit`, `addressdetails`
- Mapbox: `country`, `types`, `language`
- HERE: `limit`, `offset`, `language`
- TomTom: `limit`, `country`

### Infinite fetching

Some providers support pagination (offset/limit). The component exposes props and callbacks to implement infinite fetching in the suggestions list. See the `providers` doc for provider-specific details.
