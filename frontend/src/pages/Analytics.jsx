import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
    const [overview, setOverview] = useState(null);
    const [completionStats, setCompletionStats] = useState([]);
    const [productivity, setProductivity] = useState({ priorityData: [], categoryData: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [overviewRes, completionRes, prodRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get('/analytics/completion'),
                    api.get('/analytics/productivity')
                ]);
                
                setOverview(overviewRes.data.data);
                setCompletionStats(completionRes.data.data);
                setProductivity(prodRes.data.data);
            } catch (error) {
                console.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!overview || overview.totalTasks === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Not enough data yet</h3>
                <p className="mt-1 text-sm text-gray-500">Complete more tasks to generate productivity insights.</p>
            </div>
        );
    }

    const completionRate = Math.round((overview.completedTasks / overview.totalTasks) * 100) || 0;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Task Analytics</h1>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                        <p className="text-2xl font-semibold text-gray-900">{completionRate}%</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending</p>
                        <p className="text-2xl font-semibold text-gray-900">{overview.pendingTasks}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-full">
                        <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Completed</p>
                        <p className="text-2xl font-semibold text-gray-900">{overview.completedTasks}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Overdue</p>
                        <p className="text-2xl font-semibold text-gray-900">{overview.overdueTasks}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-full">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Completion Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Tasks Completed (Last 7 Days)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={completionStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Priority/Category Charts */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Task Priority Distribution</h3>
                    <div className="h-72 flex items-center justify-center">
                        {productivity.priorityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={productivity.priorityData}
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {productivity.priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-gray-500">No priority data available</p>
                        )}
                        <div className="absolute flex flex-col gap-2 mt-4 ml-4">
                           {productivity.priorityData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center text-xs text-gray-600 capitalize">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                                    {entry.name}: {entry.value}
                                </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
