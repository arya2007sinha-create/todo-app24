import { Calendar, Tag, Trash2, Edit, AlertCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    
    const isCompleted = task.status === 'completed';
    
    const priorityColors = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-blue-100 text-blue-800',
        high: 'bg-orange-100 text-orange-800',
        urgent: 'bg-red-100 text-red-800'
    };

    const handleStatusToggle = () => {
        const newStatus = isCompleted ? 'pending' : 'completed';
        onStatusChange(task.id, newStatus);
    };

    return (
        <div className={clsx(
            "bg-white rounded-lg shadow-sm border p-4 transition-all hover:shadow-md",
            isCompleted ? "border-gray-200 opacity-60" : "border-gray-200",
            task.priority === 'urgent' && !isCompleted ? "border-l-4 border-l-red-500" : ""
        )}>
            <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="pt-1">
                    <input 
                        type="checkbox" 
                        checked={isCompleted}
                        onChange={handleStatusToggle}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                    />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className={clsx("text-lg font-semibold text-gray-900 truncate", isCompleted && "line-through text-gray-500")}>
                            {task.title}
                        </h3>
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => onEdit(task)} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => onDelete(task.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    
                    {task.description && (
                        <p className={clsx("text-sm mb-3 line-clamp-2", isCompleted ? "text-gray-400" : "text-gray-600")}>
                            {task.description}
                        </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", priorityColors[task.priority])}>
                            {task.priority === 'urgent' && <AlertCircle className="inline h-3 w-3 mr-1 mb-0.5" />}
                            {task.priority}
                        </span>
                        
                        {task.categories && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                <Tag className="h-3 w-3" />
                                {task.categories.name}
                            </span>
                        )}
                        
                        {task.due_date && (
                            <span className={clsx(
                                "inline-flex items-center gap-1 text-xs font-medium",
                                (new Date(task.due_date) < new Date() && !isCompleted) ? "text-red-600" : "text-gray-500"
                            )}>
                                <Calendar className="h-3 w-3" />
                                {new Date(task.due_date).toLocaleDateString()}
                            </span>
                        )}
                        
                        {task.estimated_time && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                                <Clock className="h-3 w-3" />
                                {task.estimated_time}m
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
