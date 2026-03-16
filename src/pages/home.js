import {LargeCard} from '../styles/cardStyles'; // ./ (look in same folder), ../ (go up a folder)
import GlobalStyles from '../styles/GlobalStyles';
import Nav from '../components/Nav';
import Head from 'next/head'; // tab header

export default function HomePage(){
    return (
    <div id="background_image">
        <Head>
            <title>NextRound</title>
        </Head>
        <GlobalStyles/>
        <Nav></Nav>
            <h2 style={{textAlign: 'center', padding: '10px', marginBottom: '15px'}}>Why Use NextRound?</h2>
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