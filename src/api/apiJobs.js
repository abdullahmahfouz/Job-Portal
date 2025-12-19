import supabaseClient from "@/components/utlis/supabase";

export async function getJobs(token, { location, company_id, searchQuery, date_posted }) {
    const supabase = await supabaseClient(token);

    let query = supabase.from('jobs').select('*, company:companies(name, company_logo)');

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
    if (date_posted && date_posted !== 'all') {
        const date = new Date();
        date.setDate(date.getDate() - parseInt(date_posted));
        query = query.gte('created_at', date.toISOString());
    }

    // Execute the query after all filters are applied
    const { data, error } = await query;

    if (error) {
        console.error('Error fetching jobs:', error);
        throw new Error(error.message || 'Failed to fetch jobs');
    }

    return data;
}
export async function saveJobs(token,{alreadySaved}, saveData) {
    const supabase = await supabaseClient(token);

    if (alreadySaved) {
        const { data, error:deleteError } = await supabase
            .from('saved_jobs')
            .delete()
            .eq('job_id', saveData.job_id);

        if (deleteError) {
            console.error('Error removing saved job:', deleteError);
            throw new Error(deleteError.message || 'Failed to remove saved job');

        }
        return data;
    }else{
        const { data, error:insertError } = await supabase
            .from('saved_jobs')
            .insert([saveData])
            .select();
            
        if (insertError) {
            console.error('Error saving job:', insertError);
            throw new Error(insertError.message || 'Failed to save job');
        }
        return data;
    }


}
export async function getSingleJob(token, { job_id }) {
    const supabase = await supabaseClient(token);
    
    const { data, error } = await supabase
        .from('jobs')
        .select('*, company:companies(name, company_logo), applications(*)')
        .eq('id', job_id)
        .single();
    
    if (error) {
        console.error('Error fetching job:', error);
        throw new Error(error.message);
    }
    
    return data;
}

export async function applyToJob(token, _, jobData) {
    const supabase = await supabaseClient(token);
    
    const { data, error } = await supabase
        .from('applications')
        .insert([jobData])
        .select();
    
    if (error) {
        console.error('Error applying to job:', error);
        throw new Error(error.message);
    }
    
    return data;
}

// Get jobs posted by the current recruiter
export async function getMyJobs(token, { recruiter_id }) {
    const supabase = await supabaseClient(token);
    
    const { data, error } = await supabase
        .from('jobs')
        .select('*, company:companies(name, company_logo), applications(*)')
        .eq('recruiter_id', recruiter_id)
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching recruiter jobs:', error);
        throw new Error(error.message);
    }
    
    return data;
}

