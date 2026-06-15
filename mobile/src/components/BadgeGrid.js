import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Trophy, Star, Shield, Zap, CheckSquare, ClipboardCheck, Award, Crown, Lock } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

export const BadgeGrid = ({ 
  achievements = [], 
  unlockedAchievements = [] 
}) => {
  const isUnlocked = (badgeKey) => {
    return unlockedAchievements.some(
      (ua) => ua.achievement?.badgeKey === badgeKey || ua.achievement === badgeKey
    );
  };

  const getIcon = (badgeKey, isUnlocked, color) => {
    const iconSize = 28;
    const strokeColor = isUnlocked ? color : COLORS.textMuted;
    
    switch (badgeKey) {
      case 'first_session':
        return <Trophy size={iconSize} color={strokeColor} />;
      case 'sessions_5':
        return <Star size={iconSize} color={strokeColor} />;
      case 'focus_30m':
        return <Shield size={iconSize} color={strokeColor} />;
      case 'focus_120m':
        return <Zap size={iconSize} color={strokeColor} />;
      case 'tasks_3':
        return <CheckSquare size={iconSize} color={strokeColor} />;
      case 'tasks_10':
        return <ClipboardCheck size={iconSize} color={strokeColor} />;
      case 'level_3':
        return <Award size={iconSize} color={strokeColor} />;
      case 'level_10':
        return <Crown size={iconSize} color={strokeColor} />;
      default:
        return <Award size={iconSize} color={strokeColor} />;
    }
  };

  const getBadgeColor = (badgeKey) => {
    switch (badgeKey) {
      case 'first_session':
      case 'level_10':
        return COLORS.warning; // Gold/Yellow
      case 'focus_120m':
      case 'level_3':
        return COLORS.accent; // Pink/Rose
      case 'focus_30m':
      case 'tasks_3':
        return COLORS.secondary; // Cyan
      case 'sessions_5':
      case 'tasks_10':
        return COLORS.primary; // Purple
      default:
        return COLORS.primary;
    }
  };

  const renderItem = ({ item }) => {
    const unlocked = isUnlocked(item.badgeKey);
    const badgeColor = getBadgeColor(item.badgeKey);

    return (
      <View 
        style={[
          styles.badgeCard,
          unlocked ? styles.unlockedCard : styles.lockedCard,
          unlocked && { borderColor: `${badgeColor}30` }
        ]}
      >
        {/* Lock Overlay */}
        {!unlocked && (
          <View style={styles.lockIconContainer}>
            <Lock size={12} color={COLORS.textMuted} />
          </View>
        )}

        {/* Badge Icon */}
        <View 
          style={[
            styles.iconContainer,
            unlocked 
              ? { backgroundColor: `${badgeColor}15` } 
              : { backgroundColor: COLORS.border }
          ]}
        >
          {getIcon(item.badgeKey, unlocked, badgeColor)}
        </View>

        {/* Badge Details */}
        <Text style={[styles.title, !unlocked && styles.mutedText]} numberOfLines={1}>
          {item.title}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View 
          style={[
            styles.xpTag,
            unlocked ? { backgroundColor: `${badgeColor}20` } : { backgroundColor: COLORS.border }
          ]}
        >
          <Text 
            style={[
              styles.xpText,
              unlocked ? { color: badgeColor } : { color: COLORS.textMuted }
            ]}
          >
            +{item.xpValue} XP
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={achievements}
      renderItem={renderItem}
      keyExtractor={(item) => item._id || item.badgeKey}
      numColumns={2}
      columnWrapperStyle={styles.row}
      scrollEnabled={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No achievements registered in the system yet.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
    ...SHADOWS.light,
  },
  unlockedCard: {
    borderColor: `${COLORS.primary}20`,
  },
  lockedCard: {
    borderColor: 'transparent',
    opacity: 0.7,
  },
  lockIconContainer: {
    position: 'absolute',
    top: SIZES.base,
    right: SIZES.base,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: SIZES.font,
    ...FONTS.semiBold,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 10,
    ...FONTS.regular,
    textAlign: 'center',
    marginBottom: SIZES.base,
    height: 30,
  },
  mutedText: {
    color: COLORS.textMuted,
  },
  xpTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  xpText: {
    fontSize: 10,
    ...FONTS.bold,
  },
  emptyContainer: {
    padding: SIZES.large,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
  }
});

export default BadgeGrid;
