const supabase = require('../config/supabase');

const TaskModel = {
    // We add pagination, filtering and sorting logic here
    async findAll(userId, filters = {}, sort = { column: 'created_at', ascending: false }, pagination = { limit: 20, offset: 0 }) {
        let query = supabase
            .from('tasks')
            .select('*, categories(name, color)', { count: 'exact' })
            .eq('user_id', userId);

        // Filters
        if (filters.status && filters.status !== 'All') {
            query = query.eq('status', filters.status);
        }
        if (filters.priority && filters.priority !== 'All') {
            query = query.eq('priority', filters.priority);
        }
        if (filters.category_id) {
            query = query.eq('category_id', filters.category_id);
        }
        if (filters.search) {
            // Basic ILIKE search on title or description
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        // Sorting
        query = query.order(sort.column, { ascending: sort.ascending });

        // Pagination
        query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;
        return { data, count };
    },

    async findById(userId, taskId) {
        const { data, error } = await supabase
            .from('tasks')
            .select('*, categories(name)')
            .eq('user_id', userId)
            .eq('id', taskId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async create(userId, taskData) {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{ ...taskData, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(userId, taskId, taskData) {
        // If status is completed, automatically set completed_at
        if (taskData.status === 'completed' && !taskData.completed_at) {
            taskData.completed_at = new Date().toISOString();
        } else if (taskData.status && taskData.status !== 'completed') {
            taskData.completed_at = null;
        }

        const { data, error } = await supabase
            .from('tasks')
            .update(taskData)
            .eq('user_id', userId)
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async remove(userId, taskId) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('user_id', userId)
            .eq('id', taskId);

        if (error) throw error;
        return true;
    }
};

module.exports = TaskModel;
