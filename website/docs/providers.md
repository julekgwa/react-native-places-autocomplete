---
id: providers
title: Built-in Providers
---

This page documents the built-in providers supported by the library, sample `queryOptions`, and attribution notes.

## Supported Providers

- openstreetmap
- opencage
- mapbox
- google
- geoapify
- locationiq
- here
- tomtom

Each provider is exposed via the `provider` prop. For providers that require authentication, pass credentials via `providerConfig` (for example `providerConfig={{ apiKey: '...'}}`).

## Provider examples & queryOptions

### OpenStreetMap (Nominatim)
- No API key required
- Example options: `countrycodes`, `limit`, `addressdetails`
- Attribution: must credit OpenStreetMap and link to the ODbL

### OpenCage
- Requires `apiKey`
- Example options: `language`, `countrycode`, `bounds`, `limit`
- Attribution: credit OpenCage and data sources

### Mapbox
- Requires `apiKey`
- Example options: `country`, `types`, `language`, `limit`
- Attribution: display Mapbox attribution and OpenStreetMap when applicable

### Google Places
- Requires `apiKey`
- Example options: `components`, `types`, `language`
- Attribution: follow Google Maps Platform branding and attribution rules

### Geoapify
- Requires `apiKey`
- Example options: `filter`, `bias`, `type`, `limit`
- Attribution: credit Geoapify and data sources

### LocationIQ
- Requires `apiKey`
- Example options: `countrycodes`, `addressdetails`, `dedupe`, `limit`
- Attribution: credit LocationIQ and OpenStreetMap

### HERE
- Requires `apiKey`
- Example options: `limit`, `offset`, `country`, `language`
- Attribution: credit HERE and data sources (OpenStreetMap when applicable)

### TomTom
- Requires `apiKey`
- Example options: `country`, `limit`, `typeahead` (for autocomplete endpoints)
- Attribution: credit TomTom and data sources

## Infinite fetching / pagination

Some providers (Mapbox, HERE, TomTom, Geoapify, OpenCage, etc.) support pagination parameters (offset/limit or next tokens). The component includes hooks to integrate infinite scroll behavior on the suggestions list. Use `queryOptions` to pass paging params (for example `{ limit: 10, offset: 20 }`) and update them when loading more.

When implementing infinite fetching ensure you:

- Keep `fetchSuggestions` or the built-in provider call idempotent for the same paging params
- Merge results client-side when appending pages
- Respect debouncing to avoid multiple overlapping requests

## Attribution requirements

Attribution is required for all providers. OpenStreetMap and providers built on OSM data must include a visible, readable credit to OpenStreetMap with a link to: https://www.openstreetmap.org/copyright. See individual provider docs for specific required wording.

## Sample usage reference

```tsx
<LocationAutocomplete
  provider="tomtom"
  providerConfig={{ apiKey: 'YOUR_TOMTOM_KEY' }}
  queryOptions={{ country: 'US', limit: 8 }}
  onLocationSelect={(loc) => console.log(loc)}
/>
```


## Notes

If you prefer not to use built-in providers, pass your own `fetchSuggestions` function and the component will use that instead. When using built-in providers you may omit `fetchSuggestions` for convenience.
