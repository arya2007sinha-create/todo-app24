import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import { Calendar, AlertTriangle, Sparkles, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [overview, setOverview] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [overviewRes, tasksRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    // Fetch pending tasks sorted by due_date
                    api.get('/tasks?status=pending&sort_by=due_date&order=asc&limit=10')
                ]);
                
                setOverview(overviewRes.data.data);
                setTasks(tasksRes.data.data);
            } catch (error) {
                console.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            // Remove from list if completed (since we only show pending here)
            setTasks(prev => prev.filter(t => t.id !== taskId));
            // Update overview numbers slightly
            if(overview) {
                setOverview(prev => ({
                    ...prev,
                    completedTasks: prev.completedTasks + 1,
                    pendingTasks: Math.max(0, prev.pendingTasks - 1)
                }));
            }
        } catch (error) {
            console.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const now = new Date();
    now.setHours(0,0,0,0);

    const todayTasks = tasks.filter(t => t.due_date && new Date(t.due_date).getTime() === now.getTime());
    const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < now);
    const upcomingTasks = tasks.filter(t => !t.due_date || new Date(t.due_date) > now);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Good morning, {user.name.split(' ')[0]}
                    </h1>
                    <p className="text-gray-500 mt-1">Here is what's happening with your tasks today.</p>
                </div>
                <Link to="/tasks" className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                    <Plus className="h-4 w-4" /> New Task
                </Link>
            </div>

            {/* Smart Suggestions */}
            {overview && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex gap-3 items-start">
                    <Sparkles className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-indigo-900">Productivity Insight</h4>
                        <p className="text-sm text-indigo-700 mt-1">
                            {overview.overdueTasks > 0 
                                ? `You currently have ${overview.overdueTasks} overdue tasks. Consider reviewing your due dates to keep your schedule realistic.`
                                : overview.pendingTasks > 5 
                                ? `You have ${overview.pendingTasks} pending tasks. Try breaking them down or using the 2-minute rule!`
                                : `You're all caught up! Enjoy your free time or plan ahead for tomorrow.`}
                        </p>
                    </div>
                </div>
            )}

            {/* Smart Daily View Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Today & Overdue */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Overdue Section */}
                    {overdueTasks.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <h2 className="text-lg font-semibold text-gray-900">Overdue</h2>
                                <span className="bg-red-100 text-red-700 py-0.5 px-2 rounded-full text-xs font-bold">{overdueTasks.length}</span>
                            </div>
                            <div className="space-y-3">
                                {overdueTasks.slice(0, 3).map(task => (
                                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={() => {}} onDelete={() => {}} />
                                ))}
                                {overdueTasks.length > 3 && (
                                    <Link to="/tasks?status=pending" className="text-sm text-indigo-600 font-medium hover:underline block text-center mt-2">View all overdue tasks</Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Today Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 mt-6">
                            <Calendar className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-lg font-semibold text-gray-900">Today's Focus</h2>
                            <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs font-bold">{todayTasks.length}</span>
                        </div>
                        {todayTasks.length > 0 ? (
                            <div className="space-y-3">
                                {todayTasks.map(task => (
                                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={() => {}} onDelete={() => {}} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 border-dashed p-6 text-center">
                                <p className="text-sm text-gray-500">No tasks due today. Enjoy your day!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Overview Stats & Upcoming */}
                <div className="space-y-6">
                    {overview && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700">Quick Stats</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                <div className="px-4 py-3 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Total Tasks</span>
                                    <span className="font-semibold text-gray-900">{overview.totalTasks}</span>
                                </div>
                                <div className="px-4 py-3 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Completed</span>
                                    <span className="font-semibold text-green-600">{overview.completedTasks}</span>
                                </div>
                                <div className="px-4 py-3 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Pending</span>
                                    <span className="font-semibold text-orange-500">{overview.pendingTasks}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Upcoming</h2>
                        {upcomingTasks.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingTasks.slice(0, 5).map(task => (
                                    <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm flex justify-between items-center">
                                        <span className="font-medium text-gray-900 truncate pr-4">{task.title}</span>
                                        <span className="text-gray-500 shrink-0 text-xs">
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'No date'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No upcoming tasks.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
