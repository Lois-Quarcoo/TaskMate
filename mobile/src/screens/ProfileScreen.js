import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { api } from '../services/api';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import BadgeGrid from '../components/BadgeGrid';
import { LogOut, Award, CheckCircle, Flame, Sparkles } from 'lucide-react-native';

export const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const { stats, fetchStats } = useContext(TaskContext);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchStats();
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const res = await api.achievements.list();
      if (res.success) {
        setAchievements(res.data);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
    }
  };

  const getLevelTitle = (level) => {
    if (level <= 1) return 'Beginner';
    if (level <= 3) return 'Focused Learner';
    if (level <= 6) return 'Study Master';
    return 'Academic Champion';
  };

  const currentLevelTitle = getLevelTitle(user?.level || 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarBg}>
            <Text style={styles.avatarText}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'S'}
            </Text>
          </View>
          <Text style={styles.username}>{user?.username || 'Student'}</Text>
          <Text style={styles.email}>{user?.email || 'student@taskmate.com'}</Text>
          
          <View style={styles.badgeTier}>
            <Sparkles size={14} color={COLORS.warning} style={{ marginRight: 6 }} />
            <Text style={styles.badgeTierText}>{currentLevelTitle.toUpperCase()}</Text>
          </View>
        </View>

        {/* Gamified Stats Summary */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Flame size={24} color={COLORS.accent} fill={COLORS.accent} />
            <Text style={styles.statVal}>{user?.streak || 3} Days</Text>
            <Text style={styles.statLabel}>Study Streak</Text>
          </View>

          <View style={styles.statBox}>
            <Award size={24} color={COLORS.secondary} />
            <Text style={styles.statVal}>{user?.xp || 0}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>

          <View style={styles.statBox}>
            <CheckCircle size={24} color={COLORS.success} />
            <Text style={styles.statVal}>{stats.completedTasksCount || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievement Badges</Text>
          <BadgeGrid 
            achievements={achievements} 
            unlockedAchievements={user?.unlockedAchievements || []} 
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <LogOut size={18} color={COLORS.danger} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    paddingBottom: 60,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: SIZES.large,
  },
  avatarBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.glow,
  },
  avatarText: {
    fontSize: 36,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  username: {
    fontSize: 22,
    color: COLORS.textPrimary,
    ...FONTS.bold,
  },
  email: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    marginTop: 4,
  },
  badgeTier: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.warning}15`,
    borderColor: COLORS.warning,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: SIZES.medium,
  },
  badgeTierText: {
    color: COLORS.warning,
    fontSize: 10,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.medium,
    marginVertical: SIZES.large,
    ...SHADOWS.light,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  statVal: {
    fontSize: 16,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    marginTop: 2,
  },
  achievementsSection: {
    marginVertical: SIZES.base,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.large,
    ...FONTS.bold,
    marginBottom: SIZES.medium,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.danger}15`,
    borderRadius: SIZES.radius,
    paddingVertical: 14,
    marginTop: SIZES.doubleLarge,
    borderWidth: 1,
    borderColor: `${COLORS.danger}30`,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: SIZES.font,
    ...FONTS.bold,
  }
});

export default ProfileScreen;
