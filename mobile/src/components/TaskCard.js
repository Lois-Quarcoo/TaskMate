import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Circle, CheckCircle, Trash2, Calendar, Clock } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

export const TaskCard = ({ 
  task, 
  onPress, 
  onCheck, 
  onDelete 
}) => {
  const isCompleted = task.status === 'completed';
  const priorityColor = COLORS.priority[task.priority] || COLORS.textSecondary;
  const categoryColor = COLORS.categories[task.category] || COLORS.primary;

  const formatTime = (seconds) => {
    if (!seconds) return '0m focused';
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m focused`;
    }
    const hours = (minutes / 60).toFixed(1);
    return `${hours}h focused`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isCompleted && styles.completedCard,
        { borderLeftColor: priorityColor }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity 
        onPress={() => onCheck && onCheck(task._id, isCompleted ? 'pending' : 'completed')} 
        style={styles.checkButton}
      >
        {isCompleted ? (
          <CheckCircle size={22} color={COLORS.success} />
        ) : (
          <Circle size={22} color={COLORS.textSecondary} />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text 
          style={[
            styles.title, 
            isCompleted && styles.completedText
          ]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        
        {task.description ? (
          <Text 
            style={[
              styles.description, 
              isCompleted && styles.completedText
            ]}
            numberOfLines={1}
          >
            {task.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          {/* Category Tag */}
          <View style={[styles.tag, { backgroundColor: `${categoryColor}15` }]}>
            <View style={[styles.dot, { backgroundColor: categoryColor }]} />
            <Text style={[styles.tagText, { color: categoryColor }]}>{task.category}</Text>
          </View>

          {/* Time Focus */}
          <View style={styles.metaItem}>
            <Clock size={12} color={COLORS.textSecondary} style={styles.metaIcon} />
            <Text style={styles.metaText}>{formatTime(task.studyTimeSpent)}</Text>
          </View>

          {/* Due Date */}
          {task.dueDate && (
            <View style={styles.metaItem}>
              <Calendar size={12} color={COLORS.textSecondary} style={styles.metaIcon} />
              <Text style={styles.metaText}>{formatDate(task.dueDate)}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => onDelete && onDelete(task._id)}
        style={styles.deleteButton}
      >
        <Trash2 size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    marginVertical: SIZES.base,
    borderLeftWidth: 4,
    ...SHADOWS.light,
  },
  completedCard: {
    opacity: 0.6,
  },
  checkButton: {
    marginRight: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: SIZES.medium,
    ...FONTS.semiBold,
    marginBottom: 2,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    ...FONTS.regular,
    marginBottom: SIZES.base,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    ...FONTS.bold,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    ...FONTS.regular,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default TaskCard;
