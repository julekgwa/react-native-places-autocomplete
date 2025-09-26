import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LocationAutocomplete } from '../index';
import type { LocationSuggestion } from '../types';

const mockSuggestions: LocationSuggestion[] = [
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

const mockFetchSuggestions = jest.fn().mockResolvedValue(mockSuggestions);

describe('LocationAutocomplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder text', () => {
    const { getByPlaceholderText } = render(
      <LocationAutocomplete
        fetchSuggestions={mockFetchSuggestions}
        placeholder="Search for a location..."
      />
    );

    expect(getByPlaceholderText('Search for a location...')).toBeTruthy();
  });

  it('calls fetchSuggestions when text is entered', async () => {
    const { getByPlaceholderText } = render(
      <LocationAutocomplete
        fetchSuggestions={mockFetchSuggestions}
        placeholder="Search for a location..."
      />
    );

    const input = getByPlaceholderText('Search for a location...');
    fireEvent.changeText(input, 'New York');

    await waitFor(() => {
      expect(mockFetchSuggestions).toHaveBeenCalledWith('New York');
    });
  });

  it('calls onLocationSelect when a suggestion is pressed', async () => {
    const mockOnLocationSelect = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LocationAutocomplete
        fetchSuggestions={mockFetchSuggestions}
        onLocationSelect={mockOnLocationSelect}
        placeholder="Search for a location..."
      />
    );

    const input = getByPlaceholderText('Search for a location...');
    fireEvent.changeText(input, 'New York');

    await waitFor(() => {
      expect(getByText('New York')).toBeTruthy();
    });

    fireEvent.press(getByText('New York'));

    expect(mockOnLocationSelect).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it('displays recent searches when input is focused and empty', () => {
    const { getByPlaceholderText, getByText } = render(
      <LocationAutocomplete
        fetchSuggestions={mockFetchSuggestions}
        recentSearches={['Paris', 'London']}
        showRecentSearches={true}
        placeholder="Search for a location..."
      />
    );

    const input = getByPlaceholderText('Search for a location...');
    fireEvent(input, 'focus');

    expect(getByText('Recent Searches')).toBeTruthy();
    expect(getByText('Paris')).toBeTruthy();
    expect(getByText('London')).toBeTruthy();
  });
});
