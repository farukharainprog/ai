import React, { useState, useEffect } from 'react';
import { UserProfile, TaskItem } from '../../types';
import { getTasks, saveTasks, getNotes, saveNotes } from '../../services/storage';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Tag,
  Clock,
  Sparkles,
  BookOpen,
  Briefcase,
  User,
  Flame,
  Save,
} from 'lucide-react';

interface ProductivityPlannerProps {
  currentUser: UserProfile;
}

export const ProductivityPlanner: React.FC<ProductivityPlannerProps> = ({ currentUser }) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Study' | 'Work' | 'Personal' | 'Business'>('Study');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState('Today');
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    setTasks(getTasks(currentUser.id));
    setNotes(getNotes(currentUser.id));
  }, [currentUser.id]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      userId: currentUser.id,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      completed: false,
      dueDate: newDueDate || 'Today',
      createdAt: new Date().toISOString(),
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveTasks(currentUser.id, updated);
    setNewTitle('');
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    saveTasks(currentUser.id, updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(currentUser.id, updated);
  };

  const handleSaveNotes = () => {
    saveNotes(currentUser.id, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'pending') return !t.completed;
    if (activeFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-purple-400" />
            <span>Personal Productivity & Planner</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize daily tasks, monitor study goals, and keep personal thoughts synchronized.
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-[#101629] border border-white/10 shrink-0">
          <div className="text-xs font-semibold text-slate-300">
            Progress: <span className="text-purple-400 font-mono">{completedCount}/{tasks.length}</span> ({progressPercent}%)
          </div>
          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#287BFF] to-[#8955FF] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tasks & Planner */}
        <div className="lg:col-span-7 space-y-4">
          {/* Add Task Card */}
          <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-[#101629] border border-white/10 space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add a new task or study milestone..."
              className="w-full px-3.5 py-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#8955FF]"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2 text-xs">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-lg outline-none cursor-pointer"
                >
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Business">Business</option>
                  <option value="Personal">Personal</option>
                </select>

                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-lg outline-none cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>

                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="Due e.g. Today 6 PM"
                  className="px-2.5 py-1.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-lg outline-none w-28"
                />
              </div>

              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#8955FF] hover:bg-[#7840f0] rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </form>

          {/* Filter segment */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-300">My Daily Tasks</span>
            <div className="flex items-center gap-1 p-0.5 bg-[#101629] rounded-lg border border-white/5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer ${
                  activeFilter === 'all' ? 'bg-[#287BFF] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer ${
                  activeFilter === 'pending' ? 'bg-[#287BFF] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium cursor-pointer ${
                  activeFilter === 'completed' ? 'bg-[#287BFF] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 rounded-2xl bg-[#101629] border border-dashed border-white/10 text-xs">
                No tasks matching this view. Add a task above to plan your day.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const priorityColors = {
                  high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                  low: 'text-slate-400 bg-white/5 border-white/10',
                };

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-xl bg-[#101629] border transition-all flex items-center justify-between gap-3 ${
                      task.completed ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="text-slate-400 hover:text-[#287BFF] transition-colors cursor-pointer shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="truncate text-left">
                        <span
                          className={`text-xs font-medium block truncate ${
                            task.completed ? 'line-through text-slate-500' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-semibold text-slate-300">{task.category}</span>
                          <span>·</span>
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-mono ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Personal Notes & Study Timetable */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 flex-1 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-white">Quick Scratchpad & Timetable</span>
              <button
                onClick={handleSaveNotes}
                className="px-3 py-1 text-xs font-semibold text-white bg-[#287BFF] hover:bg-[#2066d9] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{notesSaved ? 'Saved!' : 'Save Notes'}</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down quick reminders, meeting points, or study timetable..."
              className="w-full flex-1 p-3 text-xs text-slate-100 bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#287BFF] resize-none leading-relaxed font-mono"
            />

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Saved locally in your encrypted browser session</span>
              <span>Markdown supported</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
