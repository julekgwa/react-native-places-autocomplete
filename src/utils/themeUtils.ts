import { defaultTheme } from '../theme/defaultTheme';
import type { LocationAutocompleteTheme, DeepPartial } from '../types';

export const mergeTheme = (
  theme: DeepPartial<LocationAutocompleteTheme>
): LocationAutocompleteTheme => {
  const mergeDeep = (target: any, source: any): any => {
    // If source is not an object, return the target unmodified
    if (typeof source !== 'object' || source === null) {
      return target;
    }

    // If target is not an object, replace it with the source
    if (typeof target !== 'object' || target === null) {
      return { ...source };
    }

    const result = { ...target };

    // Recursively merge each property
    Object.keys(source).forEach((key) => {
      if (source[key] instanceof Array) {
        result[key] = [...source[key]];
      } else if (typeof source[key] === 'object' && source[key] !== null) {
        result[key] = mergeDeep(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    });

    return result;
  };

  return mergeDeep(defaultTheme, theme);
};
