import {useState, useEffect} from 'react';
import {JobCard} from '../components/Cards'; // ./ (look in same folder), ../ (go up a folder)
import {CardLayout} from '../styles/cardStyles';
import GlobalStyles from '../styles/GlobalStyles';
import Nav from '../components/Nav';
import { auth, database } from '../library/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function JobsPage() {
    // Stores the list of jobs returned from the API
    const [jobs, setJobs] = useState([]);

    // Tracks whether we're waiting for the API to respond
    const [loading, setLoading] = useState(false);

    // Stores whatever the user types in the search box
    const [search, setSearch] = useState('');

    // tracks which jobs are already saved
    const [savedJobIds, setSavedJobIds] = useState([]);

    useEffect(() => {
        // When page loads, fetch the user's already saved job IDs from Firebase
        const fetchSavedJobs = async () => {
            const user = auth.currentUser;
            if (!user) return;

            // Get all saved jobs from Firebase for this user
            const snapshot = await getDocs(collection(database, 'users', user.uid, 'applications'));
            
            // Store just the job IDs so we can filter them out
            const ids = snapshot.docs.map(doc => doc.data().job_id);
            setSavedJobIds(ids);
        };

        fetchSavedJobs();
    }, []);

    const fetchJobs = async () => {
        // Show loading message while waiting
        setLoading(true);

        // Caches users last search so if they search for it again, we don't waste an API call
        // Local storage is saved even after page reloads OR tab is closed
        const cachedSearch = localStorage.getItem('lastQuery');
        const cachedJobs = localStorage.getItem('lastJobs')

        // if current search matches the cachedSearch and cachedJobs is not null
        if (cachedSearch === search && cachedJobs){
            const savedJobs = JSON.parse(cachedJobs).filter(job => !savedJobIds.includes(job.job_id));
            localStorage.setItem('lastJobs', JSON.stringify(savedJobs))
            setJobs(savedJobs);
            setLoading(false);
            return;
        }

        // Otherwise, call our API route which calls JSearch
        const response = await fetch(`/api/jobsapi?query=${search}`);
        
        // Convert response to JSON
        const data = await response.json();

        // Filter out jobs the user has already saved
        const filteredJobs = data.filter(job => !savedJobIds.includes(job.job_id));
        
        //TODO: Make the cached jobs a 3 frame LFU or LRU list to increase cache hit
        
        // Put the new search in the cache
        localStorage.setItem('lastJobs', JSON.stringify(filteredJobs))
        localStorage.setItem('lastQuery', search);

        // Save jobs to session storage so they are still there if you navigate to a different page
        sessionStorage.setItem('savedSearch', JSON.stringify(filteredJobs));
        // Saves the search text so users can still see it after the page rerenders
        sessionStorage.setItem('savedQuery', search);

        setJobs(filteredJobs);

        // Hide loading message
        setLoading(false);
    };

    // Load from session storage when page loads (seperate from other useEffect for clean-ness)
    // Displays last search and jobs if never deleted and tab wasn't closed
    useEffect(() => {
        const saved = sessionStorage.getItem('savedSearch');
        const savedQuery = sessionStorage.getItem('savedQuery')
        if (saved) {
            setJobs(JSON.parse(saved));
        }
        if (savedQuery){
            setSearch(savedQuery);
        }
    }, []);

    const addToTracker = async (job) => {
        const user = auth.currentUser;

        // Make sure user is logged in before saving
        if (!user) {
            alert('Please sign in to save jobs!');
            return;
        }

        try {
            // Save the job to Firebase under the user's account
            await addDoc(collection(database, 'users', user.uid, 'applications'), {
                job_id: job.job_id,
                title: job.job_title,
                company: job.employer_name,
                link: job.job_apply_link,
                status: 'Applied',
                dateAdded: new Date().toISOString()
            });

            // Remove the job from the current list so it disappears immediately
            setJobs(prev => prev.filter(j => j.job_id !== job.job_id));

            // Add the job ID to saved list
            setSavedJobIds(prev => [...prev, job.job_id]);

            alert('Job added to tracker!');
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };

    return (
        <div>
            <GlobalStyles />
            <Nav />

            {/* Search bar */}
            <div className="search" style={{paddingBottom: '10px'}}>
                <input type="text" placeholder="Search jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={fetchJobs}>Search</button>
            </div>

            <hr/>

            <h3 id="titleText">Click on the job title to apply</h3>

            {/* Show loading message while waiting for API */}
            {loading && <p>Loading jobs...</p>}

            {/* Loop through jobs and render a JobCard for each one */}
            <CardLayout>
                {jobs.map(job => (
                    <JobCard
                        key={job.job_id}
                        title={job.job_title}
                        company={job.employer_name}
                        description={job.job_description?.substring(0, 300) + '...' || 'No description available'}
                        link={job.job_apply_link}
                        onAdd={() => addToTracker(job)}
                    />
                ))}
                {/*Example card for testing so I don't use all my query searches*/}
                {/* <JobCard title="Database Maintainer" 
                    company="Oracle"
                    description="This is a mock description that tests the overflow of the card. The jobs descriptions are usually really long. There may be a summary option but I'm not sure. Looking at the API documentation is really confusing."
                    link="https://www.oracle.com/careers/"/> */}
            </CardLayout>
        </div>
    );
}