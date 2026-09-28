const supabase = require('../config/supabase');

const AnalyticsService = {
    async getOverview(userId) {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('status, due_date')
            .eq('user_id', userId);

        if (error) throw error;

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const overview = {
            totalTasks: tasks.length,
            completedTasks: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
            overdueTasks: 0,
            dueToday: 0
        };

        tasks.forEach(task => {
            if (task.status === 'completed') overview.completedTasks++;
            if (task.status === 'pending') overview.pendingTasks++;
            if (task.status === 'in_progress') overview.inProgressTasks++;

            if (task.due_date && task.status !== 'completed') {
                const dueDate = new Date(task.due_date);
                dueDate.setHours(0, 0, 0, 0);
                
                if (dueDate < now) overview.overdueTasks++;
                if (dueDate.getTime() === now.getTime()) overview.dueToday++;
            }
        });

        return overview;
    },

    async getCompletionStats(userId) {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('created_at, completed_at')
            .eq('user_id', userId)
            .eq('status', 'completed')
            .not('completed_at', 'is', null);
            
        if (error) throw error;

        // Group by day for the last 7 days
        const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const completionByDay = last7Days.reduce((acc, date) => {
            acc[date] = 0;
            return acc;
        }, {});

        tasks.forEach(task => {
            const completedDate = task.completed_at.split('T')[0];
            if (completionByDay[completedDate] !== undefined) {
                completionByDay[completedDate]++;
            }
        });

        return Object.keys(completionByDay).map(date => ({
            date,
            completed: completionByDay[date]
        }));
    },
    
    async getProductivity(userId) {
        // Here you would analyze things like categories, priorities
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('priority, categories(name)')
            .eq('user_id', userId);
            
        if (error) throw error;
        
        const priorityDistribution = {};
        const categoryDistribution = {};
        
        tasks.forEach(task => {
            priorityDistribution[task.priority] = (priorityDistribution[task.priority] || 0) + 1;
            if(task.categories) {
                const catName = task.categories.name;
                categoryDistribution[catName] = (categoryDistribution[catName] || 0) + 1;
            }
        });

        const priorityData = Object.keys(priorityDistribution).map(key => ({
            name: key,
            value: priorityDistribution[key]
        }));
        
        const categoryData = Object.keys(categoryDistribution).map(key => ({
            name: key,
            value: categoryDistribution[key]
        }));

        return { priorityData, categoryData };
    }
};

module.exports = AnalyticsService;
