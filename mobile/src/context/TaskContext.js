import React, { createContext, useState, useContext } from 'react';
import { api } from '../services/api';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { updateUserProfileState, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalMinutes: 0,
    sessionCount: 0,
    categoryStats: {},
    completedTasksCount: 0,
    pendingTasksCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const fetchTasks = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await api.tasks.list(filters);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const res = await api.tasks.create(taskData);
      if (res.success) {
        setTasks((prev) => [res.data, ...prev]);
        // Refresh stats
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      console.error('Error adding task:', err);
      return { success: false, error: err.message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const res = await api.tasks.update(id, taskData);
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? res.data : t))
        );
        if (activeTask && activeTask._id === id) {
          setActiveTask(res.data);
        }
        // Refresh stats
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      console.error('Error updating task:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await api.tasks.delete(id);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        if (activeTask && activeTask._id === id) {
          setActiveTask(null);
        }
        // Refresh stats
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      return { success: false, error: err.message };
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await api.sessions.list();
      if (res.success) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const addSession = async (sessionData) => {
    try {
      const res = await api.sessions.create(sessionData);
      if (res.success) {
        const { session, xpTotal, level, newlyUnlocked } = res.data;
        
        // Update local session logs list
        setSessions((prev) => [session, ...prev]);
        
        // Update user state in AuthContext
        if (user) {
          const updatedUser = {
            ...user,
            xp: xpTotal,
            level: level,
          };
          if (newlyUnlocked && newlyUnlocked.length > 0) {
            // Merge newly unlocked achievements
            const newAchievements = newlyUnlocked.map(a => ({
              achievement: a,
              unlockedAt: new Date().toISOString()
            }));
            updatedUser.unlockedAchievements = [
              ...newAchievements,
              ...(user.unlockedAchievements || [])
            ];
          }
          updateUserProfileState(updatedUser);
        }
        
        // Refresh tasks and stats
        fetchTasks();
        fetchStats();
        
        return { success: true, data: res.data };
      }
    } catch (err) {
      console.error('Error logging study session:', err);
      return { success: false, error: err.message };
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.sessions.stats();
      if (res.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        sessions,
        stats,
        loading,
        activeTask,
        setActiveTask,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        fetchSessions,
        addSession,
        fetchStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
