import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  SafeAreaView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react-native';
import { TaskContext } from '../context/TaskContext';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import TaskCard from '../components/TaskCard';

export const TasksScreen = () => {
  const { tasks, loading, fetchTasks, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const [filter, setFilter] = useState('pending'); // 'all' | 'pending' | 'completed'
  const [isModalVisible, setIsModalVisible] = useState(false);

  // New task form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium'); // 'low' | 'medium' | 'high'
  const [category, setCategory] = useState('Study'); // 'Study' | 'Work' | 'Coding' | etc
  const [dueDaysOffset, setDueDaysOffset] = useState(0); // 0 = Today, 1 = Tomorrow, 7 = Next Week
  
  useEffect(() => {
    const filters = {};
    if (filter !== 'all') {
      filters.status = filter;
    }
    fetchTasks(filters);
  }, [filter]);

  const handleCheckTask = async (id, newStatus) => {
    await updateTask(id, { status: newStatus });
    // Refresh current tab
    const filters = {};
    if (filter !== 'all') filters.status = filter;
    fetchTasks(filters);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
  };

  const handleAddTaskSubmit = async () => {
    if (!title.trim()) return;

    // Calculate due date based on offset
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueDaysOffset);
    dueDate.setHours(23, 59, 59, 999);

    const taskData = {
      title,
      description,
      priority,
      category,
      dueDate: dueDate.toISOString(),
    };

    const res = await addTask(taskData);
    if (res.success) {
      // Clear form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Study');
      setDueDaysOffset(0);
      setIsModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Task Manager</Text>
          <TouchableOpacity 
            style={[styles.addBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => setIsModalVisible(true)}
            activeOpacity={0.8}
          >
            <Plus size={20} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        {/* Tab Filters */}
        <View style={styles.tabsRow}>
          {['pending', 'completed', 'all'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                filter === tab ? { borderBottomColor: COLORS.secondary } : null
              ]}
              onPress={() => setFilter(tab)}
            >
              <Text 
                style={[
                  styles.tabText, 
                  filter === tab ? { color: COLORS.secondary, ...FONTS.bold } : null
                ]}
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.secondary} />
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onCheck={handleCheckTask}
                onDelete={handleDeleteTask}
              />
            )}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tasks found in this section.</Text>
              </View>
            }
          />
        )}

        {/* Slide-Up Add Task Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New Task</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <X size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Title Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Task Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What do you need to do?"
                  placeholderTextColor={COLORS.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add details..."
                  placeholderTextColor={COLORS.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Priority Select */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.pillsRow}>
                  {['low', 'medium', 'high'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.pill,
                        priority === p ? { backgroundColor: `${COLORS.priority[p]}25`, borderColor: COLORS.priority[p] } : null
                      ]}
                      onPress={() => setPriority(p)}
                    >
                      <Text style={[styles.pillText, { color: priority === p ? COLORS.priority[p] : COLORS.textSecondary }]}>
                        {p.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category Select */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.pillsRow}>
                  {['Study', 'Coding', 'Design', 'Reading', 'Writing', 'Other'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.pill,
                        category === cat ? { backgroundColor: `${COLORS.categories[cat]}25`, borderColor: COLORS.categories[cat] } : null
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.pillText, { color: category === cat ? COLORS.categories[cat] : COLORS.textSecondary }]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Due Date Select */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Due Date</Text>
                <View style={styles.pillsRow}>
                  {[
                    { label: 'Today', offset: 0 },
                    { label: 'Tomorrow', offset: 1 },
                    { label: 'Next Week', offset: 7 }
                  ].map((d) => (
                    <TouchableOpacity
                      key={d.label}
                      style={[
                        styles.pill,
                        dueDaysOffset === d.offset ? { backgroundColor: `${COLORS.secondary}25`, borderColor: COLORS.secondary } : null
                      ]}
                      onPress={() => setDueDaysOffset(d.offset)}
                    >
                      <Text style={[styles.pillText, { color: dueDaysOffset === d.offset ? COLORS.secondary : COLORS.textSecondary }]}>
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={[styles.submitBtn, { backgroundColor: COLORS.secondary }]}
                onPress={handleAddTaskSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitBtnText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    marginBottom: SIZES.medium,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.extraLarge,
    ...FONTS.bold,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SIZES.base,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.medium,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: SIZES.doubleLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: SIZES.radiusLarge,
    borderTopRightRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.large,
    ...FONTS.bold,
  },
  formGroup: {
    marginBottom: SIZES.medium,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.medium,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.medium,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: COLORS.textPrimary,
    fontSize: SIZES.font,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pillsRow: {
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
    backgroundColor: COLORS.background,
  },
  pillText: {
    fontSize: 11,
    ...FONTS.bold,
  },
  submitBtn: {
    borderRadius: SIZES.radius,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.medium,
    ...SHADOWS.glow,
  },
  submitBtnText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    ...FONTS.bold,
  }
});

export default TasksScreen;
