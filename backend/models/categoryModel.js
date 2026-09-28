const supabase = require('../config/supabase');

const CategoryModel = {
    async findAll(userId) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async findById(userId, categoryId) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', userId)
            .eq('id', categoryId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async create(userId, categoryData) {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ ...categoryData, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(userId, categoryId, categoryData) {
        const { data, error } = await supabase
            .from('categories')
            .update(categoryData)
            .eq('user_id', userId)
            .eq('id', categoryId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async remove(userId, categoryId) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('user_id', userId)
            .eq('id', categoryId);

        if (error) throw error;
        return true;
    }
};

module.exports = CategoryModel;
