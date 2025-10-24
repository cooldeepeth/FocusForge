import React, { useState } from 'react';
import type { Task } from '../../types';
import { Card } from '../shared/Card';
import { Icon } from '../shared/Icon';
import { Button } from '../shared/Button';

interface TaskCardProps {
    tasks: Task[];
    onAddTask: (text: string) => void;
    onToggleTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            onAddTask(newTask.trim());
            setNewTask('');
        }
    };

    const pendingTasks = tasks.filter(t => !t.completed).length;

    return (
        <Card title={`Today's Tasks (${pendingTasks})`} icon="list">
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-grow w-full bg-gray-800 border-gray-600 text-white rounded-lg focus:ring-brand-primary focus:border-brand-primary p-2.5"
                />
                <Button type="submit" disabled={!newTask.trim()}>Add</Button>
            </form>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {tasks.length > 0 ? tasks.map(task => (
                    <li key={task.id} className="flex items-center justify-between group bg-gray-800/50 p-2 rounded-md">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => onToggleTask(task.id)}
                                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-brand-primary focus:ring-brand-primary"
                            />
                            <span className={`ml-3 ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                {task.text}
                            </span>
                        </div>
                        <button 
                            onClick={() => onDeleteTask(task.id)}
                            className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Delete task: ${task.text}`}
                        >
                            <Icon name="trash" className="w-5 h-5" />
                        </button>
                    </li>
                )) : (
                    <p className="text-gray-400 text-center py-4">No tasks yet. Add one to get started!</p>
                )}
            </ul>
        </Card>
    );
};