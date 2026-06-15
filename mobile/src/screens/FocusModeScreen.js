import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  SafeAreaView, 
  Platform 
} from 'react-native';
import { Flame, Award, ChevronUp } from 'lucide-react-native';
import { TaskContext } from '../context/TaskContext';
import { useTimer } from '../hooks/useTimer';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import PomodoroTimer from '../components/PomodoroTimer';

export const FocusModeScreen = () => {
  const { tasks, fetchTasks, addSession, activeTask, setActiveTask } = useContext(TaskContext);
  const [selectedCategory, setSelectedCategory] = useState('Study');
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  
  // Completed session alert states
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);

  // Load pending tasks on mount
  useEffect(() => {
    fetchTasks({ status: 'pending' });
  }, []);

  const handleTimerComplete = async (mode, durationSeconds) => {
    if (mode === 'focus') {
      const taskId = activeTask ? activeTask._id : null;
      
      const res = await addSession({
        duration: durationSeconds,
        type: selectedCategory,
        taskId
      });

      if (res.success) {
        setSessionSummary(res.data);
        setIsAlertVisible(true);
      }
    }
  };

  const timer = useTimer(selectedMinutes, handleTimerComplete);

  const handleStart = () => {
    timer.start();
  };

  const handlePause = () => {
    timer.pause();
  };

  const handleReset = () => {
    timer.reset(selectedMinutes);
  };

  const handleMinutesChange = (mins) => {
    setSelectedMinutes(mins);
    timer.setTimerDuration(mins);
  };

  const handleSelectTask = (task) => {
    setActiveTask(task);
    if (task) {
      setSelectedCategory(task.category || 'Study');
    }
  };

  const currentThemeColor = COLORS.categories[selectedCategory] || COLORS.primary;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Focus Space</Text>

        {/* Task Selection Selector */}
        {!timer.isActive && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Select Task to Focus On</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.taskPickerRow}>
              <TouchableOpacity
                style={[
                  styles.taskCardPill,
                  !activeTask ? { borderColor: COLORS.secondary, backgroundColor: `${COLORS.secondary}10` } : null
                ]}
                onPress={() => handleSelectTask(null)}
              >
                <Text style={[styles.taskCardText, !activeTask ? { color: COLORS.secondary } : null]}>
                  General Study
                </Text>
              </TouchableOpacity>
              
              {tasks.filter(t => t.status === 'pending').map((task) => {
                const isSelected = activeTask?._id === task._id;
                const borderThemeColor = COLORS.categories[task.category] || COLORS.primary;
                return (
                  <TouchableOpacity
                    key={task._id}
                    style={[
                      styles.taskCardPill,
                      isSelected ? { borderColor: borderThemeColor, backgroundColor: `${borderThemeColor}10` } : null
                    ]}
                    onPress={() => handleSelectTask(task)}
                  >
                    <Text style={[styles.taskCardText, isSelected ? { color: borderThemeColor } : null]} numberOfLines={1}>
                      {task.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Category Picker (only visible if not focusing on a specific task and timer is stopped) */}
        {!timer.isActive && !activeTask && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Focus Category</Text>
            <View style={styles.pillsContainer}>
              {['Study', 'Coding', 'Design', 'Reading', 'Writing', 'Other'].map((cat) => {
                const isSelected = selectedCategory === cat;
                const catColor = COLORS.categories[cat] || COLORS.primary;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.pill,
                      isSelected ? { backgroundColor: `${catColor}20`, borderColor: catColor } : null
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.pillText, { color: isSelected ? catColor : COLORS.textSecondary }]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Duration Picker (only visible when timer is stopped) */}
        {!timer.isActive && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Session Duration</Text>
            <View style={styles.pillsContainer}>
              {[10, 25, 50, 60].map((mins) => {
                const isSelected = selectedMinutes === mins;
                return (
                  <TouchableOpacity
                    key={mins}
                    style={[
                      styles.pill,
                      isSelected ? { backgroundColor: `${currentThemeColor}20`, borderColor: currentThemeColor } : null
                    ]}
                    onPress={() => handleMinutesChange(mins)}
                  >
                    <Text style={[styles.pillText, { color: isSelected ? currentThemeColor : COLORS.textSecondary }]}>
                      {mins} MINS
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Timer Card */}
        <View style={styles.timerWrapper}>
          <PomodoroTimer
            secondsLeft={timer.secondsLeft}
            isActive={timer.isActive}
            mode={timer.mode}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            activeTask={activeTask}
            selectedCategory={selectedCategory}
          />
        </View>

        {/* Completion Alert Modal Overlay */}
        {sessionSummary && (
          <Modal
            visible={isAlertVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setIsAlertVisible(false)}
          >
            <View style={styles.alertOverlay}>
              <View style={styles.alertBox}>
                <View style={styles.fireIconBg}>
                  <Flame size={40} color={COLORS.secondary} fill={COLORS.secondary} />
                </View>
                
                <Text style={styles.alertTitle}>Session Completed!</Text>
                <Text style={styles.alertSub}>You stayed focused and completed your session.</Text>

                <View style={styles.rewardContainer}>
                  <Text style={styles.rewardText}>+{sessionSummary.xpEarned} XP Earned</Text>
                </View>

                {sessionSummary.leveledUp && (
                  <View style={styles.levelUpContainer}>
                    <ChevronUp size={24} color={COLORS.success} />
                    <Text style={styles.levelUpText}>LEVELED UP TO LEVEL {sessionSummary.level}!</Text>
                  </View>
                )}

                {sessionSummary.newlyUnlocked && sessionSummary.newlyUnlocked.length > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeHeader}>Achievements Unlocked!</Text>
                    {sessionSummary.newlyUnlocked.map((ach) => (
                      <View key={ach.badgeKey} style={styles.badgeRow}>
                        <Award size={18} color={COLORS.warning} />
                        <Text style={styles.badgeTitle}>{ach.title}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.closeAlertBtn, { backgroundColor: COLORS.secondary }]}
                  onPress={() => setIsAlertVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeAlertText}>Awesome</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  title: {
    color: COLORS.textPrimary,
    fontSize: SIZES.extraLarge,
    ...FONTS.bold,
    marginBottom: SIZES.large,
  },
  section: {
    marginBottom: SIZES.large,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.medium,
    marginBottom: SIZES.base,
  },
  taskPickerRow: {
    flexDirection: 'row',
  },
  taskCardPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    marginRight: 10,
  },
  taskCardText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.bold,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radius - 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  pillText: {
    fontSize: 11,
    ...FONTS.bold,
  },
  timerWrapper: {
    marginTop: SIZES.medium,
    marginBottom: SIZES.doubleLarge,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  alertBox: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.doubleLarge,
    alignItems: 'center',
    width: '100%',
    ...SHADOWS.medium,
  },
  fireIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.secondary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
    ...SHADOWS.glow,
  },
  alertTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.extraLarge,
    ...FONTS.bold,
  },
  alertSub: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
    marginTop: SIZES.base,
    marginBottom: SIZES.large,
  },
  rewardContainer: {
    backgroundColor: `${COLORS.secondary}15`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: SIZES.medium,
  },
  rewardText: {
    color: COLORS.secondary,
    fontSize: SIZES.medium,
    ...FONTS.bold,
  },
  levelUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  levelUpText: {
    color: COLORS.success,
    fontSize: SIZES.font,
    ...FONTS.bold,
    marginLeft: 6,
  },
  badgeContainer: {
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.medium,
    marginBottom: SIZES.large,
  },
  badgeHeader: {
    color: COLORS.warning,
    fontSize: 12,
    ...FONTS.bold,
    marginBottom: SIZES.base,
    letterSpacing: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  badgeTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.font,
    ...FONTS.medium,
    marginLeft: 8,
  },
  closeAlertBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glow,
  },
  closeAlertText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    ...FONTS.bold,
  }
});

export default FocusModeScreen;
