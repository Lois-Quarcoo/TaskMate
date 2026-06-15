import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, RotateCcw, Flame, Coffee } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

export const PomodoroTimer = ({
  secondsLeft,
  isActive,
  mode,
  onStart,
  onPause,
  onReset,
  activeTask,
  selectedCategory = 'Study'
}) => {
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const currentThemeColor = mode === 'focus' 
    ? (COLORS.categories[selectedCategory] || COLORS.primary)
    : COLORS.success;

  return (
    <View style={styles.container}>
      {/* Active Task Indicator */}
      <View style={styles.header}>
        {mode === 'focus' ? (
          <View style={styles.modeIndicator}>
            <Flame size={16} color={currentThemeColor} style={styles.modeIcon} />
            <Text style={[styles.modeText, { color: currentThemeColor }]}>FOCUS SESSION</Text>
          </View>
        ) : (
          <View style={styles.modeIndicator}>
            <Coffee size={16} color={COLORS.success} style={styles.modeIcon} />
            <Text style={[styles.modeText, { color: COLORS.success }]}>SHORT BREAK</Text>
          </View>
        )}
        
        {mode === 'focus' && activeTask && (
          <Text style={styles.taskText} numberOfLines={1}>
            Focusing on: <Text style={styles.taskTitle}>{activeTask.title}</Text>
          </Text>
        )}
      </View>

      {/* Timer Circle/Display */}
      <View style={[styles.timerCircle, { borderColor: `${currentThemeColor}30` }]}>
        <View style={[styles.timerInnerCircle, { borderColor: currentThemeColor }]}>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
          <Text style={styles.categoryText}>
            {mode === 'focus' ? selectedCategory.toUpperCase() : 'REST'}
          </Text>
        </View>
      </View>

      {/* Controls Row */}
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          onPress={onReset} 
          style={styles.controlBtnSmall}
          activeOpacity={0.7}
        >
          <RotateCcw size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {isActive ? (
          <TouchableOpacity 
            onPress={onPause} 
            style={[styles.controlBtnLarge, { backgroundColor: currentThemeColor }]}
            activeOpacity={0.8}
          >
            <Pause size={28} color={COLORS.background} fill={COLORS.background} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={onStart} 
            style={[styles.controlBtnLarge, { backgroundColor: currentThemeColor }]}
            activeOpacity={0.8}
          >
            <Play size={28} color={COLORS.background} fill={COLORS.background} style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        )}

        <View style={{ width: 44 }} /> {/* Spacer to balance layout */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.large,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLarge,
    width: '100%',
    ...SHADOWS.medium,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.background}80`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: SIZES.base,
  },
  modeIcon: {
    marginRight: 6,
  },
  modeText: {
    fontSize: 12,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  taskText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    ...FONTS.regular,
    textAlign: 'center',
  },
  taskTitle: {
    color: COLORS.textPrimary,
    ...FONTS.semiBold,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.large,
    backgroundColor: `${COLORS.background}50`,
  },
  timerInnerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  timerText: {
    color: COLORS.textPrimary,
    fontSize: 44,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    ...FONTS.bold,
    letterSpacing: 2,
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: SIZES.medium,
  },
  controlBtnSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  controlBtnLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
  }
});

export default PomodoroTimer;
