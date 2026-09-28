const supabase = require('../config/supabase');

const UserModel = {
    async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
            
        // Suppress "Row not found" error since we are just checking existence
        if (error && error.code !== 'PGRST116') throw error; 
        return data;
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, created_at, updated_at')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(user) {
        const { data, error } = await supabase
            .from('users')
            .insert([user])
            .select('id, name, email, created_at, updated_at')
            .single();

        if (error) throw error;
        return data;
    }
};

module.exports = UserModel;
