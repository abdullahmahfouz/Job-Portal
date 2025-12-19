import supabaseClient from "@/components/utlis/supabase";

export async function getJobs(token, { location, company_id, searchQuery, date_posted }) {
    const supabase = await supabaseClient(token);

    let query = supabase.from('jobs').select('*, company:companies(name, company_logo), saved: saved_jobs(id)');

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
        .select('*, company:companies(name, company_logo), applications(*), saved: saved_jobs(id)')
        .eq('id', job_id)
        .single();
    
    if (error) {
        console.error('Error fetching job:', error);
        throw new Error(error.message);
    }
    
    return data;
}

// Get saved jobs for a user
export async function getSavedJobs(token) {
    const supabase = await supabaseClient(token);
    
    const { data, error } = await supabase
        .from('saved_jobs')
        .select('*, job: jobs(*, company:companies(name, company_logo))');
    
    if (error) {
        console.error('Error fetching saved jobs:', error);
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

// Upload resume file to Supabase Storage
export async function uploadResume(token, file, candidateId) {
    const supabase = await supabaseClient(token);
    
    // Create unique filename with timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${candidateId}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);
    
    if (error) {
        console.error('Error uploading resume:', error);
        throw new Error(error.message);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);
    
    return publicUrl;
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

// Post a new job
export async function addNewJob(token, _, jobData) {
    const supabase = await supabaseClient(token);
    
    const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select();
    
    if (error) {
        console.error('Error posting job:', error);
        throw new Error(error.message);
    }
    
    return data;
}

// Update job status (open/closed)
export async function updateJobStatus(token, { job_id, isOpen }) {
    const supabase = await supabaseClient(token);
    
    const { data, error } = await supabase
        .from('jobs')
        .update({ isOpen })
        .eq('id', job_id)
        .select();
    
    if (error) {
        console.error('Error updating job status:', error);
        throw new Error(error.message);
    }
    
    return data;
}

