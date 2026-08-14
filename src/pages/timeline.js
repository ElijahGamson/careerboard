import {LargeCard} from '../styles/cardStyles'; // ./ (look in same folder), ../ (go up a folder)
import GlobalStyles from '../styles/GlobalStyles';
import Nav from '../components/Nav';
import Head from 'next/head'; // tab header

export default function TimelinePage(){
    return (
    <div>
        <Head>
            <title>What's Next?</title>
        </Head>
        <GlobalStyles/>
        <Nav/>
        <div id="titleText">
            <h1>Interested in where this project is headed?</h1>
            <h3 style={{ fontWeight: 500, color: '#888', marginTop: '8px' }}>
                Here's the plan for what will be implemented next
            </h3>
        </div>
        <LargeCard>
            <h4>Last Update to NextRound: 7/27/2026</h4>
            <br/>
            <ol>
                <li>Let users add jobs found outside this site to Tracker</li>
                <li>Let users create own statuses in dropdown on Tracker</li>
                <li>Add refresh button to jobs page</li>
                <li>Calendar Page</li>
            </ol>
        </LargeCard>
    </div>
    );
}