// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    // Grab the search query from the user, default to 'software' if nothing is typed
    const { query = 'software' } = req.query;

    // Build the API URL with the user's search query
    const url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=1&num_pages=1&country=us&date_posted=all`;
    
    // Set up the request options including our hidden API key
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY, // API key stored safely in .env.local
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        // Call the JSearch API
        const response = await fetch(url, options);

        // Convert the response to JSON
        const data = await response.json();

        // Send the job results back to the frontend
        res.status(200).json(data.data);
    } catch (error) {
        // If something goes wrong, send an error message back instead of crashing
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
}
