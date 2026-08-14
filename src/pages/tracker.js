import {TrackerCard} from '../components/Cards'; // ./ (look in same folder), ../ (go up a folder)
import {CardLayout} from '../styles/cardStyles';
import GlobalStyles from '../styles/GlobalStyles';
import Nav from '../components/Nav';
import { useState, useEffect } from 'react';
import { auth, database } from '../library/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Head from 'next/head'; // tab header

export default function TrackerPage() {
    // Stores the list of saved jobs from Firebase
    const [applications, setApplications] = useState([]);

    // Stores whatever the user types in the search box
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Load the user's saved jobs from Firebase when the page loads
        const fetchApplications = async () => {
            const user = auth.currentUser;

            // Don't fetch if no one is logged in
            if (!user) return;

            // Get all documents from the user's applications collection
            const snapshot = await getDocs(collection(database, 'users', user.uid, 'applications'));
            
            // Convert Firebase docs to a regular array of job objects
            // doc.id is the Firebase document ID, needed later for deletion
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() // spreads all saved fields like title, company, status etc
            }));

            setApplications(apps);
        };

        fetchApplications();
    }, []); // Empty [] means this only runs once when the page first loads

    const removeApplication = async (id) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // Delete the document from Firebase using its document ID
            await deleteDoc(doc(database, 'users', user.uid, 'applications', id));

            // Remove it from local state so it disappears immediately without refreshing
            setApplications(prev => prev.filter(app => app.id !== id));
        } catch (error) {
            console.error('Error removing job:', error);
        }
    };

    const updateStatus = async (id, newStatus) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // Update just the status field in Firebase
            await updateDoc(doc(database, 'users', user.uid, 'applications', id), {
                status: newStatus
            });

            // Update local state so the dropdown reflects the change immediately
            setApplications(prev =>
                prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // function returns count of all tracked jobs that have a specific status (statusType)
    function countJobStatus(statusType){
        // Better code: {applications.filter(app => app.status === statusType).length}
        let count = 0;
        for (let i = 0; i < applications.length; i++){
            if (applications[i].status === statusType) count++;
        }
        return count;
    }

    function getFilteredJobs(){
        if (!search) return applications; // show all if user enters nothing

        return applications.filter(app => 
            app.title.toLowerCase().includes(search.toLowerCase()) ||
            app.company.toLowerCase().includes(search.toLowerCase()) ||
            app.status.toLowerCase().includes(search.toLowerCase())
        ); //.includes looks for partial matches
    }


    return (
        <> {/* Empty container because functions require a parent container*/}
            <Head>
                <title>NextRound</title>
            </Head>
            <GlobalStyles/>
            <Nav/>
            {/* Search bar */}
            <div className="search" style={{paddingBottom: '10px'}}>
                <input type="text" placeholder="Keywords"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Status counts displayed as pill badges instead of pipe-separated text */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '16px'
            }}>
                {[
                    { label: 'Total', count: applications.length, color: '#fff' },
                    { label: 'Responses', count: applications.length - countJobStatus('Applied'), color: '#fff' },
                    { label: 'Applied', count: countJobStatus('Applied'), color: '#fff' },
                    { label: 'Interview', count: countJobStatus('Interview'), color: '#ffff00' },
                    { label: 'OA', count: countJobStatus('OA'), color: '#00aaff' },
                    { label: 'Awaiting', count: countJobStatus('Awaiting Next Steps'), color: '#cc00ff' },
                    { label: 'Rejected (Steps)', count: countJobStatus('Rejected after Interview, OA, etc.'), color: '#ff7700' },
                    { label: 'Cold Rejected', count: countJobStatus('Cold Rejected'), color: '#ff0000' },
                    { label: 'Accepted', count: countJobStatus('Accepted'), color: '#6bab73' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        background: 'white',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        borderLeft: `3px solid ${stat.color}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <span style={{ color: '#888' }}>{stat.label}</span>
                        <span style={{ fontWeight: 700 }}>{stat.count}</span>
                    </div>
                ))}
            </div>

            {/*<Statistics applications={applications} countJobStatus={countJobStatus()}/> //TODO */}
            <hr style={{marginBottom: "16px", border: 'none', borderTop: '1px solid #e0dbd5'}}/>
            <CardLayout>
                {/* Loop through saved jobs and render a TrackerCard for each one */}
                {getFilteredJobs().map(app => (
                    <TrackerCard
                        key={app.id}
                        title={app.title}
                        company={app.company}
                        link={app.link}
                        status={app.status}
                        onStatusChange={(newStatus) => updateStatus(app.id, newStatus)}
                        onRemove={() => removeApplication(app.id)}
                    />
                ))}
            </CardLayout>
        </>
    );
}