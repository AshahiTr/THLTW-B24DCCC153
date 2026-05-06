import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { message } from 'antd';
import moment from 'moment';

const STORAGE_KEY = 'tasks_list';

const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design new dashboard',
    description: 'Create wireframes and mockups for the dashboard redesign',
    priority: 'high',
    status: 'doing',
    tags: ['design', 'ui'],
    deadline: moment().add(2, 'days').toISOString(),
    createdAt: moment().subtract(1, 'day').toISOString(),
    updatedAt: moment().subtract(1, 'day').toISOString(),
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Check and approve pending feature branches',
    priority: 'medium',
    status: 'todo',
    tags: ['code-review'],
    deadline: moment().add(1, 'day').toISOString(),
    createdAt: moment().toISOString(),
    updatedAt: moment().toISOString(),
  },
  {
    id: '3',
    title: 'Fix login bug',
    description: 'Users unable to login with SSO on mobile devices',
    priority: 'high',
    status: 'doing',
    tags: ['bug', 'urgent'],
    deadline: moment().subtract(1, 'day').toISOString(),
    createdAt: moment().subtract(2, 'days').toISOString(),
    updatedAt: moment().subtract(2, 'days').toISOString(),
  },
  {
    id: '4',
    title: 'Update documentation',
    description: 'Add new API endpoints documentation',
    priority: 'low',
    status: 'todo',
    tags: ['documentation'],
    deadline: moment().add(5, 'days').toISOString(),
    createdAt: moment().toISOString(),
    updatedAt: moment().toISOString(),
  },
  {
    id: '5',
    title: 'Deploy v2.0 release',
    description: 'Release new version to production',
    priority: 'high',
    status: 'done',
    tags: ['release', 'deployment'],
    deadline: moment().subtract(1, 'day').toISOString(),
    createdAt: moment().subtract(3, 'days').toISOString(),
    updatedAt: moment().toISOString(),
  },
  {
    id: '6',
    title: 'Write unit tests',
    description: 'Add test coverage for auth module (min 80%)',
    priority: 'medium',
    status: 'done',
    tags: ['testing', 'quality'],
    deadline: moment().subtract(2, 'days').toISOString(),
    createdAt: moment().subtract(4, 'days').toISOString(),
    updatedAt: moment().subtract(1, 'day').toISOString(),
  },
  {
    id: '7',
    title: 'Schedule team meeting',
    description: 'Weekly stand-up meeting at 10:00 AM',
    priority: 'low',
    status: 'todo',
    tags: ['meeting'],
    deadline: moment().add(1, 'day').toISOString(),
    createdAt: moment().toISOString(),
    updatedAt: moment().toISOString(),
  },
  {
    id: '8',
    title: 'Optimize database queries',
    description: 'Improve performance of user dashboard queries',
    priority: 'medium',
    status: 'doing',
    tags: ['performance', 'backend'],
    deadline: moment().add(3, 'days').toISOString(),
    createdAt: moment().toISOString(),
    updatedAt: moment().toISOString(),
  },
];

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        // Initialize with sample data on first use
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TASKS));
        setTasks(SAMPLE_TASKS);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      // Fallback to sample data on error
      setTasks(SAMPLE_TASKS);
    }
  };

  const saveTasks = (newTasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTasks([...tasks, newTask]);
    message.success('Task added successfully');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    saveTasks(updated);
    message.success('Task updated successfully');
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((t) => t.id !== id));
    message.success('Task deleted successfully');
  };

  const moveTask = (id: string, newStatus: TaskStatus) => {
    updateTask(id, { status: newStatus });
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const overdue = tasks.filter(
      (t) =>
        t.deadline &&
        t.status !== 'done' &&
        moment(t.deadline).isBefore(moment())
    ).length;
    return { total, completed, overdue };
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
    getStats,
    loadTasks,
  };
};
