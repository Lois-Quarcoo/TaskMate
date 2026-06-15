import React, { useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import ProgressBar from '../components/ProgressBar';
import TaskCard from '../components/TaskCard';
import { Clock, CheckCircle2, Play, ChevronRight, User as UserIcon } from 'lucide-react-native';

export const DashboardScreen = () => {
  const { user } = useContext(AuthContext);
  const { tasks, stats, fetchTasks, fetchStats, updateTask, deleteTask } = useContext(TaskContext);
  const navigation = useNavigation();

  // Reload data every time dashboard comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTasks({ status: 'pending' });
      fetchStats();
    }, [])
  );

  const getPriorityTasks = () => {
    // Sort tasks: High first, then Medium, then Low
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return [...tasks]
      .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
      .slice(0, 3);
  };

  const handleCheckTask = async (id, newStatus) => {
    await updateTask(id, { status: newStatus });
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
  };

  const xpProgress = user ? (user.xp % 1000) / 1000 : 0;
  const xpNeeded = user ? 1000 - (user.xp % 1000) : 1000;
  const priorityTasks = getPriorityTasks();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.usernameText}>{user?.username || 'Learner'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <UserIcon size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Gamified XP Progress Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>{user?.level || 1}</Text>
              <Text style={styles.levelLabel}>LEVEL</Text>
            </View>
            <View style={styles.xpDetails}>
              <Text style={styles.xpTitle}>XP Progress</Text>
              <Text style={styles.xpSub}>{user ? user.xp % 1000 : 0} / 1000 XP ({xpNeeded} XP to next level)</Text>
            </View>
          </View>
          <ProgressBar 
            progress={xpProgress} 
            color={COLORS.secondary} 
            height={10} 
          />
        </View>

        {/* Summary Statistics Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: `${COLORS.primary}20` }]}>
              <Clock size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalMinutes}m</Text>
            <Text style={styles.statLabel}>Focus Time</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: `${COLORS.success}20` }]}>
              <CheckCircle2 size={20} color={COLORS.success} />
            </View>
            <Text style={styles.statValue}>{stats.completedTasksCount}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>

        {/* Quick Focus Mode Card */}
        <TouchableOpacity 
          style={styles.focusActionCard}
          onPress={() => navigation.navigate('Focus')}
          activeOpacity={0.9}
        >
          <View style={styles.focusActionContent}>
            <Text style={styles.focusActionTitle}>Ready to focus?</Text>
            <Text style={styles.focusActionSub}>Start a Pomodoro timer and level up your mind.</Text>
          </View>
          <View style={styles.focusPlayBtn}>
            <Play size={20} color={COLORS.background} fill={COLORS.background} />
          </View>
        </TouchableOpacity>

        {/* Top Priority Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>High Priority Tasks</Text>
          <TouchableOpacity 
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('Tasks')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={14} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {priorityTasks.length > 0 ? (
          priorityTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onCheck={handleCheckTask}
              onDelete={handleDeleteTask}
              onPress={() => navigation.navigate('Tasks')}
            />
          ))
        ) : (
          <View style={styles.emptyTasksCard}>
            <Text style={styles.emptyTasksText}>No high priority tasks left!</Text>
            <TouchableOpacity 
              style={styles.createTaskBtn}
              onPress={() => navigation.navigate('Tasks')}
            >
              <Text style={styles.createTaskBtnText}>Add a Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    padding: SIZES.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  welcomeText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    ...FONTS.regular,
  },
  usernameText: {
    color: COLORS.textPrimary,
    fontSize: SIZES.extraLarge,
    ...FONTS.bold,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    ...SHADOWS.medium,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  levelNumber: {
    fontSize: 22,
    color: COLORS.background,
    ...FONTS.bold,
    lineHeight: 24,
  },
  levelLabel: {
    fontSize: 8,
    color: COLORS.background,
    ...FONTS.bold,
  },
  xpDetails: {
    flex: 1,
  },
  xpTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.medium,
    ...FONTS.semiBold,
  },
  xpSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.regular,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 18,
    ...FONTS.bold,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.regular,
  },
  focusActionCard: {
    backgroundColor: COLORS.cardSecondary,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    marginBottom: SIZES.large,
    ...SHADOWS.light,
  },
  focusActionContent: {
    flex: 1,
    marginRight: SIZES.medium,
  },
  focusActionTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.medium,
    ...FONTS.bold,
    marginBottom: 4,
  },
  focusActionSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.regular,
  },
  focusPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.large,
    ...FONTS.bold,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: COLORS.secondary,
    fontSize: 12,
    ...FONTS.bold,
    marginRight: 4,
  },
  emptyTasksCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.large,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginVertical: SIZES.base,
  },
  emptyTasksText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    ...FONTS.medium,
    marginBottom: SIZES.medium,
  },
  createTaskBtn: {
    backgroundColor: `${COLORS.secondary}15`,
    paddingHorizontal: SIZES.large,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  createTaskBtnText: {
    color: COLORS.secondary,
    fontSize: 12,
    ...FONTS.bold,
  }
});

export default DashboardScreen;
