import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Plus, Search, Filter } from 'lucide-react';

const Tasks = () => {
    const { 
        tasks, loading, pagination, filters, 
        updateFilter, setPagination, createTask, updateTask, updateTaskStatus, deleteTask 
    } = useTasks();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateFilter('search', searchInput);
    };

    const handleOpenCreate = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (taskData) => {
        if (taskToEdit) {
            await updateTask(taskToEdit.id, taskData);
        } else {
            await createTask(taskData);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this task?')) {
            await deleteTask(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                <button 
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                >
                    <Plus className="h-4 w-4" /> Create Task
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4 sm:space-y-0 sm:flex sm:gap-4 items-center">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </form>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select 
                            className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.status}
                            onChange={(e) => updateFilter('status', e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <select 
                        className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.priority}
                        onChange={(e) => updateFilter('priority', e.target.value)}
                    >
                        <option value="All">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <select 
                        className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.sort_by}
                        onChange={(e) => updateFilter('sort_by', e.target.value)}
                    >
                        <option value="created_at">Date Created</option>
                        <option value="due_date">Due Date</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
            </div>

            {/* Task List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
                    <CheckSquare className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {filters.search || filters.status !== 'All' ? "Try adjusting your filters or search." : "Get started by creating a new task."}
                    </p>
                    {(!filters.search && filters.status === 'All') && (
                        <div className="mt-6">
                            <button onClick={handleOpenCreate} className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                                <Plus className="h-4 w-4 mr-1" /> New Task
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.map(task => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            onEdit={handleOpenEdit} 
                            onDelete={handleDelete} 
                            onStatusChange={updateTaskStatus}
                        />
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm mt-4">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button disabled={pagination.page === 1} onClick={() => setPagination(p => ({...p, page: p.page - 1}))} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                        <button disabled={pagination.page === pagination.totalPages} onClick={() => setPagination(p => ({...p, page: p.page + 1}))} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{pagination.page}</span> of <span className="font-medium">{pagination.totalPages}</span> ({pagination.total} total)
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button disabled={pagination.page === 1} onClick={() => setPagination(p => ({...p, page: p.page - 1}))} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                                    <span className="sr-only">Previous</span>
                                    &larr;
                                </button>
                                <button disabled={pagination.page === pagination.totalPages} onClick={() => setPagination(p => ({...p, page: p.page + 1}))} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                                    <span className="sr-only">Next</span>
                                    &rarr;
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            <TaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                task={taskToEdit} 
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};

export default Tasks;
