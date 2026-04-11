export const theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    card: '#F2F2F2',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    error: '#FF3B30',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  typography: {
    sizes: {
      small: 12,
      regular: 16,
      large: 20,
      title: 24,
      header: 32,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
    },
  },
};
