import React, { useState } from 'react';
import type { RemediationTask, CropZone } from '../types';
import { Sprout, Droplets, FlaskConical, Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface RemediationPlannerProps {
  tasks: RemediationTask[];
  selectedZone: CropZone;
  onToggleTask: (taskId: string) => void;
  onAddTask: (zoneId: string, title: string, type: RemediationTask['type']) => void;
  onDeleteTask: (taskId: string) => void;
}

export const RemediationPlanner: React.FC<RemediationPlannerProps> = ({
  tasks,
  selectedZone,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState<RemediationTask['type']>('watering');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter tasks specific to this zone
  const zoneTasks = tasks.filter((t) => t.zoneId === selectedZone.id);
  const completedTasks = zoneTasks.filter((t) => t.status === 'completed');
  
  const completionRate = zoneTasks.length > 0
    ? Math.round((completedTasks.length / zoneTasks.length) * 100)
    : 100;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(selectedZone.id, newTaskTitle, newTaskType);
    setNewTaskTitle('');
    setShowAddForm(false);
  };

  const getTaskIcon = (type: RemediationTask['type']) => {
    switch (type) {
      case 'watering':
        return <Droplets className="w-4 h-4 text-sky-400" />;
      case 'fertilizer':
        return <Sprout className="w-4 h-4 text-emerald-400" />;
      case 'treatment':
        return <FlaskConical className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="bg-agri-panel border border-agri-border backdrop-blur-md rounded-3xl p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-agri-primary" />
            <span>Remediation Planner</span>
          </h2>
          <p className="text-xs text-slate-400">Treatment schedule for {selectedZone.name}</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Completion Indicator Card */}
      <div className="bg-slate-950/20 border border-slate-900/60 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Zone Action Readiness</span>
          <span className="text-sm font-bold text-white mt-1 block">
            {zoneTasks.length > 0 ? `${completedTasks.length} of ${zoneTasks.length} items complete` : 'No tasks assigned'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-agri-primary">{completionRate}%</span>
          </div>
          <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-agri-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add Custom Task Form */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 flex flex-col gap-3">
          <div className="text-xs font-bold text-slate-300">Add Task to {selectedZone.name}</div>
          <input
            type="text"
            placeholder="Task title (e.g. Flush nitrogen lines)"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-agri-primary"
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <input
                type="radio"
                id="water"
                name="type"
                checked={newTaskType === 'watering'}
                onChange={() => setNewTaskType('watering')}
                className="accent-agri-primary"
              />
              <label htmlFor="water">Watering</label>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <input
                type="radio"
                id="fert"
                name="type"
                checked={newTaskType === 'fertilizer'}
                onChange={() => setNewTaskType('fertilizer')}
                className="accent-agri-primary"
              />
              <label htmlFor="fert">Fertilizer</label>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <input
                type="radio"
                id="treat"
                name="type"
                checked={newTaskType === 'treatment'}
                onChange={() => setNewTaskType('treatment')}
                className="accent-agri-primary"
              />
              <label htmlFor="treat">Treatment</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-1 px-2.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded-lg hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-1 px-2.5 bg-agri-primary text-white text-[10px] rounded-lg hover:bg-agri-secondary"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Task Checklist list */}
      <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
        {zoneTasks.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-slate-700" />
            <span>Zone is optimal. No urgent treatments needed.</span>
          </div>
        ) : (
          zoneTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-150 ${
                task.status === 'completed'
                  ? 'bg-slate-950/10 border-slate-900/60 opacity-60'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                    task.status === 'completed'
                      ? 'bg-agri-primary/20 border-agri-primary text-agri-primary'
                      : 'border-slate-700 hover:border-slate-500 bg-transparent'
                  }`}
                >
                  {task.status === 'completed' && <span className="text-[10px]">✔</span>}
                </button>
                <div className="flex items-center gap-2">
                  {getTaskIcon(task.type)}
                  <div>
                    <span
                      className={`text-xs font-semibold ${
                        task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="block text-[9px] text-slate-500">{task.description}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-slate-600 hover:text-slate-300 p-1 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
