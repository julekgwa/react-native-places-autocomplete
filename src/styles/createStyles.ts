import { StyleSheet } from 'react-native';
import type { LocationAutocompleteTheme } from '../types';

export const createStyles = (theme: LocationAutocompleteTheme) =>
  StyleSheet.create({
    container: {
      // flex: 1,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: theme.spacing.lg,
    },
    searchIcon: {
      marginRight: theme.spacing.iconMargin,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.onSurface,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: 0,
      minHeight: 30,
      textAlignVertical: 'center',
    },
    clearButton: {
      padding: theme.spacing.iconPadding,
      marginLeft: theme.spacing.iconMargin,
    },
    loadingIndicator: {
      marginLeft: theme.spacing.loaderMargin,
    },
    suggestionsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      maxHeight: 400,
    },
    suggestionsList: {
      maxHeight: 300,
      paddingBottom: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.typography.titleMedium.fontSize,
      fontWeight: theme.typography.titleMedium.fontWeight,
      color: theme.colors.onSurface,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    suggestionIcon: {
      marginRight: theme.spacing.iconMargin,
    },
    suggestionContent: {
      flex: 1,
    },
    suggestionTitle: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: theme.typography.body.fontWeight,
      color: theme.colors.onSurface,
      marginBottom: 2,
    },
    suggestionSubtitle: {
      fontSize: theme.typography.bodySmall.fontSize,
      color: theme.colors.onSurfaceVariant,
    },
    errorContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.onError,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    errorText: {
      fontSize: theme.typography.bodySmall.fontSize,
      color: theme.colors.error,
      fontWeight: theme.typography.body.fontWeight,
    },
  });
