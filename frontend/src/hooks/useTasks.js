import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useTasks = (initialFilters = {}) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({
        status: 'All',
        priority: 'All',
        search: '',
        sort_by: 'created_at',
        order: 'desc',
        ...initialFilters
    });

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                sort_by: filters.sort_by,
                order: filters.order
            });

            if (filters.status !== 'All') queryParams.append('status', filters.status);
            if (filters.priority !== 'All') queryParams.append('priority', filters.priority);
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.category_id) queryParams.append('category_id', filters.category_id);

            const res = await api.get(`/tasks?${queryParams.toString()}`);
            setTasks(res.data.data);
            setPagination(res.data.pagination);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.page, pagination.limit]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    const createTask = async (taskData) => {
        const res = await api.post('/tasks', taskData);
        await fetchTasks();
        return res.data;
    };

    const updateTask = async (id, taskData) => {
        const res = await api.put(`/tasks/${id}`, taskData);
        await fetchTasks();
        return res.data;
    };

    const updateTaskStatus = async (id, status) => {
        const res = await api.patch(`/tasks/${id}/status`, { status });
        await fetchTasks(); // Refresh list to respect filters/sorting
        return res.data;
    };

    const deleteTask = async (id) => {
        const res = await api.delete(`/tasks/${id}`);
        await fetchTasks();
        return res.data;
    };

    return {
        tasks,
        loading,
        error,
        pagination,
        filters,
        updateFilter,
        setPagination,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        refresh: fetchTasks
    };
};
