import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import TaskCard from '../components/TaskCard';
import { Calendar as CalendarIcon } from 'lucide-react-native';

export const CalendarScreen = () => {
  const { tasks, fetchTasks, updateTask, deleteTask } = useContext(TaskContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    generateWeekDays();
    fetchTasks(); // Load all tasks to filter locally by date
  }, []);

  const generateWeekDays = () => {
    const days = [];
    const today = new Date();
    
    // Generate 7 days: starting 2 days ago up to 4 days ahead
    for (let i = -2; i <= 4; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    setWeekDays(days);
  };

  const isSameDate = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getFilteredTasks = () => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      return isSameDate(new Date(t.dueDate), selectedDate);
    });
  };

  const handleCheckTask = async (id, newStatus) => {
    await updateTask(id, { status: newStatus });
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const filteredTasks = getFilteredTasks();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Schedule</Text>
          <CalendarIcon size={22} color={COLORS.secondary} />
        </View>

        {/* Horizontal Weekday Picker */}
        <View style={styles.weekContainer}>
          {weekDays.map((day, idx) => {
            const isSelected = isSameDate(day, selectedDate);
            const isToday = isSameDate(day, new Date());
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dayCard,
                  isSelected ? { backgroundColor: COLORS.primary } : null,
                  isToday && !isSelected ? { borderColor: COLORS.secondary, borderWidth: 1 } : null
                ]}
                onPress={() => setSelectedDate(day)}
                activeOpacity={0.7}
              >
                <Text 
                  style={[
                    styles.dayNameText,
                    isSelected ? { color: COLORS.background } : { color: COLORS.textSecondary }
                  ]}
                >
                  {dayNames[day.getDay()]}
                </Text>
                <Text 
                  style={[
                    styles.dayNumText,
                    isSelected ? { color: COLORS.background } : { color: COLORS.textPrimary }
                  ]}
                >
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Date Subheader */}
        <Text style={styles.dateSubheader}>
          {selectedDate.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>

        {/* Timeline Tasks List */}
        <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onCheck={handleCheckTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks scheduled for this day.</Text>
            </View>
          )}
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.extraLarge,
    ...FONTS.bold,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  dayCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 3,
    ...SHADOWS.light,
  },
  dayNameText: {
    fontSize: 10,
    ...FONTS.medium,
    marginBottom: 4,
  },
  dayNumText: {
    fontSize: 16,
    ...FONTS.bold,
  },
  dateSubheader: {
    color: COLORS.secondary,
    fontSize: SIZES.font,
    ...FONTS.bold,
    marginBottom: SIZES.medium,
  },
  scrollList: {
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: SIZES.doubleLarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
  }
});

export default CalendarScreen;
