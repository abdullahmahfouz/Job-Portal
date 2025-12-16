import supabaseClient from "@/components/utlis/supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
    const supabase = await supabaseClient(token);

    let query = supabase.from('jobs').select('*');

    // Apply filters before executing the query
    if (location) {
        query = query.eq('location', location);
    }
    if (company_id) {
        query = query.eq('company_id', company_id);
    }
    if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
    }

    // Execute the query after all filters are applied
    const { data, error } = await query;

    if (error) {
        console.error('Error fetching jobs:', error);
        return null;
    }

    return data;
}