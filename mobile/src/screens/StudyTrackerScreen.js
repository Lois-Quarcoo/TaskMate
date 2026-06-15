import React, { useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TaskContext } from '../context/TaskContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { Hourglass, Trophy, Calendar } from 'lucide-react-native';

export const StudyTrackerScreen = () => {
  const { sessions, stats, fetchSessions, fetchStats } = useContext(TaskContext);

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
      fetchStats();
    }, [])
  );

  const formatDuration = (seconds) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCategoryColor = (cat) => {
    return COLORS.categories[cat] || COLORS.primary;
  };

  const renderSessionItem = ({ item }) => {
    const categoryColor = getCategoryColor(item.type);
    
    return (
      <View style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          {/* Category Tag */}
          <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}15` }]}>
            <View style={[styles.dot, { backgroundColor: categoryColor }]} />
            <Text style={[styles.categoryName, { color: categoryColor }]}>
              {item.type || 'Study'}
            </Text>
          </View>
          
          <Text style={styles.xpText}>+{item.xpEarned} XP</Text>
        </View>

        <View style={styles.sessionDetails}>
          <Text style={styles.durationText}>
            Focused for {formatDuration(item.duration)}
          </Text>
          {item.task && (
            <Text style={styles.taskText} numberOfLines={1}>
              Task: {item.task.title}
            </Text>
          )}
        </View>

        <View style={styles.timeRow}>
          <Calendar size={12} color={COLORS.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.timeText}>{formatDateTime(item.startTime)}</Text>
        </View>
      </View>
    );
  };

  // Convert categoryStats object to list for rendering
  const categoryStatsList = Object.entries(stats.categoryStats || {}).map(([key, value]) => ({
    category: key,
    ...value
  })).sort((a, b) => b.minutes - a.minutes);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Study Tracker</Text>

        {/* Analytics Header Section */}
        <View style={styles.analyticsSection}>
          <View style={styles.analyticItem}>
            <Hourglass size={20} color={COLORS.secondary} />
            <Text style={styles.analyticValue}>{stats.totalMinutes} mins</Text>
            <Text style={styles.analyticLabel}>Total Focus</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.analyticItem}>
            <Trophy size={20} color={COLORS.warning} />
            <Text style={styles.analyticValue}>{stats.sessionCount}</Text>
            <Text style={styles.analyticLabel}>Sessions</Text>
          </View>
        </View>

        {/* Category Breakdown list */}
        {categoryStatsList.length > 0 && (
          <View style={styles.breakdownContainer}>
            <Text style={styles.subTitle}>Category Split</Text>
            <View style={styles.categoryRow}>
              {categoryStatsList.slice(0, 4).map((item) => {
                const color = getCategoryColor(item.category);
                return (
                  <View key={item.category} style={styles.categoryPill}>
                    <Text style={[styles.categoryPillText, { color }]}>{item.category}</Text>
                    <Text style={styles.categoryPillMins}>{item.minutes}m</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <Text style={styles.subTitle}>History Logs</Text>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item._id}
          renderItem={renderSessionItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No focus sessions logged yet. Head to Focus Mode to get started!</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    flex: 1,
    padding: SIZES.large,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: SIZES.extraLarge,
    ...FONTS.bold,
    marginBottom: SIZES.large,
  },
  analyticsSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SIZES.large,
    ...SHADOWS.light,
  },
  analyticItem: {
    alignItems: 'center',
  },
  analyticValue: {
    color: COLORS.textPrimary,
    fontSize: 18,
    ...FONTS.bold,
    marginTop: SIZES.base,
  },
  analyticLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    ...FONTS.regular,
  },
  divider: {
    height: 40,
    width: 1,
    backgroundColor: COLORS.border,
  },
  breakdownContainer: {
    marginBottom: SIZES.large,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: SIZES.base,
  },
  categoryPill: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillText: {
    fontSize: 11,
    ...FONTS.bold,
    marginRight: 6,
  },
  categoryPillMins: {
    color: COLORS.textPrimary,
    fontSize: 11,
    ...FONTS.bold,
  },
  subTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.large,
    ...FONTS.bold,
    marginVertical: SIZES.base,
  },
  listContainer: {
    paddingBottom: 40,
  },
  sessionCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    marginVertical: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 10,
    ...FONTS.bold,
  },
  xpText: {
    color: COLORS.secondary,
    fontSize: 12,
    ...FONTS.bold,
  },
  sessionDetails: {
    marginBottom: SIZES.base,
  },
  durationText: {
    color: COLORS.textPrimary,
    fontSize: SIZES.font,
    ...FONTS.semiBold,
  },
  taskText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.regular,
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 10,
    ...FONTS.regular,
  },
  emptyContainer: {
    padding: SIZES.doubleLarge,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
    lineHeight: 20,
  }
});

export default StudyTrackerScreen;
