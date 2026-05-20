import { addDays, formatDateKey } from '../utils/date.js';

const today = new Date();

export const sampleTasks = [
  {
    id: 'task-1',
    title: 'Finalize investor update deck',
    notes: 'Tighten metrics narrative and add roadmap slide.',
    category: 'Work',
    tags: ['strategy', 'deck'],
    priority: 'High',
    dueDate: formatDateKey(today),
    dueTime: '11:00',
    completed: false,
    repeat: 'none',
    reminderMinutes: 30,
    subtasks: [
      { id: 'sub-1', title: 'Refresh growth chart', completed: true },
      { id: 'sub-2', title: 'Add hiring plan', completed: false }
    ],
    createdAt: Date.now() - 86400000 * 2,
    order: 1
  },
  {
    id: 'task-2',
    title: 'Design weekly planning ritual',
    notes: 'Create a repeatable Sunday review checklist.',
    category: 'Personal',
    tags: ['planning'],
    priority: 'Medium',
    dueDate: formatDateKey(addDays(today, 1)),
    dueTime: '17:00',
    completed: false,
    repeat: 'weekly',
    reminderMinutes: 60,
    subtasks: [],
    createdAt: Date.now() - 86400000,
    order: 2
  },
  {
    id: 'task-3',
    title: 'Ship onboarding polish',
    notes: 'Improve empty state copy and responsive details.',
    category: 'Product',
    tags: ['ux', 'release'],
    priority: 'High',
    dueDate: formatDateKey(addDays(today, 2)),
    dueTime: '15:30',
    completed: false,
    repeat: 'none',
    reminderMinutes: 15,
    subtasks: [
      { id: 'sub-3', title: 'Review mobile states', completed: false },
      { id: 'sub-4', title: 'Check keyboard shortcuts', completed: false }
    ],
    createdAt: Date.now() - 43200000,
    order: 3
  },
  {
    id: 'task-4',
    title: 'Morning focus session',
    notes: 'Deep work block for the core roadmap.',
    category: 'Focus',
    tags: ['deep-work'],
    priority: 'Medium',
    dueDate: formatDateKey(addDays(today, -1)),
    dueTime: '09:00',
    completed: true,
    completedAt: Date.now() - 86400000,
    repeat: 'daily',
    reminderMinutes: 10,
    subtasks: [],
    createdAt: Date.now() - 86400000 * 4,
    order: 4
  },
  {
    id: 'task-5',
    title: 'Book dentist appointment',
    notes: 'Try for early morning next week.',
    category: 'Health',
    tags: ['errands'],
    priority: 'Low',
    dueDate: formatDateKey(addDays(today, 4)),
    dueTime: '10:00',
    completed: false,
    repeat: 'none',
    reminderMinutes: 1440,
    subtasks: [],
    createdAt: Date.now() - 7200000,
    order: 5
  }
];

export const defaultSettings = {
  theme: 'system',
  notifications: true,
  reminderSound: true,
  vibration: true,
  defaultReminderMinutes: 30,
  timeFormat: '12',
  accent: 'royal',
  onboardingSeen: false,
  profileName: 'Alex Morgan'
};
