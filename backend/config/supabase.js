const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase credentials in .env. Please configure them before starting the server.');
}

// We initialize the Supabase client with the Service Role Key since this runs on the backend.
// This allows the backend to securely manage all users' data, but we MUST strictly enforce
// ownership checks in our controllers (e.g., verifying req.user.id === task.user_id).
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
