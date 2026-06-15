import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export const ProgressBar = ({ 
  progress = 0, 
  color = COLORS.primary, 
  height = 8, 
  showPercentage = false, 
  label = '' 
}) => {
  // Clamp progress between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentageText = `${Math.round(clampedProgress * 100)}%`;

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.labelsContainer}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          {showPercentage ? <Text style={styles.percentage}>{percentageText}</Text> : null}
        </View>
      )}
      <View style={[styles.barBg, { height, borderRadius: height / 2 }]}>
        <View 
          style={[
            styles.barFill, 
            { 
              width: `${clampedProgress * 100}%`, 
              backgroundColor: color, 
              height, 
              borderRadius: height / 2 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: SIZES.base,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    ...FONTS.medium,
  },
  percentage: {
    color: COLORS.secondary,
    fontSize: SIZES.small,
    ...FONTS.bold,
  },
  barBg: {
    width: '100%',
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  barFill: {
    // Add subtle glow shadow for Android/iOS if possible (handled by background colors)
  }
});

export default ProgressBar;
