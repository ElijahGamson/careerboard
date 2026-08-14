import {LargeCard} from '../styles/cardStyles'; // ./ (look in same folder), ../ (go up a folder)
import GlobalStyles from '../styles/GlobalStyles';
import Nav from '../components/Nav';
import Head from 'next/head'; // tab header

export default function HomePage(){
    return (
    <div>  {/* removed background_image id — clean layout looks more professional */}
        <Head>
            <title>NextRound</title>
        </Head>
        <GlobalStyles/>
        <Nav></Nav>
        <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
                NextRound
            </h1>
            <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '40px' }}>
                Get to the next round of your job search.
            </p>
        </div>
        <LargeCard>
            <ul>
                <li>Find Jobs</li>
                <li>Track applications</li>
                <li>Organize your job search</li>
                <li>Keep all the information in one place</li>
                <li>Get to the "NextRound" of interviews</li>
            </ul>
        </LargeCard>
    </div>
    );
}