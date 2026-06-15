export const COLORS = {
  // Theme bases
  background: '#0F0F1A',
  card: '#1B1B2F',
  cardSecondary: '#24243E',
  border: '#2A2A4A',
  
  // Brand accents
  primary: '#6C63FF',
  secondary: '#00F0FF',
  accent: '#FF007F',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0C0',
  textMuted: '#606080',
  
  // Feedback
  success: '#00FF87',
  warning: '#FFB800',
  danger: '#FF4646',
  info: '#00D8FF',
  
  // Priority colors
  priority: {
    low: '#00FF87',
    medium: '#FFB800',
    high: '#FF4646',
  },

  // Focus Categories Colors
  categories: {
    Study: '#6C63FF',
    Coding: '#00F0FF',
    Design: '#FF007F',
    Reading: '#00FF87',
    Writing: '#FFB800',
    Other: '#A0A0C0',
  }
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  doubleLarge: 32,
  radius: 12,
  radiusLarge: 20,
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  medium: {
    shadowColor: '#6C63FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  glow: {
    shadowColor: '#00F0FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  }
};

export const FONTS = {
  bold: {
    fontWeight: '700',
  },
  semiBold: {
    fontWeight: '600',
  },
  medium: {
    fontWeight: '500',
  },
  regular: {
    fontWeight: '400',
  },
  light: {
    fontWeight: '300',
  },
};
